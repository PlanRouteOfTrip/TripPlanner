// let points = [
//     {
//       index: 0,
//       minsToSpend: 120
//     },
//     {
//       index: 1,
//       minsToSpend: 60
//     },
//     {
//       index: 2,
//       minsToSpend: 30
//     },
//     {
//       index: 3,
//       minsToSpend: 45
//     },
//     {
//       index: 4,
//       minsToSpend: 90
//     },
//     {
//       index: 5,
//       minsToSpend: 75
//     },
//     {
//       index: 6,
//       minsToSpend: 40
//     }
//   ]
//   ​
// //   let travelTimes = new Array(7).fill([0])

// //   const fillTravelTimes = () => {
// //     for (let i = 0; i < travelTimes.length; i++) {
// //       for (let j = i + 1; j < travelTimes.length; j++) {
// //         let travelTime = Math.round(Math.random() * 100);
// //         travelTimes[i][j] = travelTime;
// //         travelTimes[j][i] = travelTime;
// //       }
// //     }
// //   }
// //   ​
// //   fillTravelTimes()
// //   console.log(travelTimes)

// let travelTimes = [
//     [0, 10, 40, 30, 15, 34, 41],
//     [10, 0, 33, 26, 23, 15, 10],
//     [40, 33, 0, 23, 13, 30, 20],
//     [30, 26, 23, 0, 12, 15, 8],
//     [15, 23, 13, 12, 0, 22, 9],
//     [34, 15, 30, 15, 22, 0, 7],
//     [41, 10, 20, 8, 9, 7, 0]
//   ]

//   function getSets(points, totalTripTime) {
//     //filter out large points
//     let newPoints = points.filter(point => point.minsToSpend <= totalTripTime)
//     //generate all possible sets of Points
//     let allTrips = createPossibleTrip(newPoints)
//     let allSets = [];
//     //go through all sets and check if total of poit.minsToSpends
//     //+ travel distances <= total trip time
//     for (let i = 0; i < allTrips.length; i++) {
//       let currentSet = allTrips[i];
//       let currentTotal = currentSet[0].minsToSpend;
//       let currentPointInd = 0
//       //go through each set an calculate total trip time
//       //once it reached totalTripTime, return points collected so far
//       for (let j = 1; j < currentSet.length; j++) {
//         let additionalTime = currentSet[j].minsToSpend + travelTimes[currentSet[j].index][currentSet[j-1].index]
//         if (currentTotal + additionalTime <= totalTripTime ) {
//           currentTotal += additionalTime
//           currentPointInd = j
//         } else {
//           break
//         }
//       }
//       allSets.push(currentSet.slice(0, currentPointInd + 1))
//       if (currentPointInd < currentSet.length - 1) {
//         i++
//       }
//     }
//     return allSets
//   }
//   ​
//   // return all permutations for points
//   const createPossibleTrips = points => {
//     const permutations = []
  
//     const permutate = (cur, rest) => {
//       if (rest.length === 0) {
//         permutations.push(cur)
//         return
//       }
  
//       for (let i = 0; i < rest.length; i++) {
       
//         permutate(
//           [...cur, rest[i]],
//           [...rest.slice(0, i), ...rest.slice(i + 1)],
//         );
//       }
//     };
  
//     permutate([], points);
//     return permutations
//   };
  
//   ​
// //   console.log(getSets(points, 200))
//   // createTrip([1, 2, 3])
//   ​
//   // [A,  J, H, K   B]




  let points = [
    {
      index: 0,
      minsToSpend: 220
    },
    {
      index: 1,
      minsToSpend: 60
    },
    {
      index: 2,
      minsToSpend: 350
    },
    {
      index: 3,
      minsToSpend: 45
    },
    {
      index: 4,
      minsToSpend: 90
    },
    {
      index: 5,
      minsToSpend: 75
    },
    {
      index: 6,
      minsToSpend: 40
    }
  ]
let travelTimes = [
    [0, 10, 40, 30, 15, 34, 41],
    [10, 0, 33, 26, 23, 15, 10],
    [40, 33, 0, 23, 13, 30, 20],
    [30, 26, 23, 0, 12, 15, 8],
    [15, 23, 13, 12, 0, 22, 9],
    [34, 15, 30, 15, 22, 0, 7],
    [41, 10, 20, 8, 9, 7, 0]
  ]

 const createPossibleTrips = points => {
    const permutations = []
  
    const permutate = (cur, rest) => {
      if (rest.length === 0) {
        permutations.push(cur)
        return
      }
  
      for (let i = 0; i < rest.length; i++) {
       
        permutate(
          [...cur, rest[i]],
          [...rest.slice(0, i), ...rest.slice(i + 1)],
        );
      }
    };
  
    permutate([], points);
    return permutations
  };
  
  const getSets = (places, totalTripTime) => {
    let newPoints = places.filter(point => point.minsToSpend <= totalTripTime)

    let finalSet = []
    let tripsOptions = createPossibleTrips(newPoints)

    for (let i = 0; i < tripsOptions.length; i++) {
      let time = tripsOptions[i][0].minsToSpend
      let trip = tripsOptions[i]
      for (let j = 1; j < newPoints.length; j++) {
        time = time + travelTimes[trip[j-1].index][trip[j].index] + trip[j].minsToSpend
        if (time > totalTripTime) {
            trip = trip.slice(0, j)
            break
        } 
      }
      if (!checkSet(finalSet, trip)) {
          finalSet.push(trip)
      }
    }
    return finalSet
  }

  const checkSet = (curSet, trip) => {
    // to count times when trip not equal one of the sets from curSet
    let countOfFalse = 0
    
    if (!curSet.length) return false

    for (let i = 0; i < curSet.length; i++) {
      if (curSet[i].length === trip.length) {
        let idx = 0
        while (idx < trip.length) {
          if (curSet[i][idx].index === trip[idx].index && curSet[i][idx].minsToSpend === trip[idx].minsToSpend) idx++
            else {
              countOfFalse++
              break
            } 
        }
      }
    }
    // if countOfFalse less than curSet length - true, this trip already in set
    return countOfFalse < curSet.length
  }

  console.log(getSets(points, 200))
