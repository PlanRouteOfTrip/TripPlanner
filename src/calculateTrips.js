import { checkOpenHours } from "./openingHours";
import { getBestSet } from "./findThreeBestSets";
import { fillTravelTimes } from "./matrixMaker";

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

export function getSets(places, totalTripTime, start) {
  let finalSet = [];
  let bestSet = [];
  let matrix = fillTravelTimes(places)

  let tripsOptions = createPossibleTrips(places);
  console.log("trip options", tripsOptions);

  for (let i = 0; i < tripsOptions.length; i++) {
    let time =
      tripsOptions[i][0].minsToSpend +
      tripsOptions[i][0].timeFromStart +
      tripsOptions[i][tripsOptions[i].length - 1].timeToFinish;
    let trip = tripsOptions[i];
    for (let j = 1; j < places.length; j++) {
      time =
        time +
        matrix[trip[j - 1].index][trip[j].index] +
        trip[j].minsToSpend;
      //if time greater than totalTripTime we need to cut rest of the points in this trip and break this loop
      if (time > totalTripTime) {
        trip = trip.slice(0, j);
        break;
      }
    }
    trip[0].totalTripTime = time;
    //check if trip is already in finalSet
    if (!checkSet(finalSet, trip)) {
      finalSet.push(trip);
    }
  }

  let afterCheckHours = checkOpenHours(finalSet, start, matrix);
  // pick 3 best sets
  bestSet = getBestSet(afterCheckHours);

  return bestSet;
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
