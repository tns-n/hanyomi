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

#### 3. `POST /api/anki/add-card`

単一のカードをAnkiに追加します。

**ボディ:**

```json
{
  "deckName": "デッキ名",
  "modelName": "モデル名",
  "fields": {
    "Front": "韓国語",
    "Back": "日本語の意味"
  },
  "tags": ["anki", "korean"]
}
```

**レスポンス例:**

```json
{
  "success": true,
  "cardId": 1234567890,
  "message": "Card created successfully"
}
```

#### 4. `POST /api/anki/add-cards`

複数のカードをAnkiに一括追加します。

**ボディ:**

```json
{
  "deckName": "デッキ名",
  "modelName": "モデル名",
  "notes": [
    {
      "fields": {
        "Front": "감사",
        "Back": "感謝"
      },
      "tags": ["korean"]
    },
    {
      "fields": {
        "Front": "사랑",
        "Back": "愛"
      },
      "tags": ["korean"]
    }
  ]
}
```

**レスポンス例:**

```json
{
  "success": true,
  "cardIds": [1234567890, 1234567891],
  "count": 2,
  "message": "Cards created successfully"
}
```

#### 5. `GET /api/anki/decks`

利用可能なデッキの一覧を取得します。

**レスポンス例:**

```json
{
  "success": true,
  "decks": ["Default", "Korean", "Japanese"],
  "count": 3
}
```

#### 6. `GET /api/anki/models`

利用可能なモデルの一覧を取得します。

**レスポンス例:**

```json
{
  "success": true,
  "models": ["Basic", "Basic (reversed card)", "Cloze"],
  "count": 3
}
```

#### 7. `GET /api/anki/models/:modelName/fields`

指定したモデルのフィールド一覧を取得します。

**パラメータ:**
- `modelName` (string, 必須): モデル名

**レスポンス例:**

```json
{
  "success": true,
  "modelName": "Basic",
  "fields": ["Front", "Back"],
  "count": 2
}
```

### 使用例

```bash
# 単語検索（候補と意味のみ）
curl "http://localhost:3000/api/dic?word=감사"

# 例文取得（詳細情報）
curl "http://localhost:3000/api/examples?word=감사"

# デッキ一覧を取得
curl "http://localhost:3000/api/anki/decks"

# モデル一覧を取得
curl "http://localhost:3000/api/anki/models"

# 単一カードをAnkiに追加
curl -X POST http://localhost:3000/api/anki/add-card \
  -H "Content-Type: application/json" \
  -d '{
    "deckName": "Korean",
    "modelName": "Basic",
    "fields": {
      "Front": "감사",
      "Back": "感謝"
    },
    "tags": ["korean"]
  }'

# 複数カードをAnkiに追加
curl -X POST http://localhost:3000/api/anki/add-cards \
  -H "Content-Type: application/json" \
  -d '{
    "deckName": "Korean",
    "modelName": "Basic",
    "notes": [
      {"fields": {"Front": "감사", "Back": "感謝"}, "tags": ["korean"]},
      {"fields": {"Front": "사랑", "Back": "愛"}, "tags": ["korean"]}
    ]
  }'
```

## 実装仕様

1. **検索API** (`/api/dic`): NAVER辞書の検索APIから単語の候補を取得し、韓国語単語と日本語の意味を返す
2. **詳細API** (`/api/examples`): 指定した単語の詳細情報を取得し、例文を抽出して返す
3. **AnkiConnect API** (`/api/anki/*`): Anki連携APIで、カード追加やデッキ・モデル情報の取得が可能
4. **エラーハンドリング**: 単語が見つからない場合は空配列を返す、APIエラーはエラーメッセージを返す

## ポート

デフォルトポート: 3000

環境変数で変更可能:

```bash
PORT=8080 npm start
```

## AnkiConnect設定

AnkiConnectはAnkiプラグインで、このサーバーからAnkiにカードを追加するために必要です。

**デフォルトURL:** `http://localhost:8765`

環境変数で変更可能:

```bash
ANKI_CONNECT_URL=http://localhost:8765 npm start
```

**Anki側での設定:**

1. Ankiで `ツール` → `アドオン` から AnkiConnectをインストール
2. AnkiConnectの設定で `http://localhost:8765` でリッスンするよう設定
3. 本サーバーとの連携が可能になります

## 依存ライブラリ

- **express**: Webサーバーフレームワーク
- **axios**: HTTP クライアント

## エラーハンドリング

- `word` パラメータが未指定の場合: 400 Bad Request を返す
- 単語が見つからない場合: 空配列 `[]` を返す
- APIエラーが発生した場合: 500 Internal Server Error とエラーメッセージを返す
- 例文データが取得できない場合: 空配列を返す
