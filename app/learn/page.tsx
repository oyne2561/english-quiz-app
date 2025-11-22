/**
 * 学習コンテンツ一覧ページ
 */

import Link from 'next/link';
import { getLearnContentList } from '@/lib/markdown';
import { BackToHomeButton } from '@/components/ui/BackToHomeButton';

export default function LearnPage() {
  const contents = getLearnContentList();

  return (
    <div 
      className="min-h-screen bg-gray-50 pb-safe flex items-start justify-center"
      style={{ minHeight: '100dvh' }}
    >
      <div className="w-full px-4 py-8 max-w-lg">
        <div className="mb-6">
          <BackToHomeButton />
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          基本学習
        </h1>

        <div className="grid grid-cols-1 gap-4">
          {contents.map((content) => (
            <Link
              key={content.id}
              href={`/learn/${content.id}`}
              className="block p-6 bg-white rounded-2xl shadow-sm border border-gray-100 active:shadow-md active:scale-[0.98] transition-all touch-manipulation hover:border-gray-200"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {content.title}
              </h2>
              <p className="text-gray-600 text-sm">
                文法の基本を学習します
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

