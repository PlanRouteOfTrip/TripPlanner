var infowindow;
var google;
var document = window.document;
var map;
var service;

let points = [];
let startPoint;

let startDay;
let startTime;
let endDay;
let endTime;
let totalTripTime;


import {getTimeFromStart} from "./calculate-trip"

window.initMap = function() {

  var newYork = new window.google.maps.LatLng(40.5941732, -73.9443477);

  infowindow = new window.google.maps.InfoWindow();

  map = new window.google.maps.Map(document.getElementById("map"), {
    center: newYork,
    zoom: 10,
  });
};

// pressing of the button to add a place to the list

document
  .getElementById("addPoint")
  .addEventListener("click", async function (e) {
    e.preventDefault();
    console.log('points', points)
    let place = document.getElementById("point").value;
    let minutes = document.getElementById("timeInPlace").value;
    
    points.push({
        index: place,
        minsToSpend: minutes})
      
    var request = {
      query: place,
      fields: ["name", "geometry", "formatted_address", "place_id"],
    };

    let newPlace = await findPlace(request);
    console.log("object of the place", newPlace);
   
    let newPoint = document.createElement("li");
    newPoint.innerText = place;
    document.getElementById("listAllPlaces").appendChild(newPoint);
  });



document.getElementById("point").value = "";
document.getElementById("timeInPlace").value = "";

// pressing of the button to add starting point of the trip
document.getElementById("addStart").addEventListener("click", function (e) {
  e.preventDefault();
  startPoint = document.getElementById("yourLocation").value;
  var request = {
    query: startPoint,
    fields: ["name", "geometry", "formatted_address", "place_id"],
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
    fields: ["name", "geometry", "formatted_address", "place_id"],
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
async function findPlace(request) {
  let foundPoint;
  console.log("I am here searching point on a map!");
  service = new window.google.maps.places.PlacesService(map);
  try {
    await service.findPlaceFromQuery(request, async function (results, status) {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
          foundPoint = await createMarker(results[i]);
        }
        map.setCenter(results[0].geometry.location);
      }

      console.log("found point", foundPoint);
      return foundPoint;
    });
  } catch (error) {
    console.log("no point found", error);
  }
}

// mark place on a map
async function createMarker(place) {
  try {
    var marker = new window.google.maps.Marker({
      map: map,
      position: place.geometry.location,
      placeId: place.place_id,
    });

    window.google.maps.event.addListener(marker, "click", function () {
      infowindow.setContent(place.name);
      infowindow.open(map, this);
    });

    let request = {
      placeId: marker.placeId,
      fields: ["name", "formatted_address", "opening_hours"],
    };

    let goalPlace;

    await service.getDetails(request, (place, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        goalPlace = place;
      }
      console.log("goal", goalPlace);
      // points.push(goalPlace)
    });
    return goalPlace;
  } catch (error) {
    console.log("error", error);
  }
}

// finding trip duration and distance using distance matrix API
document.getElementById("findTrips").addEventListener("click", function (e) {
  e.preventDefault();
  let withTimeFromStart = getTimeFromStart(startPoint, points, totalTripTime)
  console.log(withTimeFromStart.places)
});

//time difference - total trip time
function diff_hours(dt2, dt1) {
  let diff = (dt2.getTime() - dt1.getTime()) / 1000;
  diff /= 60;
  return Math.abs(Math.round(diff));
}
