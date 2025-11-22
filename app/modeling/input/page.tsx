/**
 * モデリング学習 - インプットモード
 * 解説を見ながら学習するモード
 */

'use client';

import { useState, useEffect, Suspense } from 'react';
import type { GrammarQuestion } from '@/types/quiz';
import { shuffleArray } from '@/lib/quiz';
import { BackToHomeButton } from '@/components/ui/BackToHomeButton';
import { ProgressBar } from '@/components/quiz/ProgressBar';
import { markdownToHtml } from '@/lib/markdown-client';

function InputModeContent() {
  const [questions, setQuestions] = useState<GrammarQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState<number>(0);
  const [optionHtmls, setOptionHtmls] = useState<Record<number, string>>({});
  const [questionHtml, setQuestionHtml] = useState<string>('');

  // 選択肢をシャッフルする関数
  const shuffleOptions = async (question: GrammarQuestion) => {
    const correctOption = question.options[question.correctAnswer];
    const optionsWithIndex = question.options.map((opt, idx) => ({ opt, idx }));
    const shuffled = shuffleArray(optionsWithIndex);
    const newOptions = shuffled.map(item => item.opt);
    const newCorrectIndex = shuffled.findIndex(item => item.opt === correctOption);

    setShuffledOptions(newOptions);
    setCorrectAnswerIndex(newCorrectIndex);

    // マークダウンをHTMLに変換
    const htmls: Record<number, string> = {};
    for (let i = 0; i < newOptions.length; i++) {
      htmls[i] = await markdownToHtml(newOptions[i]);
    }
    setOptionHtmls(htmls);
  };

  // 問題文をMarkdownからHTMLに変換
  useEffect(() => {
    async function convertQuestion() {
      if (questions.length > 0 && questions[currentIndex]?.question) {
        const html = await markdownToHtml(questions[currentIndex].question);
        setQuestionHtml(html);
      }
    }
    convertQuestion();
  }, [questions, currentIndex]);

  // 問題を読み込む
  useEffect(() => {
    async function loadQuestions() {
      setIsLoading(true);
      try {
        const response = await fetch('/data/modeling/economic-platform-strategic.json');
        const allQuestions = (await response.json()) as GrammarQuestion[];
        const shuffled = shuffleArray(allQuestions);
        setQuestions(shuffled);
        if (shuffled.length > 0) {
          await shuffleOptions(shuffled[0]);
        }
      } catch (error) {
        console.error('Failed to load questions:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadQuestions();
  }, []);

  const moveToNext = async () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      await shuffleOptions(questions[currentIndex + 1]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const moveToPrevious = async () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      await shuffleOptions(questions[currentIndex - 1]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (isLoading) {
    return (
      <div className="content-page__loading">
        <div className="content-page__loading-text">読み込んでいます...</div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="content-page__empty">
        <div className="content-page__empty-title">問題が見つかりませんでした</div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="modeling-quiz-page">
      <div className="modeling-quiz-page__container">
        <div className="modeling-quiz-page__header">
          <BackToHomeButton />
        </div>

        {/* モード表示 */}
        <div className="mode-badge mode-badge--input">
          <span>📖</span>
          <span>インプットモード</span>
        </div>

        {/* プログレスバー */}
        <ProgressBar total={questions.length} current={currentIndex} />

        {/* 問題番号 */}
        <div className="question-number">
          問題 {currentIndex + 1} / {questions.length}
        </div>

        {/* 問題文 */}
        <div className="content-box">
          <div className="content-box__label content-box__label--blue">📝 問題</div>
          <div className="content-box__text prose prose-gray max-w-none">
            <div dangerouslySetInnerHTML={{ __html: questionHtml || currentQuestion.question }} />
          </div>
        </div>

        {/* 選択肢（正解をハイライト） */}
        <div className="content-box">
          <div className="content-box__label content-box__label--gray">選択肢</div>
          <div className="option-list__items">
            {shuffledOptions.map((option, index) => {
              const isCorrect = index === correctAnswerIndex;
              return (
                <div
                  key={index}
                  className={`option-item ${isCorrect ? 'option-item--correct' : 'option-item--default'}`}
                >
                  <div className="option-item__content">
                    <span className={`option-item__label ${isCorrect ? 'option-item__label--correct' : 'option-item__label--default'}`}>
                      {['A', 'B', 'C', 'D'][index]}.
                    </span>
                    <div className="option-item__text">
                      <div
                        className={isCorrect ? 'option-item__text--correct' : ''}
                        dangerouslySetInnerHTML={{ __html: optionHtmls[index] || option }}
                      />
                      {isCorrect && (
                        <div className="option-item__badge option-item__badge--correct">
                          ✓ 正解
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 解説 */}
        <div className="content-box">
          <div className="content-box__label content-box__label--gray">💡 解説</div>
          <div className="content-box__text content-box__text--base content-box__text--prewrap">
            {currentQuestion.explanation.text}
          </div>
        </div>

        {/* 日本語訳 */}
        {currentQuestion.explanation.translation && (
          <div className="content-box">
            <div className="content-box__label content-box__label--gray">🗾 日本語訳</div>
            <div className="content-box__text content-box__text--base">
              {currentQuestion.explanation.translation}
            </div>
          </div>
        )}

        {/* 間違えた選択肢の解説 */}
        {currentQuestion.explanation.wrongOptionExplanations &&
         Object.keys(currentQuestion.explanation.wrongOptionExplanations).length > 0 && (
          <div className="content-box content-box--yellow">
            <div className="content-box__label content-box__label--yellow">⚠️ 他の選択肢について</div>
            <div className="option-list__items">
              {Object.entries(currentQuestion.explanation.wrongOptionExplanations).map(([index, explanation]) => {
                const optionIndex = parseInt(index);
                const labels = ['A', 'B', 'C', 'D'];
                return (
                  <div key={index} className="content-box__text content-box__text--base">
                    <span className="font-medium">{labels[optionIndex]}: </span>
                    {explanation}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ナビゲーションボタン */}
        <div className="nav-buttons">
          <button
            onClick={moveToPrevious}
            disabled={currentIndex === 0}
            className={`nav-buttons__button nav-buttons__button--prev ${currentIndex === 0 ? 'nav-buttons__button--disabled' : ''}`}
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            ← 前へ
          </button>
          <button
            onClick={moveToNext}
            disabled={currentIndex === questions.length - 1}
            className={`nav-buttons__button nav-buttons__button--next ${currentIndex === questions.length - 1 ? 'nav-buttons__button--disabled' : ''}`}
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            次へ →
          </button>
        </div>
      </div>
    </div>
  );
}

export default function InputModePage() {
  return (
    <Suspense fallback={
      <div className="content-page__loading">
        <div className="content-page__loading-text">読み込んでいます...</div>
      </div>
    }>
      <InputModeContent />
    </Suspense>
  );
}

