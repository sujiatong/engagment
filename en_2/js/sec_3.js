let map3;
let map3Initialized = false;
let enableLabeling = false; // 控制標籤功能的開關

// 加載保存的標註
let markers = JSON.parse(localStorage.getItem('userMarkers')) || [];

// 地圖上的所有標記實例
const markerInstances = [];

// 渲染單個標記
function renderMarker(marker, index) {
  const mapMarker = L.marker([marker.lat, marker.lng])
    .addTo(map3)
    .bindPopup(
      `<b>${marker.name}</b><br>
       Current Nationality: ${marker.nationality || 'Unknown'}<br>
       <button onclick="deleteMarker(${index})">Cancel your label</button>`
    );
  markerInstances.push(mapMarker); // 保存到實例列表
}

// 初始化時渲染所有標記
function renderAllMarkers() {
  // 確保清理地圖上的舊標記
  markerInstances.forEach(instance => map3.removeLayer(instance));
  markerInstances.length = 0; // 清空實例列表

  markers.forEach((marker, index) => {
    renderMarker(marker, index);
  });
}

// 添加新標記
function addMarker(lat, lng, name, nationality) {
  const newMarker = { lat, lng, name, nationality };
  markers.push(newMarker);
  localStorage.setItem('userMarkers', JSON.stringify(markers));
  renderMarker(newMarker, markers.length - 1);
}

// 刪除標記
window.deleteMarker = function (index) {
  // 從地圖移除標記
  map3.removeLayer(markerInstances[index]);
  markerInstances.splice(index, 1); // 同步標記實例列表

  // 從數據中移除
  markers.splice(index, 1);
  localStorage.setItem('userMarkers', JSON.stringify(markers));

  // 重新渲染，以確保數據和索引一致
  renderAllMarkers();
};

// 初始化地圖
function initMap3() {
  if (map3Initialized) return; // 防止重複初始化
  map3Initialized = true;

  // 初始化地圖
  map3 = L.map('map3').setView([20, 0], 2); // 世界中心

  // 添加 OpenStreetMap 圖層
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
  }).addTo(map3);

  // 加載 1800 年的 GeoJSON
  const geojsonUrl = 'data_his/1800.geojson'; // 替換為正確的 GeoJSON 文件路徑

  fetch(geojsonUrl)
    .then(response => response.json())
    .then(data => {
      // 加載 GeoJSON 到地圖
      L.geoJSON(data, {
        style: feature => {
          const countryName = feature.properties.NAME || 'Unknown';
          return {
            color: '#000000', // 邊框顏色
            weight: 1, // 邊框粗細
            fillColor: generateColor(feature.properties.NAME), // 使用之前的 generateColor 函數
            fillOpacity: 0.7 // 填充透明度
          };
        },
        onEachFeature: (feature, layer) => {
          // 為每個國家添加彈窗
          if (feature.properties && feature.properties.NAME) {
            layer.bindPopup(`<strong>${feature.properties.NAME}</strong>`);
          }else {
            layer.bindPopup(`</strong> Unknown`);
        }
        }
      }).addTo(map3);
    })
    .catch(error => {
      console.error('無法加載 GeoJSON 數據:', error);
    });

  // 點擊地圖時的標註功能
  map3.on('click', (e) => {
    if (!enableLabeling) return; // 如果標籤功能未啟動，直接返回

    const lat = e.latlng.lat;
    const lng = e.latlng.lng;

    // 提示用戶輸入姓名
    const userName = prompt("Please insert your name:");
    if (!userName) return;

    // 提示用戶輸入當前國籍
    const nationality = prompt("Please insert your current nationality:");
    if (!nationality) return;

    // 添加標記
    addMarker(lat, lng, userName, nationality);
  });

  // 初始化時渲染所有標記
  renderAllMarkers();
}

// 切換標籤功能
function toggleLabeling() {
  enableLabeling = !enableLabeling;
  const button = document.getElementById('toggle-labeling');
  button.textContent = enableLabeling ? 'Disable Labeling' : 'Enable Labeling';
}
