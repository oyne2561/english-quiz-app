/**
 * モデリング学習 - アウトプットモード
 * 問題を解いて考えるモード
 */

'use client';

import { useState, useEffect, Suspense } from 'react';
import type { GrammarQuestion } from '@/types/quiz';
import { shuffleArray } from '@/lib/quiz';
import { recordMistake, recordSession } from '@/lib/storage';
import { ProgressBar } from '@/components/quiz/ProgressBar';
import { OptionButton } from '@/components/quiz/OptionButton';
import { MarkdownOption } from '@/components/modeling/MarkdownOption';
import { BackToHomeButton } from '@/components/ui/BackToHomeButton';
import { markdownToHtml } from '@/lib/markdown-client';

function OutputModeContent() {
  const [questions, setQuestions] = useState<GrammarQuestion[]>([]);
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState<number>(0);
  const [shuffledToOriginalIndexMap, setShuffledToOriginalIndexMap] = useState<number[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [flashGreen, setFlashGreen] = useState(false);
  const [shake, setShake] = useState(false);
  const [questionHtml, setQuestionHtml] = useState<string>('');
  const [optionHtmls, setOptionHtmls] = useState<Record<number, string>>({});
  const [answers, setAnswers] = useState<
    Array<{ questionId: string; selectedAnswer: number; isCorrect: boolean }>
  >([]);

  // 選択肢をシャッフルする関数
  const shuffleOptions = async (question: GrammarQuestion) => {
    const correctOption = question.options[question.correctAnswer];
    const optionsWithIndex = question.options.map((opt, idx) => ({ opt, idx }));
    const shuffled = shuffleArray(optionsWithIndex);
    const newOptions = shuffled.map(item => item.opt);
    const newCorrectIndex = shuffled.findIndex(item => item.opt === correctOption);
    const indexMap = shuffled.map(item => item.idx);
    
    setShuffledOptions(newOptions);
    setCorrectAnswerIndex(newCorrectIndex);
    setShuffledToOriginalIndexMap(indexMap);

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
  }, [currentIndex, questions]);

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

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null) return;

    const currentQuestion = questions[currentIndex];
    const correct = answerIndex === correctAnswerIndex;

    setSelectedAnswer(answerIndex);
    setIsCorrect(correct);

    // 回答を記録
    setAnswers([
      ...answers,
      {
        questionId: currentQuestion.id,
        selectedAnswer: answerIndex,
        isCorrect: correct,
      },
    ]);

    if (correct) {
      // 正解：緑フラッシュ → 解説表示
      setFlashGreen(true);
      setTimeout(() => {
        setFlashGreen(false);
        setShowExplanation(true);
      }, 200);
    } else {
      // 不正解：画面揺れ → 解説表示
      recordMistake(currentQuestion.id);
      setShake(true);
      setTimeout(() => {
        setShake(false);
        setShowExplanation(true);
      }, 300);
    }
  };

  const moveToNext = async () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setShowExplanation(false);
      await shuffleOptions(questions[currentIndex + 1]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    const correctCount = answers.filter(a => a.isCorrect).length;
    recordSession(questions.length, correctCount);
    alert(`クイズ終了！\n正解数: ${correctCount} / ${questions.length}`);
    window.location.href = '/modeling';
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
      className={`min-h-screen bg-gray-50 pb-safe flex flex-col items-center transition-colors duration-200 ${
        flashGreen ? 'bg-green-100' : ''
      }`}
      style={{ minHeight: '100dvh' }}
    >
      <div className="w-full max-w-2xl px-4 py-6">
        <div className="mb-4">
          <BackToHomeButton />
        </div>

        {/* モード表示 */}
        <div className="mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
            <span>💭</span>
            <span>アウトプットモード</span>
          </div>
        </div>

        {/* プログレスバー */}
        <ProgressBar total={questions.length} current={currentIndex} />

        {/* 問題番号 */}
        <div className="text-center text-sm text-gray-600 mb-6 mt-4">
          問題 {currentIndex + 1} / {questions.length}
        </div>

        {/* 問題文 */}
        <div className={`bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6 transition-transform duration-300 ${
          shake ? 'animate-shake' : ''
        }`}>
          <div className="text-sm font-semibold text-blue-600 mb-3">📝 問題</div>
          <div className="prose prose-gray max-w-none text-gray-900 text-lg leading-relaxed break-words">
            <div dangerouslySetInnerHTML={{ __html: questionHtml || currentQuestion.question }} />
          </div>
        </div>

        {/* 選択肢セクション */}
        <div className="w-full mb-6">
          <div className="text-sm text-gray-600 font-medium mb-3">
            選択肢を選んでください
          </div>
          <div className="space-y-3">
            {shuffledOptions.map((option, index) => (
              <MarkdownOption
                key={index}
                option={option}
                index={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={selectedAnswer !== null}
                isSelected={selectedAnswer === index}
                isCorrectOption={index === correctAnswerIndex}
                showFeedback={selectedAnswer !== null}
              />
            ))}
          </div>
        </div>

        {/* 解説ドロワー */}
        {showExplanation && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center cursor-pointer"
            onClick={moveToNext}
          >
            {/* オーバーレイ */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

            {/* ドロワー */}
            <div
              className="relative w-full max-w-2xl max-h-[85vh] bg-white rounded-3xl shadow-2xl overflow-y-auto overscroll-contain mx-4"
              style={{ maxHeight: '85vh' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-6 py-6 pb-8" onClick={moveToNext}>
                {/* ハンドル */}
                <div className="flex justify-center mb-6">
                  <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
                </div>

                {/* 正解/不正解表示 */}
                <div
                  className={`
                    mb-6 p-4 rounded-2xl border-2 text-center
                    ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}
                  `}
                >
                  <div className={`font-bold text-2xl mb-2 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                    {isCorrect ? '✓ 正解！' : '✗ 不正解'}
                  </div>
                  {isCorrect ? (
                    <div className="text-gray-800 text-lg">
                      正解です！
                    </div>
                  ) : (
                    <div className="text-gray-800 text-lg space-y-1">
                      <div>
                        あなたが選んだのは選択肢 <span className="font-bold text-red-600 text-xl">{['A', 'B', 'C', 'D'][selectedAnswer ?? 0]}</span> でした
                      </div>
                      <div>
                        正解は選択肢 <span className="font-bold text-green-600 text-xl">{['A', 'B', 'C', 'D'][correctAnswerIndex]}</span> です
                      </div>
                    </div>
                  )}
                </div>

                {/* 問題文 */}
                <div className="bg-blue-50 border-2 border-blue-100 rounded-2xl p-5 mb-6">
                  <div className="text-sm font-semibold text-blue-600 mb-2">📝 問題</div>
                  <div className="prose prose-gray max-w-none text-gray-900 text-lg font-medium px-2 break-words">
                    <div dangerouslySetInnerHTML={{ __html: questionHtml || currentQuestion.question }} />
                  </div>
                </div>

                {/* 日本語訳 */}
                {currentQuestion.explanation.translation && (
                  <div className="bg-white border-2 border-gray-200 rounded-2xl p-5 mb-4">
                    <div className="text-sm font-semibold text-gray-600 mb-2">🗾 日本語訳</div>
                    <p className="text-gray-900 text-base leading-relaxed px-2">{currentQuestion.explanation.translation}</p>
                  </div>
                )}

                {/* 選択肢の再表示 */}
                {selectedAnswer !== null && (
                  <div className="mb-6">
                    <div className="text-sm font-semibold text-gray-700 mb-3">📋 選択肢</div>
                    <div className="space-y-3">
                      {shuffledOptions.map((option, index) => {
                        const isSelected = index === selectedAnswer;
                        const isCorrectOption = index === correctAnswerIndex;
                        return (
                          <div
                            key={index}
                            className={`
                              p-4 rounded-xl border-2
                              ${isCorrectOption
                                ? 'bg-green-50 border-green-500'
                                : isSelected && !isCorrect
                                ? 'bg-red-50 border-red-500'
                                : 'bg-gray-50 border-gray-200'
                              }
                            `}
                          >
                            <div className="flex items-start gap-3">
                              <span className={`font-bold text-lg shrink-0 ${
                                isCorrectOption ? 'text-green-600' : isSelected && !isCorrect ? 'text-red-600' : 'text-gray-600'
                              }`}>
                                {['A', 'B', 'C', 'D'][index]}.
                              </span>
                              <div className="flex-1 prose prose-sm max-w-none">
                                <div
                                  className={`
                                    ${isCorrectOption ? 'text-green-900 font-medium' : isSelected && !isCorrect ? 'text-red-900 font-medium' : 'text-gray-800'}
                                  `}
                                  dangerouslySetInnerHTML={{ __html: optionHtmls[index] || option }}
                                />
                              </div>
                              {isCorrectOption && (
                                <span className="text-xl shrink-0 text-green-600">✓</span>
                              )}
                              {isSelected && !isCorrect && (
                                <span className="text-xl shrink-0 text-red-600">✗</span>
                              )}
                            </div>
                            {isCorrectOption && (
                              <div className="mt-2 text-sm text-green-600 font-medium">
                                正解
                              </div>
                            )}
                            {isSelected && !isCorrect && (
                              <div className="mt-2 text-sm text-red-600 font-medium">
                                あなたが選んだ選択肢
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 解説 */}
                <div className="bg-white border-2 border-gray-200 rounded-2xl p-5 mb-4">
                  <div className="text-sm font-semibold text-gray-600 mb-2">💡 解説</div>
                  <p className="text-gray-900 text-base leading-relaxed px-2 whitespace-pre-wrap break-words">{currentQuestion.explanation.text}</p>
                </div>

                {/* 間違えた選択肢の解説 */}
                {selectedAnswer !== null && !isCorrect && currentQuestion.explanation.wrongOptionExplanations && (
                  (() => {
                    const originalSelectedIndex = shuffledToOriginalIndexMap[selectedAnswer] ?? selectedAnswer;
                    const wrongExplanation = currentQuestion.explanation.wrongOptionExplanations[originalSelectedIndex] ||
                      (currentQuestion.explanation.wrongOptionExplanations as Record<string, string>)[String(originalSelectedIndex)];
                    return wrongExplanation ? (
                      <div className="mb-4 p-5 bg-yellow-50 rounded-2xl border-2 border-yellow-200">
                        <div className="text-sm font-semibold text-yellow-800 mb-2">
                          ⚠️ 選択した答えについて
                        </div>
                        <p className="text-base text-yellow-900 leading-relaxed px-2">{wrongExplanation}</p>
                      </div>
                    ) : null;
                  })()
                )}

                {/* タップして次へ */}
                <div className="text-center py-4">
                  <p className="text-gray-500 text-sm">
                    画面をタップして次の問題へ
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function OutputModePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 pb-safe flex items-center justify-center" style={{ minHeight: '100dvh' }}>
        <div className="text-xl">読み込んでいます...</div>
      </div>
    }>
      <OutputModeContent />
    </Suspense>
  );
}

