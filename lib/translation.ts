/**
 * 翻訳APIユーティリティ
 */

/**
 * LibreTranslate APIを使用して翻訳
 * 無料のオープンソース翻訳API
 */
export async function translateText(
  text: string,
  targetLang: string = 'ja'
): Promise<string> {
  // 環境変数からAPI URLを取得（デフォルトは公開インスタンス）
  const apiUrl =
    process.env.NEXT_PUBLIC_TRANSLATE_API_URL ||
    'https://libretranslate.de/translate';

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        source: 'en',
        target: targetLang,
        format: 'text',
      }),
    });

    if (!response.ok) {
      throw new Error('Translation API error');
    }

    const data = await response.json();
    return data.translatedText || text;
  } catch (error) {
    console.error('Translation failed:', error);
    // フォールバック：元のテキストを返す
    return text;
  }
}

/**
 * 翻訳が利用可能かどうかを確認
 */
export function isTranslationAvailable(): boolean {
  return typeof window !== 'undefined' && 'fetch' in window;
}

