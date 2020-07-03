var map;
var service;
var infowindow;


function initMap() {
  var newYork = new google.maps.LatLng(40.5941732, -73.9443477);

  infowindow = new google.maps.InfoWindow();

  map = new google.maps.Map(document.getElementById("map"), {
    center: newYork,
    zoom: 10,
  });

  document.getElementById("addStart").addEventListener("click", function (e) {
    e.preventDefault();
    let start = document.getElementById("yourLocation").value;
  var request = {
    query: start,
    fields: ["name", "geometry"],
  };

  service = new google.maps.places.PlacesService(map);

  service.findPlaceFromQuery(request, function (results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        createMarker(results[i]);
      }

      map.setCenter(results[0].geometry.location);
    }
  });
  })
  
}

function createMarker(place) {
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location,
  });

  google.maps.event.addListener(marker, "click", function () {
    infowindow.setContent(place.name);
    infowindow.open(map, this);
  });
}


