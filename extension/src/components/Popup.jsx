import React, { useState, useEffect } from "react";
import "./Popup.css";

const Popup = ({ word, onClose }) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (word) {
      fetchDictionary(word);
    }
  }, [word]);

  const fetchDictionary = async (searchWord) => {
    setLoading(true);
    setError("");
    try {
      // background.jsを経由してAPIリクエストを送信
      chrome.runtime.sendMessage(
        { action: "fetchDictionary", word: searchWord },
        (response) => {
          if (response && response.success) {
            setResults(response.data);
          } else {
            setError("辞書データの取得に失敗しました");
          }
          setLoading(false);
        }
      );
    } catch (err) {
      setError("辞書データの取得に失敗しました");
      console.error("Fetch error:", err);
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="popup-container">
      {/* ヘッダー */}
      <div className="popup-header">
        <div className="word-header">
          <div className="word-title">{word}</div>
          <div className="word-pronunciation">[{word}] 🔊</div>
        </div>
        <button className="close-btn" onClick={handleClose}>
          ✕
        </button>
      </div>

      {/* コンテンツ */}
      <div className="popup-content">
        {loading ? (
          <div className="loading">読み込み中...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : results.length > 0 ? (
          results.map((result, index) => (
            <React.Fragment key={index}>
              <div className="meaning-entry">
                <div className="meaning-header">
                  <div className="meaning-number">{index + 1}.</div>
                  <div className="meaning-header-content">
                    <div className="word-form">{result.word}</div>
                  </div>
                </div>
                <div className="meanings-list">
                  <div className="meaning-text">{result.mean}</div>
                </div>
              </div>
              {index < results.length - 1 && <div className="divider"></div>}
            </React.Fragment>
          ))
        ) : (
          <div className="no-results">検索結果がありません</div>
        )}
      </div>
    </div>
  );
};

export default Popup;
