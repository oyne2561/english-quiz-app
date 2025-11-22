/**
 * サーバーサイドで使用するマークダウン変換ユーティリティ
 */

import { remark } from 'remark';
import remarkHtml from 'remark-html';
import remarkGfm from 'remark-gfm';
import fs from 'fs';
import path from 'path';

/**
 * マークダウンファイルを読み込んでHTMLに変換（サーバーサイド専用）
 */
export async function markdownToHtml(markdownContent: string): Promise<string> {
  const result = await remark()
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: false })
    .process(markdownContent);
  return String(result);
}

/**
 * マークダウンファイルを読み込む
 */
export function readMarkdownFile(filePath: string): string {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    return fs.readFileSync(fullPath, 'utf-8');
  } catch (error) {
    console.error(`Failed to read markdown file: ${filePath}`, error);
    return '';
  }
}

/**
 * 学習コンテンツのリストを取得
 */
export function getLearnContentList(): Array<{ id: string; title: string; path: string }> {
  return [
    { id: 'parts-of-speech', title: '品詞（名詞・動詞・形容詞など）', path: 'md/learn/parts-of-speech.md' },
    { id: 'modal-verbs', title: '助動詞', path: 'md/learn/modal-verbs.md' },
    { id: 'relative-pronouns', title: '関係代名詞', path: 'md/learn/relative-pronouns.md' },
    { id: 'prepositions', title: '前置詞', path: 'md/learn/prepositions.md' },
    { id: 'participles', title: '分詞', path: 'md/learn/participles.md' },
    { id: 'ddd-modeling', title: 'DDDとモデリング', path: 'md/learn/ddd-modeling.md' },
  ];
}

