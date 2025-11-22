/**
 * Local Storage管理ユーティリティ
 */

import type { StorageData, MistakeRecord } from '@/types/storage';

const STORAGE_KEY = 'quiz-app:data';

/**
 * Local Storageからデータを取得
 */
export function getStorageData(): StorageData {
  if (typeof window === 'undefined') {
    return {
      mistakes: {},
      sessions: [],
      wordProgress: {},
    };
  }

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data) as StorageData;
    }
  } catch (error) {
    console.error('Failed to parse storage data:', error);
  }

  return {
    mistakes: {},
    sessions: [],
    wordProgress: {},
  };
}

/**
 * Local Storageにデータを保存
 */
export function saveStorageData(data: StorageData): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save storage data:', error);
  }
}

/**
 * 間違えた問題を記録（通常モード用）
 * nextReviewを更新して、忘却曲線に基づいた復習スケジュールを設定
 */
export function recordMistake(questionId: string): void {
  const data = getStorageData();
  const now = Date.now();

  if (data.mistakes[questionId]) {
    // 既存の記録を更新
    data.mistakes[questionId].count += 1;
    data.mistakes[questionId].lastMistake = now;
    data.mistakes[questionId].nextReview = calculateNextReview(
      data.mistakes[questionId].count
    );
  } else {
    // 新しい記録を作成
    data.mistakes[questionId] = {
      count: 1,
      lastMistake: now,
      nextReview: calculateNextReview(1),
    };
  }

  saveStorageData(data);
}

/**
 * 間違えた問題を記録（苦手克服モード用）
 * nextReviewを更新せず、即座に復習可能な状態を維持
 */
export function recordMistakeForWeakMode(questionId: string): void {
  const data = getStorageData();
  const now = Date.now();

  if (data.mistakes[questionId]) {
    // 既存の記録を更新（nextReviewは更新しない）
    data.mistakes[questionId].count += 1;
    data.mistakes[questionId].lastMistake = now;
    // nextReviewは現在時刻に設定（即座に復習可能のまま）
    data.mistakes[questionId].nextReview = now;
  } else {
    // 新しい記録を作成
    data.mistakes[questionId] = {
      count: 1,
      lastMistake: now,
      nextReview: now, // 即座に復習可能
    };
  }

  saveStorageData(data);
}

/**
 * 間違えた問題の記録を削除（正解した場合）
 */
export function removeMistake(questionId: string): void {
  const data = getStorageData();
  if (data.mistakes[questionId]) {
    delete data.mistakes[questionId];
    saveStorageData(data);
  }
}

/**
 * 忘却曲線に基づいて次回復習日を計算
 * 1回目の間違いは即座に復習可能、2回目以降は間隔を空ける
 */
function calculateNextReview(mistakeCount: number): number {
  if (mistakeCount === 1) {
    // 1回目の間違いは即座に復習可能
    return Date.now();
  }

  // 2回目以降は段階的に間隔を空ける（分単位）
  const intervals = [5, 30, 60, 120, 240]; // 分数（5分、30分、1時間、2時間、4時間）
  const minutes = intervals[Math.min(mistakeCount - 2, intervals.length - 1)];
  return Date.now() + minutes * 60 * 1000;
}

/**
 * 復習が必要な問題のIDリストを取得
 */
export function getQuestionsToReview(): string[] {
  const data = getStorageData();
  const now = Date.now();

  return Object.entries(data.mistakes)
    .filter(([_, record]) => now >= record.nextReview)
    .map(([questionId]) => questionId);
}

/**
 * 復習が必要な文法問題のIDリストを取得（word:プレフィックスを除外）
 */
export function getGrammarQuestionsToReview(): string[] {
  const data = getStorageData();
  const now = Date.now();

  return Object.entries(data.mistakes)
    .filter(([questionId, record]) => !questionId.startsWith('word:') && now >= record.nextReview)
    .map(([questionId]) => questionId);
}

/**
 * 復習が必要な単語のIDリストを取得（word:プレフィックスのみ）
 */
export function getWordQuestionsToReview(): string[] {
  const data = getStorageData();
  const now = Date.now();

  return Object.entries(data.mistakes)
    .filter(([questionId, record]) => questionId.startsWith('word:') && now >= record.nextReview)
    .map(([questionId]) => questionId.replace('word:', ''));
}

/**
 * 間違えた問題の記録を取得
 */
export function getMistakeRecord(questionId: string): MistakeRecord | null {
  const data = getStorageData();
  return data.mistakes[questionId] || null;
}

/**
 * 学習セッションを記録
 */
export function recordSession(totalQuestions: number, correctAnswers: number): void {
  const data = getStorageData();
  const today = new Date().toISOString().split('T')[0];

  data.sessions.push({
    date: today,
    totalQuestions,
    correctAnswers,
  });

  saveStorageData(data);
}

/**
 * 単語の学習進捗を更新
 */
export function updateWordProgress(
  wordId: string,
  mastered: boolean,
  reviewCount: number
): void {
  const data = getStorageData();

  data.wordProgress[wordId] = {
    mastered,
    reviewCount,
    lastReview: Date.now(),
  };

  saveStorageData(data);
}

/**
 * 単語の学習進捗を取得
 */
export function getWordProgress(wordId: string) {
  const data = getStorageData();
  return data.wordProgress[wordId] || null;
}

/**
 * 統計情報を取得
 */
export function getStatistics() {
  const data = getStorageData();

  const totalMistakes = Object.values(data.mistakes).reduce(
    (sum, record) => sum + record.count,
    0
  );

  const totalSessions = data.sessions.length;
  const totalQuestions = data.sessions.reduce(
    (sum, session) => sum + session.totalQuestions,
    0
  );
  const totalCorrectAnswers = data.sessions.reduce(
    (sum, session) => sum + session.correctAnswers,
    0
  );

  const averageScore =
    totalQuestions > 0 ? (totalCorrectAnswers / totalQuestions) * 100 : 0;

  return {
    totalMistakes,
    totalSessions,
    totalQuestions,
    totalCorrectAnswers,
    averageScore: Math.round(averageScore * 10) / 10,
  };
}

/**
 * 全ての学習記録をリセット
 */
export function resetAllData(): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to reset storage data:', error);
  }
}

