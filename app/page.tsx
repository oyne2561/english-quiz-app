/**
 * ホームページ
 */

import Link from 'next/link';

export default function Home() {
  return (
    <div className="home-page">
      <div className="home-page__container">
        <div className="home-page__title">
          クイズアプリ
        </div>

        <div className="home-page__grid">
          {/* 単語学習カード */}
          <Link href="/word?type=word" className="menu-card">
            <div className="menu-card__header">
              <div className="menu-card__emoji">📖</div>
              <h2 className="menu-card__title">
                単語
              </h2>
            </div>
            <p className="menu-card__description">
              音声付きで単語を学習
            </p>
          </Link>

          {/* 慣用句学習カード */}
          <Link href="/word?type=idiom" className="menu-card">
            <div className="menu-card__header">
              <div className="menu-card__emoji">💬</div>
              <h2 className="menu-card__title">
                慣用句
              </h2>
            </div>
            <p className="menu-card__description">
              慣用句を学習
            </p>
          </Link>

          {/* クイズカード */}
          <Link href="/quiz/category" className="menu-card">
            <div className="menu-card__header">
              <div className="menu-card__emoji">📚</div>
              <h2 className="menu-card__title">
                文法 (穴埋め問題)
              </h2>
            </div>
            <p className="menu-card__description">
              関係代名詞、前置詞、分詞などの文法を学習
            </p>
          </Link>

          {/* 基本学習カード */}
          <Link href="/learn" className="menu-card">
            <div className="menu-card__header">
              <div className="menu-card__emoji">📝</div>
              <h2 className="menu-card__title">
                基本学習
              </h2>
            </div>
            <p className="menu-card__description">
              関係代名詞、前置詞、分詞などの基本を学習
            </p>
          </Link>

          {/* DDDとモデリングカード */}
          <Link href="/modeling" className="menu-card menu-card--special">
            <div className="menu-card__header">
              <div className="menu-card__emoji">🎨</div>
              <h2 className="menu-card__title">
                DDDとモデリング
              </h2>
            </div>
            <p className="menu-card__description">
              具体と抽象を行き来する思考力を身につける
            </p>
          </Link>

          {/* 苦手克服カード（単語） */}
          <Link href="/word?mode=weak&type=word" className="menu-card">
            <div className="menu-card__header">
              <div className="menu-card__emoji">📝</div>
              <h2 className="menu-card__title">
                苦手克服（単語）
              </h2>
            </div>
            <p className="menu-card__description">
              間違えた単語を重点的に復習
            </p>
          </Link>

          {/* 苦手克服カード（慣用句） */}
          <Link href="/word?mode=weak&type=idiom" className="menu-card">
            <div className="menu-card__header">
              <div className="menu-card__emoji">💬</div>
              <h2 className="menu-card__title">
                苦手克服（慣用句）
              </h2>
            </div>
            <p className="menu-card__description">
              間違えた慣用句を重点的に復習
            </p>
          </Link>

          {/* 苦手克服カード（文法） */}
          <Link href="/quiz?mode=weak" className="menu-card">
            <div className="menu-card__header">
              <div className="menu-card__emoji">🎯</div>
              <h2 className="menu-card__title">
                苦手克服（文法）
              </h2>
            </div>
            <p className="menu-card__description">
              間違えた文法問題を重点的に復習
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
