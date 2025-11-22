/**
 * ホームへ戻るボタン
 */

import Link from 'next/link';

interface BackToHomeButtonProps {
  className?: string;
}

export function BackToHomeButton({ className = '' }: BackToHomeButtonProps) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2 bg-blue-500 text-white rounded-full shadow-lg border-2 border-blue-600 active:scale-95 transition-all touch-manipulation hover:bg-blue-600 hover:shadow-xl font-medium ${className}`}
      style={{ 
        WebkitTapHighlightColor: 'transparent',
        paddingLeft: '8px',
        paddingRight: '8px',
        paddingTop: '8px',
        paddingBottom: '8px'
      }}
      aria-label="ホームに戻る"
    >
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
      <span className="text-sm font-semibold">ホーム</span>
    </Link>
  );
}

