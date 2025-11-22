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
    <div className="category-page">
      <div className="category-page__container">
        {/* ホームボタン */}
        <div className="category-page__header">
          <BackToHomeButton />
        </div>

        <div className="category-page__title-section">
          <h1 className="category-page__title">
            文法クイズ
          </h1>
          <p className="category-page__subtitle">
            カテゴリと難易度を選択してください
          </p>
        </div>

        {/* 難易度選択 */}
        <div className="difficulty-selector">
          <div className="difficulty-selector__label">
            難易度を選択
          </div>
          <div className="difficulty-selector__grid">
            {difficulties.map((difficulty) => {
              const isSelected = selectedDifficulty === difficulty.value;
              const isBeginner = difficulty.value === 1;
              const isIntermediate = difficulty.value === 2;

              return (
                <button
                  key={difficulty.value ?? 'all'}
                  onClick={() => setSelectedDifficulty(difficulty.value)}
                  className={`
                    difficulty-selector__button
                    ${isBeginner ? 'difficulty-selector__button--beginner' : ''}
                    ${isIntermediate ? 'difficulty-selector__button--intermediate' : ''}
                    ${isSelected ? 'difficulty-selector__button--selected' : ''}
                  `}
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  <div className="difficulty-selector__button-label">{difficulty.label}</div>
                  <div className="difficulty-selector__button-desc">
                    {difficulty.description}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* カテゴリ選択 */}
        <div className="category-selector">
          <div className="category-selector__label">
            カテゴリを選択
          </div>
          <div className="category-selector__grid">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/quiz?category=${category.id}${getDifficultyParam()}`}
                className="category-card"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <div className="category-card__content">
                  <div className="category-card__emoji">{category.emoji}</div>
                  <div className="category-card__text">
                    <h2 className="category-card__title">
                      {category.name}
                    </h2>
                    <p className="category-card__description">
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

