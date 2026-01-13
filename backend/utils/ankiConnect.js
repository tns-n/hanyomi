const axios = require("axios");

const ANKI_CONNECT_URL =
  process.env.ANKI_CONNECT_URL || "http://localhost:8765";

/**
 * AnkiConnectにリクエストを送信
 * @param {string} action - AnkiConnectのアクション
 * @param {object} params - パラメータ
 * @returns {Promise<object>} レスポンス
 */
async function invokeAnkiConnect(action, params = {}) {
  try {
    const payload = {
      action,
      version: 6,
      params,
    };

    const response = await axios.post(ANKI_CONNECT_URL, payload);

    if (response.data.error) {
      throw new Error(response.data.error);
    }

    return response.data.result;
  } catch (error) {
    console.error(`AnkiConnect error (${action}):`, error.message);
    throw error;
  }
}

/**
 * カードを作成
 * @param {string} deckName - デッキ名
 * @param {string} modelName - モデル名
 * @param {object} fields - フィールド
 * @param {array} tags - タグ
 * @returns {Promise<number>} カードID
 */
async function createCard(deckName, modelName, fields, tags = []) {
  const params = {
    note: {
      deckName,
      modelName,
      fields,
      tags,
    },
  };
  return invokeAnkiConnect("addNote", params);
}

/**
 * 複数のカードを作成
 * @param {string} deckName - デッキ名
 * @param {string} modelName - モデル名
 * @param {array} notes - ノートの配列
 * @returns {Promise<array>} カードIDの配列
 */
async function createCards(deckName, modelName, notes) {
  const params = {
    notes: notes.map((note) => ({
      deckName,
      modelName,
      fields: note.fields,
      tags: note.tags || [],
    })),
  };

  return invokeAnkiConnect("addNotes", params);
}

/**
 * デッキ一覧を取得
 * @returns {Promise<array>} デッキ名の配列
 */
async function getDeckNames() {
  return invokeAnkiConnect("deckNames");
}

/**
 * モデル一覧を取得
 * @returns {Promise<array>} モデル名の配列
 */
async function getModelNames() {
  return invokeAnkiConnect("modelNames");
}

/**
 * モデルのフィールドを取得
 * @param {string} modelName - モデル名
 * @returns {Promise<array>} フィールド名の配列
 */
async function getModelFields(modelName) {
  return invokeAnkiConnect("modelFieldNames", { modelName });
}

module.exports = {
  invokeAnkiConnect,
  createCard,
  createCards,
  getDeckNames,
  getModelNames,
  getModelFields,
};
