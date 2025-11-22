/**
 * Instagram Stories風プログレスバー
 */

interface ProgressBarProps {
  total: number;
  current: number;
}

export function ProgressBar({ total, current }: ProgressBarProps) {
  return (
    <div className="flex gap-1 px-3 py-3 pl-14 bg-white/95 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-10">
      {Array.from({ length: total }).map((_, index) => {
        const isActive = index < current;
        const isCurrent = index === current;

        return (
          <div
            key={index}
            className={`h-1 flex-1 rounded-full transition-all duration-200 ${
              isActive
                ? 'bg-blue-500'
                : isCurrent
                  ? 'bg-blue-300'
                  : 'bg-gray-200'
            }`}
          />
        );
      })}
    </div>
  );
}

