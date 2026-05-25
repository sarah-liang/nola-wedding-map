import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import './MapPage.css'

// ── Data ──────────────────────────────────────────────────────────────────────

const VENUES = [
  {
    lat: 29.963782112405575, lng: -90.05763770647313,
    color: '#7b4fa6', pin: '🎉', label: 'Dat Dog',
    emoji: '🌭',
    title: 'Dat Dog on Frenchmen',
    sub: 'Welcome Party · Feb 19 evening',
    body: 'Colorful counter-service joint serving creative gourmet hot dogs with toppings like crawfish étouffée and alligator sausage in a lively Frenchmen Street setting.<br><br><a href="https://maps.google.com/?q=Dat+Dog+601+Frenchmen+St+New+Orleans+LA" target="_blank" rel="noopener" style="color:#7b4fa6;font-size:11px;text-decoration:none;">View on Google Maps →</a>',
  },
  {
    lat: 29.9610929523623, lng: -90.06063171678058,
    color: '#b5272b', pin: '💒', label: 'Ceremony',
    emoji: '⛪',
    title: "St. Mary's Church",
    sub: 'Ceremony · Old Ursuline Museum',
    body: 'The oldest surviving building in the Mississippi Valley — this 1752 French Colonial convent is a National Historic Landmark and the setting for our ceremony.<br><br><em style="color:#9a7c5e;">~11 min walk to reception →</em><br><br><a href="https://maps.google.com/?q=Old+Ursuline+Convent+1100+Chartres+St+New+Orleans+LA" target="_blank" rel="noopener" style="color:#b5272b;font-size:11px;text-decoration:none;">View on Google Maps →</a>',
  },
  {
    lat: 29.9559983642747, lng: -90.0667985462138,
    color: '#d4830a', pin: '🥂', label: "Latrobe's",
    emoji: '🏛️',
    title: "Latrobe's on Royal",
    sub: 'Reception · 403 Royal St',
    body: 'Stately 1821 Greek Revival bank building designed by Benjamin Henry Latrobe, now a sought-after event venue with soaring ceilings and original brick vaults.<br><br><a href="https://maps.google.com/?q=Latrobes+on+Royal+403+Royal+St+New+Orleans+LA" target="_blank" rel="noopener" style="color:#d4830a;font-size:11px;text-decoration:none;">View on Google Maps →</a>',
  },
  {
    lat: 29.9548204002082, lng: -90.06836251401374,
    color: '#2e6fa8', pin: '🏢', label: 'Hotel Mazarin',
    emoji: '🏢',
    title: 'Hotel Mazarin',
    sub: 'Room Block · 730 Bienville St',
    body: 'Our recommended hotel for out-of-town guests, just steps from the French Quarter. Ask about the room block when booking.<br><br><a href="https://maps.google.com/?q=Hotel+Mazarin+730+Bienville+St+New+Orleans+LA" target="_blank" rel="noopener" style="color:#2e6fa8;font-size:11px;text-decoration:none;">View on Google Maps →</a>',
  },
  {
    lat: 29.95838661735729, lng: -90.06529732181706,
    color: '#1a6e2e', pin: '🎺', label: "Pat O'Brien's",
    emoji: '🎶',
    title: "Pat O'Brien's",
    sub: 'Afterparty · 718 St Peter St',
    body: "Legendary bar since 1933 and birthplace of the Hurricane cocktail, famous for dueling pianos, a lush courtyard, and a flaming fountain. We'll second-line straight here from Latrobe's!<br><br><a href=\"https://maps.google.com/?q=Pat+O'Briens+718+St+Peter+St+New+Orleans+LA\" target=\"_blank\" rel=\"noopener\" style=\"color:#1a6e2e;font-size:11px;text-decoration:none;\">View on Google Maps →</a>",
  },
]

