// let travelTimes = [
//   [0, 10, 40, 30, 15, 34, 41],
//   [10, 0, 33, 26, 23, 15, 10],
//   [40, 33, 0, 23, 13, 30, 20],
//   [30, 26, 23, 0, 12, 15, 8],
//   [15, 23, 13, 12, 0, 22, 9],
//   [34, 15, 30, 15, 22, 0, 7],
//   [41, 10, 20, 8, 9, 7, 0],
// ];

// //temporary TravelTimes set for testing
// let travelTimes = [
//   [0, 10, 40],
//   [10, 0, 33],
//   [40, 33, 0]
// ];

  const fillTravelTimes = (num) => {
    let travelTimes = new Array(num).fill([0])
    for (let i = 0; i < num; i++) {
      for (let j = i + 1; j < num; j++) {
        let travelTime = Math.round(Math.random() * 100);
        travelTimes[i][j] = travelTime;
        travelTimes[j][i] = travelTime;
      }
    }
    return travelTimes
  }


const createPossibleTrips = (points) => {

  const permutations = [];

  const permutate = (cur, rest) => {
    if (rest.length === 0) {
      permutations.push(cur);
      return;
    }

    for (let i = 0; i < rest.length; i++) {
      permutate([...cur, rest[i]], [...rest.slice(0, i), ...rest.slice(i + 1)]);
    }
  };

  permutate([], points);
  return permutations;
};

export function getSets (places, totalTripTime) {
  //let newPoints = places.filter((point) => point.minsToSpend <= totalTripTime);

  let finalSet = [];
  let bestSet = [];

  let travelTimes = fillTravelTimes(places.length)

  let tripsOptions = createPossibleTrips(places);
  console.log("trip options", tripsOptions)

  for (let i = 0; i < tripsOptions.length; i++) {
    let time = tripsOptions[i][0].minsToSpend + tripsOptions[i][0].timeFromStart + tripsOptions[i][tripsOptions[i].length - 1].timeToFinish;
    let trip = tripsOptions[i];
    for (let j = 1; j < places.length; j++) {
      time =
        time +
        travelTimes[trip[j - 1].index][trip[j].index] +
        trip[j].minsToSpend
      //if time greater than totalTripTime we need to cut rest of the points in this trip and break this loop
      if (time > totalTripTime) {
        trip = trip.slice(0, j);
        break;
      }
    }
    trip[0].totalTripTime = time
    //check if trip is already in finalSet
    if (!checkSet(finalSet, trip)) {
      finalSet.push(trip);
    }
  }

  // pick 3 best sets
  bestSet = getBestSet(finalSet)

  return bestSet;
};

const getBestSet = (set) => {
  let bestTrips = []
  if (!set.length) {
    return []
  } else if (set.length === 1 || set.length === 2 || set.length === 3) {
    return set
  } else {
    //sort 3 first elements
    if (set[0].totalTripTime > set[1].totalTripTime) {
      bestTrips[0] = set[1];
      bestTrips[1] = set[0]
    } else {
      bestTrips[0] = set[0];
      bestTrips[1] = set[1]
    }
    if (bestTrips[0].totalTripTime > set[2].totalTripTime) {
      bestTrips.unshift(set[2])
    } else if (bestTrips[1].totalTripTime < set[2].totalTripTime) {
      bestTrips.push(set[2])
    } else {
      bestTrips[2] = [...bestTrips[1]];
      bestTrips[1] = [...set[2]];
    }
    for (let i = 3; i < set.length; i++) {
      let currentTrip = set[i];
      if (currentTrip.totalTripTime < bestTrips[0].totalTripTime) {
        bestTrips.unshift(currentTrip);
        bestTrips.pop()
      } else if (currentTrip.totalTripTime >= bestTrips[0] && currentTrip.totalTripTime < bestTrips[1]) {
        bestTrips[2] = [...bestTrips[1]];
        bestTrips[1] = [...currentTrip]
      } else if (currentTrip.totalTripTime >= bestTrips[1] && currentTrip.totalTripTime < bestTrips[2]) {
        bestTrips[1] = [...currentTrip]
      }
    }
}
return bestTrips
}

const checkSet = (curSet, trip) => {
  // to count times when trip not equal one of the sets from curSet
  let countOfFalse = 0;

  if (!curSet.length) return false;

  for (let i = 0; i < curSet.length; i++) {
    if (curSet[i].length === trip.length) {
      let idx = 0;
      while (idx < trip.length) {
        if (
          curSet[i][idx].place_id === trip[idx].place_id &&
          curSet[i][idx].minsToSpend === trip[idx].minsToSpend
        )
          idx++;
        else {
          countOfFalse++;
          break;
        }
      }
    }
  }
  // if countOfFalse less than curSet length - true, this trip already in set
  return countOfFalse < curSet.length;
};

// console.log(getSets(points, 200));

// module.exports = getSets;

