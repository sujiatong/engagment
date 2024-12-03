

// 第二個地圖的初始化

// Mapbox access token and style
const mapboxKey = 'pk.eyJ1IjoibWp1bWJlLXRlc3QiLCJhIjoiY2w3ZTh1NTIxMTgxNTQwcGhmODU2NW5kaSJ9.pBPd19nWO-Gt-vTf1pOHBA';
const mapboxStyle = 'mapbox/light-v11';

// Initialize the map
const map1 = L.map('map1').setView([30, 30], 2);

// Mapbox tile layer with custom style
L.tileLayer(`https://api.mapbox.com/styles/v1/${mapboxStyle}/tiles/{z}/{x}/{y}?access_token=${mapboxKey}`, {
    maxZoom: 10,
    tileSize: 512,
    zoomOffset: -1,
    attribution: '© <a href="https://www.mapbox.com/">Mapbox</a> © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map1);

