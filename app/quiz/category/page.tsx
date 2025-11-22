/**
 * カテゴリ選択ページ
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BackToHomeButton } from '@/components/ui/BackToHomeButton';

const categories = [
  {
    id: 'kankeidaimeishi',
    name: '関係代名詞',
    description: '関係代名詞の使い方を学ぶ',
    emoji: '🔗',
  },
  {
    id: 'zenchishi',
    name: '前置詞',
    description: '前置詞の使い方を学ぶ',
    emoji: '📍',
  },
  {
    id: 'participle',
    name: '現在分詞と過去分詞',
    description: '分詞の使い方を学ぶ',
    emoji: '📝',
  },
  {
    id: 'jodoushi',
    name: '助動詞',
    description: '助動詞の使い方を学ぶ',
    emoji: '⚡',
  },
  {
    id: 'kateihou',
    name: '仮定法',
    description: '仮定法の使い方を学ぶ',
    emoji: '💭',
  },
  {
    id: 'judoutai',
    name: '受動態',
    description: '受動態の使い方を学ぶ',
    emoji: '🔄',
  },
  {
    id: 'futeishi',
    name: '不定詞',
    description: '不定詞の使い方を学ぶ',
    emoji: '➡️',
  },
  {
    id: 'domeishi',
    name: '動名詞',
    description: '動名詞の使い方を学ぶ',
    emoji: '📚',
  },
  {
    id: 'hikakukyuu',
    name: '比較級と最上級',
    description: '比較級と最上級の使い方を学ぶ',
    emoji: '📊',
  },
  {
    id: 'jodoushi-gimon',
    name: '助動詞の疑問文・依頼・提案',
    description: 'Shall/Can/May/Will/Wouldを使った疑問文・依頼・提案を学ぶ',
    emoji: '❓',
  },
];

const difficulties = [
  { value: 1, label: '初級', description: '基礎レベル' },
  { value: 2, label: '中級', description: '中級レベル' },
];

export default function CategoryPage() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<number>(1); // デフォルトで初級を選択

  const getDifficultyParam = () => {
    return `&difficulty=${selectedDifficulty}`;
  };

  return (
    <div 
      className="min-h-screen bg-slate-50 pb-safe flex items-start justify-center"
      style={{ minHeight: '100dvh' }}
    >
      <div className="w-full px-4 py-8 max-w-lg">
        {/* ホームボタン */}
        <div className="mb-6">
          <BackToHomeButton />
        </div>

        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            文法クイズ
          </h1>
          <p className="text-gray-600">
            カテゴリと難易度を選択してください
          </p>
        </div>

        {/* 難易度選択 */}
        <div className="mb-6">
          <div className="text-sm font-medium text-gray-700 mb-3">
            難易度を選択
          </div>
          <div className="grid grid-cols-2 gap-2">
            {difficulties.map((difficulty) => {
              const isSelected = selectedDifficulty === difficulty.value;
              const isBeginner = difficulty.value === 1;
              const isIntermediate = difficulty.value === 2;
              
              return (
                <button
                  key={difficulty.value ?? 'all'}
                  onClick={() => setSelectedDifficulty(difficulty.value)}
                  className={`
                    px-3 py-2 rounded-lg text-sm font-medium transition-all
                    ${isSelected
                      ? isBeginner
                        ? 'bg-green-500 text-white shadow-md border-2 border-green-600'
                        : isIntermediate
                        ? 'bg-yellow-500 text-white shadow-md border-2 border-yellow-600'
                        : 'bg-gray-500 text-white shadow-md border-2 border-gray-600'
                      : isBeginner
                        ? 'bg-white text-gray-700 border-2 border-green-200 hover:border-green-300'
                        : isIntermediate
                        ? 'bg-white text-gray-700 border-2 border-yellow-200 hover:border-yellow-300'
                        : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-300'
                    }
                    active:scale-[0.98] touch-manipulation
                  `}
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  <div className="font-semibold">{difficulty.label}</div>
                  <div className={`text-xs mt-0.5 ${isSelected ? 'opacity-90' : 'opacity-80'}`}>
                    {difficulty.description}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* カテゴリ選択 */}
        <div className="mb-4">
          <div className="text-sm font-medium text-gray-700 mb-3">
            カテゴリを選択
          </div>
          <div className="grid grid-cols-1 gap-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/quiz?category=${category.id}${getDifficultyParam()}`}
                className="block p-6 bg-white rounded-2xl shadow-sm border border-gray-100 active:shadow-md active:scale-[0.98] transition-all touch-manipulation hover:border-gray-200"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{category.emoji}</div>
                  <div className="flex-1 text-left">
                    <h2 className="text-xl font-semibold text-gray-800 mb-1">
                      {category.name}
                    </h2>
                    <p className="text-gray-600 text-sm">
                      {category.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

