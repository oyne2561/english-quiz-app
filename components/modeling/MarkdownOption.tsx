/**
 * マークダウン形式の選択肢コンポーネント
 */

'use client';

import { useEffect, useState } from 'react';
import { markdownToHtml } from '@/lib/markdown-client';

interface MarkdownOptionProps {
  option: string;
  index: number;
  onClick: () => void;
  disabled?: boolean;
  isSelected?: boolean;
  isCorrectOption?: boolean;
  showFeedback?: boolean;
}

export function MarkdownOption({
  option,
  index,
  onClick,
  disabled = false,
  isSelected = false,
  isCorrectOption = false,
  showFeedback = false,
}: MarkdownOptionProps) {
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const labels = ['A', 'B', 'C', 'D'];

  useEffect(() => {
    async function convertMarkdown() {
      setIsLoading(true);
      try {
        const html = await markdownToHtml(option);
        setHtmlContent(html);
      } catch (error) {
        console.error('Failed to convert markdown:', error);
        setHtmlContent(option);
      } finally {
        setIsLoading(false);
      }
    }
    convertMarkdown();
  }, [option]);

  const isCorrectSelected = showFeedback && isSelected && isCorrectOption;
  const isWrongSelected = showFeedback && isSelected && !isCorrectOption;

  if (isLoading) {
    return (
      <div className="w-full py-4 px-6 rounded-xl bg-gray-50 border-2 border-gray-200 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full py-4 px-6 rounded-xl text-left
        transition-all duration-150
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        touch-manipulation
        min-h-[60px] flex items-start gap-3
        shadow-sm hover:shadow-lg
        ${
          isCorrectSelected
            ? 'bg-green-50 border-2 border-green-500'
            : isWrongSelected
            ? 'bg-red-50 border-2 border-red-500'
            : 'bg-white border-2 border-gray-200 active:scale-[0.98] active:bg-blue-50 active:border-blue-500 hover:border-gray-300'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      <span className={`font-bold text-lg shrink-0 ${
        isCorrectSelected ? 'text-green-600' : isWrongSelected ? 'text-red-600' : 'text-blue-600'
      }`}>
        {labels[index]}.
      </span>
      <div className="flex-1 prose prose-sm max-w-none">
        <div
          className={`
            ${isCorrectSelected ? 'text-green-900' : isWrongSelected ? 'text-red-900' : 'text-gray-800'}
            ${showFeedback && isSelected ? 'font-medium' : ''}
          `}
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>
      {showFeedback && isSelected && (
        <span className="ml-2 text-xl shrink-0">
          {isCorrectOption ? '✓' : '✗'}
        </span>
      )}
    </button>
  );
}

