/**
 * モデリング学習モード選択ページ
 */

'use client';

import Link from 'next/link';
import { BackToHomeButton } from '@/components/ui/BackToHomeButton';

export default function ModelingPage() {
  return (
    <div 
      className="min-h-screen bg-gray-50 pb-safe flex items-start justify-center"
      style={{ minHeight: '100dvh' }}
    >
      <div className="w-full px-4 py-8 max-w-lg">
        <div className="mb-6">
          <BackToHomeButton />
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">
          DDDとモデリング
        </h1>
        <p className="text-gray-600 text-center mb-8">
          具体と抽象を行き来する思考力を身につけましょう
        </p>

        <div className="grid grid-cols-1 gap-6 mb-8">
          {/* インプットモード */}
          <Link
            href="/modeling/input"
            className="block p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-sm border-2 border-blue-200 active:shadow-md active:scale-[0.98] transition-all touch-manipulation hover:border-blue-300"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <div className="flex items-start gap-4">
              <div className="text-4xl">📖</div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  インプットモード
                </h2>
                <p className="text-gray-600 text-sm mb-3">
                  解説を見ながら学習します。知識を効率的にインプットできます。
                </p>
                <div className="flex items-center gap-2 text-xs text-blue-600 font-medium">
                  <span>✓</span>
                  <span>解説を確認しながら理解を深める</span>
                </div>
              </div>
            </div>
          </Link>

          {/* アウトプットモード */}
          <Link
            href="/modeling/output"
            className="block p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-sm border-2 border-green-200 active:shadow-md active:scale-[0.98] transition-all touch-manipulation hover:border-green-300"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <div className="flex items-start gap-4">
              <div className="text-4xl">💭</div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  アウトプットモード
                </h2>
                <p className="text-gray-600 text-sm mb-3">
                  問題を解いて考えます。思考力を鍛えることができます。
                </p>
                <div className="flex items-center gap-2 text-xs text-green-600 font-medium">
                  <span>✓</span>
                  <span>自分で考えて解答を選択する</span>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* 学習コンテンツへのリンク */}
        <div className="mt-8">
          <Link
            href="/learn/ddd-modeling"
            className="block p-4 bg-white rounded-xl shadow-sm border border-gray-200 active:shadow-md active:scale-[0.98] transition-all touch-manipulation hover:border-gray-300 text-center"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <span className="text-gray-700 font-medium">📚 学習コンテンツを見る</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

