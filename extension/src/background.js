// Background service worker

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "fetchDictionary") {
    // APIリクエストをバックグラウンドから実行
    const word = message.word;
    fetch(`http://localhost:3000/api/dic?word=${encodeURIComponent(word)}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("API error");
        }
        return response.json();
      })
      .then((data) => {
        sendResponse({ success: true, data });
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        sendResponse({ success: false, error: error.message });
      });

    return true; // 非同期応答を使用
  }

  if (message.action === "fetchExamples") {
    // 例文APIリクエストをバックグラウンドから実行
    const word = message.word;
    fetch(`http://localhost:3000/api/examples?word=${encodeURIComponent(word)}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("API error");
        }
        return response.json();
      })
      .then((data) => {
        sendResponse({ success: true, data });
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        sendResponse({ success: false, error: error.message });
      });

    return true; // 非同期応答を使用
  }

  if (message.action === "openPopup") {
    // ポップアップを開く処理
    chrome.action
      .openPopup()
      .then(() => {
        sendResponse({ success: true });
      })
      .catch((error) => {
        console.error("Failed to open popup:", error);
        sendResponse({ success: false });
      });

    return true;
  }

  if (message.action === "addToAnki") {
    // Ankiカード追加処理
    const { deckName, modelName, fields, tags } = message;

    if (!deckName || !modelName || !fields) {
      sendResponse({
        success: false,
        error: "Missing required fields: deckName, modelName, or fields",
      });
      return true;
    }

    const payload = {
      deckName,
      modelName,
      fields,
      tags,
    };

    fetch("http://localhost:3000/api/anki/add-card", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Anki API response:", data);
        if (data.error) {
          sendResponse({ success: false, error: data.error });
        } else {
          sendResponse({ success: true, cardId: data.cardId });
        }
      })
      .catch((error) => {
        console.error("Add to Anki error:", error);
        sendResponse({ success: false, error: error.message });
      });

    return true; // 非同期応答を使用
  }
});
