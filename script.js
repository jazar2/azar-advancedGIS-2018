// This isn't necessary but it keeps the editor from thinking L and carto are typos
/* global L, carto, reqwest */

var map = L.map('map').setView([29.418, -98.502], 14);

// Add base layer
L.tileLayer('https://api.mapbox.com/styles/v1/jazar2/cj9ps88o218of2slnuwi12h24/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiamF6YXIyIiwiYSI6ImNqOWcyNHl4cjJzOTIycXA5aDduamk2M24ifQ.7qxtJVMsfvQjTIt8-KbVrg', {
  maxZoom: 18
}).addTo(map);

// Initialize Carto
var client = new carto.Client({
  apiKey: 'ce7c8928afb5ce71a8b39779ee55f9f32a8cff9f',
  username: 'jazar2'
});
//-------------layer 1-----------------//
// Initialze source data
var source1 = new carto.source.SQL("SELECT * FROM parcelforcarto");

// Create style for the data
var style1 = new carto.style.CartoCSS(`
#layer {
  polygon-fill: ramp([use], (#E58606, #5D69B1, #52BCA3, #99C945, #CC61B0, #24796C, #DAA51B, #2F8AC4, #764E9F, #ED645A, #A5AA99), ("Single Family", "Retail", "Vacant", "Industrial", "Gov Owned", "Religous", "Multifam", "Medical", "Hotel", "Parking"), "=");
  opacity: .9;
  polygon-comp-op: multiply;
}
#layer::outline {
  line-width: 1;
  line-color: #FFFFFF;
  line-opacity: 0.5;
}
`);
// Add style to the data
var layer1 = new carto.layer.Layer(source1, style1);
//-------------layer 1 close-----------------//


//------------layer 2 start----------------//
var source2 = new carto.source.SQL("SELECT * FROM parcelforcarto");

// Create style for the data
var style2 = new carto.style.CartoCSS(`
#layer {
  polygon-fill: transparent;
  opacity: 1;
}

`);
var layer2 = new carto.layer.Layer(source2,style2)
//------------layer 2 close----------------//


// ------------------------------sidebar start------------------------------------------ //
var sidebarLayer = new carto.layer.Layer(source2, style2, {
  featureClickColumns: ['use', 'totval', 'yrblt', 'dba', 'totval']
});

var sidebar = document.querySelector('.sidebar-feature-content');
sidebarLayer.on('featureClicked', function (event) {
  var content = '<h1>' + event.data['use'] + '</h1>'
  
  if (event.data['totval']!= null) {
  content += '<div>2017 Appraisal Value: $' + event.data['totval'] + '';} 
  
  if (event.data['yrblt']!= null) {
  content += '<div></br>Year Built: ' + event.data['yrblt'] + ' </div>';}
  
  if (event.data['dba']!= null) {
  content += '<div></br>Doing Business as: ' + event.data['dba'] + ' </div>';}
  
  // --------------SQL FOR AVERAGE HOME VALUE------------ //

  console.log(sidebar, content);
  
  sidebar.innerHTML = content;
  console.log('sidebarLayer change event happened');
  
  
  //-------------streetview start----------------//
  // Select the <img> tag that will hold our streetview image. This needs to exist in the HTML and is styled a bit in the CSS
  var sidebarStreetview = document.querySelector('.sidebar-streetview');
  var apiKey = 'AIzaSyCbTjkvjOf_xaj76wfKTqeMQM5g6hTOerQ';
  console.log(event.latLng);
  
  // Build the URL for the streetview image, including lat, lng, and API key
  var imageUrl = 'https://maps.googleapis.com/maps/api/streetview?size=400x400&location=' + event.latLng.lat + ',' + event.latLng.lng + '&key=' + apiKey;
  sidebarStreetview.src = imageUrl;
   console.log(imageUrl);
  
  
  // Log out the image URL here--the URL it puts in the console should work fine if you put it in your browser
});
  //-------------streetview close----------------//



// ------------------------------sidebar close------------------------------------------ //

// Add the data to the map as a layer
client.addLayers([layer1, sidebarLayer, layer2]);
client.getLeafletLayer().addTo(map);

// ------------------------------dropdown start------------------------------------------ //

var layer1Picker = document.querySelector('.layer1-picker');

// Step 2: Add an event listener to the dropdown. We will run some code whenever the dropdown changes.
layer1Picker.addEventListener('change', function (e) {
  console.log('layer1Picker change event happened');
  
  // The value of the dropdown is in e.target.value when it changes
  
var parcelUse = e.target.value;  
source1.setQuery("SELECT * FROM parcelforcarto WHERE use = '" + parcelUse + "'");  
});
  
// ------------------------------dropdown close------------------------------------------ //

// ------------------------------ Checkbox Start ----------------------------------------- //


// ------------------------------ Checkbox Close ----------------------------------------- //


//--------------------------------radius click start--------------------------------------//

var radiusClick = new carto.layer.Layer(source1, style1);

client.addLayer(radiusClick);
client.getLeafletLayer().addTo(map);

map.on('click', function (e) {
  console.log(e.latlng); 
  
var sql = 'SELECT * FROM parcelforcarto WHERE ST_Intersects(ST_Transform(the_geom, 2263), ST_Buffer(ST_Transform(CDB_LatLng(' + e.latlng.lat + ',' + e.latlng.lng + '), 2263),1320))';
  console.log(sql);
  
  source1.setQuery(sql);
  
var countSql = 'SELECT AVG(totval) FROM parcelforcarto WHERE ST_Intersects(ST_Transform(the_geom, 2263), ST_Buffer(ST_Transform(CDB_LatLng(' + e.latlng.lat + ',' + e.latlng.lng + '), 2263),1320))';
reqwest('https://jazar2.carto.com/api/v2/sql/?q=' + countSql, function (response) {
    // All of the data returned is in the response variable
    console.log(response);

  });
});

//---------------------------radius click end-------------------//

