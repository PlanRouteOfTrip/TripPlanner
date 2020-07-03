let points = [];

document.getElementById("addPoint").addEventListener("click", function (e) {
  e.preventDefault();
  let place = document.getElementById("point").value;
  let minutes = document.getElementById("timeInPlace").value;
  points.push({ index: place, minsToSpend: minutes });
//   console.log(points);
  document.getElementById("point").value = "";
  document.getElementById("timeInPlace").value = "";

  let newPoint = document.createElement("li")
  newPoint.innerText = place
  document.getElementById("listAllPlaces").appendChild(newPoint)

  var request = {
    query: place,
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
});

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
