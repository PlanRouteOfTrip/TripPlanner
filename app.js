var google;
let points = [];
let pointsNameOnly = [];
let startPoint;

let startDay;
let startTime;
let endDay;
let endTime;
let totalTripTime;

// pressing of the button to add a place to the list
document.getElementById("addPoint").addEventListener("click", function (e) {
  e.preventDefault();
  let place = document.getElementById("point").value;
  console.log(place);
  let minutes = document.getElementById("timeInPlace").value;
  points.push({ index: place, minsToSpend: minutes });
  pointsNameOnly.push(place);
  document.getElementById("point").value = "";
  document.getElementById("timeInPlace").value = "";

  var request = {
    query: place,
    fields: ["name", "geometry", "formatted_address"],
  };

  let newPlace = findPlace(request);
  let newPoint = document.createElement("li");
  newPoint.innerText = place
  document.getElementById("listAllPlaces").appendChild(newPoint);

  
  //TO USE NAME OF THE PLACE AND ITS ADDRESS 

  // newPoint.innerText = newPlace.name + ', ' + newPlace.formatted_address;
  // document.getElementById("listAllPlaces").appendChild(newPoint);
  // points.push({ index: newPlace.name, minsToSpend: minutes, address: newPlace.formatted_address});
  // pointsNameOnly.push(place);
});

// pressing of the button to add starting point of the trip
document.getElementById("addStart").addEventListener("click", function (e) {
  e.preventDefault();
  startPoint = document.getElementById("yourLocation").value;
  var request = {
    query: startPoint,
    fields: ["name", "geometry", "formatted_address"],
  };
  findPlace(request);

  // check if date of trip start is chosen
  startDay = document.getElementById("dateOfTripStart").value;
  console.log("this is start date", startDay);

  // check if time of trip start is chosen
  startTime = document.getElementById("startTime").value;
  console.log("this is start time", startTime);
});

// pressing of the button to add final point of the trip
document.getElementById("addFinish").addEventListener("click", function (e) {
  e.preventDefault();
  let end = document.getElementById("finishLocation").value;
  var request = {
    query: end,
    fields: ["name", "geometry", "formatted_address"],
  };
  findPlace(request);

  // check if date of trip end is chosen
  endDay = document.getElementById("dateOfTripEnd").value;
  console.log("this is end date", endDay);

  // check if time of trip end is chosen
  endTime = document.getElementById("endTime").value;
  console.log("this is end time", endTime);

  let dt1 = new Date(startDay + "T" + startTime);
  let dt2 = new Date(endDay + "T" + endTime);
  totalTripTime = diff_hours(dt2, dt1);
  console.log("this is total time in minutes", totalTripTime);
});

// finding place on a map using google places API
function findPlace(request) {
  let foundPoint
  service = new google.maps.places.PlacesService(map);
  service.findPlaceFromQuery(request, function (results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        createMarker(results[i]);
      }
      console.log(results[0])
      foundPoint = results[0]
      map.setCenter(results[0].geometry.location);
    }
  });
  return foundPoint
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
  console.log(`Starting point: ${startPoint}, points: ${pointsNameOnly}`);
  var service = new google.maps.DistanceMatrixService();
  service.getDistanceMatrix(
    {
      origins: [startPoint],
      destinations: pointsNameOnly,
      travelMode: "DRIVING",
    },
    function (response, status) {
      console.log("from calculateTimeToFirstPoint", response, status);
    }
  );
});

//time difference - total trip time
function diff_hours(dt2, dt1) {
  let diff = (dt2.getTime() - dt1.getTime()) / 1000;
  diff /= 60;
  return Math.abs(Math.round(diff));
}
