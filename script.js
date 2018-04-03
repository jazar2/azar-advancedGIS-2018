// This isn't necessary but it keeps the editor from thinking L and carto are typos
/* global L, carto */

var map = L.map('map').setView([29.418, -98.493628], 14);

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
var source1 = new carto.source.SQL("SELECT * FROM parcel_use_for_carto");

// Create style for the data
var style1 = new carto.style.CartoCSS(`
#layer {
  polygon-fill: ramp([use], (#E58606, #5D69B1, #52BCA3, #99C945, #CC61B0, #24796C, #DAA51B, #2F8AC4, #764E9F, #ED645A, #A5AA99), ("Singlefami", "Retail", "Vacant", "Industrial", "Gov Owned", "Religous", "Multifam", "Medical", "Hotel", "Parking"), "=");
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

//-------------layer 2-----------------//
var source2 = new carto.source.Dataset('s_s');

var style2 = new carto.style.CartoCSS(`
#layer {
  polygon-fill: #00ff11;
  polygon-opacity: 0.9;
}
#layer::outline {
  line-width: 1;
  line-color: #FFFFFF;
  line-opacity: 0.5;
}
#layer::labels {
  text-name: [site_name];
  text-face-name: 'Lato Bold';
  text-size: 12;
  text-fill: #09ff00;
  text-label-position-tolerance: 0;
  text-halo-radius: 2;
  text-halo-fill: #000000;
  text-dy: 0;
  text-allow-overlap: true;
  text-placement: point;
  text-placement-type: dummy;
}
`);

var layer2 = new carto.layer.Layer(source2, style2);

//------------layer 2 close----------------//

//------------layer 3 start----------------//
var source3 = new carto.source.SQL("SELECT * FROM parcel_use_for_carto");

// Create style for the data
var style3 = new carto.style.CartoCSS(`
#layer {
  polygon-fill: transparent;
  opacity: 1;
}

`);
//------------layer 3 close----------------//

// ------------------------------sidebar start------------------------------------------ //
var sidebarLayer = new carto.layer.Layer(source3, style3, {
  featureClickColumns: ['use', 'totval', 'yrblt', 'dba']
});

  
var sidebar = document.querySelector('.sidebar-feature-content');
sidebarLayer.on('featureClicked', function (event) {
  var content = '<h1>' + event.data['use'] + '</h1>'
  content += '<div>2017 Appraisal Value: $' + event.data['totval'] + '';
  content += '<div></br>Year Built: ' + event.data['yrblt'] + ' </div>';
  content += '<div></br>Doing Business as: ' + event.data['dba'] + ' </div>';
  console.log(sidebar, content);
  sidebar.innerHTML = content;
  
  console.log('sidebarLayer change event happened');
});
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
source1.setQuery("SELECT * FROM parcel_use_for_carto WHERE use = '" + parcelUse + "'");  
});
  
// ------------------------------dropdown close------------------------------------------ //


