/**
 * クイズロジック
 */

import type { GrammarQuestion, QuizMode } from '@/types/quiz';
import { getGrammarQuestionsToReview } from './storage';

/**
 * 配列をシャッフル（Fisher-Yatesアルゴリズム）
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * 難易度で問題をフィルタリング
 */
export function filterByDifficulty(
  questions: GrammarQuestion[],
  difficulty: number | null
): GrammarQuestion[] {
  if (difficulty === null) {
    return questions;
  }
  return questions.filter((q) => q.difficulty === difficulty);
}

/**
 * 各カテゴリから指定数ずつランダムに問題を選択
 */
export function selectRandomQuestions(
  questionsByCategory: Record<string, GrammarQuestion[]>,
  totalQuestions: number,
  difficulty: number | null = null
): GrammarQuestion[] {
  const selected: GrammarQuestion[] = [];
  const categoryCount = Object.keys(questionsByCategory).length;

  // カテゴリが1つの場合：そのカテゴリから指定数取得（指定数が大きい場合は全て取得）
  // カテゴリが複数の場合：各カテゴリから均等に取得
  if (categoryCount === 1) {
    const questions = Object.values(questionsByCategory)[0];
    const filtered = filterByDifficulty(questions, difficulty);
    const shuffled = shuffleArray(filtered);
    // 指定数が実際の問題数より大きい場合は全ての問題を返す
    selected.push(...shuffled.slice(0, totalQuestions > shuffled.length ? shuffled.length : totalQuestions));
  } else {
    const questionsPerCategory = Math.ceil(totalQuestions / categoryCount);
    Object.values(questionsByCategory).forEach((questions) => {
      const filtered = filterByDifficulty(questions, difficulty);
      const shuffled = shuffleArray(filtered);
      // 各カテゴリから指定数取得（指定数が大きい場合は全て取得）
      const count = questionsPerCategory > shuffled.length ? shuffled.length : questionsPerCategory;
      selected.push(...shuffled.slice(0, count));
    });
    // 指定数に合わせて調整（指定数が大きい場合は全て返す）
    const shuffled = shuffleArray(selected);
    return shuffled.slice(0, totalQuestions > shuffled.length ? shuffled.length : totalQuestions);
  }

  return shuffleArray(selected);
}

/**
 * 苦手克服モード用の問題を選択
 */
export function selectWeakQuestions(
  allQuestions: GrammarQuestion[],
  questionIds: string[]
): GrammarQuestion[] {
  const questionMap = new Map(allQuestions.map((q) => [q.id, q]));
  const selected = questionIds
    .map((id) => questionMap.get(id))
    .filter((q): q is GrammarQuestion => q !== undefined);

  return shuffleArray(selected);
}

/**
 * クイズ問題を読み込む
 */
export async function loadQuestions(
  categories: string[],
  questionsPerCategory: number,
  mode: QuizMode = 'normal',
  difficulty: number | null = null
): Promise<GrammarQuestion[]> {
  const questionsByCategory: Record<string, GrammarQuestion[]> = {};

  // 各カテゴリのJSONファイルを読み込む
  for (const category of categories) {
    try {
      const response = await fetch(`/data/grammar/${category}.json`);
      const questions = (await response.json()) as GrammarQuestion[];
      questionsByCategory[category] = questions;
    } catch (error) {
      console.error(`Failed to load questions for category ${category}:`, error);
    }
  }

  if (mode === 'weak') {
    // 苦手克服モード：復習が必要な文法問題のみ
    const questionIdsToReview = getGrammarQuestionsToReview();
    const allQuestions = Object.values(questionsByCategory).flat();
    const weakQuestions = selectWeakQuestions(allQuestions, questionIdsToReview);
    // 苦手克服モードでも難易度フィルタリングを適用
    return filterByDifficulty(weakQuestions, difficulty);
  }

  // 通常モード：各カテゴリからランダムに選択
  return selectRandomQuestions(questionsByCategory, questionsPerCategory, difficulty);
}

/**
 * 答えが正解かどうかを判定
 */
export function isCorrectAnswer(
  question: GrammarQuestion,
  selectedAnswer: number
): boolean {
  return question.correctAnswer === selectedAnswer;
}

