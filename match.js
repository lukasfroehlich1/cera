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
  leave_earliest: 100,
  leave_latest:200,
  waypoints: 'UCLA|UC Irvine',
  end_point: 'UC Santa Barbara',
  start_point: "UCSD",
  trip_time: 3600,
  threshold: 1200,
  price_seat: 20,
  seats: 4 } ,
 { id: 2,
  leave_earliest: 300,
  leave_latest: 400,
  waypoints: 'UCLA|UC Irvine',
  end_point: 'UC Santa Barbara',
  start_point: "UCSD",
  trip_time: 3600,
  threshold: 1200,
  price_seat: 20,
  seats: 4 } ]

var test_riders = [ { id: 3,
  leave_earliest: 150,
  leave_latest: 160,
  end_points: 'Garden Grove',
  start_point: "UCSD"
   } ,
 { id: 2,
  leave_earliest: 170,
  leave_latest: 180,
  end_points: 'Santa Monica',
  start_point: "UCSD"
  } ]

var test_drivers1 = [ { id: 1,
  leave_earliest: 100,
  leave_latest: 200,
  waypoints: '',
  end_point: 'SF',
  start_point: "Los Angeles",
  trip_time: 19260,
  threshold: 9600,
  price_seat: 20,
  seats: 4 } ];

var test_riders1 = [ { id: 3,
  leave_earliest: 150,
  leave_latest: 160,
  end_points: 'San Jose',
  start_point: "Los Angeles"
}];


find_match = function(rider, driver, big_callback) {
    var end_points = rider.end_points.split("|");

    if (driver.start_point != rider.start_point || driver.leave_earliest > rider.leave_latest
            || driver.leave_latest < rider.leave_earliest) {
        big_callback(false);
        return;
    }

    var additional_time;
    var i = 0;
    async.doUntil(
        function(callback) {
            var leave_earliest = Math.max(driver.leave_earliest, rider.leave_earliest);
            var leave_latest = Math.min(driver.leave_latest, rider.leave_latest);

            gmAPI.directions({origin: driver.start_point, destination: driver.end_point,
                waypoints: "optimize:true|" + (driver.waypoints + "|" + end_points[i]).split(' ').join('+'),
                departure_time: (leave_earliest + leave_latest) / 2 
            }, function(err, results) {
                if (err) {
                    console.log('Error :( -> ' + err);
                    console.log('most likely invalid location input');
                }else {
                    var new_trip_time = results.routes[0].legs.map(function (x) { 
                        return x.duration.value;
                    }).reduce(function (a, b) { return a + b; }, 0);

                    console.log("new_trip_time " + new_trip_time);
                    console.log("driver.trip_time" + driver.trip_time);

                    additional_time = new_trip_time - driver.trip_time;




                    callback(null, {"driver_id": driver.id, "rider_end_point": end_points[i++], "new_trip_time": new_trip_time,
                                "leave_earliest": leave_earliest,
                                "leave_latest": leave_latest});
                }
            }
        )},
        function() {
            return additional_time <= driver.threshold || i == end_points.length;
        },
        function(err, results){
            if (i == end_points.length && additional_time > driver.threshold) {
                big_callback(false);
            } else {
                big_callback(results);
            }
        }
      );
}

//call this asynchronously
map_riders_to_drivers = function(riders, drivers, callback){
	async.map(riders, function(rider, callback1) { 
		async.map(drivers, function(driver, callback2) {
            find_match(rider, driver, function(results) {
                callback2(null, results);
            })
		}, function(err, results) {
			callback1(null, results.filter(function (x) { return x != false }));
		});
	}, function(err, results) {
		if (err) {
			console.log("Error: " + err);
		}
        else {
            callback(results);
        }
	});
};
