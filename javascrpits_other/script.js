// 初始化地图
const map = L.map('map').setView([20, 0], 1);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 7
}).addTo(map);

// 当前 GeoJSON 图层变量
let geojsonLayer;

// 生成唯一颜色的函数
function generateColor(name) {
    if (!name) return '#cccccc'; // 如果没有国家名，使用默认颜色
    const hash = [...name].reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const hue = hash % 360; // 生成 0-359 的色调
    return `hsl(${hue}, 70%, 60%)`; // 使用 HSL 颜色空间生成颜色
}

// 加载 GeoJSON 的函数
function loadGeoJSON(year) {
    // 移除现有图层
    if (geojsonLayer) {
        map.removeLayer(geojsonLayer);
    }

    // 动态加载 GeoJSON 文件
    fetch(`data/${year}.geojson`)
        .then(response => {
            if (!response.ok) throw new Error(`Failed to load GeoJSON for year: ${year}`);
            return response.json();
        })
        .then(data => {
            // 添加新的 GeoJSON 图层
            geojsonLayer = L.geoJSON(data, {
                style: feature => ({
                    color: "#000000", // 边界颜色
                    weight: 1,
                    fillColor: generateColor(feature.properties.NAME), // 每个国家的填充颜色
                    fillOpacity: 0.7
                }),
                onEachFeature: (feature, layer) => {
                    if (feature.properties && feature.properties.NAME) {
                        layer.bindPopup(`<strong>Country:</strong> ${feature.properties.NAME}`);
                    } else {
                        layer.bindPopup(`<strong>Country:</strong> Unknown`);
                    }
                }
            }).addTo(map);

            // 自动缩放到图层范围
            map.fitBounds(geojsonLayer.getBounds());
        })
        .catch(error => {
            console.error('Error loading GeoJSON:', error);
            alert(`Error: Could not load GeoJSON for year ${year}.`);
        });
}

// 初始化加载第一个时间段
loadGeoJSON('1800');

// 添加事件监听到下拉菜单
document.getElementById('time-period').addEventListener('change', (event) => {
    const selectedYear = event.target.value;
    loadGeoJSON(selectedYear);
});
