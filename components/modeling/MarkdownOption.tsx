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
      <div className="markdown-option__loading">
        <div className="markdown-option__loading-bar"></div>
      </div>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        markdown-option
        ${isCorrectSelected ? 'markdown-option--correct' : ''}
        ${isWrongSelected ? 'markdown-option--wrong' : 'markdown-option--default'}
        ${disabled ? 'markdown-option--disabled' : ''}
      `}
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      <span className={`
        markdown-option__label
        ${isCorrectSelected ? 'markdown-option__label--correct' : ''}
        ${isWrongSelected ? 'markdown-option__label--wrong' : ''}
      `}>
        {labels[index]}.
      </span>
      <div className="markdown-option__content">
        <div
          className={`
            markdown-option__text
            ${isCorrectSelected ? 'markdown-option__text--correct' : ''}
            ${isWrongSelected ? 'markdown-option__text--wrong' : ''}
          `}
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>
      {showFeedback && isSelected && (
        <span className="markdown-option__feedback">
          {isCorrectOption ? '✓' : '✗'}
        </span>
      )}
    </button>
  );
}

