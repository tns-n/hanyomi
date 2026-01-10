const express = require("express");
const axios = require("axios");
const app = express();

const PORT = process.env.PORT || 3000;

// CORS設定
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// NAVER辞書の検索APIから単語を検索
async function searchWord(word) {
  try {
    const encodedWord = encodeURIComponent(word);
    const searchUrl = `https://ac-dict.naver.com/koja/ac?n_katahira=0&st=11&r_lt=11&q=${encodedWord}`;

    const response = await axios.get(searchUrl);
    return response.data;
  } catch (error) {
    console.error("Search API error:", error.message);
    throw error;
  }
}

// 単語の詳細情報を取得
async function getWordDetails(query) {
  try {
    const encodedQuery = encodeURIComponent(query);
    const detailUrl = `https://korean.dict.naver.com/api3/koja/search?query=${encodedQuery}&m=mobile&shouldSearchVlive=true`;

    const response = await axios.get(detailUrl, {
      headers: {
        accept: "*/*",
        "accept-language": "ja,en;q=0.9,ko;q=0.6",
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        referer: "https://korean.dict.naver.com/kojadict/",
        "sec-fetch-site": "same-origin",
        "sec-fetch-mode": "cors",
        "sec-fetch-dest": "empty",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Detail API error:", error.message);
    throw error;
  }
}

// 例文情報を抽出
function extractExamples(detailData) {
  const examples = [];

  if (!detailData.searchResultMap?.searchResultListMap?.EXAMPLE?.items) {
    console.log("No example data found");
    return examples;
  }

  const items = detailData.searchResultMap.searchResultListMap.EXAMPLE.items;
  items.forEach((item) => {
    examples.push({
      expExample1: item.expExample1 || "",
      expExample2: item.expExample2 || "",
      expEntry: item.expEntry || "",
    });
  });

  return examples;
}
// メインのAPI処理
app.get("/api/dic", async (req, res) => {
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
});

// 例文取得API
app.get("/api/examples", async (req, res) => {
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
});

// ヘルスチェック
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Dictionary API server is running on http://localhost:${PORT}`);
  console.log(`Usage: http://localhost:${PORT}/api/dic?word=감사`);
});
