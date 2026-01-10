# Hanyomi Chrome Extension

韓国語学習用のChrome拡張機能。選択した文字の意味をポップアップで表示します。

## 機能

- ページ上の文字を選択すると、自動的に選択内容がストレージに保存される
- 拡張機能アイコンをクリックしてポップアップを表示
- バックエンドAPIから辞書データを取得して表示

## セットアップ

### 1. 依存パッケージのインストール

```bash
cd extension
npm install
```

### 2. ビルド

開発環境でのビルド（ファイル監視有効）:

```bash
npm run dev
```

本番環境でのビルド:

```bash
npm run build
```

### 3. Chrome拡張機能として読み込む

1. Chrome を開く
2. `chrome://extensions/` にアクセス
3. 「デベロッパーモード」を有効にする（右上のトグル）
4. 「拡張機能を読み込む」をクリック
5. `extension/public/` ディレクトリを選択

## 使用方法

### ページで文字を選択

1. Webページ上で韓国語の文字を選択
2. 選択した文字の右下にポップアップが自動的に表示される
3. ポップアップで選択した文字の意味が表示される
4. 別の箇所をクリックするとポップアップは自動的に削除される

## ファイル構造

```
extension/
├── src/
│   ├── components/
│   │   ├── Popup.jsx       # ポップアップUIコンポーネント
│   │   └── Popup.css       # スタイル
│   ├── popup.jsx           # ポップアップエントリーポイント
│   ├── content.js          # コンテントスクリプト（ページ上の文字選択検出）
│   └── background.js       # バックグラウンドスクリプト
├── public/
│   ├── manifest.json       # マニフェスト
│   └── popup.html          # ポップアップHTML
├── dist/                   # ビルド出力
├── package.json
├── webpack.config.js       # Webpack設定
└── .babelrc               # Babel設定
```

## バックエンド設定

バックエンドサーバー（Node.js Express）が `http://localhost:3000` で動作している必要があります。

詳細は `../backend/README.md` を参照してください。

## APIエンドポイント

### GET /api/dic?word=[韓国語単語]

選択した単語から以下の情報を返す：

- `word`: 韓国語単語
- `mean`: 日本語での意味

複数の結果が返された場合は配列で複数のオブジェクトが返される。

## 開発

### Hot Reload

Webpackをウォッチモードで実行:

```bash
npm run dev
```

ビルド後、Chrome拡張機能の「再読み込み」ボタンをクリックして反映させます。

### デバッグ

- `chrome://extensions/` からサービスワーカーのコンソールを開く
- ポップアップのコンソールを開くには、ポップアップを右クリック → 「検査」

## トラブルシューティング

### ポップアップが表示されない

1. バックエンドサーバーが起動しているか確認
2. `http://localhost:3000/api/dic?word=테스트` でAPIが応答するか確認
3. Chrome拡張機能の権限設定を確認

### ビルドエラー

```bash
npm install
npm run build
```

Webpack設定を確認して、すべてのローダーが正しくインストールされているか確認。
