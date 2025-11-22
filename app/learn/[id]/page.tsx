/**
 * 学習コンテンツ詳細ページ
 */

import { notFound } from 'next/navigation';
import { getLearnContentList, readMarkdownFile, markdownToHtml } from '@/lib/markdown';
import { BackToHomeButton } from '@/components/ui/BackToHomeButton';
import { ScrollToTopButton } from '@/components/ui/ScrollToTopButton';

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
    <div className="learn-detail-page">
      <div className="learn-detail-page__container">
        <div className="learn-detail-page__header">
          <BackToHomeButton />
        </div>

        <div
          className="learn-detail-page__content prose prose-gray max-w-none"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>

      <ScrollToTopButton />
    </div>
  );
}

