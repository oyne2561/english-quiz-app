/**
 * 文法クイズページ
 */

'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import type { GrammarQuestion, QuizMode } from '@/types/quiz';
import { loadQuestions, isCorrectAnswer, shuffleArray, filterByDifficulty } from '@/lib/quiz';
import { recordMistake, recordSession } from '@/lib/storage';
import { ProgressBar } from '@/components/quiz/ProgressBar';
import { OptionButton } from '@/components/quiz/OptionButton';
import { ExplanationDrawer } from '@/components/quiz/ExplanationDrawer';
import { BackToHomeButton } from '@/components/ui/BackToHomeButton';

function QuizPageContent() {
  const searchParams = useSearchParams();
  const mode = (searchParams.get('mode') || 'normal') as QuizMode;
  const category = searchParams.get('category');
  const difficultyParam = searchParams.get('difficulty');
  const difficulty = difficultyParam ? parseInt(difficultyParam, 10) : null;

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
  const [answers, setAnswers] = useState<
    Array<{ questionId: string; selectedAnswer: number; isCorrect: boolean }>
  >([]);

  // 選択肢をシャッフルする関数
  const shuffleOptions = (question: GrammarQuestion) => {
    const correctOption = question.options[question.correctAnswer];
    const optionsWithIndex = question.options.map((opt, idx) => ({ opt, idx }));
    const shuffled = shuffleArray(optionsWithIndex);
    const newOptions = shuffled.map(item => item.opt);
    const newCorrectIndex = shuffled.findIndex(item => item.opt === correctOption);
    const indexMap = shuffled.map(item => item.idx); // シャッフル後のインデックス → 元のインデックス

    setShuffledOptions(newOptions);
    setCorrectAnswerIndex(newCorrectIndex);
    setShuffledToOriginalIndexMap(indexMap);
  };

  // 問題を読み込む
  useEffect(() => {
    async function loadQuiz() {
      setIsLoading(true);

      if (mode === 'weak') {
        // 苦手克服モード：全カテゴリから復習が必要な問題を取得
        const allCategories = [
          'zenchishi',
          'genzaibunshi',
          'kakobunshi',
          'kankeidaimeishi',
          'jodoushi',
          'kateihou',
          'judoutai',
          'futeishi',
          'domeishi',
          'hikakukyuu',
          'jodoushi-gimon',
        ];
        const loadedQuestions = await loadQuestions(
          allCategories,
          30,
          mode,
          difficulty
        ) as GrammarQuestion[];
        setQuestions(loadedQuestions);
        if (loadedQuestions.length > 0) {
          shuffleOptions(loadedQuestions[0]);
        }
      } else if (category) {
        // カテゴリ指定モード
        // データに存在する全ての問題を表示（難易度でフィルタリング）

        if (category === 'participle') {
          // 現在分詞と過去分詞をまとめて出題
          const presentQuestions = await fetch('/data/grammar/genzaibunshi.json').then(r => r.json()) as GrammarQuestion[];
          const pastQuestions = await fetch('/data/grammar/kakobunshi.json').then(r => r.json()) as GrammarQuestion[];
          const allParticiple = [...shuffleArray(presentQuestions), ...shuffleArray(pastQuestions)];
          const filtered = filterByDifficulty(allParticiple, difficulty);
          const shuffled = shuffleArray(filtered);
          setQuestions(shuffled);
          if (shuffled.length > 0) {
            shuffleOptions(shuffled[0]);
          }
        } else {
          // 直接データを読み込んで、難易度でフィルタリング
          const response = await fetch(`/data/grammar/${category}.json`);
          const allQuestions = (await response.json()) as GrammarQuestion[];
          const filtered = filterByDifficulty(allQuestions, difficulty);
          const shuffled = shuffleArray(filtered);
          setQuestions(shuffled);
          if (shuffled.length > 0) {
            shuffleOptions(shuffled[0]);
          }
        }
      } else {
        // カテゴリ未指定：カテゴリ選択ページにリダイレクト
        window.location.href = '/quiz/category';
        return;
      }

      setIsLoading(false);
    }

    loadQuiz();
  }, [mode, category, difficulty]);

  // ページを離れる時に間違えた問題を保存（途中でホームに戻った場合でも記録）
  // 注意: handleAnswerSelect内で既にrecordMistakeを呼んでいるため、
  // ここでは重複を避けるため、未記録の回答のみを記録する
  useEffect(() => {
    return () => {
      // コンポーネントがアンマウントされる時（ページを離れる時）に実行
      // 間違えた問題は既にhandleAnswerSelect内でrecordMistakeで記録されている
      // このクリーンアップ関数は念のためのフォールバックとして残す
    };
  }, []);

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null) return; // 既に回答済み

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
      // 正解：緑フラッシュ → 解説表示（zenchishiの場合）または自動で次の問題へ
      // 苦手克服モードでも正解しても削除しない（間違えた問題を継続的に復習できるように）
      setFlashGreen(true);
      setTimeout(() => {
        setFlashGreen(false);
        // 前置詞（zenchishi）と関係代名詞（kankeidaimeishi）の場合は正解時も解説を表示
        if (category === 'zenchishi' || category === 'kankeidaimeishi') {
          setShowExplanation(true);
        } else {
          // その他のカテゴリは従来通り自動で次の問題へ
          if (currentIndex < questions.length - 1) {
            moveToNext();
          } else {
            finishQuiz();
          }
        }
      }, 200);
    } else {
      // 不正解：画面揺れ → 解説ドロワー表示
      // 間違えた問題を記録（苦手克服モードでも通常モードでも記録）
      recordMistake(currentQuestion.id);
      setShake(true);
      setTimeout(() => {
        setShake(false);
        setShowExplanation(true);
      }, 300);
    }
  };

  const moveToNext = () => {
    if (currentIndex < questions.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setShowExplanation(false);
      shuffleOptions(questions[nextIndex]); // 次の問題の選択肢をシャッフル
    } else {
      // クイズ終了
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    const correctCount = answers.filter((a) => a.isCorrect).length;
    const totalAnswers = answers.length;
    recordSession(totalAnswers, correctCount);

    // 結果を表示してホームに戻る
    const score = totalAnswers > 0 ? ((correctCount / totalAnswers) * 100).toFixed(1) : '0';
    if (confirm(`クイズ終了！\n正答数: ${correctCount} / ${totalAnswers}\n正答率: ${score}%\n\nホームに戻りますか？`)) {
      window.location.href = '/';
    }
  };

  if (isLoading) {
    return (
      <div className="content-page__loading">
        <div className="content-page__loading-button">
          <BackToHomeButton />
        </div>
        <div className="content-page__loading-text">問題を読み込んでいます...</div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="content-page__empty">
        <div className="content-page__empty-button">
          <BackToHomeButton />
        </div>
        <div className="content-page__empty-content">
          <div className="content-page__empty-title">
            {mode === 'weak'
              ? '復習が必要な問題がありません'
              : '問題が見つかりませんでした'}
          </div>
          {mode === 'weak' && (
            <p className="content-page__empty-description">
              通常モードで問題を解いて、間違えた問題を復習しましょう
            </p>
          )}
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className={`quiz-page ${flashGreen ? 'quiz-page--flash-green' : ''} ${shake ? 'quiz-page--shake' : ''}`}>
      <ProgressBar total={questions.length} current={currentIndex} />

      <div className="quiz-page__container">
        {/* ホームボタンを問題文の上に配置 */}
        <div className="quiz-page__header">
          <BackToHomeButton />
        </div>

        {/* 問題文 */}
        <div className="question-card">
          <div className="question-card__inner">
            <div className="question-card__meta">
              <div className="question-card__progress">
                問題 {currentIndex + 1} / {questions.length}
              </div>
              {difficulty !== null && (
                <div className={`question-card__difficulty ${
                  difficulty === 1
                    ? 'question-card__difficulty--beginner'
                    : difficulty === 2
                      ? 'question-card__difficulty--intermediate'
                      : ''
                }`}>
                  {difficulty === 1 ? '初級' : difficulty === 2 ? '中級' : ''}
                </div>
              )}
            </div>
            <h2 className="question-card__question">
              {currentQuestion.question}
            </h2>
            <div className="question-card__translation">
              {currentQuestion.explanation.translation}
            </div>
          </div>
        </div>

        {/* 選択肢セクション */}
        <div className="options-section">
          <div className="options-section__list">
            {shuffledOptions.map((option, index) => (
              <OptionButton
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
        <ExplanationDrawer
          question={currentQuestion}
          selectedAnswer={selectedAnswer ?? -1}
          correctAnswerIndex={correctAnswerIndex}
          shuffledToOriginalIndexMap={shuffledToOriginalIndexMap}
          isOpen={showExplanation}
          onClose={moveToNext}
        />
      </div>
    </div>
  );
}

export default function QuizPage() {
  return (
    <Suspense fallback={
      <div className="content-page__loading">
        <div className="content-page__loading-text">読み込んでいます...</div>
      </div>
    }>
      <QuizPageContent />
    </Suspense>
  );
}

