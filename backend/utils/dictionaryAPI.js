const axios = require("axios");

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

module.exports = {
  searchWord,
  getWordDetails,
  extractExamples,
};
