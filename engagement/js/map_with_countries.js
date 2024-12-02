// 保存所有的國家圖層，用於搜索
let countryLayers = {};

// 加載世界國家邊界的 GeoJSON 文件
fetch('./data/countries.geojson') // 確保文件路徑正確
    .then(response => response.json())
    .then(data => {
        L.geoJSON(data, {
            style: {
                color: "#3388ff", // 邊界顏色
                weight: 1, // 邊界粗細
                fillColor: "#cce5ff", // 填充顏色
                fillOpacity: 0.1 // 填充透明度
            },
            onEachFeature: (feature, layer) => {
                if (feature.properties && feature.properties.ADMIN) {
                    // 保存每個國家的圖層，使用名稱作為鍵
                    countryLayers[feature.properties.ADMIN.toLowerCase()] = layer;
                }
            }
        }).addTo(map); // 確保 map 已初始化
    })
    .catch(error => console.error('Error loading GeoJSON:', error));

// 搜索功能
document.getElementById('search-button').addEventListener('click', () => {
    const searchInput = document.getElementById('station-search').value.toLowerCase();
    const layer = countryLayers[searchInput];

    if (layer) {
        // 縮放到國家範圍
        map.fitBounds(layer.getBounds());
        layer.openPopup(); // 打開該國家的彈窗
    } else {
        alert('Country not found. Please try again.');
    }
});

// 實時搜索建議
document.getElementById('station-search').addEventListener('input', () => {
    const inputValue = document.getElementById('station-search').value.toLowerCase();
    const suggestions = document.getElementById('suggestions');
    suggestions.innerHTML = ''; // 清空建議列表

    // 匹配建議
    if (inputValue) {
        Object.keys(countryLayers)
            .filter(name => name.includes(inputValue))
            .forEach(matchedName => {
                const listItem = document.createElement('li');
                listItem.textContent = matchedName;
                listItem.addEventListener('click', () => {
                    document.getElementById('station-search').value = matchedName;
                    suggestions.innerHTML = ''; // 清空建議列表
                });
                suggestions.appendChild(listItem);
            });
    }
});
