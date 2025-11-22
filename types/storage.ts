/**
 * Local Storageの型定義
 */

export interface MistakeRecord {
  count: number;
  lastMistake: number;
  nextReview: number;
}

export interface SessionRecord {
  date: string;
  totalQuestions: number;
  correctAnswers: number;
}

export interface StorageData {
  mistakes: {
    [questionId: string]: MistakeRecord;
  };
  sessions: SessionRecord[];
  wordProgress: {
    [wordId: string]: {
      mastered: boolean;
      reviewCount: number;
      lastReview: number;
    };
  };
}

