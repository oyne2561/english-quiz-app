/**
 * クイズ問題の型定義
 */

// Markdown形式の文構造ブロック
export interface StructureBlock {
  type: 'S' | 'V' | 'O' | 'C' | 'RC' | 'PP' | 'INF' | 'GER' | 'ADJ' | 'ADV' | 'OTHER';
  text: string;
  children?: StructureBlock[]; // 階層構造をサポート
}

export interface Explanation {
  text: string;
  translation: string;
  structure: string; // Markdown形式の文構造（必須）
  wrongOptionExplanations?: {
    [optionIndex: number]: string;
  };
}

export interface GrammarQuestion {
  id: string;
  category: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: Explanation;
  difficulty: number;
}

export interface QuizSession {
  questions: GrammarQuestion[];
  currentIndex: number;
  answers: {
    questionId: string;
    selectedAnswer: number;
    isCorrect: boolean;
    timestamp: number;
  }[];
  startTime: number;
}

export type QuizMode = 'normal' | 'review' | 'weak';

