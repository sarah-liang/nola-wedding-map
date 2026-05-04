// fetch-routes.mjs
// Run once: node fetch-routes.mjs
// Fetches street-snapped walking routes via Stadia Maps (Valhalla) and writes routes.json.
//
// Coordinates are manually verified street-facing points. Nominatim placed Latrobe's
// on Burgundy St (3 blocks off) and the ceremony inside the Ursuline Convent grounds,
// causing OSRM to loop through the Marigny. These coords sit on public street corners.

import { writeFileSync } from 'fs';

const STADIA_KEY = '471886bd-71ee-4e1d-8e5b-f8bcce511f12';

const COORDS = {
  ceremony:   { lat: 29.9610929523623,   lng: -90.06063171678058 }, // St. Mary's Church
  reception:  { lat: 29.9559983642747,   lng: -90.0667985462138  }, // Latrobe's on Royal
  afterparty: { lat: 29.95838661735729,  lng: -90.06529732181706  }, // Pat O'Brien's
  welcome:    { lat: 29.963782112405575, lng: -90.05763770647313  }, // Dat Dog on Frenchmen
  jackson:    { lat: 29.9575,  lng: -90.0629 }, // Jackson Square
  cafedumond: { lat: 29.9576,  lng: -90.0619 }, // Café du Monde
};

// Decode Valhalla's 6-digit precision encoded polyline → [[lat, lng], ...]
function decodePolyline(encoded) {
  const coords = [];
  let index = 0, lat = 0, lng = 0;
  while (index < encoded.length) {
    let b, shift = 0, result = 0;
    do { b = encoded.charCodeAt(index++) - 63; result |= (b & 0x1f) << shift; shift += 5; } while (b >= 0x20);
    lat += (result & 1) ? ~(result >> 1) : (result >> 1);

    shift = 0; result = 0;
    do { b = encoded.charCodeAt(index++) - 63; result |= (b & 0x1f) << shift; shift += 5; } while (b >= 0x20);
    lng += (result & 1) ? ~(result >> 1) : (result >> 1);

    coords.push([lat / 1e6, lng / 1e6]);
  }
  return coords;
}

// via: optional array of { lat, lng } through-points to force a specific corridor
async function getWalkingRoute(from, to, via = []) {
  const locations = [
    { lat: from.lat, lon: from.lng, type: 'break' },
    ...via.map(p => ({ lat: p.lat, lon: p.lng, type: 'through' })),
    { lat: to.lat,   lon: to.lng,   type: 'break' },
  ];
  const res = await fetch(`https://api.stadiamaps.com/route/v1?api_key=${STADIA_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ locations, costing: 'pedestrian' }),
  });
  const data = await res.json();
  if (!data.trip) throw new Error(`Routing error: ${JSON.stringify(data)}`);
  // Collect all leg shapes (via points split into multiple legs)
  const waypoints = data.trip.legs.flatMap(leg => decodePolyline(leg.shape));
  const secs = data.trip.summary.time;
  const mins = Math.round(secs / 60);
  return { waypoints, mins };
}

console.log('Fetching walk route (ceremony → reception)...');
const walk = await getWalkingRoute(COORDS.ceremony, COORDS.reception);
console.log(`  ${walk.waypoints.length} waypoints, ~${walk.mins} min`);

console.log('Fetching second-line route (reception → afterparty)...');
const secondLine = await getWalkingRoute(COORDS.reception, COORDS.afterparty, [
  { lat: 29.956423223570628, lng: -90.06617380134989  }, // Royal & St Louis
  { lat: 29.957065493544754, lng: -90.06707374265673  }, // St Louis & Bourbon
  { lat: 29.958688414301594, lng: -90.0656622975491   }, // Bourbon & St Peter
]);
console.log(`  ${secondLine.waypoints.length} waypoints, ~${secondLine.mins} min`);

const output = {
  coords:          COORDS,
  walkRoute:       walk.waypoints,
  walkMins:        walk.mins,
  secondLineRoute: secondLine.waypoints,
  secondLineMins:  secondLine.mins,
};
writeFileSync('routes.json', JSON.stringify(output, null, 2));
console.log('\nWrote routes.json ✓');
