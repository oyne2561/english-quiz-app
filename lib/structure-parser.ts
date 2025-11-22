/**
 * Markdown形式の文構造パーサー（remark使用）
 * 
 * 形式: [TYPE: text] または [TYPE: text [CHILD: nested]]
 * 
 * 例:
 * [S: The proposal] [RC: whose details we discussed yesterday] [RC: which the board is likely [INF: to approve]]
 */

import { remark } from 'remark';
import type { StructureBlock } from '@/types/quiz';

const TYPE_COLORS: Record<string, string> = {
  S: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-blue-200',
  V: 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-red-200',
  O: 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-green-200',
  C: 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-yellow-200',
  RC: 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-purple-200',
  PP: 'bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-pink-200',
  INF: 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-indigo-200',
  GER: 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-teal-200',
  ADJ: 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-orange-200',
  ADV: 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white shadow-cyan-200',
  OTHER: 'bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-gray-200',
};

const TYPE_LABELS: Record<string, string> = {
  S: 'S',
  V: 'V',
  O: 'O',
  C: 'C',
  RC: '関係節',
  PP: '前置詞句',
  INF: '不定詞',
  GER: '動名詞',
  ADJ: '形容詞',
  ADV: '副詞',
  OTHER: '',
};

/**
 * カスタム構文を解析するremarkプラグイン
 */
function structurePlugin() {
  return (tree: any) => {
    // テキストノードを処理
    const visit = (node: any) => {
      if (node.type === 'text' && node.value) {
        const blocks = parseStructureBlocks(node.value);
        if (blocks.length > 0) {
          // テキストノードを構造ブロックに置き換え
          node.type = 'structureBlocks';
          node.blocks = blocks;
        }
      }
      if (node.children) {
        node.children.forEach(visit);
      }
    };
    visit(tree);
  };
}

/**
 * 文字列から構造ブロックをパース（再帰的）
 */
function parseStructureBlocks(text: string): StructureBlock[] {
  if (!text || text.trim() === '') {
    return [];
  }

  const blocks: StructureBlock[] = [];
  let i = 0;

  while (i < text.length) {
    if (text[i] === '[') {
      const result = parseBlock(text, i);
      if (result) {
        blocks.push(result.block);
        i = result.nextIndex;
        continue;
      }
    }
    i++;
  }

  return blocks;
}

/**
 * 単一のブロックをパース（再帰的、改善版）
 */
function parseBlock(str: string, startIndex: number): { block: StructureBlock; nextIndex: number } | null {
  if (str[startIndex] !== '[') {
    return null;
  }

  // タイプを取得 [TYPE:
  const typeEnd = str.indexOf(':', startIndex);
  if (typeEnd === -1) return null;
  
  const type = str.slice(startIndex + 1, typeEnd).trim();
  if (!type.match(/^[A-Z]+$/)) return null;

  // テキストとネストされたブロックを取得
  let depth = 1;
  let i = typeEnd + 1;
  let textStart = i;
  const children: StructureBlock[] = [];
  let textEnd = -1;
  const textParts: string[] = [];

  while (i < str.length && depth > 0) {
    if (str[i] === '[') {
      depth++;
      // ネストされたブロックを再帰的にパース
      if (depth === 2) {
        // ネストされたブロックの前のテキストを保存
        if (i > textStart) {
          const beforeText = str.slice(textStart, i).trim();
          if (beforeText) {
            textParts.push(beforeText);
          }
        }
        
        const nestedResult = parseBlock(str, i);
        if (nestedResult) {
          children.push(nestedResult.block);
          i = nestedResult.nextIndex;
          textStart = i;
          depth--;
          continue;
        } else {
          // パースに失敗した場合は通常の文字として扱う
          depth--;
        }
      }
    } else if (str[i] === ']') {
      depth--;
      if (depth === 0) {
        textEnd = i;
        // 最後のテキスト部分を保存
        if (i > textStart) {
          const lastText = str.slice(textStart, i).trim();
          if (lastText) {
            textParts.push(lastText);
          }
        }
        break;
      }
    }
    i++;
  }

  if (textEnd === -1) return null;

  // テキストを結合
  const textContent = textParts.join(' ').trim().replace(/\s+/g, ' ');

  const block: StructureBlock = {
    type: type as StructureBlock['type'],
    text: textContent,
  };

  if (children.length > 0) {
    block.children = children;
  }

  return {
    block,
    nextIndex: textEnd + 1,
  };
}

/**
 * Markdown形式の構造文字列をパース
 * 
 * @param structure Markdown形式の構造文字列
 * @returns パースされた構造ブロックの配列
 */
export function parseStructure(structure: string): StructureBlock[] {
  if (!structure || structure.trim() === '') {
    return [];
  }

  try {
    // remarkを使ってパース（カスタムプラグインで処理）
    const blocks = parseStructureBlocks(structure);
    return blocks;
  } catch (error) {
    console.error('Failed to parse structure:', error);
    return [];
  }
}

/**
 * 構造ブロックの色を取得
 */
export function getStructureColor(type: string): string {
  return TYPE_COLORS[type] || TYPE_COLORS.OTHER;
}

/**
 * 構造ブロックのラベルを取得
 */
export function getStructureLabel(type: string): string {
  return TYPE_LABELS[type] || '';
}
