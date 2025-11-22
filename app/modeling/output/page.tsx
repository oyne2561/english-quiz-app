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
    <div className={`modeling-quiz-page ${flashGreen ? 'modeling-quiz-page--flash-green' : ''}`}>
      <div className="modeling-quiz-page__container">
        <div className="modeling-quiz-page__header">
          <BackToHomeButton />
        </div>

        {/* モード表示 */}
        <div className="mode-badge mode-badge--output">
          <span>💭</span>
          <span>アウトプットモード</span>
        </div>

        {/* プログレスバー */}
        <ProgressBar total={questions.length} current={currentIndex} />

        {/* 問題番号 */}
        <div className="question-number">
          問題 {currentIndex + 1} / {questions.length}
        </div>

        {/* 問題文 */}
        <div className={`content-box ${shake ? 'content-box--shake' : ''}`}>
          <div className="content-box__label content-box__label--blue">📝 問題</div>
          <div className="content-box__text prose prose-gray max-w-none">
            <div dangerouslySetInnerHTML={{ __html: questionHtml || currentQuestion.question }} />
          </div>
        </div>

        {/* 選択肢セクション */}
        <div className="option-list">
          <div className="option-list__label">
            選択肢を選んでください
          </div>
          <div className="option-list__items">
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
          <div className="quiz-drawer" onClick={moveToNext}>
            {/* オーバーレイ */}
            <div className="quiz-drawer__overlay" />

            {/* ドロワー */}
            <div className="quiz-drawer__content" onClick={(e) => e.stopPropagation()}>
              <div className="quiz-drawer__inner" onClick={moveToNext}>
                {/* ハンドル */}
                <div className="quiz-drawer__handle">
                  <div className="quiz-drawer__handle-bar" />
                </div>

                {/* 正解/不正解表示 */}
                <div className={`result-box ${isCorrect ? 'result-box--correct' : 'result-box--incorrect'}`}>
                  <div className={`result-box__title ${isCorrect ? 'result-box__title--correct' : 'result-box__title--incorrect'}`}>
                    {isCorrect ? '✓ 正解！' : '✗ 不正解'}
                  </div>
                  {isCorrect ? (
                    <div className="result-box__text">
                      正解です！
                    </div>
                  ) : (
                    <div className="result-box__text">
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
                <div className="content-box">
                  <div className="content-box__label content-box__label--blue">📝 問題</div>
                  <div className="content-box__text prose prose-gray max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: questionHtml || currentQuestion.question }} />
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

                {/* 選択肢の再表示 */}
                {selectedAnswer !== null && (
                  <div className="content-box">
                    <div className="content-box__label content-box__label--gray">📋 選択肢</div>
                    <div className="option-list__items">
                      {shuffledOptions.map((option, index) => {
                        const isSelected = index === selectedAnswer;
                        const isCorrectOption = index === correctAnswerIndex;
                        return (
                          <div
                            key={index}
                            className={`option-item ${
                              isCorrectOption
                                ? 'option-item--correct'
                                : isSelected && !isCorrect
                                ? 'option-item--selected-wrong'
                                : 'option-item--default'
                            }`}
                          >
                            <div className="option-item__content">
                              <span className={`option-item__label ${
                                isCorrectOption ? 'option-item__label--correct' : isSelected && !isCorrect ? 'option-item__label--wrong' : 'option-item__label--default'
                              }`}>
                                {['A', 'B', 'C', 'D'][index]}.
                              </span>
                              <div className={`option-item__text ${
                                isCorrectOption ? 'option-item__text--correct' : isSelected && !isCorrect ? 'option-item__text--wrong' : ''
                              }`}>
                                <div dangerouslySetInnerHTML={{ __html: optionHtmls[index] || option }} />
                              </div>
                              {isCorrectOption && (
                                <span className="option-item__icon option-item__icon--correct">✓</span>
                              )}
                              {isSelected && !isCorrect && (
                                <span className="option-item__icon option-item__icon--wrong">✗</span>
                              )}
                            </div>
                            {isCorrectOption && (
                              <div className="option-item__badge option-item__badge--correct">
                                正解
                              </div>
                            )}
                            {isSelected && !isCorrect && (
                              <div className="option-item__badge option-item__badge--wrong">
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
                <div className="content-box">
                  <div className="content-box__label content-box__label--gray">💡 解説</div>
                  <div className="content-box__text content-box__text--base content-box__text--prewrap">
                    {currentQuestion.explanation.text}
                  </div>
                </div>

                {/* 間違えた選択肢の解説 */}
                {selectedAnswer !== null && !isCorrect && currentQuestion.explanation.wrongOptionExplanations && (
                  (() => {
                    const originalSelectedIndex = shuffledToOriginalIndexMap[selectedAnswer] ?? selectedAnswer;
                    const wrongExplanation = currentQuestion.explanation.wrongOptionExplanations[originalSelectedIndex] ||
                      (currentQuestion.explanation.wrongOptionExplanations as Record<string, string>)[String(originalSelectedIndex)];
                    return wrongExplanation ? (
                      <div className="content-box content-box--yellow">
                        <div className="content-box__label content-box__label--yellow">
                          ⚠️ 選択した答えについて
                        </div>
                        <div className="content-box__text content-box__text--base">
                          {wrongExplanation}
                        </div>
                      </div>
                    ) : null;
                  })()
                )}
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
      <div className="content-page__loading">
        <div className="content-page__loading-text">読み込んでいます...</div>
      </div>
    }>
      <OutputModeContent />
    </Suspense>
  );
}

