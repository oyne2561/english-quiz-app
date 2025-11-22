/**
 * 学習コンテンツ一覧ページ
 */

import Link from 'next/link';
import { getLearnContentList } from '@/lib/markdown';
import { BackToHomeButton } from '@/components/ui/BackToHomeButton';

export default function LearnPage() {
  const contents = getLearnContentList();

  return (
    <div className="learn-page">
      <div className="learn-page__container">
        <div className="learn-page__header">
          <BackToHomeButton />
        </div>

        <h1 className="learn-page__title">
          基本学習
        </h1>

        <div className="learn-page__grid">
          {contents.map((content) => (
            <Link
              key={content.id}
              href={`/learn/${content.id}`}
              className="learn-card"
            >
              <h2 className="learn-card__title">
                {content.title}
              </h2>
              <p className="learn-card__description">
                文法の基本を学習します
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

