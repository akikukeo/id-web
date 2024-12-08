document.addEventListener("DOMContentLoaded", () => {
    let data = []; // JSONデータを格納する変数
    let sortedData = []; // ソートされたデータ
    let isNewOrder = true; // デフォルトは新しい順

    // JSONデータを取得
    fetch('../src/data/contentid.json') // ファイルの相対パス
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTPエラー! ステータス: ${response.status}`);
            }
            return response.json(); // JSONデータをパース
        })
        .then(jsonData => {
            data = jsonData;
            // 日付を元にデータを登録順に並べる
            sortedData = data.map((item) => ({
                ...item,
                registrationDate: new Date(item.registrationDate)
            }));
            // デフォルトで新しい順に表示
            sortedData.sort((a, b) => b.registrationDate - a.registrationDate);
            displayData(sortedData, true); // 新しい順表示

            // 新しい順ボタンにアクティブクラスを追加
            document.getElementById("sort-new").classList.add("active");
        })
        .catch(error => {
            console.error('エラーが発生しました:', error);
        });

    // データをHTMLテーブルに表示
    function displayData(dataToDisplay, isNewOrder) {
        const tableBody = document.getElementById("data-list");
        tableBody.innerHTML = ''; // テーブルをクリア

        dataToDisplay.forEach((item, index) => {
            const row = document.createElement("tr");

            // 新しい順では1から振り、古い順では逆順で番号を振る
            const registrationNumber = isNewOrder ? index + 1 : dataToDisplay.length - index;

            // 24時間表記の形式で日付と時間を表示
            const formattedDateTime = item.registrationDate.toLocaleDateString('ja-JP', {
                year: 'numeric',
                month: 'long',
                day: '2-digit',
            }) + ' ' + item.registrationDate.toLocaleTimeString('ja-JP', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false // 24時間形式を指定
            });

            // 各セルを作成し、テーブル行に追加
            row.innerHTML = `
                <td>${registrationNumber}</td>
                <td>${formattedDateTime}</td>
                <td>${item.author}</td>
                <td>${item.creator}</td>
                <td>${item.uploadPlatform}</td>
                <td>${item.title}</td>
                <td>${item.videoId}</td>
                <td><a href="${item.url}" target="_blank">視聴</a></td>
            `;

            tableBody.appendChild(row);
        });

        // ソート状態を表示
        const sortStatus = document.getElementById("sort-status");
        sortStatus.textContent = isNewOrder ? "現在は新しい順で表示しています" : "現在は古い順で表示しています";
        
    }

    // 古い順ボタン
    document.getElementById("sort-old").addEventListener("click", () => {
        // 登録日を基準にソート（古い順）
        sortedData.sort((a, b) => a.registrationDate - b.registrationDate);
        isNewOrder = false; // 古い順に変更
        displayData(sortedData, false); // 古い順表示

        // ボタンのアクティブ状態を変更
        document.getElementById("sort-new").classList.remove("active");
        document.getElementById("sort-old").classList.add("active");
    });

    // 新しい順ボタン
    document.getElementById("sort-new").addEventListener("click", () => {
        // 登録日を基準にソート（新しい順）
        sortedData.sort((a, b) => b.registrationDate - a.registrationDate);
        isNewOrder = true; // 新しい順に変更
        displayData(sortedData, true); // 新しい順表示

        // ボタンのアクティブ状態を変更
        document.getElementById("sort-old").classList.remove("active");
        document.getElementById("sort-new").classList.add("active");
    });
});
