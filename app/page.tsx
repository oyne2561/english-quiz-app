/**
 * ホームページ
 */

import Link from 'next/link';

export default function Home() {
  return (
    <div 
      className="min-h-screen bg-gray-50 pb-safe flex items-start justify-center"
      style={{ minHeight: '100dvh'}}
    >
      <div className="w-full px-4 py-8 max-w-lg">
        <div className="text-center">
          <h1 
            className="text-4xl font-bold text-gray-800 mb-8 block"
            style={{ marginBottom: '2rem' }}
          >
            英語クイズ
          </h1>

          <div className="grid grid-cols-1 gap-4">
            {/* クイズカード */}
            <Link
              href="/quiz/category"
              className="block p-6 bg-white rounded-2xl shadow-sm border border-gray-100 active:shadow-md active:scale-[0.98] transition-all touch-manipulation hover:border-gray-200"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <div className="text-4xl mb-3">📚</div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                文法クイズ
              </h2>
              <p className="text-gray-600 text-sm">
              関係代名詞、前置詞、分詞、助動詞など選択
              </p>
            </Link>

            {/* 単語学習カード */}
            <Link
              href="/word"
              className="block p-6 bg-white rounded-2xl shadow-sm border border-gray-100 active:shadow-md active:scale-[0.98] transition-all touch-manipulation hover:border-gray-200"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <div className="text-4xl mb-3">📖</div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                単語学習
              </h2>
              <p className="text-gray-600 text-sm">
                音声付きで単語を学習。サクサク進められる設計
              </p>
            </Link>

            {/* 苦手克服カード */}
            <Link
              href="/quiz?mode=weak"
              className="block p-6 bg-white rounded-2xl shadow-sm border border-gray-100 active:shadow-md active:scale-[0.98] transition-all touch-manipulation hover:border-gray-200"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <div className="text-4xl mb-3">🎯</div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                苦手克服
              </h2>
              <p className="text-gray-600 text-sm">
                間違えた問題を重点的に復習。繰り返し練習して定着させましょう
              </p>
            </Link>

            {/* 基本学習カード */}
            <Link
              href="/learn"
              className="block p-6 bg-white rounded-2xl shadow-sm border border-gray-100 active:shadow-md active:scale-[0.98] transition-all touch-manipulation hover:border-gray-200"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <div className="text-4xl mb-3">📝</div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                基本学習
              </h2>
              <p className="text-gray-600 text-sm">
                関係代名詞、前置詞、分詞などの文法を学習
              </p>
            </Link>

            {/* DDDとモデリングカード */}
            <Link
              href="/modeling"
              className="block p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-sm border-2 border-purple-200 active:shadow-md active:scale-[0.98] transition-all touch-manipulation hover:border-purple-300"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <div className="text-4xl mb-3">🎨</div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                DDDとモデリング
              </h2>
              <p className="text-gray-600 text-sm">
                具体と抽象を行き来する思考力を身につける
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
