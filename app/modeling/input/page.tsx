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
        const response = await fetch('/data/modeling/economic-platform.json');
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
      <div className="min-h-screen bg-gray-50 pb-safe flex items-center justify-center" style={{ minHeight: '100dvh' }}>
        <div className="text-xl text-gray-600">読み込んでいます...</div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pb-safe flex items-center justify-center" style={{ minHeight: '100dvh' }}>
        <div className="text-xl text-gray-600">問題が見つかりませんでした</div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div 
      className="min-h-screen bg-gray-50 pb-safe flex flex-col items-center"
      style={{ minHeight: '100dvh' }}
    >
      <div className="w-full max-w-2xl px-4 py-6">
        <div className="mb-4">
          <BackToHomeButton />
        </div>

        {/* モード表示 */}
        <div className="mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
            <span>📖</span>
            <span>インプットモード</span>
          </div>
        </div>

        {/* プログレスバー */}
        <ProgressBar total={questions.length} current={currentIndex} />

        {/* 問題番号 */}
        <div className="text-center text-sm text-gray-600 mb-6 mt-4">
          問題 {currentIndex + 1} / {questions.length}
        </div>

        {/* 問題文 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="text-sm font-semibold text-blue-600 mb-3">📝 問題</div>
          <div className="prose prose-gray max-w-none text-gray-900 text-lg leading-relaxed break-words">
            <div dangerouslySetInnerHTML={{ __html: questionHtml || currentQuestion.question }} />
          </div>
        </div>

        {/* 選択肢（正解をハイライト） */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="text-sm font-semibold text-gray-700 mb-4">選択肢</div>
          <div className="space-y-3">
            {shuffledOptions.map((option, index) => {
              const isCorrect = index === correctAnswerIndex;
              return (
                <div
                  key={index}
                  className={`
                    p-4 rounded-xl border-2 transition-all
                    ${isCorrect 
                      ? 'bg-green-50 border-green-300' 
                      : 'bg-gray-50 border-gray-200'
                    }
                  `}
                >
                  <div className="flex items-start gap-3">
                    <span className={`font-bold text-lg shrink-0 ${
                      isCorrect ? 'text-green-600' : 'text-gray-600'
                    }`}>
                      {['A', 'B', 'C', 'D'][index]}.
                    </span>
                    <div className="flex-1 prose prose-sm max-w-none">
                      <div
                        className={`
                          ${isCorrect ? 'text-green-900 font-medium' : 'text-gray-800'}
                        `}
                        dangerouslySetInnerHTML={{ __html: optionHtmls[index] || option }}
                      />
                      {isCorrect && (
                        <div className="mt-2 text-sm text-green-600 font-medium">
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
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="text-sm font-semibold text-gray-700 mb-3">💡 解説</div>
          <div className="text-gray-900 text-base leading-relaxed whitespace-pre-wrap break-words">
            {currentQuestion.explanation.text}
          </div>
        </div>

        {/* 日本語訳 */}
        {currentQuestion.explanation.translation && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="text-sm font-semibold text-gray-700 mb-3">🗾 日本語訳</div>
            <div className="text-gray-900 text-base leading-relaxed">
              {currentQuestion.explanation.translation}
            </div>
          </div>
        )}

        {/* 間違えた選択肢の解説 */}
        {currentQuestion.explanation.wrongOptionExplanations && 
         Object.keys(currentQuestion.explanation.wrongOptionExplanations).length > 0 && (
          <div className="bg-yellow-50 rounded-2xl shadow-sm border border-yellow-200 p-6 mb-6">
            <div className="text-sm font-semibold text-yellow-800 mb-3">⚠️ 他の選択肢について</div>
            <div className="space-y-3">
              {Object.entries(currentQuestion.explanation.wrongOptionExplanations).map(([index, explanation]) => {
                const optionIndex = parseInt(index);
                const labels = ['A', 'B', 'C', 'D'];
                return (
                  <div key={index} className="text-yellow-900 text-sm leading-relaxed">
                    <span className="font-medium">{labels[optionIndex]}: </span>
                    {explanation}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ナビゲーションボタン */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={moveToPrevious}
            disabled={currentIndex === 0}
            className={`
              flex-1 py-4 px-6 rounded-xl font-semibold text-lg transition-all touch-manipulation
              ${currentIndex === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white border-2 border-gray-300 text-gray-700 active:scale-[0.98] hover:border-gray-400 shadow-sm'
              }
            `}
            style={{ WebkitTapHighlightColor: 'transparent', minHeight: '56px' }}
          >
            ← 前へ
          </button>
          <button
            onClick={moveToNext}
            disabled={currentIndex === questions.length - 1}
            className={`
              flex-1 py-4 px-6 rounded-xl font-semibold text-lg transition-all touch-manipulation
              ${currentIndex === questions.length - 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-500 text-white active:scale-[0.98] hover:bg-blue-600 shadow-sm'
              }
            `}
            style={{ WebkitTapHighlightColor: 'transparent', minHeight: '56px' }}
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
      <div className="min-h-screen bg-gray-50 pb-safe flex items-center justify-center" style={{ minHeight: '100dvh' }}>
        <div className="text-xl">読み込んでいます...</div>
      </div>
    }>
      <InputModeContent />
    </Suspense>
  );
}

