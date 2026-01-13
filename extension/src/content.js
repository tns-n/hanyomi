// Content script: ページ上で文字選択を検出し、ポップアップを直接挿入

import React from "react";
import ReactDOM from "react-dom/client";
import Popup from "./components/Popup";

let popupContainer = null;
let popupRoot = null;
let isPopupFocused = false;

// ポップアップを表示
function showPopup(word, selectionRect) {
  // 既存のポップアップを削除（フォーカス状態をリセット）
  hidePopup();
  isPopupFocused = false;

  // コンテナを作成
  popupContainer = document.createElement("div");
  popupContainer.id = "hanyomi-popup-container";
  popupContainer.style.position = "fixed";
  popupContainer.style.zIndex = "10000";
  popupContainer.style.pointerEvents = "auto";

  // 選択位置の右下に配置
  const x = selectionRect.right;
  const y = selectionRect.bottom;

  popupContainer.style.left = x + "px";
  popupContainer.style.top = y + "px";

  // ポップアップにフォーカスイベントを追加
  popupContainer.addEventListener("mouseenter", () => {
    isPopupFocused = true;
  });

  popupContainer.addEventListener("mouseleave", () => {
    isPopupFocused = false;
  });

  document.body.appendChild(popupContainer);

  // Reactをレンダリング
  popupRoot = ReactDOM.createRoot(popupContainer);
  popupRoot.render(
    <React.StrictMode>
      <Popup word={word} onClose={hidePopup} />
    </React.StrictMode>
  );
}

// ポップアップを削除
function hidePopup() {
  if (popupRoot) {
    popupRoot.unmount();
    popupRoot = null;
  }
  if (popupContainer && popupContainer.parentNode) {
    popupContainer.parentNode.removeChild(popupContainer);
    popupContainer = null;
  }
  isPopupFocused = false;
}

// 文字選択イベント
document.addEventListener("mouseup", () => {
  const selection = window.getSelection();
  const selectedText = selection.toString().trim();

  if (selectedText.length > 0 && selectedText.length < 50) {
    // 新しい文字が選択された場合はポップアップを削除
    hidePopup();

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    // ポップアップを表示
    showPopup(selectedText, rect);
  } else if (!isPopupFocused) {
    // ポップアップにフォーカスがない場合のみ削除
    hidePopup();
  }
});

// 選択解除時
document.addEventListener("mousedown", (e) => {
  // ポップアップ内をクリック以外で削除
  if (popupContainer && !popupContainer.contains(e.target)) {
    // ポップアップ外をクリックした場合のみ削除
    hidePopup();
  }
});

// ページ離脱時にクリーンアップ
window.addEventListener("beforeunload", hidePopup);
