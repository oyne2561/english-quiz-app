/**
 * Instagram Stories風プログレスバー
 */

interface ProgressBarProps {
  total: number;
  current: number;
}

export function ProgressBar({ total, current }: ProgressBarProps) {
  return (
    <div className="progress-bar">
      {Array.from({ length: total }).map((_, index) => {
        const isActive = index < current;
        const isCurrent = index === current;

        return (
          <div
            key={index}
            className={`
              progress-bar__item
              ${isActive ? 'progress-bar__item--active' : ''}
              ${isCurrent ? 'progress-bar__item--current' : ''}
              ${!isActive && !isCurrent ? 'progress-bar__item--inactive' : ''}
            `}
          />
        );
      })}
    </div>
  );
}

