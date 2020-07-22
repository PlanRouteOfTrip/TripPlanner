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
let endPoint;

import { getTimeFromStart, getTimeToFinish } from "./calculateWithStartFinish";

import { getSets } from "./calculateTrips";


window.initMap = function () {
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
    let place = document.getElementById("point").value;
    let minutes = document.getElementById("timeInPlace").value;

    let newPlace = await getFoundPlace(place);
    if (newPlace.opening_hours) {
      points.push({
        name: newPlace.name,
        address: newPlace.formatted_address,
        minsToSpend: Number(minutes),
        hours: newPlace.opening_hours,
      });
    } else {
      points.push({
        name: newPlace.name,
        address: newPlace.formatted_address,
        minsToSpend: Number(minutes),
      });
    }

    let newPoint = document.createElement("li");
    newPoint.innerText = newPlace.name;
    document.getElementById("listAllPlaces").appendChild(newPoint);

    document.getElementById("point").value = "";
    document.getElementById("timeInPlace").value = "";
  });

// pressing of the button to add starting point of the trip
document
  .getElementById("addStart")
  .addEventListener("click", async function (e) {
    e.preventDefault();
    let start = document.getElementById("yourLocation").value;
    startPoint = await getFoundPlace(start);

    // check if date of trip start is chosen
    startDay = document.getElementById("dateOfTripStart").value;
    console.log("this is start date", startDay);

    // check if time of trip start is chosen
    startTime = document.getElementById("startTime").value;
    console.log("this is start time", startTime);
  });

// pressing of the button to add final point of the trip
document
  .getElementById("addFinish")
  .addEventListener("click", async function (e) {
    e.preventDefault();
    let end = document.getElementById("finishLocation").value;
    if (!end.length) endPoint = startPoint;
    else endPoint = await getFoundPlace(end);

    // check if date of trip end is chosen
    endDay = document.getElementById("dateOfTripEnd").value;
    console.log("this is end date", endDay);

    // check if time of trip end is chosen
    endTime = document.getElementById("endTime").value;
    console.log("this is end time", endTime);

    let dt1 = new Date(startDay + "T" + startTime);
    let dt2 = new Date(endDay + "T" + endTime);
    totalTripTime = diff_hours(dt2, dt1);
    console.log("TOTAL TRIP TIME in MINS", totalTripTime);
  });

function getFoundPlace(place) {
  var request = {
    query: place,
    fields: ["name", "geometry", "formatted_address", "place_id"],
  };
  return new Promise((resolve, reject) => {
    service = new window.google.maps.places.PlacesService(map);
    service.findPlaceFromQuery(request, async function (results, status) {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        let foundPoint = await createMarker(results[0]);
        map.setCenter(results[0].geometry.location);
        resolve(foundPoint);
      }
    });
  });
}

function getGoalPlace(placeId) {
  let request = {
    placeId: placeId,
    fields: ["name", "formatted_address", "opening_hours"],
  };

  return new Promise((resolve, reject) => {
    service.getDetails(request, (place, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        resolve(place);
      }
    });
  });
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

    let goalPlace = await getGoalPlace(marker.placeId);

    return goalPlace;
  } catch (error) {
    console.log("error", error);
  }
}

// finding trip duration and distance using distance matrix API
document.getElementById("findTrips").addEventListener("click", function (e) {
  e.preventDefault();

  let withTimeFromStart = getTimeFromStart(startPoint, points, totalTripTime);
  let withTimeToFinish;

  setTimeout(function () {
    withTimeToFinish = getTimeToFinish(
      endPoint,
      withTimeFromStart,
      totalTripTime
    );
  }, 1000);

  setTimeout(function () {
    for (let i = 0; i < withTimeToFinish.length; i++) {
      withTimeToFinish[i].index = i;
    }
  }, 2000)

  setTimeout(function() {
    let dt1 = new Date(startDay + "T" + startTime);
    console.log("!***!final set!***!", getSets(withTimeToFinish, totalTripTime, dt1));
  }, 3000)
});

//time difference - total trip time
function diff_hours(dt2, dt1) {
  let diff = (dt2.getTime() - dt1.getTime()) / 1000;
  diff /= 60;
  return Math.abs(Math.round(diff));
}
