# English Quiz App

英語学習用のクイズアプリケーション

## 使用している翻訳サービスについて

このプロジェクトでは、翻訳機能に **LibreTranslate** を使用しています。

### LibreTranslate について

- **公式サイト**: https://ja.libretranslate.com/
- **ライセンス**: AGPL-3.0（GNU Affero General Public License v3.0）
- **特徴**: オープンソースの無料翻訳API

### ライセンスに関する重要な注意事項

LibreTranslateは[GNU](https://e-words.jp/w/GNU.html)プロジェクトのAGPLライセンスで提供されています。

**本プロジェクトでの使用方法**:
- 公開されているLibreTranslate APIをHTTP経由で使用しているため、本プロジェクトのソースコードはAGPLの対象外です
- LibreTranslateのソースコードを改変したり、サーバーに組み込んだりはしていません
- 単なるAPIクライアントとしての利用のため、本リポジトリの公開義務はありません

**参考情報**:
- AGPLライセンスは、ネットワーク越しにサービスを提供する場合でもソースコード公開を求めるコピーレフト型ライセンスです
- ただし、APIを使用するクライアント側のコードには適用されません
- 詳細は[GPLについて](https://e-words.jp/w/GPL.html)をご参照ください

**本リポジトリのライセンス**:
- 本プロジェクト自体のソースコードは、LibreTranslateとは独立したものです
- LibreTranslateのAPIを利用しているだけなので、本プロジェクトは自由にライセンスを選択できます

## 単語の追加・削除方法

単語データは `英単語.md` と `public/data/vocabulary/words.json` で管理されています。

### 手順

1. `英単語.md` を編集して単語を追加・削除する
2. 以下のコマンドを実行して同期する：

```bash
node scripts/sync-vocabulary.js
```

このスクリプトは以下の処理を自動的に行います：
- `英単語.md` から新しい単語を抽出して `words.json` に追加
- 既存の単語の意味や例文を更新
- `英単語.md` にない単語を `words.json` から削除

### 注意事項

- 単語の `difficulty` (難易度) は既存の値が保持されます
- 必要に応じて `words.json` で手動調整してください

