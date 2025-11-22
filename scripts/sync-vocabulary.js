const fs = require('fs');
const path = require('path');

// 英単語.mdから単語を抽出
function parseMarkdownVocabulary(mdContent) {
  const words = [];
  const lines = mdContent.split('\n');
  
  let currentCategory = '';
  const categoryMap = {
    '## 名詞 (Nouns)': '基本プログラミング用語',
    '## 動詞 (Verbs)': '基本プログラミング用語',
    '## 形容詞 (Adjectives)': '基本プログラミング用語',
    '## 副詞 (Adverbs)': '基本プログラミング用語',
    '## 接続詞・前置詞 (Conjunctions & Prepositions)': '基本プログラミング用語'
  };
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // カテゴリの検出
    if (line.startsWith('##')) {
      currentCategory = categoryMap[line] || '基本プログラミング用語';
      continue;
    }
    
    // テーブルの行を解析（| で始まり、複数の | を含む）
    if (line.startsWith('|') && !line.includes('-----') && !line.includes('英単語')) {
      const columns = line.split('|').map(col => col.trim()).filter(col => col);
      
      if (columns.length >= 5) {
        const [word, meanings, , example, exampleJp] = columns;
        
        // meaningを分割（、で区切られている）
        const meaningArray = meanings.split('、').map(m => m.trim()).filter(m => m);
        
        // difficultyを推定（単語の複雑さやカテゴリから）
        let difficulty = 1;
        if (word.includes('-')) {
          difficulty = 2; // ハイフンを含む複合語
        } else if (word.length > 12) {
          difficulty = 2; // 長い単語
        }
        if (currentCategory.includes('高度') || meaningArray.length > 2) {
          difficulty = 3;
        }
        
        words.push({
          word: word,
          meaning: meaningArray,
          example: {
            sentence: example,
            translation: exampleJp
          },
          difficulty: difficulty,
          category: currentCategory
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
  
  // 次のIDを取得
  let maxId = 0;
  existingWords.forEach(word => {
    const match = word.id.match(/word-(\d+)/);
    if (match) {
      maxId = Math.max(maxId, parseInt(match[1]));
    }
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
      existingWord.category = newWord.category;
      // difficultyは既存の値を保持（手動で調整されている可能性があるため）
      updatedCount++;
    } else {
      // 新しい単語を追加
      maxId++;
      const newEntry = {
        id: `word-${String(maxId).padStart(4, '0')}`,
        ...newWord
      };
      filteredWords.push(newEntry);
      wordMap.set(newWord.word.toLowerCase(), newEntry);
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

