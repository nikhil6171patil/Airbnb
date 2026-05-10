
 
  let key = mapToken ;
  // Variable with place name
  const myPlaceName = "mumbai";

  const map = L.map('map').setView([0, 0], 2);
  L.tileLayer(`https://api.maptiler.com/maps/streets-v4/{z}/{x}/{y}.png?key=${key}`, {
    tileSize: 512,
    zoomOffset: -1,
    minZoom: 1,
    attribution: "<a href='https://www.maptiler.com/copyright/' target='_blank'>&copy; MapTiler</a> <a href='https://www.openstreetmap.org/copyright' target='_blank'>&copy; OpenStreetMap contributors</a>",
    crossOrigin: true
  }).addTo(map);

  const gc = new maptilerGeocoder.GeocodingControl({ apiKey: key });
  map.addControl(gc);

  let marker;

  // Function to search by place name and drop marker
  async function searchPlace(place) {
    const url = `https://api.maptiler.com/geocoding/${encodeURIComponent(place)}.json?key=${key}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.features && data.features.length > 0) {
      const feature = data.features[0];
      const [lon, lat] = feature.geometry.coordinates;
      const coords = [lat, lon];

      if (marker) {
        map.removeLayer(marker);
      }

      marker = L.marker(coords).addTo(map);
      marker.bindPopup(feature.place_name).openPopup();
      map.setView(coords, 14);
    } else {
      alert("Place not found!");
    }
  }

  // Call once at load with your variable
  searchPlace(myPlaceName);

  // Also update marker when user searches manually
  gc.on('select', function (e) {
    const [lon, lat] = e.feature.geometry.coordinates;
    const coords = [lat, lon];
    if (marker) map.removeLayer(marker);
    marker = L.marker(coords).addTo(map);
    marker.bindPopup(e.feature.place_name).openPopup();
    map.setView(coords, 14);
  });

