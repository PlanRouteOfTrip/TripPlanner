export function fillTravelTimes(places) {
  let error = "";
  let travelTimes = []
  for (let i = 0; i < places.length; i++) {
      travelTimes.push(new Array(places.length).fill(0))
  }
  let addressesOnly = [...places].map((el) => el.address);
//   console.log("only addresses for matrix", addressesOnly);

  for (let i = 0; i < travelTimes.length; i++) {
    for (let j = i + 1; j < travelTimes.length; j++) {
      var service = new window.google.maps.DistanceMatrixService();
      service.getDistanceMatrix(
        {
          origins: [addressesOnly[i]],
          destinations: addressesOnly.slice(i + 1),
          travelMode: "DRIVING",
        },
        function (response, status) {
          if (status === "OK") {
            let timesOfTravel = response.rows[0].elements;
            for (let k = i + 1; k < travelTimes.length; k++) {
              let singleTime = Math.floor(timesOfTravel[0].duration.value / 60);
              timesOfTravel.shift();
              travelTimes[i][k] = singleTime;
              travelTimes[k][i] = singleTime;
            }
          } else {
            error = "Unable to get travel time from matrix api";
          }
        }
      );
      break;
    }
  }
    return travelTimes;
//   return {
//     error: error,
//     times: travelTimes,
//   };
}
