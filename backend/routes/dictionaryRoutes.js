const {
  searchWord,
  getWordDetails,
  extractExamples,
} = require("../utils/dictionaryAPI");

// 辞書検索API
async function dictionaryHandler(req, res) {
  try {
    const { word } = req.query;

    if (!word) {
      return res.status(400).json({ error: "word parameter is required" });
    }

    // 1. 検索APIから候補単語を取得
    const searchResult = await searchWord(word);

    if (!searchResult.items || searchResult.items.length === 0) {
      return res.json([]);
    }

    const results = [];

    // 2. 各候補単語に対して詳細情報を取得
    for (const itemGroup of searchResult.items) {
      if (!Array.isArray(itemGroup) || itemGroup.length === 0) continue;

      for (const item of itemGroup) {
        if (!Array.isArray(item) || item.length < 5) continue;

        const koreanWord = item[0]?.[0] || "";
        const japaneseText = item[3]?.[0] || "";

        if (!koreanWord) continue;

        try {
          // 詳細情報を取得
          //const detailData = await getWordDetails(koreanWord);

          // 例文情報を抽出
          //const examples = extractExamples(detailData);

          results.push({
            word: koreanWord,
            mean: japaneseText,
          });
        } catch (error) {
          console.error(
            `Error fetching details for ${koreanWord}:`,
            error.message
          );
          // エラーが発生した場合もスキップして続行
          continue;
        }
      }
    }

    res.json(results);
  } catch (error) {
    console.error("API error:", error);
    res.status(500).json({ error: error.message });
  }
}

// 例文取得API
async function examplesHandler(req, res) {
  try {
    const { word } = req.query;

    if (!word) {
      return res.status(400).json({ error: "word parameter is required" });
    }

    const detailData = await getWordDetails(word);
    const examples = extractExamples(detailData);

    res.json({
      word: word,
      examples: examples,
    });
  } catch (error) {
    console.error("Examples API error:", error);
    res.status(500).json({ error: error.message });
  }
}

// ヘルスチェック
function healthHandler(req, res) {
  res.json({ status: "ok" });
}

module.exports = {
  dictionaryHandler,
  examplesHandler,
  healthHandler,
};
