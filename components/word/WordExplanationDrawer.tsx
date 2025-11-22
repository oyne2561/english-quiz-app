/**
 * 単語学習用の解説ドロワー（Bottom Sheet）
 */

import type { Word } from '@/types/word';

interface WordExplanationDrawerProps {
  word: Word;
  isCorrect: boolean;
  isOpen: boolean;
  onClose: () => void;
}

export function WordExplanationDrawer({
  word,
  isCorrect,
  isOpen,
  onClose,
}: WordExplanationDrawerProps) {
  if (!isOpen) return null;

  const getMeaningText = (meanings: string[]): string => {
    return meanings.join('、');
  };

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
        onClick={onClose}
      >
        <div className="explanation-drawer__inner">
          {/* ハンドル */}
          <div className="explanation-drawer__handle">
            <div className="explanation-drawer__handle-bar" />
          </div>

          {isCorrect ? (
            <div className="explanation-drawer__correct-box">
              <div className="explanation-drawer__correct-title">
                ✓ 正解！
              </div>
              <div className="explanation-drawer__correct-answer">
                正解は <span className="explanation-drawer__correct-text">{getMeaningText(word.meaning)}</span> です
              </div>
            </div>
          ) : (
            <div className="explanation-drawer__incorrect-box">
              <div className="explanation-drawer__incorrect-title">
                ✗ 不正解
              </div>
              <div className="explanation-drawer__incorrect-answer">
                正解は <span className="explanation-drawer__correct-text">{getMeaningText(word.meaning)}</span> です
              </div>
            </div>
          )}

          <div className="explanation-drawer__word-info">
            <div className="explanation-drawer__word-header">
              <h3 className="explanation-drawer__word-title">
                {word.word}
              </h3>
              {word.pronunciation && (
                <p className="explanation-drawer__word-pronunciation">
                  {word.pronunciation}
                </p>
              )}
            </div>

            <div className="explanation-drawer__info-box">
              <div className="explanation-drawer__info-label">💡 意味</div>
              <div className="explanation-drawer__info-text">
                {word.meaning.join('、')}
              </div>
            </div>

            <div className="explanation-drawer__info-box">
              <div className="explanation-drawer__info-label">📝 例文</div>
              <div className="explanation-drawer__info-text explanation-drawer__info-text--italic">
                {word.example.sentence}
              </div>
              <div className="explanation-drawer__info-text explanation-drawer__info-text--small">
                {word.example.translation}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
