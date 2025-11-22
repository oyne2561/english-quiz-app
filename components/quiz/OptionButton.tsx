/**
 * 選択肢ボタン（親指ワンタップ用）
 */

interface OptionButtonProps {
  option: string;
  index: number;
  onClick: () => void;
  disabled?: boolean;
  isSelected?: boolean;
  isCorrectOption?: boolean;
  showFeedback?: boolean;
}

export function OptionButton({
  option,
  index,
  onClick,
  disabled = false,
  isSelected = false,
  isCorrectOption = false,
  showFeedback = false,
}: OptionButtonProps) {
  const labels = ['A', 'B', 'C', 'D'];

  // フィードバックの状態を判定
  const isCorrectSelected = showFeedback && isSelected && isCorrectOption;
  const isWrongSelected = showFeedback && isSelected && !isCorrectOption;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        option-button
        ${isCorrectSelected ? 'option-button--correct' : ''}
        ${isWrongSelected ? 'option-button--wrong' : 'option-button--default'}
        ${disabled ? 'option-button--disabled' : ''}
      `}
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      <span className={`
        option-button__label
        ${isCorrectSelected ? 'option-button__label--correct' : ''}
        ${isWrongSelected ? 'option-button__label--wrong' : ''}
      `}>
        {labels[index]}.
      </span>
      <span className={`option-button__text ${showFeedback && isSelected ? 'option-button__text--selected' : ''}`}>
        {option}
      </span>
      {showFeedback && isSelected && (
        <span className="option-button__feedback">
          {isCorrectOption ? '✓' : '✗'}
        </span>
      )}
    </button>
  );
}

