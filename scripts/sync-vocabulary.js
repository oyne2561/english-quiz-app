const fs = require('fs');
const path = require('path');

// 英単語.mdから単語を抽出
function parseMarkdownVocabulary(mdContent) {
  const words = [];
  const lines = mdContent.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // テーブルの行を解析（| で始まり、複数の | を含む）
    if (line.startsWith('|') && !line.includes('-----') && !line.includes('英単語')) {
      const columns = line.split('|').map(col => col.trim()).filter(col => col);

      if (columns.length >= 5) {
        const [word, meanings, , example, exampleJp] = columns;

        // meaningを分割（、で区切られている）
        const meaningArray = meanings.split('、').map(m => m.trim()).filter(m => m);

        words.push({
          word: word,
          meaning: meaningArray,
          example: {
            sentence: example,
            translation: exampleJp
          }
        });
      }
    }
  }

  return words;
}

// words.jsonを更新
function syncVocabulary() {
  const mdPath = path.join(__dirname, '..', '英単語.md');
  const jsonPath = path.join(__dirname, '..', 'public', 'data', 'vocabulary', 'words.json');

  // 英単語.mdを読み込む
  const mdContent = fs.readFileSync(mdPath, 'utf-8');
  const newWords = parseMarkdownVocabulary(mdContent);

  console.log(`Parsed ${newWords.length} words from 英単語.md`);

  // words.jsonを読み込む
  let existingWords = [];
  try {
    existingWords = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    console.log(`Loaded ${existingWords.length} existing words from words.json`);
  } catch (err) {
    console.log('No existing words.json found, creating new one');
  }

  // 既存の単語のマップを作成
  const wordMap = new Map();
  existingWords.forEach(word => {
    wordMap.set(word.word.toLowerCase(), word);
  });

  let addedCount = 0;
  let updatedCount = 0;
  let deletedCount = 0;

  // 英単語.mdに存在する単語のセットを作成
  const newWordSet = new Set(newWords.map(w => w.word.toLowerCase()));

  // 英単語.mdにない単語を削除
  const filteredWords = existingWords.filter(existingWord => {
    if (!newWordSet.has(existingWord.word.toLowerCase())) {
      deletedCount++;
      console.log(`Deleting: ${existingWord.word}`);
      return false;
    }
    return true;
  });

  // 単語マップを再構築
  wordMap.clear();
  filteredWords.forEach(word => {
    wordMap.set(word.word.toLowerCase(), word);
  });

  // 新しい単語を追加または更新
  newWords.forEach(newWord => {
    const existingWord = wordMap.get(newWord.word.toLowerCase());

    if (existingWord) {
      // 既存の単語を更新
      existingWord.meaning = newWord.meaning;
      existingWord.example = newWord.example;
      updatedCount++;
    } else {
      // 新しい単語を追加
      filteredWords.push(newWord);
      wordMap.set(newWord.word.toLowerCase(), newWord);
      addedCount++;
    }
  });

  console.log(`Added ${addedCount} new words`);
  console.log(`Updated ${updatedCount} existing words`);
  console.log(`Deleted ${deletedCount} words`);
  console.log(`Total words: ${filteredWords.length}`);

  // words.jsonに書き込む
  fs.writeFileSync(jsonPath, JSON.stringify(filteredWords, null, 2), 'utf-8');
  console.log('Successfully synced vocabulary!');
}

// 実行
syncVocabulary();

