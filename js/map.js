//create the empty layers
var dataLayer = L.layerGroup();

//Initialize the leaflet map
var map = L.map('map', {
    center: [39.5,-98.35],
    zoom: 4,
    zoomControl: true,
    dragging: true,
});

// Create additional map panes to fix layering issue
//map.createPane("pane200").style.zIndex = 200; // tile pane
//map.createPane("pane450").style.zIndex = 450; // between overlays and shadows
//map.createPane("pane600").style.zIndex = 600; // marker pane
       
//Create the baselayer and add it to the map
var layer = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.{ext}', {
attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
subdomains: 'abcd',
minZoom: 0,
maxZoom: 20,
ext: 'png'
});
map.addLayer(layer);

//Create the census tract layer from the geojson
$.getJSON("data/data.geojson", function(data) {
    dataLayer = L.geoJson(data, {
    onEachFeature: function (feature, layer){
        dataLayer.addLayer(layer), layer.bindPopup('<b>'+feature.properties.Institution+'</b><br>Timing: '+feature.properties.Timing+'<br>City: '+feature.properties.City+'<br>State: '+feature.properties.State+'<br>Sector: '+feature.properties.Sector)},
    //pane: "pane450",
    weight: 1,
    opacity: 1,
    color: '#fa0000',
    dashArray: '3'
}).addTo(map);
});