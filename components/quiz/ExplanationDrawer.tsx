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
      className="explanation-drawer"
      onClick={onClose}
    >
      {/* オーバーレイ */}
      <div className="explanation-drawer__overlay" />

      {/* ドロワー */}
      <div
        className="explanation-drawer__content"
        style={{ maxHeight: '85vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="explanation-drawer__inner" onClick={onClose}>
          {/* ハンドル */}
          <div className="explanation-drawer__handle">
            <div className="explanation-drawer__handle-bar" />
          </div>

          {/* 正解/不正解表示 */}
          <div className={`explanation-drawer__result ${isCorrect ? 'explanation-drawer__result--correct' : 'explanation-drawer__result--wrong'}`}>
            <div className={`explanation-drawer__result-title ${isCorrect ? 'explanation-drawer__result-title--correct' : 'explanation-drawer__result-title--wrong'}`}>
              {isCorrect ? '✓ 正解！' : '✗ 不正解'}
            </div>
            <div className="explanation-drawer__result-text">
              正解は <span className="explanation-drawer__result-answer">{question.options[question.correctAnswer]}</span> です
            </div>
          </div>

          {/* 問題文 */}
          <div className="explanation-drawer__section explanation-drawer__section--question">
            <div className="explanation-drawer__section-title explanation-drawer__section-title--question">📝 問題</div>
            <p className="explanation-drawer__section-text explanation-drawer__section-text--question">{question.question}</p>
          </div>

          {/* 日本語訳 */}
          <div className="explanation-drawer__section explanation-drawer__section--translation">
            <div className="explanation-drawer__section-title explanation-drawer__section-title--translation">🗾 日本語訳</div>
            <p className="explanation-drawer__section-text explanation-drawer__section-text--translation">{question.explanation.translation}</p>
          </div>

          {/* 解説 */}
          <div className="explanation-drawer__section explanation-drawer__section--explanation">
            <div className="explanation-drawer__section-title explanation-drawer__section-title--explanation">💡 解説</div>
            <p className="explanation-drawer__section-text explanation-drawer__section-text--explanation">{question.explanation.text}</p>
          </div>

          {/* SVOCブロック */}
          <div className="explanation-drawer__structure">
            <div className="explanation-drawer__structure-header">
              <div>🔤</div>
              <div className="explanation-drawer__structure-title">文の構造</div>
            </div>
            <SVOCBlock
              structure={question.explanation.structure}
            />
          </div>

          {/* 間違えた選択肢の解説 */}
          {wrongExplanation && (
            <div className="explanation-drawer__section explanation-drawer__section--wrong">
              <div className="explanation-drawer__section-title explanation-drawer__section-title--wrong">
                ⚠️ 選択した答えについて
              </div>
              <p className="explanation-drawer__section-text explanation-drawer__section-text--wrong">{wrongExplanation}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

