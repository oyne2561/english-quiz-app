/**
 * 単語学習の型定義
 */

export interface Word {
  id: string;
  word: string;
  pronunciation?: string;
  meaning: string[];
  example: {
    sentence: string;
    translation: string;
  };
  difficulty: number;
  category?: string;
}

export interface WordProgress {
  mastered: boolean;
  reviewCount: number;
  lastReview: number;
}

