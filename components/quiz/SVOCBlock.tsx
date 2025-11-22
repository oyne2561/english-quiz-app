/**
 * SVOCブロック表示コンポーネント
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
  if (isGroupedType && hasChildren) {
    return (
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          {label && (
            <span className="text-[10px] font-bold text-gray-700 uppercase min-w-[55px] px-2 py-1 bg-gray-100 rounded border border-gray-200 text-center shrink-0">
              {label}
            </span>
          )}
          <div className="flex items-center gap-1.5 flex-wrap">
            {block.text && (
              <div
                className={`
                  ${color}
                  py-2 rounded-lg font-medium
                  shadow-sm text-sm
                  break-words
                  inline-block
                `}
                style={{ paddingLeft: '16px', paddingRight: '16px' }}
              >
                {block.text}
              </div>
            )}
            {block.children!.map((child, index) => (
              <div key={index} className="flex items-center gap-2">
                {getStructureLabel(child.type) && (
                  <span className="text-[10px] font-bold text-gray-700 uppercase min-w-[40px] px-1.5 py-0.5 bg-gray-100 rounded border border-gray-200 text-center shrink-0">
                    {getStructureLabel(child.type)}
                  </span>
                )}
                <div
                  className={`
                    ${getStructureColor(child.type)}
                    py-1.5 rounded-lg font-medium
                    shadow-sm text-xs
                    break-words
                    inline-block
                  `}
                  style={{ paddingLeft: '12px', paddingRight: '12px' }}
                >
                  {child.text || child.type}
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* さらにネストされた子要素がある場合 */}
        {block.children!.some(child => child.children && child.children.length > 0) && (
          <div className="flex flex-col gap-1.5 mt-2 ml-[60px]">
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
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2">
        {label && (
          <span className="text-[10px] font-bold text-gray-700 uppercase min-w-[55px] px-2 py-1 bg-gray-100 rounded border border-gray-200 text-center shrink-0">
            {label}
          </span>
        )}
        <div
          className={`
            ${color}
            py-2 rounded-lg font-medium
            shadow-sm text-sm
            break-words
            inline-block
            transition-all duration-150
            ${level === 0 ? 'text-sm' : 'text-xs'}
          `}
          style={{ paddingLeft: '16px', paddingRight: '16px' }}
        >
          {block.text || block.type}
        </div>
      </div>
      {hasChildren && (
        <div className="flex flex-col gap-1.5 mt-2 ml-[60px]">
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
    return (
      <div className="text-gray-500 text-sm italic py-2">
        文の構造情報がありません
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 w-full">
      {blocks.map((block, index) => (
        <StructureBlockComponent key={index} block={block} />
      ))}
    </div>
  );
}

