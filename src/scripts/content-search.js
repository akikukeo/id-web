// 半角と全角を統一する関数
function toHalfWidth(str) {
    return str.replace(/[\uff01-\uff5e]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0xFEE0));
  }
  
  // 検索文字列をハイライトする関数
  function highlightMatch(text, query) {
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, (match) => `<span style="font-weight: bold;">${match}</span>`);
    // return text.replace(regex, (match) => `<span style="background-color: yellow; font-weight: bold;">${match}</span>`);
  }
  
  // JSONデータを取得
  fetch('/id-web/src/data/contentid.json')
    .then(response => {
      if (!response.ok) {
        if (response.status === 404) {
          console.error('File not found. Please check the path.');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      displayResults(data);
    })
    .catch(error => {
      console.error('Error fetching JSON:', error);
      const resultsContainer = document.getElementById('results');
      resultsContainer.innerHTML = '<p>Error loading data. Please try again later.</p>';
    })
    .then(response => response.json())
    .then(data => {
      // 検索ボタンのイベントリスナー
      document.getElementById('searchButton').addEventListener('click', () => {
        const searchQuery = toHalfWidth(document.getElementById('searchInput').value.toLowerCase()).normalize();
  
        if (searchQuery.trim() === '') {
          // 空白の検索クエリの場合は「No results found.」を表示
          displayResults([]);
        } else {
          const results = data.filter(item =>
            toHalfWidth(item.title.toLowerCase()).normalize().includes(searchQuery) ||
            toHalfWidth(item.author.toLowerCase()).normalize().includes(searchQuery) ||
            toHalfWidth(item.creator.toLowerCase()).normalize().includes(searchQuery) ||
            toHalfWidth(item.uploadPlatform.toLowerCase()).normalize().includes(searchQuery)
          );
  
          displayResults(results, searchQuery);
        }
      });
  
      // クリアボタンのイベントリスナー
      document.getElementById('clearButton').addEventListener('click', () => {
        document.getElementById('searchInput').value = ''; // 入力フィールドをクリア
        displayResults([]); // 検索結果を空にする
      });
    })
    .catch(error => console.error('Error fetching data:', error));
  
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
  