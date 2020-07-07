

function getDistance() {
    var origin1 = {lat: 55.930, lng: -3.118};
    var origin2 = 'Greenwich, England';
    var destinationA = 'Stockholm, Sweden';
    var destinationB = {lat: 50.087, lng: 14.421};

  var service = new google.maps.DistanceMatrixService();
  service.getDistanceMatrix(
    {
      origins: [origin1, origin2],
      destinations: [destinationA, destinationB],
      travelMode: "DRIVING",
      transitOptions: TransitOptions,
      drivingOptions: DrivingOptions,
      unitSystem: UnitSystem,
      avoidHighways: Boolean,
      avoidTolls: Boolean,
    },
    callback
  );

  function callback(response, status) {
    if (status == "OK") {
      var origins = response.originAddresses;
      var destinations = response.destinationAddresses;

      for (var i = 0; i < origins.length; i++) {
        var results = response.rows[i].elements;
        for (var j = 0; j < results.length; j++) {
          var element = results[j];
          var distance = element.distance.text;
          var duration = element.duration.text;
          var from = origins[i];
          var to = destinations[j];
        }
      }
    }
  }
}

getDistance();
