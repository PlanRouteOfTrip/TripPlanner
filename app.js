var google;
let points = [];
let pointsNameOnly = [];
let startPoint

// pressing of the button to add a place to the list 
document.getElementById("addPoint").addEventListener("click", function (e) {
  e.preventDefault();
  let place = document.getElementById("point").value;
  console.log(place)
  let minutes = document.getElementById("timeInPlace").value;
  points.push({ index: place, minsToSpend: minutes });
  pointsNameOnly.push(place)
  // console.log(points);
  document.getElementById("point").value = "";
  document.getElementById("timeInPlace").value = "";

  let newPoint = document.createElement("li")
  newPoint.innerText = place
  document.getElementById("listAllPlaces").appendChild(newPoint)

  var request = {
    query: place,
    fields: ["name", "geometry"],
  };
  findPlace(request)
});

// pressing of the button to add starting point of the trip
document.getElementById("addStart").addEventListener("click", function (e) {
  e.preventDefault();
  startPoint = document.getElementById("yourLocation").value;
  var request = {
    query: startPoint,
    fields: ["name", "geometry"]
  };
  findPlace(request)
})

// pressing of the button to add final point of the trip
document.getElementById("addFinish").addEventListener("click", function (e) {
  e.preventDefault();
  let end = document.getElementById("finishLocation").value;
  var request = {
    query: end,
    fields: ["name", "geometry"]
  };
  findPlace(request)
})

// finding place on a map using google places API
function findPlace (request) {
  service = new google.maps.places.PlacesService(map);
  service.findPlaceFromQuery(request, function (results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        createMarker(results[i]);
      }
  
      map.setCenter(results[0].geometry.location);
    }
  });
}

// mark place on a map 
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

// finding trip duration and distance using distance matrix API
document.getElementById("findTrips").addEventListener("click", function (e) {
  e.preventDefault();
  console.log(`Starting point: ${startPoint}, points: ${pointsNameOnly}`)
  var service = new google.maps.DistanceMatrixService();
  service.getDistanceMatrix(
  {
    origins: [startPoint],
    destinations: pointsNameOnly,
    travelMode: 'DRIVING'
  }, 
  function (response, status) {
    console.log('from calculateTimeToFirstPoint', response, status)
  });
});
