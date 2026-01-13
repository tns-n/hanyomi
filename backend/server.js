const express = require("express");
const app = express();

const { setupCors } = require("./utils/cors");
const {
  dictionaryHandler,
  examplesHandler,
  healthHandler,
} = require("./routes/dictionaryRoutes");
const {
  addCardHandler,
  addCardsHandler,
  getDecksHandler,
  getModelsHandler,
  getModelFieldsHandler,
} = require("./routes/ankiRoutes");

const PORT = process.env.PORT || 3000;

// ミドルウェア設定
setupCors(app);
app.use(express.json());

// 辞書API ルート
app.get("/api/dic", dictionaryHandler);
app.get("/api/examples", examplesHandler);

// AnkiConnect API ルート
app.post("/api/anki/add-card", addCardHandler);
app.post("/api/anki/add-cards", addCardsHandler);
app.get("/api/anki/decks", getDecksHandler);
app.get("/api/anki/models", getModelsHandler);
app.get("/api/anki/models/:modelName/fields", getModelFieldsHandler);

// ヘルスチェック
app.get("/health", healthHandler);

app.listen(PORT, () => {
  console.log(`Dictionary API server is running on http://localhost:${PORT}`);
  console.log(`Usage: http://localhost:${PORT}/api/dic?word=감사`);
});
