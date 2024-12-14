// 半角と全角を統一する関数
function toHalfWidth(str) {
  return str.replace(/[\uff01-\uff5e]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0xFEE0));
}

// 検索文字列をハイライトする関数
function highlightMatch(text, query) {
  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, (match) => `<span style="font-weight: bold;">${match}</span>`);
}

// 日付を日本語表記に変換する関数
function formatDateToJapanese(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}年${month}月${day}日 ${hours}:${minutes}:${seconds}`;
}

// ユーザーが入力したJSONデータを保持
let userData = [];

// JSONデータを処理
function processJsonInput(jsonText) {
  try {
    const parsedData = JSON.parse(jsonText); // JSONテキストをパース
    userData = parsedData; // データを保存
    displayMessage('JSONデータが正常に読み込まれました。', 'success');
  } catch (error) {
    console.error('Invalid JSON:', error);
    displayMessage('無効なJSONデータです。もう一度確認してください。', 'error');
  }
}

// メッセージを画面に表示する関数
function displayMessage(message, type) {
  const messageContainer = document.getElementById('messageContainer');
  messageContainer.textContent = message;
  messageContainer.className = type; // メッセージの種類に応じたクラスを追加（成功・エラー）

  // メッセージを表示
  messageContainer.style.display = 'block'; // displayをblockに設定して表示

  // // 一定時間後にメッセージを非表示にする
  // setTimeout(() => {
  //   messageContainer.style.display = 'none'; // 5秒後に非表示に
  //   messageContainer.className = ''; // クラスをリセット
  // }, 5000); // 5秒後にメッセージを非表示に
};

// // メッセージを画面に表示する関数
// // function displayMessage(message, type) {
// //   const messageContainer = document.getElementById('messageContainer');
// //   messageContainer.textContent = message;
// //   messageContainer.className = type; // メッセージの種類に応じたクラスを追加（成功・エラー）

// //   // 一定時間後にメッセージを非表示にする
// //   setTimeout(() => {
// //     messageContainer.textContent = '';
// //     messageContainer.className = '';
// //   }, 5000); // 5秒後にメッセージを非表示に
// // }
// // メッセージを画面に表示する関数
// function displayMessage(message, type) {
//   const messageContainer = document.getElementById('messageContainer');
//   messageContainer.textContent = message;
//   messageContainer.className = type; // メッセージの種類に応じたクラスを追加（成功・エラー）

//   // メッセージを表示
//   messageContainer.style.display = 'block'; // displayをblockに設定して表示

// //   // 一定時間後にメッセージを非表示にする
// //   setTimeout(() => {
// //     messageContainer.style.display = 'none'; // 5秒後に非表示に
// //     messageContainer.className = ''; // クラスをリセット
// //   }, 5000); // 5秒後にメッセージを非表示に
// };


// 検索ボタンのイベントリスナー
document.getElementById('searchButton').addEventListener('click', () => {
  const searchQuery = toHalfWidth(document.getElementById('searchInput').value.toLowerCase()).normalize();

  if (searchQuery.trim() === '') {
    displayResults([]); // 空白の場合は結果なしを表示
  } else {
    const results = userData.filter(item =>
      toHalfWidth(item.title.toLowerCase()).normalize().includes(searchQuery) ||
      toHalfWidth(item.author.toLowerCase()).normalize().includes(searchQuery) ||
      toHalfWidth(item.creator.toLowerCase()).normalize().includes(searchQuery) ||
      toHalfWidth(item.uploadPlatform.toLowerCase()).normalize().includes(searchQuery)
    );

    displayResults(results, searchQuery); // 検索結果を表示
  }
});

// クリアボタンのイベントリスナー
document.getElementById('clearButton').addEventListener('click', () => {
  document.getElementById('searchInput').value = ''; // 入力フィールドをクリア
  displayResults([]); // 検索結果をクリア
});

// JSON入力ボタンのイベントリスナー
document.getElementById('jsonSubmitButton').addEventListener('click', () => {
  const jsonInput = document.getElementById('jsonInput').value;
  processJsonInput(jsonInput); // JSONデータを処理
});

// 検索結果を表示する関数
function displayResults(results, query = '') {
  const resultsTableBody = document.querySelector('#results table tbody');
  resultsTableBody.innerHTML = ''; // 既存の内容をクリア

  if (results.length === 0) {
    resultsTableBody.innerHTML = '<tr><td colspan="7">No results found.</td></tr>';
  } else {
    results.forEach(item => {
      const row = document.createElement('tr');

      // ハイライト処理
      const highlightedTitle = highlightMatch(item.title, query);
      const highlightedAuthor = highlightMatch(item.author, query);
      const highlightedCreator = highlightMatch(item.creator, query);
      const highlightedPlatform = highlightMatch(item.uploadPlatform, query);

      row.innerHTML = `
        <td>${highlightedTitle}</td>
        <td>${formatDateToJapanese(item.registrationDate)}</td>
        <td>${highlightedAuthor}</td>
        <td>${highlightedCreator}</td>
        <td>${highlightedPlatform}</td>
        <td>${item.videoId}</td>
        <td><a href="${item.url}" target="_blank">視聴</a></td>
      `;
      resultsTableBody.appendChild(row);
    });
  }
}
