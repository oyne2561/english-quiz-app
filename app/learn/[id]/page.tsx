/**
 * 学習コンテンツ詳細ページ
 */

import { notFound } from 'next/navigation';
import { getLearnContentList, readMarkdownFile, markdownToHtml } from '@/lib/markdown';
import { BackToHomeButton } from '@/components/ui/BackToHomeButton';

interface LearnDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function LearnDetailPage({ params }: LearnDetailPageProps) {
  const { id } = await params;
  const contents = getLearnContentList();
  const content = contents.find((c) => c.id === id);

  if (!content) {
    notFound();
  }

  const markdownContent = readMarkdownFile(content.path);
  const htmlContent = await markdownToHtml(markdownContent);

  return (
    <div 
      className="min-h-screen bg-gray-50 pb-safe flex items-start justify-center"
      style={{ minHeight: '100vh' }}
    >
      <div className="w-full px-4 py-8 max-w-lg">
        <div className="mb-8">
          <BackToHomeButton />
        </div>

        <div 
          className="prose prose-gray max-w-none bg-white p-8 rounded-2xl shadow-sm border border-gray-100"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
          style={{ padding: '8px' }}
        />
      </div>
    </div>
  );
}

