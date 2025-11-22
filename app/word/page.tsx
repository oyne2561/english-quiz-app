/**
 * 単語学習ページ
 */

'use client';

import { useState, useEffect } from 'react';
import type { Word } from '@/types/word';
import { shuffleArray } from '@/lib/quiz';
import { AudioButton } from '@/components/word/AudioButton';
import { OptionButton } from '@/components/quiz/OptionButton';
import { BackToHomeButton } from '@/components/ui/BackToHomeButton';

export default function WordPage() {
  const [words, setWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [flashGreen, setFlashGreen] = useState(false);
  const [shake, setShake] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

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
        const response = await fetch('/data/vocabulary/words.json');
        const loadedWords = (await response.json()) as Word[];
        // 日本語訳が日本語のもののみをフィルタリング
        const japaneseWords = filterJapaneseWords(loadedWords);
        const shuffled = shuffleArray(japaneseWords);
        setWords(shuffled);
        if (shuffled.length > 0) {
          generateOptions(shuffled[0], shuffled);
        }
      } catch (error) {
        console.error('Failed to load words:', error);
      }
      setIsLoading(false);
    }

    loadWords();
  }, []);

  // カテゴリ名から品詞を判定
  const getPartOfSpeech = (category?: string): string | null => {
    if (!category) return null;
    if (category.includes('動詞')) return '動詞';
    if (category.includes('名詞')) return '名詞';
    if (category.includes('形容詞')) return '形容詞';
    if (category.includes('副詞')) return '副詞';
    return null;
  };

  // 単語の意味を全て取得
  const getMeaningText = (meanings: string[]): string => {
    return meanings.join('、');
  };

  // 選択肢を生成（正解 + 3つの誤答）
  const generateOptions = (word: Word, allWords: Word[]) => {
    const correctAnswer = getMeaningText(word.meaning);
    const partOfSpeech = getPartOfSpeech(word.category);
    
    // 同じ品詞の単語から選択肢を選ぶ
    let candidateWords = allWords.filter((w) => {
      if (w.id === word.id) return false;
      if (!isJapanese(w.meaning[0])) return false;
      const wMeaning = getMeaningText(w.meaning);
      if (wMeaning === correctAnswer) return false;
      
      // 品詞が指定されている場合、同じ品詞の単語のみを選ぶ
      if (partOfSpeech) {
        const wPartOfSpeech = getPartOfSpeech(w.category);
        return wPartOfSpeech === partOfSpeech;
      }
      
      return true;
    });
    
    // 同じ品詞の単語が3つ未満の場合は、品詞を無視して選ぶ
    if (candidateWords.length < 3 && partOfSpeech) {
      candidateWords = allWords.filter((w) => {
        if (w.id === word.id) return false;
        if (!isJapanese(w.meaning[0])) return false;
        const wMeaning = getMeaningText(w.meaning);
        if (wMeaning === correctAnswer) return false;
        return true;
      });
    }
    
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

    if (correct) {
      // 正解：緑フラッシュ → 自動で次の単語へ
      setFlashGreen(true);
      setTimeout(() => {
        setFlashGreen(false);
        if (currentIndex < words.length - 1) {
          moveToNext();
        } else {
          // 最後の単語
          alert('全ての単語を学習しました！');
        }
      }, 200);
    } else {
      // 不正解：画面揺れ → 解説ドロワー表示
      setShake(true);
      setTimeout(() => {
        setShake(false);
        setShowExplanation(true);
      }, 300);
    }
  };

  const moveToNext = () => {
    if (currentIndex < words.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setShowExplanation(false);
      generateOptions(words[nextIndex], words);
    } else {
      // 最後の単語
      alert('全ての単語を学習しました！');
      window.location.href = '/';
    }
  };

  if (isLoading) {
    return (
      <div 
        className="min-h-screen bg-slate-50 pb-safe flex items-center justify-center"
        style={{ minHeight: '100dvh' }}
      >
        <div className="fixed top-3 left-3 z-40">
          <BackToHomeButton />
        </div>
        <div className="text-xl text-gray-800">単語を読み込んでいます...</div>
      </div>
    );
  }

  if (words.length === 0) {
    return (
      <div 
        className="min-h-screen bg-slate-50 pb-safe flex items-center justify-center"
        style={{ minHeight: '100dvh' }}
      >
        <div className="fixed top-3 left-3 z-40">
          <BackToHomeButton />
        </div>
        <div className="text-xl text-gray-800">単語が見つかりませんでした</div>
      </div>
    );
  }

  const currentWord = words[currentIndex];

  return (
    <div 
      className={`
        min-h-screen bg-slate-50 pb-safe
        ${flashGreen ? 'animate-flash-green' : ''}
        ${shake ? 'animate-shake' : ''}
      `}
      style={{ minHeight: '100dvh' }}
    >
      <div className="w-full px-4 py-4 pb-6 flex flex-col items-center">
        {/* ホームボタンを問題文の上に配置 */}
        <div className="w-full max-w-2xl mb-3 flex justify-start">
          <BackToHomeButton />
        </div>

        {/* 単語カード */}
        <div className="w-full max-w-2xl mb-8">
          <div className="bg-white rounded-2xl shadow-md border-2 border-blue-100 p-6 text-center">
            <div className="text-sm text-blue-600 font-medium mb-3">
              単語 {currentIndex + 1} / {words.length}
            </div>
            {/* 音声ボタン */}
            <div className="flex justify-center mb-4">
              <AudioButton text={currentWord.word} />
            </div>
            {/* 単語 */}
            <h1 className="text-2xl font-bold text-gray-900 leading-relaxed mb-4">
              {currentWord.word}
            </h1>
            {/* 発音記号 */}
            {currentWord.pronunciation && (
              <p className="text-base text-gray-600 mb-4">
                {currentWord.pronunciation}
              </p>
            )}
            {/* 例文 */}
            <div className="text-base text-gray-600 italic border-t border-gray-200 pt-4">
              {currentWord.example.sentence}
            </div>
          </div>
        </div>

        {/* 選択肢セクション */}
        <div className="w-full max-w-lg px-0">
          <div className="text-sm text-gray-600 font-medium mb-3 pl-6">
            選択肢を選んでください
          </div>
          <div className="space-y-3">
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
          {showExplanation && (
            <div className="fixed inset-0 z-50 flex items-end">
              {/* 背景オーバーレイ */}
              <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={moveToNext}
              />
              
              {/* ドロワー本体 */}
              <div className="relative w-full bg-white rounded-t-3xl shadow-2xl px-6 py-6 pb-8 max-h-[85vh] overflow-y-auto">
                {/* ハンドル */}
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
                </div>
                
                {/* 不正解表示 */}
                <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 mb-6">
                  <div className="text-center">
                    <div className="text-red-600 font-bold text-2xl mb-2">
                      ✗ 不正解
                    </div>
                    <div className="text-gray-800 text-lg">
                      正解は <span className="font-bold text-green-600 text-xl">{getMeaningText(currentWord.meaning)}</span> です
                    </div>
                  </div>
                </div>
                
                {/* 単語情報 */}
                <div className="bg-blue-50 border-2 border-blue-100 rounded-2xl p-5 mb-6">
                  <div className="text-center mb-4">
                    <h3 className="text-3xl font-bold text-gray-900 mb-2">
                      {currentWord.word}
                    </h3>
                    {currentWord.pronunciation && (
                      <p className="text-gray-600 text-base">
                        {currentWord.pronunciation}
                      </p>
                    )}
                  </div>
                  
                  {/* 意味 */}
                  <div className="mb-4 bg-white rounded-xl p-4">
                    <div className="text-sm font-semibold text-blue-600 mb-2">💡 意味</div>
                    <div className="text-lg text-gray-900 font-medium">
                      {currentWord.meaning.join('、')}
                    </div>
                  </div>
                  
                  {/* 例文 */}
                  <div className="bg-white rounded-xl p-4">
                    <div className="text-sm font-semibold text-blue-600 mb-2">📝 例文</div>
                    <div className="text-base text-gray-900 italic mb-2 leading-relaxed">
                      {currentWord.example.sentence}
                    </div>
                    <div className="text-sm text-gray-600 leading-relaxed">
                      {currentWord.example.translation}
                    </div>
                  </div>
                </div>
                
                {/* 次へボタン */}
                <button
                  onClick={moveToNext}
                  className="w-full bg-blue-500 text-white font-bold py-4 rounded-2xl active:scale-[0.98] transition-all touch-manipulation hover:bg-blue-600 shadow-lg text-lg"
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  次の問題へ →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

