let map
let marker

// 更新页面信息显示区域
function updateInfo({ ip, location, timezone, isp }) {
  document.getElementById('ip').textContent = ip
  document.getElementById('location').textContent = location
  document.getElementById('timezone').textContent = timezone
  document.getElementById('isp').textContent = isp || 'N/A'
}

// 更新地图（初始化或更新视图和标记点）
function updateMap(lat, lon) {
  if (!map) {
    map = L.map('map', {
      zoomControl: false,
      scrollWheelZoom: true,
      dragging: true,
      doubleClickZoom: true,
      touchZoom: true,
    }).setView([lat, lon], 13)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map)
  } else {
    map.setView([lat, lon], 13)
  }

  if (marker) map.removeLayer(marker)

  const customIcon = L.icon({
    iconUrl: './images/icon-location.svg',
    iconSize: [40, 50],
    iconAnchor: [20, 50],
  })

  marker = L.marker([lat, lon], { icon: customIcon }).addTo(map)
}

async function fetchIPData(ip = '') {
  try {
    const url = `https://api.ipapi.is/?ip=${ip}`
    const res = await fetch(url)
    const re = await res.json()

    if (!re || !re.location) throw new Error('Invalid response')

    updateInfo({
      ip: re.ip,
      location: `${re.location.city}, ${re.location.continent} ${re.location.zip}`,
      timezone: `${re.location.country_code} ${extractUTCOffset(re.location.local_time)}`,
      isp: re.company.name || 'N/A',
    })
    updateMap(re.location.latitude, re.location.longitude)
  } catch (error) {
    console.error('False location, use the default IP', error)
    useDefaultLocation()
  }
}

function extractUTCOffset(localTimeStr) {
  const match = localTimeStr.match(/([+-]\d{2}:\d{2})$/)
  return match ? `${match[1]}` : ''
}

function useDefaultLocation() {
  const fallback = {
    ip: '192.212.174.101',
    location: 'Brooklyn, NY 10001',
    timezone: 'UTC -05:00',
    isp: 'SpaceX Starlink',
    lat: 40.650002,
    lon: -73.949997,
  }

  updateInfo({
    ip: fallback.ip,
    location: fallback.location,
    timezone: fallback.timezone,
    isp: fallback.isp,
  })
  updateMap(fallback.lat, fallback.lon)
}

document.getElementById('form').addEventListener('submit', (e) => {
  e.preventDefault()
  const input = document.getElementById('ip-input').value.trim()
  if (input) {
    fetchIPData(input)
  }
})

fetchIPData()