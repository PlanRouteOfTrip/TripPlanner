export const getBestSet = (set) => {
  let bestTrips = [];
  if (!set.length) {
    return [];
  } else if (set.length === 1 || set.length === 2 || set.length === 3) {
    return set;
  } else {
    //sort 3 first elements
    if (set[0].totalTripTime > set[1].totalTripTime) {
      bestTrips[0] = set[1];
      bestTrips[1] = set[0];
    } else {
      bestTrips[0] = set[0];
      bestTrips[1] = set[1];
    }
    if (bestTrips[0].totalTripTime > set[2].totalTripTime) {
      bestTrips.unshift(set[2]);
    } else if (bestTrips[1].totalTripTime < set[2].totalTripTime) {
      bestTrips.push(set[2]);
    } else {
      bestTrips[2] = [...bestTrips[1]];
      bestTrips[1] = [...set[2]];
    }
    for (let i = 3; i < set.length; i++) {
      let currentTrip = set[i];
      if (currentTrip.totalTripTime < bestTrips[0].totalTripTime) {
        bestTrips.unshift(currentTrip);
        bestTrips.pop();
      } else if (
        currentTrip.totalTripTime >= bestTrips[0] &&
        currentTrip.totalTripTime < bestTrips[1]
      ) {
        bestTrips[2] = [...bestTrips[1]];
        bestTrips[1] = [...currentTrip];
      } else if (
        currentTrip.totalTripTime >= bestTrips[1] &&
        currentTrip.totalTripTime < bestTrips[2]
      ) {
        bestTrips[1] = [...currentTrip];
      }
    }
  }
  return bestTrips;
};