const POIS = [
  {
    lat: 29.9575, lng: -90.0629, emoji: '🏛', shortLabel: 'Jackson Square',
    name: 'Jackson Square', sub: 'Landmark · French Quarter',
    body: 'Historic park and National Historic Landmark anchored by St. Louis Cathedral, lined with artists, tarot readers, and street performers.<br><br><a href="https://maps.google.com/?q=Jackson+Square+New+Orleans+LA" target="_blank" rel="noopener" style="color:#c86d1a;font-size:11px;text-decoration:none;">View on Google Maps →</a>',
  },
  {
    lat: 29.9576, lng: -90.0619, emoji: '☕', shortLabel: 'Café du Monde',
    name: 'Café du Monde', sub: 'Café · 800 Decatur St',
    body: 'New Orleans institution serving hot beignets and chicory café au lait since 1862 from its iconic open-air pavilion overlooking the Mississippi.<br><br><a href="https://maps.google.com/?q=Cafe+du+Monde+800+Decatur+St+New+Orleans+LA" target="_blank" rel="noopener" style="color:#c86d1a;font-size:11px;text-decoration:none;">View on Google Maps →</a>',
  },
  {
    lat: 29.9596, lng: -90.0602, emoji: '🛍️', shortLabel: 'French Market',
    name: 'French Market', sub: 'Market · Decatur St',
    body: 'One of the oldest public markets in the US, stretching along the riverfront with local crafts, Creole spices, produce, and street food.<br><br><a href="https://maps.google.com/?q=French+Market+New+Orleans+LA" target="_blank" rel="noopener" style="color:#c86d1a;font-size:11px;text-decoration:none;">View on Google Maps →</a>',
  },
  {
    lat: 29.9584, lng: -90.0656, emoji: '🎷', shortLabel: 'Preservation Hall',
    name: 'Preservation Hall', sub: 'Jazz · 726 St Peter St',
    body: 'Celebrated 1961 music hall where traditional New Orleans jazz is performed nightly in an intentionally bare-bones, standing-room setting.<br><br><a href="https://maps.google.com/?q=Preservation+Hall+726+St+Peter+St+New+Orleans+LA" target="_blank" rel="noopener" style="color:#c86d1a;font-size:11px;text-decoration:none;">View on Google Maps →</a>',
  },
  {
    lat: 29.964176407393857, lng: -90.05768890401362, emoji: '🎸', shortLabel: 'Spotted Cat',
    name: 'Spotted Cat Music Club', sub: 'Live music · 623 Frenchmen St',
    body: 'Weathered bar & intimate jazz venue hosting live acts on a tiny stage for a standing-room crowd.<br><br><a href="https://maps.google.com/?q=Spotted+Cat+Music+Club+623+Frenchmen+St+New+Orleans" target="_blank" rel="noopener" style="color:#c86d1a;font-size:11px;text-decoration:none;">View on Google Maps →</a>',
  },
  {
    lat: 29.95541910492861, lng: -90.06267155983821, emoji: '⚓', shortLabel: 'Steamboat Natchez',
    name: 'Steamboat Natchez', sub: 'River cruise · Toulouse St Wharf',
    body: 'The last authentic steam-powered sternwheel riverboat on the Mississippi, offering daily jazz cruises with views of the New Orleans skyline.<br><br><a href="https://maps.google.com/?q=Steamboat+Natchez+New+Orleans" target="_blank" rel="noopener" style="color:#c86d1a;font-size:11px;text-decoration:none;">View on Google Maps →</a>',
  },
]

