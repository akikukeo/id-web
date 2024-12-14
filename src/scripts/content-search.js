// 半角と全角を統一する関数
function toHalfWidth(str) {
  return str.replace(/[\uff01-\uff5e]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0xFEE0));
}

// 検索文字列をハイライトする関数
function highlightMatch(text, query) {
  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, (match) => `<span style="font-weight: bold;">${match}</span>`);
}

// リポジトリベースパスを取得
const basePath = `/${window.location.pathname.split('/')[1]}`;

// JSONデータを取得
// fetch(`${basePath}/src/data/contentid.json`)
fetch(`src/data/contentid.json`)
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json(); // 一度だけ json() を呼び出す
  })
  .then(data => {
    // 検索ボタンのイベントリスナー
    document.getElementById('searchButton').addEventListener('click', () => {
      const searchQuery = toHalfWidth(document.getElementById('searchInput').value.toLowerCase()).normalize();

      if (searchQuery.trim() === '') {
        displayResults([]); // 空白の場合は結果なしを表示
      } else {
        const results = data.filter(item =>
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
  })
  .catch(error => {
    console.error('Error fetching JSON:', error);
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '<p>Error loading data. Please try again later.</p>';
  });

// 検索結果を表示する関数
function displayResults(results, query = '') {
  const resultsContainer = document.getElementById('results');
  resultsContainer.innerHTML = ''; // 既存の内容をクリア

  if (results.length === 0) {
    resultsContainer.innerHTML = '<p>No results found.</p>';
  } else {
    results.forEach(item => {
      const itemElement = document.createElement('div');

      // ハイライト処理
      const highlightedTitle = highlightMatch(item.title, query);
      const highlightedAuthor = highlightMatch(item.author, query);
      const highlightedCreator = highlightMatch(item.creator, query);
      const highlightedPlatform = highlightMatch(item.uploadPlatform, query);

      itemElement.innerHTML = `
        <h3>${highlightedTitle}</h3>
        <p>登録日時: ${(item.registrationDate)}</p>
        <p>制作者: ${highlightedAuthor}</p>
        <p>著作者: ${highlightedCreator}</p>
        <p>プラットフォーム: ${highlightedPlatform}</p>
        <p>動画ID: ${item.videoId}</p>
        <p><a href="${item.url}" target="_blank">「${item.uploadPlatform}」で視聴</a></p>
      `;
      resultsContainer.appendChild(itemElement);
    });
  }
}
