var infowindow;
var google;
var document;
var map;


function initMap() {
  var newYork = new google.maps.LatLng(40.5941732, -73.9443477);

  infowindow = new google.maps.InfoWindow();

  map = new google.maps.Map(document.getElementById("map"), {
    center: newYork,
    zoom: 10,
  });
}



