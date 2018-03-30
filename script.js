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
// ------------------------------pop-up------------------------------------------ //

var layer1pop = new carto.layer.Layer(source1, style1, {
  featureClickColumns: ['totval', 'use']
});

var layer1Popup = L.popup();
layer1pop.on('featureClicked', function (event) {
  // Create the HTML that will go in the popup. event.data has all the data for 
  // the clicked feature.
  //
  // I will add the content line-by-line here to make it a little easier to read.
  var popContent = '<h1>' + event.data['use'] + '</h1>'
  popContent += '<div>$' + event.data['totval'] + ' appraised value</div>';
  layer1Popup.setContent(popContent);
  
  // Place the popup and open it
 layer1Popup.setLatLng(event.latLng);
 layer1Popup.openOn(map);
  
  console.log('layer1pop change event happened');
});
// ------------------------------pop-up close------------------------------------------ //


// Add the data to the map as a layer
client.addLayers([layer1, layer1pop,layer2]);
client.getLeafletLayer().addTo(map);

// ------------------------------dropdown start------------------------------------------ //

var layer1Picker = document.querySelector('.layer1-picker');

// Step 2: Add an event listener to the dropdown. We will run some code whenever the dropdown changes.
layer1Picker.addEventListener('change', function (e) {
  console.log('layer1Picker change event happened');
  

  // The value of the dropdown is in e.target.value when it changes
  
var parcelUse = e.target.value;
  
// Step 3: Decide on the SQL query to use and set it on the datasource
if (parcelUse === 'all') {
    source1.setQuery("SELECT * FROM parcel_use_for_carto");
  }
if (parcelUse === 'Singlefami') {
    source1.setQuery("SELECT * FROM parcel_use_for_carto WHERE use = 'Singlefami'");
  }
if (parcelUse === 'Retail') {
    source1.setQuery("SELECT * FROM parcel_use_for_carto WHERE use = 'Retail'");
  } 
if (parcelUse === 'Vacant') {
    source1.setQuery("SELECT * FROM parcel_use_for_carto WHERE use = 'Vacant'");
  } 
if (parcelUse === 'Industrial') {
    source1.setQuery("SELECT * FROM parcel_use_for_carto WHERE use = 'Industrial'");
  }  
if (parcelUse === 'Gov Owned') {
    source1.setQuery("SELECT * FROM parcel_use_for_carto WHERE use = 'Gov Owned'");
  }  
if (parcelUse === 'Religous') {
    source1.setQuery("SELECT * FROM parcel_use_for_carto WHERE use = 'Religous'");
  }   
if (parcelUse === 'Multifam') {
    source1.setQuery("SELECT * FROM parcel_use_for_carto WHERE use = 'Multifam'");
  }  
if (parcelUse === 'Medical') {
    source1.setQuery("SELECT * FROM parcel_use_for_carto WHERE use = 'Medical'");
  }   
if (parcelUse === 'Hotel') {
    source1.setQuery("SELECT * FROM parcel_use_for_carto WHERE use = 'Hotel'");
  }
if (parcelUse === 'Parking') {
    source1.setQuery("SELECT * FROM parcel_use_for_carto WHERE use = 'Parking'");
  }   
});
  
// ------------------------------dropdown close------------------------------------------ //


