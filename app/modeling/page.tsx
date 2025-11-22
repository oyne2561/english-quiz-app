/**
 * モデリング学習モード選択ページ
 */

'use client';

import Link from 'next/link';
import { BackToHomeButton } from '@/components/ui/BackToHomeButton';

export default function ModelingPage() {
  return (
    <div className="modeling-page">
      <div className="modeling-page__container">
        <div className="modeling-page__header">
          <BackToHomeButton />
        </div>

        <h1 className="modeling-page__title">
          DDDとモデリング
        </h1>
        <p className="modeling-page__subtitle">
          具体と抽象を行き来する思考力を身につけましょう
        </p>

        <div className="modeling-page__grid">
          {/* インプットモード */}
          <Link
            href="/modeling/input"
            className="mode-card mode-card--input"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <div className="mode-card__content">
              <div className="mode-card__emoji">📖</div>
              <div className="mode-card__text">
                <h2 className="mode-card__title">
                  インプットモード
                </h2>
                <p className="mode-card__description">
                  解説を見ながら学習します。知識を効率的にインプットできます。
                </p>
                <div className="mode-card__feature">
                  <span className="mode-card__feature-icon">✓</span>
                  <span className="mode-card__feature-text">解説を確認しながら理解を深める</span>
                </div>
              </div>
            </div>
          </Link>

          {/* アウトプットモード */}
          <Link
            href="/modeling/output"
            className="mode-card mode-card--output"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <div className="mode-card__content">
              <div className="mode-card__emoji">💭</div>
              <div className="mode-card__text">
                <h2 className="mode-card__title">
                  アウトプットモード
                </h2>
                <p className="mode-card__description">
                  問題を解いて考えます。思考力を鍛えることができます。
                </p>
                <div className="mode-card__feature">
                  <span className="mode-card__feature-icon">✓</span>
                  <span className="mode-card__feature-text">自分で考えて解答を選択する</span>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* 学習コンテンツへのリンク */}
        <div className="modeling-page__footer">
          <Link
            href="/learn/ddd-modeling"
            className="link-card"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <span className="link-card__text">📚 学習コンテンツを見る</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

