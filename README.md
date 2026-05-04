# 🎺 NOLA Wedding Map

## Regenerating route data

Run the fetch script to pull fresh coordinates and street-snapped routes from Nominatim/OSRM:

```bash
node fetch-routes.mjs
```

This writes `routes.json`, which `index.html` loads at startup.


Interactive watercolor map for our New Orleans wedding — **February 20, 2027**.

Built with [Leaflet.js](https://leafletjs.com/) and [Stamen Watercolor tiles](https://stamen.com/open-source/watercolor/).

## Venues

| Pin | Venue | Event |
|-----|-------|-------|
| 🎉 | Dat Dog on Frenchmen St | Welcome Party |
| 💒 | St. Mary's Church / Old Ursuline Museum | Ceremony |
| 🥂 | Latrobe's on Royal | Reception |
| 🎺 | Pat O'Brien's | Afterparty |

Routes:
- **Orange solid line** — ~12 min walk from ceremony to reception
- **Blue dashed line** — second-line parade route from Latrobe's to Pat O'Brien's 🎺

## Usage

### Local dev

Just open `index.html` directly in a browser — no build step needed.

```bash
# Or use any static server, e.g.:
npx serve .
python3 -m http.server 8080
```

### Embed in Zola (iframe)

Host `index.html` on any static host (Netlify, GitHub Pages, Vercel), then embed:

```html
<iframe
  src="https://your-domain.com/nola-wedding-map/"
  width="100%"
  height="600"
  style="border:none;border-radius:12px;"
  title="Wedding Map"
></iframe>
```

## Customization

All venue data lives in the `VENUES` array in `index.html`. Each entry has:
- `lat` / `lng` — coordinates
- `color` — pin color (hex)
- `pin` — emoji shown on the pin
- `title`, `sub`, `body` — info panel content

Route waypoints are in `WALK_CEREMONY_TO_RECEPTION` and `SECOND_LINE` arrays.

## Tile providers

Currently using **Stamen Watercolor** (no API key required):
```
https://tiles.stamen.com/watercolor/{z}/{x}/{y}.jpg
https://tiles.stamen.com/toner-labels/{z}/{x}/{y}.png
```

To swap to Stadia (requires API key), replace the tile URLs with:
```
https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg?api_key=YOUR_KEY
```
