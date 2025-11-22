/**
 * クライアントサイドで使用するマークダウン変換ユーティリティ
 */

import { remark } from 'remark';
import remarkHtml from 'remark-html';
import remarkGfm from 'remark-gfm';

/**
 * マークダウンコンテンツをHTMLに変換（クライアントサイド対応）
 */
export async function markdownToHtml(markdownContent: string): Promise<string> {
  const result = await remark()
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: false })
    .process(markdownContent);
  return String(result);
}

