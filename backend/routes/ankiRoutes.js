const {
  createCard,
  createCards,
  getDeckNames,
  getModelNames,
  getModelFields,
} = require("../utils/ankiConnect");

/**
 * 単一カードを追加
 * POST /api/anki/add-card
 * Body: { deckName, modelName, fields, tags }
 */
async function addCardHandler(req, res) {
  try {
    const { deckName, modelName, fields, tags } = req.body;

    if (!deckName || !modelName || !fields) {
      return res.status(400).json({
        error: "deckName, modelName, and fields are required",
      });
    }

    const cardId = await createCard(deckName, modelName, fields, tags);

    res.json({
      success: true,
      cardId,
      message: "Card created successfully",
    });
  } catch (error) {
    console.error("Add card error:", error);
    res.status(500).json({ error: error.message });
  }
}

/**
 * 複数カードを追加
 * POST /api/anki/add-cards
 * Body: { deckName, modelName, notes }
 */
async function addCardsHandler(req, res) {
  try {
    const { deckName, modelName, notes } = req.body;

    if (!deckName || !modelName || !Array.isArray(notes)) {
      return res.status(400).json({
        error: "deckName, modelName, and notes array are required",
      });
    }

    const cardIds = await createCards(deckName, modelName, notes);

    res.json({
      success: true,
      cardIds,
      count: cardIds.length,
      message: "Cards created successfully",
    });
  } catch (error) {
    console.error("Add cards error:", error);
    res.status(500).json({ error: error.message });
  }
}

/**
 * デッキ一覧を取得
 * GET /api/anki/decks
 */
async function getDecksHandler(req, res) {
  try {
    const decks = await getDeckNames();

    res.json({
      success: true,
      decks,
      count: decks.length,
    });
  } catch (error) {
    console.error("Get decks error:", error);
    res.status(500).json({ error: error.message });
  }
}

/**
 * モデル一覧を取得
 * GET /api/anki/models
 */
async function getModelsHandler(req, res) {
  try {
    const models = await getModelNames();

    res.json({
      success: true,
      models,
      count: models.length,
    });
  } catch (error) {
    console.error("Get models error:", error);
    res.status(500).json({ error: error.message });
  }
}

/**
 * モデルのフィールドを取得
 * GET /api/anki/models/:modelName/fields
 */
async function getModelFieldsHandler(req, res) {
  try {
    const { modelName } = req.params;

    if (!modelName) {
      return res.status(400).json({ error: "modelName is required" });
    }

    const fields = await getModelFields(modelName);

    res.json({
      success: true,
      modelName,
      fields,
      count: fields.length,
    });
  } catch (error) {
    console.error("Get model fields error:", error);
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  addCardHandler,
  addCardsHandler,
  getDecksHandler,
  getModelsHandler,
  getModelFieldsHandler,
};
