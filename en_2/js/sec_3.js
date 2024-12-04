let map3;
let map3Initialized = false;
let isLabelingEnabled = false; // 標註模式標記

// 加載保存的標註
let markers = JSON.parse(localStorage.getItem('userMarkers')) || [];
const markerInstances = []; // 地圖上的所有標記實例

// 渲染單個標記
function renderMarker(marker, index) {
  const mapMarker = L.marker([marker.lat, marker.lng])
    .addTo(map3)
    .bindPopup(
      `<b>${marker.name}</b><br>
       Current Nationality: ${marker.nationality || 'Unknown'}<br>
       <button onclick="deleteMarker(${index})">Cancel your label</button>`
    );
  markerInstances.push(mapMarker);
}

// 初始化時渲染所有標記
function renderAllMarkers() {
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
  map3.removeLayer(markerInstances[index]);
  markerInstances.splice(index, 1); // 同步標記實例列表

  markers.splice(index, 1);
  localStorage.setItem('userMarkers', JSON.stringify(markers));
  renderAllMarkers(); // 確保索引一致
};

function initMap3() {
  if (map3Initialized) return;
  map3Initialized = true;

  // 初始化地圖
  map3 = L.map('map3').setView([20, 0], 2);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
  }).addTo(map3);

  // 加載 1800 年的 GeoJSON
  const geojsonUrl = 'data_his/1800.geojson';

  fetch(geojsonUrl)
    .then(response => response.json())
    .then(data => {
      L.geoJSON(data, {
        style: feature => {
          const countryName = feature.properties.NAME || 'Unknown';
          return {
            color: '#000000',
            weight: 1,
            fillColor: generateColor(feature.properties.NAME),
            fillOpacity: 0.7
          };
        },
        onEachFeature: (feature, layer) => {
          // 添加國家名稱彈窗（不影響標註功能）
          if (feature.properties && feature.properties.NAME) {
            layer.bindPopup(`<strong>${feature.properties.NAME}</strong>`);
          }
        }
      }).addTo(map3);
    })
    .catch(error => {
      console.error('無法加載 GeoJSON 數據:', error);
    });

  // 點擊地圖事件，僅在標註模式啟用時有效
  map3.on('click', (e) => {
    if (!isLabelingEnabled) return; // 如果不在標註模式，直接返回

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

  // 按鈕控制標註模式
  const enableMarkerBtn = document.getElementById('enable-marker-btn');
  enableMarkerBtn.addEventListener('click', () => {
    isLabelingEnabled = !isLabelingEnabled; // 切換標註模式
    enableMarkerBtn.textContent = isLabelingEnabled
      ? 'Disable Labeling Mode'
      : 'Enable Labeling Mode'; // 更新按鈕文字
  });
}