const PARKING = [
  {
    lat: 29.95595473903992, lng: -90.06802925475156,
    emoji: '🅿️', shortLabel: 'Parking P0149',
    name: 'Premium Parking P149', sub: "Closest to Latrobe's",
    body: "Covered lot — the closest parking option to Latrobe's on Royal. Reserve in advance online.<br><br><a href=\"https://maps.app.goo.gl/ygPu2cDXb3pdVubp9\" target=\"_blank\" rel=\"noopener\" style=\"color:#2e6fa8;font-size:11px;text-decoration:none;\">View on Google Maps →</a>",
  },
  {
    lat: 29.957747764765408, lng: -90.06148328979478,
    emoji: '🅿️', shortLabel: 'Parking P0407',
    name: 'Premium Parking P407', sub: 'Near the French Quarter',
    body: 'Convenient lot near the heart of the French Quarter — a good middle-ground option between venues. Reserve in advance online.<br><br><a href="https://www.premiumparking.com/checkout/P407?parking_time_type=reservation&starts=1778360400&ends=1778389200" target="_blank" rel="noopener" style="color:#2e6fa8;font-size:11px;text-decoration:none;">Reserve on Premium Parking →</a>',
  },
  {
    lat: 29.955761860044404, lng: -90.06819663674855,
    emoji: '🚗', shortLabel: 'Royal Sonesta Valet',
    name: 'Royal Sonesta Valet', sub: 'Valet Parking',
    body: 'Valet parking at the Royal Sonesta Hotel, conveniently located near the reception.<br><br><a href="https://maps.app.goo.gl/87ryyzLn3RG9YetQ9" target="_blank" rel="noopener" style="color:#2e6fa8;font-size:11px;text-decoration:none;">View on Google Maps →</a>',
  },
]

// ── Icon helpers ──────────────────────────────────────────────────────────────

function makePin(color, emoji, label, r = 22) {
  const w = Math.max(r * 2 + 4, label.length * 7 + 16)
  const h = r * 2 + 28
  const cx = w / 2, cy = r + 2
  const id = `wc-${label.replace(/\s/g, '')}`
  return L.divIcon({
    className: '',
    iconSize: [w, h],
    iconAnchor: [w / 2, cy],
    html: `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="${id}"><feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="1.4" xChannelSelector="R" yChannelSelector="G"/></filter>
      </defs>
      <ellipse cx="${cx + 1}" cy="${cy * 2 - 1}" rx="${r * 0.7}" ry="${r * 0.18}" fill="rgba(0,0,0,0.13)"/>
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}" opacity="0.92" filter="url(#${id})"/>
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="1.5"/>
      <text x="${cx}" y="${cy + r * 0.38}" text-anchor="middle" font-size="${r * 0.9}" font-family="serif">${emoji}</text>
      <rect x="1" y="${cy + r + 4}" width="${w - 2}" height="17" rx="4" fill="rgba(255,250,242,0.93)" stroke="${color}" stroke-width="0.8"/>
      <text x="${cx}" y="${cy + r + 15.5}" text-anchor="middle" font-size="9.5" font-family="Georgia,serif" fill="${color}" font-weight="700" letter-spacing="0.02em">${label}</text>
    </svg>`,
  })
}

function makePOI(emoji, label) {
  const w = Math.max(34, label.length * 7 + 16)
  const cx = w / 2
  return L.divIcon({
    className: '',
    iconSize: [w, 45],
    iconAnchor: [cx, 14],
    html: `<svg width="${w}" height="45" viewBox="0 0 ${w} 45" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="${cx}" cy="14" rx="13" ry="13" fill="#f5e8c8" opacity="0.92" stroke="#b49050" stroke-width="1"/>
      <text x="${cx}" y="19" text-anchor="middle" font-size="13" font-family="serif">${emoji}</text>
      <rect x="1" y="28" width="${w - 2}" height="15" rx="3" fill="rgba(255,250,242,0.9)" stroke="#b49050" stroke-width="0.6"/>
      <text x="${cx}" y="39" text-anchor="middle" font-size="8.5" font-family="Georgia,serif" fill="#7a5c2e" font-weight="700">${label}</text>
    </svg>`,
  })
}

function makeParkingIcon(emoji) {
  return L.divIcon({
    className: '',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    html: `<svg width="30" height="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="15" cy="15" rx="14" ry="14" fill="#f5e8c8" opacity="0.92" stroke="#b49050" stroke-width="1"/>
      <text x="15" y="20" text-anchor="middle" font-size="14" font-family="serif">${emoji}</text>
    </svg>`,
  })
}

