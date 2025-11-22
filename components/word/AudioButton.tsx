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
        setIsSpeaking(false);
      });
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`audio-button ${isSpeaking ? 'audio-button--speaking' : ''}`}
      aria-label="音声を再生"
    >
      <svg
        className="audio-button__icon"
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

