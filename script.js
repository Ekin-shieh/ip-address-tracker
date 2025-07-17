let map;

async function getUserLocation() {
  const res = await fetch('https://ipwho.is/')
  const data = await res.json()

  if (data.success) {
    const lat = data.latitude
    const lon = data.longitude

    initMap(lat, lon)
    addMarker(lat, lon)
  } else {
    console.error('Fail to locate IP:', data.message)
  }
}

function initMap(lat, lon) {
  map = L.map('map', {
    zoomControl: false,
    scrollWheelZoom: true,
    dragging: true,
    doubleClickZoom: true,
    touchZoom: true
}).setView([lat, lon], 13)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map)
}

function addMarker(lat, lon) {
  const customIcon = L.icon({
    iconUrl: './images/icon-location.svg',
    iconSize: [40, 50],
    iconAnchor: [20, 50],
  })

  L.marker([lat, lon], { icon: customIcon }).addTo(map)
}

getUserLocation()