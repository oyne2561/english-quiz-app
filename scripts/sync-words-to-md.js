const fs = require('fs');
const path = require('path');

/**
 * words.jsonから英単語.mdを生成する
 */
function generateMarkdownFromWords() {
  const jsonPath = path.join(__dirname, '..', 'public', 'data', 'vocabulary', 'words.json');
  const mdPath = path.join(__dirname, '..', '英単語.md');

  // words.jsonを読み込む
  let words = [];
  try {
    words = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    console.log(`Loaded ${words.length} words from words.json`);
  } catch (err) {
    console.error('Failed to load words.json:', err);
    process.exit(1);
  }

  // 既存の英単語.mdを読み込んで、品詞情報を保持する
  let existingMd = '';
  try {
    existingMd = fs.readFileSync(mdPath, 'utf-8');
  } catch (err) {
    console.log('No existing 英単語.md found, creating new one');
  }

  // 既存のマークダウンから品詞情報を抽出
  const partOfSpeechMap = new Map();
  if (existingMd) {
    const lines = existingMd.split('\n');
    let currentPartOfSpeech = '';

    for (const line of lines) {
      // カテゴリの検出
      if (line.startsWith('## ')) {
        const match = line.match(/## (.+)/);
        if (match) {
          currentPartOfSpeech = match[1].trim();
        }
        continue;
      }

      // テーブルの行を解析
      if (line.startsWith('|') && !line.includes('-----') && !line.includes('英単語')) {
        const columns = line.split('|').map(col => col.trim()).filter(col => col);
        if (columns.length >= 1) {
          const word = columns[0].toLowerCase();
          if (currentPartOfSpeech) {
            partOfSpeechMap.set(word, currentPartOfSpeech);
          }
        }
      }
    }
  }

  // 単語を品詞ごとに分類
  const wordsByPartOfSpeech = new Map();
  words.forEach(word => {
    const wordLower = word.word.toLowerCase();
    const partOfSpeech = partOfSpeechMap.get(wordLower) || 'その他';

    if (!wordsByPartOfSpeech.has(partOfSpeech)) {
      wordsByPartOfSpeech.set(partOfSpeech, []);
    }
    wordsByPartOfSpeech.get(partOfSpeech).push(word);
  });

  // マークダウンを生成
  let markdown = '# プログラミング英単語集\n\n';

  // 品詞の順序を定義（既存の順序を維持）
  const partOfSpeechOrder = [
    '名詞 (Nouns)',
    '動詞 (Verbs)',
    '形容詞 (Adjectives)',
    '副詞 (Adverbs)',
    '接続詞・前置詞 (Conjunctions & Prepositions)'
  ];

  // 既存の品詞から順番に生成
  partOfSpeechOrder.forEach(partOfSpeech => {
    const wordsInCategory = wordsByPartOfSpeech.get(partOfSpeech) || [];
    if (wordsInCategory.length === 0) return;

    markdown += `## ${partOfSpeech}\n\n`;
    markdown += '| 英単語 | 日本語訳 | 使用例 | 使用例の日本語訳 |\n';
    markdown += '|--------|----------|--------|------------------|\n';

    wordsInCategory.forEach(word => {
      const meanings = word.meaning.join('、');
      const example = word.example.sentence || '';
      const exampleJp = word.example.translation || '';

      markdown += `| ${word.word} | ${meanings} | ${example} | ${exampleJp} |\n`;
    });

    markdown += '\n';
  });

  // その他の単語（品詞が不明なもの）
  const otherWords = wordsByPartOfSpeech.get('その他') || [];
  if (otherWords.length > 0) {
    markdown += '## その他\n\n';
    markdown += '| 英単語 | 日本語訳 | 使用例 | 使用例の日本語訳 |\n';
    markdown += '|--------|----------|--------|------------------|\n';

    otherWords.forEach(word => {
      const meanings = word.meaning.join('、');
      const example = word.example.sentence || '';
      const exampleJp = word.example.translation || '';

      markdown += `| ${word.word} | ${meanings} | ${example} | ${exampleJp} |\n`;
    });
  }

  // ファイルに書き込む
  fs.writeFileSync(mdPath, markdown, 'utf-8');
  console.log(`Successfully generated 英単語.md with ${words.length} words`);
  console.log(`Categories: ${Array.from(wordsByPartOfSpeech.keys()).join(', ')}`);
}

// 実行
generateMarkdownFromWords();
