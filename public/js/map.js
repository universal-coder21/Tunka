

mapboxgl.accessToken =mapToken;
  const map = new mapboxgl.Map({
      container: 'map', // container ID
      // style:"mapbox://styles/mapbox/dark-v11",
      center: coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
      zoom: 9 // starting zoom
  });

  // console.log(coordinates);

  const marker = new mapboxgl.Marker({color:"red"})
  .setLngLat(coordinates)
  .setPopup(new mapboxgl.Popup({offset: 25,})
  .setHTML("<h1> Exact location will be provided after booking</h1>"))
  .addTo(map);