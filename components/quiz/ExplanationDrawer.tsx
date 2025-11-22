/**
 * 解説ドロワー（Bottom Sheet）
 */

import type { GrammarQuestion } from '@/types/quiz';
import { SVOCBlock } from './SVOCBlock';

interface ExplanationDrawerProps {
  question: GrammarQuestion;
  selectedAnswer: number;
  correctAnswerIndex: number;
  shuffledToOriginalIndexMap: number[];
  isOpen: boolean;
  onClose: () => void;
}

export function ExplanationDrawer({
  question,
  selectedAnswer,
  correctAnswerIndex,
  shuffledToOriginalIndexMap,
  isOpen,
  onClose,
}: ExplanationDrawerProps) {
  if (!isOpen) return null;

  const isCorrect = correctAnswerIndex === selectedAnswer;
  // シャッフル後のインデックスを元のインデックスに変換
  const originalSelectedIndex = shuffledToOriginalIndexMap[selectedAnswer] ?? selectedAnswer;
  const wrongOptionExplanations = question.explanation.wrongOptionExplanations || {};
  // JSONでは文字列キーの可能性があるため、両方試す
  const wrongExplanation =
    !isCorrect &&
    (wrongOptionExplanations[originalSelectedIndex] ||
     (wrongOptionExplanations as Record<string, string>)[String(originalSelectedIndex)]);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center cursor-pointer"
      onClick={onClose}
    >
      {/* オーバーレイ */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* ドロワー */}
      <div
        className={`
          relative w-full max-w-2xl max-h-[85vh] bg-white rounded-3xl
          shadow-2xl transform transition-transform duration-300 ease-out
          ${isOpen ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-4 scale-95 opacity-0'}
          overflow-y-auto overscroll-contain mx-4
        `}
        style={{ maxHeight: '85vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-6 pb-8" onClick={onClose}>
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
            <div className="text-gray-800 text-lg">
              正解は <span className="font-bold text-green-600 text-xl">{question.options[question.correctAnswer]}</span> です
            </div>
          </div>

          {/* 問題文 */}
          <div className="bg-blue-50 border-2 border-blue-100 rounded-2xl p-5 mb-6">
            <div className="text-sm font-semibold text-blue-600 mb-2">📝 問題</div>
            <p className="text-gray-900 text-lg font-medium px-2">{question.question}</p>
          </div>

          {/* 日本語訳 */}
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-5 mb-4">
            <div className="text-sm font-semibold text-gray-600 mb-2">🗾 日本語訳</div>
            <p className="text-gray-900 text-base leading-relaxed px-2">{question.explanation.translation}</p>
          </div>

          {/* 解説 */}
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-5 mb-4">
            <div className="text-sm font-semibold text-gray-600 mb-2">💡 解説</div>
            <p className="text-gray-900 text-base leading-relaxed px-2">{question.explanation.text}</p>
          </div>

          {/* SVOCブロック */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="text-lg">🔤</div>
              <div className="text-sm font-semibold text-gray-700">文の構造</div>
            </div>
            <SVOCBlock 
              structure={question.explanation.structure}
            />
          </div>

          {/* 間違えた選択肢の解説 */}
          {wrongExplanation && (
            <div className="mb-4 p-5 bg-yellow-50 rounded-2xl border-2 border-yellow-200">
              <div className="text-sm font-semibold text-yellow-800 mb-2">
                ⚠️ 選択した答えについて
              </div>
              <p className="text-base text-yellow-900 leading-relaxed px-2">{wrongExplanation}</p>
            </div>
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
  );
}

