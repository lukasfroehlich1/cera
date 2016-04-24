var GoogleMapsAPI = require('googlemaps');
var async = require('async');


var publicConfig = {
  key: 'AIzaSyB_1bO9S2BzI5TmiQDIIVT1G-9uMbVWUd8',
  stagger_time:       1000, // for elevationPath
  encode_polylines:   false,
  secure:             true, // use https
};

var gmAPI = new GoogleMapsAPI(publicConfig);

var test_drivers = [ { id: 1,
  leave_earliest: Fri May 06 2016 00:00:00 GMT-0400 (EDT),
  leave_latest: Sat May 07 2016 00:00:00 GMT-0400 (EDT),
  waypoints: '41.40338, 2.17403|41.40338, 2.17403',
  end_point: '61.40338, 3.17403',
  start_point: "UCSD",
  trip_time: 3600,
  threshold: 1200,
  price_seat: 20,
  seats: 4 } ,
 { id: 2,
  leave_earliest: Fri May 06 2016 00:00:00 GMT-0400 (EDT),
  leave_latest: Sat May 07 2016 00:00:00 GMT-0400 (EDT),
  waypoints: '41.40338, 2.17403|41.40338, 2.17403',
  end_point: '61.40338, 3.17403',
  startId: 1,
  trip_time: 3600,
  threshold: 1200,
  price_seat: 20,
  seats: 4 } ]


find_match = function(driver, rider) {
    var end_points = rider.end_points.split("|");
	var result = false;
    for (end_point in end_points) {
		gmAPI.directions({origin: driver.start_point, destination: driver.end_point,
			waypoints: "optimize:true|" + driver.waypoints + "|" + end_point}, function(err, results) {
			if (err) {
				console.log('Error' + err);
			}
			else {
				console.log(results);
				console.log(results.routes[0].legs[0].duration.value);

				var new_trip_time = results.routes[0].legs[0].duration.value;

				if (new_trip_time - driver.trip_time <= driver.threshold) {
					result = {"driver_id": driver.id, "end_point": end_point, "new_trip_time": new_trip_time};
				}
			}
		});
		if (result) {
			break;
		}	
	}
	return result;
}


map_riders_to_drivers = function(riders, drivers){
    var result;
	async.map(riders, function(rider, callback1) { 
		async.map(drivers, function(driver, callback2) {
			callback2(null, find_match(rider, driver));
		}, function(err, results) {
			callback1(null, results.filter(function (x) { return x != false }));
		});
	}, function(err, results) {
		if (err) {
			console.log("Error: " + err);
		}
        result = results;
	});
    return result;
};

