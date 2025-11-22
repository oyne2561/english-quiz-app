/**
 * SVOCブロック表示コンポーネント
 *
 * CSSクラス対応:
 * - svoc-block: ルートコンテナ（flex column）
 * - svoc-block__item: 各構造ブロックのコンテナ（flex column）
 * - svoc-block__row: ラベルとテキストを横並びにする行（flex row, align-items: center）
 * - svoc-block__label: S/V/O/Cなどのラベル（14px, 太字, 背景色あり）
 * - svoc-block__label--small: 小さなラベル（12px, グループ内で使用）
 * - svoc-block__text: テキストブロック（パディング、角丸、影あり）
 * - svoc-block__text--large: 大きなテキスト（14px）
 * - svoc-block__text--small: 小さなテキスト（12px）
 * - svoc-block__text--{S|V|O|C|RC|PP|INF|GER}: タイプ別の色クラス
 * - svoc-block__children: 子要素のコンテナ（flex column, 左マージン60px）
 * - svoc-block__group: グループ化された要素のコンテナ（flex row, wrap）
 * - svoc-block__group-item: グループ内の各アイテム（flex row）
 * - svoc-block__empty: 空状態のメッセージ
 */

import type { StructureBlock } from '@/types/quiz';
import { parseStructure, getStructureColor, getStructureLabel } from '@/lib/structure-parser';

interface SVOCBlockProps {
  structure: string; // Markdown形式の構造（必須）
}

/**
 * 構造ブロックを表示するコンポーネント（階層構造を視覚的に表現）
 */
function StructureBlockComponent({ block, level = 0 }: { block: StructureBlock; level?: number }) {
  const hasChildren = block.children && block.children.length > 0;
  const label = getStructureLabel(block.type);
  const color = getStructureColor(block.type);
  const isGroupedType = block.type === 'RC' || block.type === 'PP' || block.type === 'INF' || block.type === 'GER';

  // 関係節などのグループ化されたタイプはまとめて表示
  // CSS: svoc-block__item > svoc-block__row > svoc-block__group
  if (isGroupedType && hasChildren) {
    return (
      <div className="svoc-block__item">
        {/* CSS: svoc-block__row - ラベルとグループを横並び */}
        <div className="svoc-block__row">
          {/* CSS: svoc-block__label - S/V/O/Cなどのラベル（14px） */}
          {label && (
            <span className="svoc-block__label">
              {label}
            </span>
          )}
          {/* CSS: svoc-block__group - グループ内の要素を横並び（wrap可） */}
          <div className="svoc-block__group">
            {/* CSS: svoc-block__text--large + svoc-block__text--{type} - 親要素のテキスト（14px） */}
            {block.text && (
              <div className={`svoc-block__text svoc-block__text--large svoc-block__text--${block.type}`}>
                {block.text}
              </div>
            )}
            {/* CSS: svoc-block__group-item - グループ内の各アイテム */}
            {block.children!.map((child, index) => (
              <div key={index} className="svoc-block__group-item">
                {/* CSS: svoc-block__label--small - 小さなラベル（12px） */}
                {getStructureLabel(child.type) && (
                  <span className="svoc-block__label svoc-block__label--small">
                    {getStructureLabel(child.type)}
                  </span>
                )}
                {/* CSS: svoc-block__text--small + svoc-block__text--{type} - 子要素のテキスト（12px） */}
                <div className={`svoc-block__text svoc-block__text--small svoc-block__text--${child.type}`}>
                  {child.text || child.type}
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* さらにネストされた子要素がある場合 */}
        {/* CSS: svoc-block__children - 子要素のコンテナ（左マージン60px） */}
        {block.children!.some(child => child.children && child.children.length > 0) && (
          <div className="svoc-block__children">
            {block.children!.map((child, index) =>
              child.children && child.children.length > 0 ? (
                <StructureBlockComponent key={index} block={child} level={level + 1} />
              ) : null
            )}
          </div>
        )}
      </div>
    );
  }

  // 通常の表示
  // CSS: svoc-block__item > svoc-block__row
  return (
    <div className="svoc-block__item">
      {/* CSS: svoc-block__row - ラベルとテキストを横並び */}
      <div className="svoc-block__row">
        {/* CSS: svoc-block__label - S/V/O/Cなどのラベル（14px） */}
        {label && (
          <span className="svoc-block__label">
            {label}
          </span>
        )}
        {/* CSS: svoc-block__text--large/small + svoc-block__text--{type} - テキストブロック */}
        <div className={`svoc-block__text ${level === 0 ? 'svoc-block__text--large' : 'svoc-block__text--small'} svoc-block__text--${block.type}`}>
          {block.text || block.type}
        </div>
      </div>
      {/* CSS: svoc-block__children - 子要素のコンテナ（左マージン60px） */}
      {hasChildren && (
        <div className="svoc-block__children">
          {block.children!.map((child, index) => (
            <StructureBlockComponent key={index} block={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export function SVOCBlock({ structure }: SVOCBlockProps) {
  const blocks = parseStructure(structure);

  if (blocks.length === 0) {
    // CSS: svoc-block__empty - 空状態のメッセージ
    return (
      <div className="svoc-block__empty">
        文の構造情報がありません
      </div>
    );
  }

  // CSS: svoc-block - ルートコンテナ（flex column）
  return (
    <div className="svoc-block">
      {blocks.map((block, index) => (
        <StructureBlockComponent key={index} block={block} />
      ))}
    </div>
  );
}

