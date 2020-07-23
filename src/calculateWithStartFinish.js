//we have
//startPoint = {}
//places = [{}, {}, ...]
//finishPoint = {}
//totalTripTime = number in mins

//1. For each place from places calculate time from startPoint to this place,
//add place.timeFromStart: time if (timeFromStart + timeToSpend) < totalTripTime
//else remove place from places

//For each place in places get travel time from point to this place

function getTimeFromStartFromAPI(startPoint, places, totalTripTime) {

  let placesAddressesOnly = [];
  for (let i = 0; i < places.length; i++) {
    placesAddressesOnly.push(places[i].address);
  }


  let request = {
    origins: [startPoint.formatted_address],
    destinations: placesAddressesOnly,
    travelMode: "DRIVING",
  };
  return new Promise((resolve, reject) => {
    var service = new window.google.maps.DistanceMatrixService();
    service.getDistanceMatrix(request, (response, status) => {

      if (status === "OK") {
        let newPlaces = [];
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
          resolve(newPlaces);
        }
      }
    });
  });
}

export async function getTimeFromStart(startPoint, places, totalTripTime = 0) {

  if (!startPoint || !places || !places.length) {
    return {
      error: "Starting point or places to visit are not specified",
      newPlaces: [],
    };
  }

  let newPlaces = await getTimeFromStartFromAPI(
    startPoint,
    places,
    totalTripTime
  );

  return newPlaces;
}

function getTimeToFinishAPI(endPoint, places, totalTripTime) {
  let placesAddressesOnly = [];
  for (let i = 0; i < places.length; i++) {
    placesAddressesOnly.push(places[i].address);
  }
  let request = {
    origins: [endPoint.formatted_address],
    destinations: placesAddressesOnly,
    travelMode: "DRIVING",
  };

  return new Promise((resolve, reject) => {
    var service = new window.google.maps.DistanceMatrixService();
    service.getDistanceMatrix(request, (response, status) => {
      if (status === "OK") {
        let finalPlaces = []
        let foundTimes = response.rows[0].elements;
        for (let i = 0; i < places.length; i++) {
          let curPlace = places[i];
          let curTimeToFinish = Math.floor(foundTimes[i].duration.value / 60);
          if (
            curPlace.minsToSpend + curTimeToFinish + curPlace.timeFromStart <
            totalTripTime
          ) {
            curPlace.timeToFinish = curTimeToFinish;
            finalPlaces.push(curPlace);
          }
          resolve(finalPlaces)
        }
      }
    });
  });
}

export async function getTimeToFinish(endPoint, places, totalTripTime = 0) {
  if (!endPoint || !places || !places.length) {
    return {
      error: "Starting point/ending point or places to visit are not specified",
      finalPlaces: [],
    };
  }
  let finalPlaces = await getTimeToFinishAPI(endPoint, places, totalTripTime);
  return finalPlaces;
}

//2. For each place from places calculate time to finishPoint from this place,
//add place.timeToFinish: time if (timeFromStart + timeToSpend + timeToFinish) < totalTripTime
//else remove place from places
//3. Fill out travelTimes matrix for remaining places
//4. Calculate all possible trips
//5. Get trips within total trip time
