/**
 * 音声ボタンコンポーネント
 */

import { speakText, stopSpeaking } from '@/lib/speech';
import { useState } from 'react';

interface AudioButtonProps {
  text: string;
  lang?: string;
}

export function AudioButton({ text, lang = 'en-US' }: AudioButtonProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleClick = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      speakText(text, lang, () => {
        // 読み上げ終了時のコールバック
        setIsSpeaking(false);
      });
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`
        w-16 h-16 rounded-full
        flex items-center justify-center
        bg-blue-500 text-white
        hover:bg-blue-600 active:scale-95
        transition-all duration-200
        shadow-lg hover:shadow-xl
        ${isSpeaking ? 'animate-pulse' : ''}
      `}
      aria-label="音声を再生"
    >
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        {isSpeaking ? (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        ) : (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M6.343 6.343l4.243 4.243m0 0l-4.243 4.243m4.243-4.243H3"
          />
        )}
      </svg>
    </button>
  );
}

