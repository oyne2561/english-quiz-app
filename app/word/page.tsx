/**
 * 単語学習ページ
 */

'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import type { Word } from '@/types/word';
import { shuffleArray } from '@/lib/quiz';
import { recordMistake, recordMistakeForWeakMode, removeMistake, getWordQuestionsToReview } from '@/lib/storage';
import { AudioButton } from '@/components/word/AudioButton';
import { WordExplanationDrawer } from '@/components/word/WordExplanationDrawer';
import { OptionButton } from '@/components/quiz/OptionButton';
import { BackToHomeButton } from '@/components/ui/BackToHomeButton';

function WordPageContent() {
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode') || 'normal';
  const wordType = searchParams.get('type') || 'word'; // 'word' or 'idiom'

  const [words, setWords] = useState<Word[]>([]);
  const [allWords, setAllWords] = useState<Word[]>([]); // 選択肢生成用の全単語
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [flashGreen, setFlashGreen] = useState(false);
  const [shake, setShake] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [skipExplanationOnCorrect, setSkipExplanationOnCorrect] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('wordSkipExplanationOnCorrect');
      return saved === 'true';
    }
    return false;
  });
  const wasCorrectRef = useRef<boolean>(false);
  const initialQuestionCountRef = useRef<number>(0); // 苦手克服モードの最初の問題数
  const [answeredCount, setAnsweredCount] = useState<number>(0); // 回答した問題数

  // 日本語かどうかを判定（ひらがな、カタカナ、漢字が含まれているか）
  const isJapanese = (text: string): boolean => {
    const japaneseRegex = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/;
    return japaneseRegex.test(text);
  };

  // 日本語訳が日本語の単語のみをフィルタリング
  const filterJapaneseWords = (words: Word[]): Word[] => {
    return words.filter((word) => {
      // meaning配列の最初の要素が日本語かどうかをチェック
      return word.meaning.length > 0 && isJapanese(word.meaning[0]);
    });
  };

  // 単語データを読み込む
  useEffect(() => {
    async function loadWords() {
      setIsLoading(true);
      try {
        // typeに応じて適切なJSONファイルを読み込む
        const jsonFile = wordType === 'idiom' ? '/data/vocabulary/idioms.json' : '/data/vocabulary/words.json';
        const response = await fetch(jsonFile);
        const loadedWords = (await response.json()) as Word[];
        // 日本語訳が日本語のもののみをフィルタリング
        const japaneseWords = filterJapaneseWords(loadedWords);

        setAllWords(japaneseWords); // 選択肢生成用に全単語を保存

        let targetWords: Word[];
        if (mode === 'weak') {
          // 苦手克服モード：間違えた単語のみを出題
          const wordIdsToReview = getWordQuestionsToReview();
          targetWords = japaneseWords.filter((word) => wordIdsToReview.includes(word.word.toLowerCase()));
          targetWords = shuffleArray(targetWords);
        } else {
          // 通常モード：全単語からシャッフル
          targetWords = shuffleArray(japaneseWords);
        }

        setWords(targetWords);
        // 苦手克服モードの場合、最初の問題数を記録
        if (mode === 'weak') {
          initialQuestionCountRef.current = targetWords.length;
          setAnsweredCount(0);
        }
        if (targetWords.length > 0) {
          generateOptions(targetWords[0], japaneseWords);
        }
      } catch (error) {
        console.error('Failed to load words:', error);
      }
      setIsLoading(false);
    }

    loadWords();
  }, [mode, wordType]);

  // 単語の意味を全て取得
  const getMeaningText = (meanings: string[]): string => {
    return meanings.join('、');
  };

  // 選択肢を生成（正解 + 3つの誤答）
  const generateOptions = (word: Word, allWords: Word[]) => {
    const correctAnswer = getMeaningText(word.meaning);

    // すべての単語から選択肢を選ぶ
    const candidateWords = allWords.filter((w) => {
      if (w.word.toLowerCase() === word.word.toLowerCase()) return false;
      if (!isJapanese(w.meaning[0])) return false;
      const wMeaning = getMeaningText(w.meaning);
      if (wMeaning === correctAnswer) return false;
      return true;
    });

    const wrongAnswers = candidateWords.map((w) => getMeaningText(w.meaning));
    const shuffledWrong = shuffleArray(wrongAnswers).slice(0, 3);
    const allOptions = shuffleArray([correctAnswer, ...shuffledWrong]);

    // 正解のインデックスを保存
    const correctIndex = allOptions.findIndex((opt) => opt === correctAnswer);
    setCorrectAnswerIndex(correctIndex);
    setOptions(allOptions);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null) return;

    const currentWord = words[currentIndex];
    const correct = options[answerIndex] === getMeaningText(currentWord.meaning);

    setSelectedAnswer(answerIndex);
    setIsCorrect(correct);
    wasCorrectRef.current = correct;

    if (correct) {
      // 正解：緑フラッシュ → 解説ドロワー表示（設定でスキップ可能）
      // 苦手克服モードの場合、正解した単語を間違いリストから削除
      if (mode === 'weak') {
        const wordId = `word:${currentWord.word.toLowerCase()}`;
        removeMistake(wordId);
      }
      setFlashGreen(true);
      setTimeout(() => {
        setFlashGreen(false);
        if (skipExplanationOnCorrect) {
          // 設定でスキップする場合：すぐ次へ
          moveToNext();
        } else {
          // デフォルト：解説モーダルを表示
          setShowExplanation(true);
        }
      }, 200);
    } else {
      // 不正解：画面揺れ → 解説ドロワー表示
      // 間違えた単語を記録
      const wordId = `word:${currentWord.word.toLowerCase()}`;
      if (mode === 'weak') {
        // 苦手克服モード：nextReviewを更新せず、即座に復習可能のまま
        recordMistakeForWeakMode(wordId);
      } else {
        // 通常モード：nextReviewを更新して復習スケジュールを設定
        recordMistake(wordId);
      }
      setShake(true);
      setTimeout(() => {
        setShake(false);
        setShowExplanation(true);
      }, 300);
    }
  };

  const handleToggleSkipExplanation = () => {
    const newValue = !skipExplanationOnCorrect;
    setSkipExplanationOnCorrect(newValue);
    localStorage.setItem('wordSkipExplanationOnCorrect', String(newValue));
  };

  const moveToNext = () => {
    // 苦手克服モードの場合、回答数をカウント
    if (mode === 'weak') {
      const newAnsweredCount = answeredCount + 1;
      setAnsweredCount(newAnsweredCount);

      // 最初の問題数に達したら終了
      if (newAnsweredCount >= initialQuestionCountRef.current) {
        window.location.href = '/';
        return;
      }
    }

    if (currentIndex < words.length - 1) {
      // 次の問題へ
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setSelectedAnswer(null);
      setIsCorrect(null);
      wasCorrectRef.current = false;
      setShowExplanation(false);
      generateOptions(words[nextIndex], allWords.length > 0 ? allWords : words);
    } else {
      // 最後の単語
      window.location.href = '/';
    }
  };

  if (isLoading) {
    return (
      <div className="loading-state">
        <div className="loading-state__back-button">
          <BackToHomeButton />
        </div>
        <div className="loading-state__message">{wordType === 'idiom' ? '慣用句' : '単語'}を読み込んでいます...</div>
      </div>
    );
  }

  if (words.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state__back-button">
          <BackToHomeButton />
        </div>
        <div className="empty-state__content">
          <div className="empty-state__message">
            {mode === 'weak'
              ? `復習が必要な${wordType === 'idiom' ? '慣用句' : '単語'}がありません`
              : `${wordType === 'idiom' ? '慣用句' : '単語'}が見つかりませんでした`}
          </div>
          {mode === 'weak' && (
            <p className="empty-state__description">
              {wordType === 'idiom' ? '慣用句' : '単語'}学習で問題を解いて、間違えた{wordType === 'idiom' ? '慣用句' : '単語'}を復習しましょう
            </p>
          )}
        </div>
      </div>
    );
  }

  const currentWord = words[currentIndex];

  return (
    <div
      className={`word-page ${flashGreen ? 'word-page--flash-green' : ''} ${shake ? 'word-page--shake' : ''}`}
    >
      <div className="word-page__container">
        {/* ホームボタンと設定 */}
        <div className="word-page__header">
          <BackToHomeButton />
          <button
            onClick={handleToggleSkipExplanation}
            className="word-page__setting-button"
            aria-label="設定"
          >
            {skipExplanationOnCorrect ? '⚡' : '📖'}
          </button>
        </div>

        {/* 単語カード */}
        <div className="word-card">
          <div className="word-card__inner">
            <div className="word-card__progress">
              {wordType === 'idiom' ? '慣用句' : '単語'} {currentIndex + 1} / {words.length}
            </div>
            <div className="word-card__word-row">
              <h1 className="word-card__word">
                {currentWord.word}
              </h1>
              <AudioButton text={currentWord.word} />
            </div>
            {currentWord.pronunciation && (
              <p className="word-card__pronunciation">
                {currentWord.pronunciation}
              </p>
            )}
            <div className="word-card__example">
              {currentWord.example.sentence}
            </div>
          </div>
        </div>

        {/* 選択肢セクション */}
        <div className="options-section">
          <div className="options-section__list">
            {options.map((option, index) => (
              <OptionButton
                key={index}
                option={option}
                index={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={selectedAnswer !== null && (isCorrect ?? false)}
                isSelected={selectedAnswer === index}
                isCorrectOption={index === correctAnswerIndex}
                showFeedback={selectedAnswer !== null}
              />
            ))}
          </div>

          {/* 解説ドロワー */}
          <WordExplanationDrawer
            word={currentWord}
            isCorrect={isCorrect ?? false}
            isOpen={showExplanation}
            onClose={moveToNext}
          />
        </div>
      </div>
    </div>
  );
}

export default function WordPage() {
  return (
    <Suspense fallback={
      <div className="loading-state">
        <div className="loading-state__message">読み込んでいます...</div>
      </div>
    }>
      <WordPageContent />
    </Suspense>
  );
}

