// 初始化地圖
const map = L.map('map').setView([20, 0], 2); // 世界地圖初始位置

// 添加地圖瓦片層
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// 加載保存的標註
let markers = JSON.parse(localStorage.getItem('userMarkers')) || [];

// 地圖上的所有標記實例
const markerInstances = [];

// 渲染單個標記
function renderMarker(marker, index) {
    const mapMarker = L.marker([marker.lat, marker.lng])
        .addTo(map)
        .bindPopup(
            `<b>${marker.name}</b><br>來自: ${marker.location}<br>
             <button onclick="deleteMarker(${index})">刪除標記</button>`
        );
    markerInstances.push(mapMarker); // 保存到實例列表
}

// 初始化時渲染所有標記
function renderAllMarkers() {
    // 確保清理地圖上的舊標記
    markerInstances.forEach(instance => map.removeLayer(instance));
    markerInstances.length = 0; // 清空實例列表

    markers.forEach((marker, index) => {
        renderMarker(marker, index);
    });
}

// 添加新標記
function addMarker(lat, lng, name, location) {
    const newMarker = { lat, lng, name, location };
    markers.push(newMarker);
    localStorage.setItem('userMarkers', JSON.stringify(markers));
    renderMarker(newMarker, markers.length - 1);
}

// 刪除標記
window.deleteMarker = function (index) {
    // 從地圖移除標記
    map.removeLayer(markerInstances[index]);
    markerInstances.splice(index, 1); // 同步標記實例列表

    // 從數據中移除
    markers.splice(index, 1);
    localStorage.setItem('userMarkers', JSON.stringify(markers));

    // 重新渲染，以確保數據和索引一致
    renderAllMarkers();
};

// 點擊地圖以添加新標註
map.on('click', (e) => {
    const lat = e.latlng.lat;
    const lng = e.latlng.lng;

    // 提示用戶輸入姓名和地點名稱
    const userName = prompt("請輸入你的名字：");
    if (!userName) return;

    const locationName = prompt("請輸入你的位置名稱：");
    if (!locationName) return;

    // 添加標記
    addMarker(lat, lng, userName, locationName);
});

// 初始化時渲染所有標記
renderAllMarkers();
