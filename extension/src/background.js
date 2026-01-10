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
});
