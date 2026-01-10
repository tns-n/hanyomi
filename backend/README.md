# Hanyomi Dictionary API Server

NAVER辞書のAPIを利用した韓国語-日本語辞書APIサーバー

## インストール

```bash
npm install
```

## 起動

```bash
npm start
```

開発環境でホットリロードを有効にする場合：

```bash
npm run dev
```

## 使用方法

### エンドポイント

#### 1. `GET /api/dic?word=[韓国語単語]`

指定した韓国語単語の検索結果を返します。検索APIから候補単語と日本語の意味を取得します。

**パラメータ:**
- `word` (string, 必須): 検索する韓国語単語

**レスポンス例:**

```json
[
  {
    "word": "감사",
    "mean": "かんしゃ【感謝】"
  },
  {
    "word": "감사하다",
    "mean": "感謝する"
  }
]
```

**レスポンス形式:**

```javascript
[
  {
    word: string,  // 韓国語単語
    mean: string   // 日本語での意味
  }
]
```

#### 2. `GET /api/examples?word=[韓国語単語]`

指定した韓国語単語の詳細情報と例文を取得します。

**パラメータ:**
- `word` (string, 必須): 検索する韓国語単語

**レスポンス例:**

```json
{
  "word": "감사",
  "examples": [
    {
      "expExample1": "감사합니다",
      "expExample2": "ありがとうございます",
      "expEntry": "<strong>感謝</strong>"
    }
  ]
}
```

**レスポンス形式:**

```javascript
{
  word: string,
  examples: [
    {
      expExample1: string, // 例文（韓国語）
      expExample2: string, // 例文（日本語）
      expEntry: string     // 見出し語（HTML形式の場合あり）
    }
  ]
}
```

### 使用例

```bash
# 単語検索（候補と意味のみ）
curl "http://localhost:3000/api/dic?word=감사"

# 例文取得（詳細情報）
curl "http://localhost:3000/api/examples?word=감사"
```

## 実装仕様

1. **検索API** (`/api/dic`): NAVER辞書の検索APIから単語の候補を取得し、韓国語単語と日本語の意味を返す
2. **詳細API** (`/api/examples`): 指定した単語の詳細情報を取得し、例文を抽出して返す
3. **エラーハンドリング**: 単語が見つからない場合は空配列を返す、APIエラーはエラーメッセージを返す

## ポート

デフォルトポート: 3000

環境変数で変更可能:

```bash
PORT=8080 npm start
```

## 依存ライブラリ

- **express**: Webサーバーフレームワーク
- **axios**: HTTP クライアント

## エラーハンドリング

- `word` パラメータが未指定の場合: 400 Bad Request を返す
- 単語が見つからない場合: 空配列 `[]` を返す
- APIエラーが発生した場合: 500 Internal Server Error とエラーメッセージを返す
- 例文データが取得できない場合: 空配列を返す
