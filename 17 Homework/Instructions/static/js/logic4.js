// Grab data urls from Gitlab
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
var tectonicurl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

// d3.json to grab the data
d3.json(queryUrl, function(data) {
  createFeatures(data.features);
});

// All 3 maps from mapbox
function createFeatures(quakedata) {

  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 10,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 10,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  var lightmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 10,
    id: "mapbox.light",
    accessToken: API_KEY
  });

  // create a loop to grab all coordinates and plot them with circles on the map (activity 9 per Mark)
  var circlemarkers = [];

  for (var i = 0; i < quakedata.length; i++) {

    coordinates = [quakedata[i].geometry.coordinates[1],quakedata[i].geometry.coordinates[0]]
    properties = quakedata[i].properties;

    var color = "black";
    if (properties.mag < 1) {
      color = "lime";
    }
    else if (properties.mag < 2) {
      color = "green";
    }
    else if (properties.mag < 3) {
      color = "yellow";
    }
    else if (properties.mag < 4) {
      color = "orange";
    }
    else if (properties.mag < 5) {
      color = "red";
    }
    else {
      color = "black";
    }
// make circles (activity 9 per Mark)
    var markercircles = L.circle(coordinates, {
      stroke: false,
      fillOpacity: .75,
      color: color,
      fillColor: color,
      radius: (properties.mag * 30000)
    }).bindPopup("<h5>" + properties.place + "</h1> <hr> <h3>Magnitude of Earthquake: " + properties.mag + "</h5> ");
    circlemarkers.push(markercircles);
  }

  var earthquakes = L.layerGroup(circlemarkers);
  
  // plot github tectonic plates data
  d3.json(tectonicurl, function(tectonicdata){
    L.geoJson(tectonicdata, {
      color: "orange",
      weight: 2
    })
    .addTo(tectonicplates);
  });
  
var tectonicplates = new L.LayerGroup();

  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap,
    "Light Map": lightmap
  };
  
  var overlayMaps = {
    Earthquakes: earthquakes,
    "Tectonic Plates": tectonicplates
  };
  
  var myMap = L.map("map", {
    center: [
      40.00, -110.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes, tectonicplates]
  });

  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
};

// legend?