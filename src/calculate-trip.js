//we have
//startPoint = {}
//places = [{}, {}, ...]
//finishPoint = {}
//totalTripTime = number in mins

//1. For each place from places calculate time from startPoint to this place,
//add place.timeFromStart: time if (timeFromStart + timeToSpend) < totalTripTime
//else remove place from places

//For each place in places get travel time from point to this place

export function getTimeFromStart(startPoint, places, totalTripTime = 0) {
  let error = "";
  let newPlaces = [];
  let placesAdressesOnly = [];

  if (!startPoint || !places || !places.length) {
    return {
      error: "Starting point or places to visit are not specified",
      newPlaces: [],
    };
  }
  //TBD: change name to address!!!!
  for (let i = 0; i < places.length; i++) {
    placesAdressesOnly.push(places[i].address);
  }
  var service = new window.google.maps.DistanceMatrixService();
  service.getDistanceMatrix(
    {
      origins: [startPoint.formatted_address],
      destinations: placesAdressesOnly,
      travelMode: "DRIVING",
    },
    function (response, status) {
      if (status === "OK") {
        let foundTimes = response.rows[0].elements;
        for (let i = 0; i < places.length; i++) {
          let currentPlace = places[i];
          let currentTimeFromStart = Math.floor(
            foundTimes[i].duration.value / 60
          );
          if (currentPlace.minsToSpend + currentTimeFromStart < totalTripTime) {
            currentPlace.timeFromStart = currentTimeFromStart;
            newPlaces.push(currentPlace);
          }
        }
      } else {
        error = "Unable to get travel time from matrix api";
      }
    }
  );
  // return {
  //   error: error,
  //   places: newPlaces,
  // };
  console.log('places from getTimeFromStart', newPlaces, newPlaces.length)
  return newPlaces
}

// const places1 = [{
//   address: "1820 Avenue N, Brooklyn, NY",
//   minsToSpend: 10,
//   timeFromStart: 10,
// }]

export function getTimeToFinish(endPoint, places, totalTripTime = 0) {
  let error = "";
  let finalPlaces = [];
  let placesAdressesOnly = [];

  // WHY PLACES.LENGTH IS 0????? BUT ARRAY HAS OBJECTS IN IT
  
  setTimeout(function() {
    console.log("length", places.length);

  }, 5000)
  console.log("places", places, places.length);

  // if (!endPoint || !places || !places.length) {
  //   return {
  //     error: "Starting point/ending point or places to visit are not specified",
  //     finalPlaces: []
  //   }
  // }

  for (let i = 0; i < places.length; i++) {
    placesAdressesOnly.push(places[i].address);
  }

  console.log("adresses only", placesAdressesOnly);

  var service = new window.google.maps.DistanceMatrixService();
  service.getDistanceMatrix(
    {
      origins: [endPoint.formatted_address],
      destinations: placesAdressesOnly,
      travelMode: "DRIVING",
    },
    function (response, status) {
      if (status === "OK") {
        let foundTimes = response.rows[0].elements;
        for (let i = 0; i < places.length; i++) {
          let curPlace = places[i];
          let curTimeToFinish = Math.floor(foundTimes[i].duration.value / 60);
          if (
            currentPlace.minsToSpend + curTimeToFinish + timeFromStart <
            totalTripTime
          ) {
            currentPlace.timeToFinish = curTimeToFinish;
            finalPlaces.push(curPlace);
          }
        }
      } else {
        error = "Unable to get travel time from matrix api";
      }
    }
  );
  return {
    error: error,
    places: finalPlaces,
  };
}

//2. For each place from places calculate time to finishPoint from this place,
//add place.timeToFinish: time if (timeFromStart + timeToSpend + timeToFinish) < totalTripTime
//else remove place from places
//3. Fill out travelTimes matrix for remaining places
//4. Calculate all possible trips
//5. Get trips within total trip time
