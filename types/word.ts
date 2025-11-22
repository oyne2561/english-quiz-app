/**
 * 単語学習の型定義
 */

export interface Word {
  word: string;
  pronunciation?: string;
  meaning: string[];
  example: {
    sentence: string;
    translation: string;
  };
  type?: 'word' | 'idiom'; // デフォルトは'word'
}

export interface WordProgress {
  mastered: boolean;
  reviewCount: number;
  lastReview: number;
}

