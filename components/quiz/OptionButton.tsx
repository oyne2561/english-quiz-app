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
        w-full py-4 !pl-6 pr-4 rounded-xl text-left
        transition-all duration-150
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        touch-manipulation
        min-h-[60px] flex items-center
        shadow-sm hover:shadow-lg
        ${
          isCorrectSelected
            ? 'bg-green-50 border-2 border-green-500 text-green-900'
            : isWrongSelected
            ? 'bg-red-50 border-2 border-red-500 text-red-900'
            : 'bg-white border-2 border-gray-200 active:scale-[0.98] active:bg-blue-50 active:border-blue-500 hover:border-gray-300'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
      style={{ WebkitTapHighlightColor: 'transparent', paddingLeft: '1.5rem' }}
    >
      <span className={`font-bold text-lg ${
        isCorrectSelected ? 'text-green-600' : isWrongSelected ? 'text-red-600' : 'text-blue-600'
      }`} style={{ marginRight: '8px' }}>
        {labels[index]}. 
      </span>
      <span className={`text-base flex-1 ${
        showFeedback && isSelected ? 'font-medium' : 'text-gray-800'
      }`}>{option}</span>
      {showFeedback && isSelected && (
        <span className="ml-2 text-xl">
          {isCorrectOption ? '✓' : '✗'}
        </span>
      )}
    </button>
  );
}