function addRouteLabel(map, latlngs, text, borderColor, textColor, posOverride) {
  const mid = posOverride ?? latlngs[Math.floor(latlngs.length / 2)]
  L.marker(mid, {
    icon: L.divIcon({
      className: '',
      iconSize: [0, 0],
      iconAnchor: [0, 0],
      html: `<div style="
        display:inline-block;
        transform:translate(-50%,-50%);
        background:rgba(255,252,247,0.92);
        border:0.5px solid ${borderColor};
        border-radius:8px;
        padding:2px 8px;
        font-family:Georgia,serif;
        font-size:10px;
        color:${textColor};
        white-space:nowrap;
      ">${text}</div>`,
    }),
    interactive: false,
    zIndexOffset: 50,
  }).addTo(map)
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function MapPage() {
  const mapContainerRef = useRef(null)
  const mapRef = useRef(null)
  const poiMarkersRef = useRef([])
  const parkingMarkersRef = useRef([])

  const [infoPanel, setInfoPanel] = useState(null)
  const [poisVisible, setPoisVisible] = useState(false)
  const [parkingVisible, setParkingVisible] = useState(true)
  const [titleCardVisible, setTitleCardVisible] = useState(true)
  const [legendOpen, setLegendOpen] = useState(true)

  // Initialize map once
  useEffect(() => {
    if (mapRef.current) return

    const STADIA_KEY = import.meta.env.VITE_STADIA_KEY

    const isMobile = window.innerWidth < 640
    const map = L.map(mapContainerRef.current, {
      center: isMobile ? [29.9558, -90.0630] : [29.9591, -90.0621],
      zoom: isMobile ? 15 : 16,
      zoomControl: true,
    })
    mapRef.current = map

    L.tileLayer(
      `https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg?api_key=${STADIA_KEY}`,
      {
        attribution:
          'Map tiles by <a href="https://stamen.com">Stamen Design</a>, ' +
          'under <a href="https://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. ' +
          'Data &copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors. ' +
          'Hosting by <a href="https://stadiamaps.com">Stadia Maps</a>.',
        maxZoom: 18,
        minZoom: 13,
      },
    ).addTo(map)

    L.tileLayer(
      `https://tiles.stadiamaps.com/tiles/stamen_toner_labels/{z}/{x}/{y}.png?api_key=${STADIA_KEY}`,
      { attribution: '', maxZoom: 18, minZoom: 13, opacity: 0.45 },
    ).addTo(map)

    // Venue markers
    VENUES.forEach((v) => {
      const marker = L.marker([v.lat, v.lng], { icon: makePin(v.color, v.pin, v.label) }).addTo(map)
      marker.on('click', () => setInfoPanel({ emoji: v.emoji, title: v.title, sub: v.sub, body: v.body }))
    })

    // POI markers (hidden initially)
    POIS.forEach((p) => {
      const marker = L.marker([p.lat, p.lng], { icon: makePOI(p.emoji, p.shortLabel) })
      marker.on('click', () => setInfoPanel({ emoji: p.emoji, title: p.name, sub: p.sub, body: p.body }))
      poiMarkersRef.current.push(marker)
    })

    // Parking markers (visible initially)
    PARKING.forEach((p) => {
      const marker = L.marker([p.lat, p.lng], { icon: makeParkingIcon(p.emoji) }).addTo(map)
      marker.on('click', () => setInfoPanel({ emoji: p.emoji, title: p.name, sub: p.sub, body: p.body }))
      parkingMarkersRef.current.push(marker)
    })

    // Routes
    fetch('routes.json')
      .then((r) => r.json())
      .then(({ walkRoute, walkMins, secondLineRoute }) => {
        L.polyline(walkRoute, {
          color: '#c86d1a', weight: 3.5, opacity: 0.88, lineCap: 'round', lineJoin: 'round',
        }).addTo(map)
        addRouteLabel(map, walkRoute, `~${walkMins ?? 11} min walk to reception`, '#c86d1a', '#7a4010', walkRoute[2])

        L.polyline(secondLineRoute, {
          color: '#2563a8', weight: 3.5, opacity: 0.85, dashArray: '9 6', lineCap: 'round',
        }).addTo(map)
        addRouteLabel(map, secondLineRoute, '🎺 Second line!', '#2563a8', '#1a3e6e', [29.957019, -90.067071])
      })
      .catch(() => console.warn('routes.json not found — run: node fetch-routes.mjs'))

    return () => {
      map.remove()
      mapRef.current = null
      poiMarkersRef.current = []
      parkingMarkersRef.current = []
    }
  }, [])

  // Sync POI visibility
  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    poiMarkersRef.current.forEach((m) => (poisVisible ? m.addTo(map) : m.remove()))
    if (!poisVisible) setInfoPanel(null)
  }, [poisVisible])

  // Sync parking visibility
  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    parkingMarkersRef.current.forEach((m) => (parkingVisible ? m.addTo(map) : m.remove()))
    if (!parkingVisible) setInfoPanel(null)
  }, [parkingVisible])

  return (
    <div className="map-root">
      <div ref={mapContainerRef} className="map-div" />

      {/* Title card */}
      {titleCardVisible && (
        <div className="map-card title-card">
          <div className="title-card-inner">
            <div>
              <div className="title-card-name">Sarah & Brandon's Wedding</div>
              <div className="title-card-date">New Orleans · February 2027</div>
              <Link to="/" className="title-card-home">← Back to our site</Link>
            </div>
            <button className="title-card-close" onClick={() => setTitleCardVisible(false)}>✕</button>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className={`map-card legend ${legendOpen ? 'legend--open' : 'legend--closed'}`}>
        <button className="legend-mobile-toggle" onClick={() => setLegendOpen((v) => !v)}>
          <span>Map Legend</span>
          <span className="legend-chevron-wrap">
            <span className="legend-chevron-label">{legendOpen ? 'collapse' : 'expand'}</span>
            <span className="legend-chevron">{legendOpen ? '▾' : '▴'}</span>
          </span>
        </button>
        <div className="legend-body">
          <h2 className="legend-heading">February 19, 2027</h2>
          <div className="legend-item">
            <span className="legend-dot" style={{ background: '#7b4fa6' }} />
            Welcome Party · Dat Dog Frenchmen
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ background: '#2e6fa8' }} />
            Hotel Mazarin · Room Block
          </div>

          <hr className="legend-divider" />
          <h2 className="legend-heading">February 20, 2027</h2>

          <div className="legend-item">
            <span className="legend-dot" style={{ background: '#b5272b' }} />
            Ceremony · St. Mary's Church
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ background: '#d4830a' }} />
            Reception · Latrobe's on Royal
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ background: '#1a6e2e' }} />
            Afterparty · Pat O'Brien's
          </div>

          <hr className="legend-divider" />
          <div className="legend-item">
            <span className="legend-line" style={{ background: '#c86d1a' }} />
            Walk from ceremony (~11 min)
          </div>
          <div className="legend-item">
            <span className="legend-line-dashed" />
            Second-line to Pat O's 🎺
          </div>

          <hr className="legend-divider" />
          <div className="legend-toggle" onClick={() => setPoisVisible((v) => !v)}>
            <div className={`toggle-pill ${poisVisible ? 'toggle-pill--on' : 'toggle-pill--off'}`} />
            Show points of interest
          </div>
          <div className="legend-toggle" onClick={() => setParkingVisible((v) => !v)}>
            <div className={`toggle-pill ${parkingVisible ? 'toggle-pill--on' : 'toggle-pill--off'}`} />
            Show parking recommendations
          </div>
        </div>
      </div>

      {/* Info panel */}
      {infoPanel && (
        <div className="map-card info-panel">
          <div className="info-panel-emoji">{infoPanel.emoji}</div>
          <div className="info-panel-title">{infoPanel.title}</div>
          <div className="info-panel-sub">{infoPanel.sub}</div>
          <div
            className="info-panel-body"
            dangerouslySetInnerHTML={{ __html: infoPanel.body }}
          />
          <button className="info-panel-close" onClick={() => setInfoPanel(null)}>
            ✕ close
          </button>
        </div>
      )}
    </div>
  )
}
