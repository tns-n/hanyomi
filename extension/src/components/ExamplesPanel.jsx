import React, { useState, useEffect } from "react";
import "./ExamplesPanel.css";

const ExamplesPanel = ({ word }) => {
  const [examples, setExamples] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [addingIndex, setAddingIndex] = useState(null);
  const [addMessage, setAddMessage] = useState("");

  useEffect(() => {
    if (word) {
      fetchExamples(word);
    }
  }, [word]);

  const fetchExamples = async () => {
    setLoading(true);
    setError("");
    try {
      // background.jsを経由して例文APIリクエストを送信
      chrome.runtime.sendMessage(
        { action: "fetchExamples", word: word },
        (response) => {
          if (response && response.success) {
            setExamples(response.data.examples || []);
          } else {
            setError("例文の取得に失敗しました");
          }
          setLoading(false);
        }
      );
    } catch (err) {
      setError("例文の取得に失敗しました");
      console.error("Fetch error:", err);
      setLoading(false);
    }
  };

  // 太字を下線に変換する関数
  const convertBoldToUnderline = (html) => {
    // <b>...</b> または <strong>...</strong> を <u>...</u> に変換
    let converted = html.replace(/<b>(.*?)<\/b>/g, "<u>$1</u>");
    converted = converted.replace(/<strong>(.*?)<\/strong>/g, "<u>$1</u>");
    return converted;
  };

  const addToAnki = async (example, index) => {
    setAddingIndex(index);
    setAddMessage("");

    try {
      // メッセージ送信のタイムアウトを設定
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Request timeout")), 10000)
      );

      const messagePromise = new Promise((resolve, reject) => {
        try {
          chrome.runtime.sendMessage(
            {
              action: "addToAnki",
              deckName: "韓国語::語彙",
              modelName: "miz_1",
              fields: {
                表面: convertBoldToUnderline(example.expExample2),
                裏面: convertBoldToUnderline(example.expExample1),
              },
            },
            (response) => {
              // エラーハンドリング
              if (chrome.runtime.lastError) {
                reject(new Error(chrome.runtime.lastError.message));
                return;
              }

              if (response && response.success) {
                resolve(response);
              } else {
                reject(new Error(response?.error || "不明なエラー"));
              }
            }
          );
        } catch (err) {
          reject(err);
        }
      });

      await Promise.race([messagePromise, timeoutPromise]);

      setAddMessage("Ankiに追加しました ✓");
      setTimeout(() => {
        setAddMessage("");
        setAddingIndex(null);
      }, 2000);
    } catch (err) {
      console.error("Add to Anki error:", err);
      setAddMessage(`追加失敗: ${err.message}`);
      setAddingIndex(null);
    }
  };

  return (
    <div className="examples-panel">
      {/* ヘッダー */}
      <div className="examples-header">
        <div className="examples-word-header">
          <div className="examples-word-title">{word}</div>
          <div className="examples-word-pronunciation">[{word}] 🔊</div>
        </div>
      </div>

      {/* コンテンツ */}
      <div className="examples-content">
        {loading ? (
          <div className="examples-loading">読み込み中...</div>
        ) : error ? (
          <div className="examples-error">{error}</div>
        ) : examples.length > 0 ? (
          <div className="examples-list">
            {examples.map((example, index) => (
              <div key={index} className="example-item">
                <div className="example-content">
                  <div>
                    <div
                      className="example-korean"
                      dangerouslySetInnerHTML={{
                        __html: example.expExample1,
                      }}
                    />
                    <div
                      className="example-japanese"
                      dangerouslySetInnerHTML={{
                        __html: example.expExample2,
                      }}
                    />
                  </div>
                  <button
                    className={`add-to-anki-icon-btn ${
                      addingIndex === index ? "adding" : ""
                    }`}
                    onClick={() => addToAnki(example, index)}
                    disabled={addingIndex === index}
                    title="この例文をAnkiに追加"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
                      <polyline points="17 5 17 19" />
                      <polyline points="5 12 19 12" />
                      <polyline points="5 5 5 19" />
                    </svg>
                  </button>
                </div>
                {addingIndex === index && addMessage && (
                  <span className="add-message">{addMessage}</span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="examples-no-results">例文がありません</div>
        )}
      </div>
    </div>
  );
};

export default ExamplesPanel;
