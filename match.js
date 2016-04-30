var GoogleMapsAPI = require('googlemaps');
var async = require('async');

var match = module.exports = {};

var publicConfig = {
    key: 'AIzaSyB_1bO9S2BzI5TmiQDIIVT1G-9uMbVWUd8',
    stagger_time:       1000, // for elevationPath
    encode_polylines:   false,
    secure:             true, // use https
};

var gmAPI = new GoogleMapsAPI(publicConfig);

find_match = function(rider, driver, big_callback) {
    var end_points = rider.end_points.split("|");

    if (driver.start_point != rider.start_point || driver.leave_earliest > rider.leave_latest || 
            driver.leave_latest < rider.leave_earliest) {
        big_callback(null, false);
    }
    else {
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
                        console.log('Error: ' + err);
                        console.log('most likely invalid location input');
                        i++;
                        // not raising an error just quietly ignoring 
                        callback(null, false);
                    } else {
                        var new_trip_time = results.routes[0].legs.map(function (x) {
                            return x.duration.value;
                        }).reduce(function (a, b) { return a + b; }, 0);

                        additional_time = new_trip_time - driver.trip_time;

                        callback(null, {"rider_id": rider.id,
                                        "driver_id": driver.id,
                                        "rider_end_point": end_points[i++],
                                        "new_trip_time": new_trip_time,
                                        "leave_earliest": leave_earliest,
                                        "leave_latest": leave_latest});
                    }
                }
            );},
            function() {
                return additional_time <= driver.threshold || i == end_points.length;
            },
            function(err, results){
                if (err) big_callback(null, false);
                if (i == end_points.length && additional_time > driver.threshold) {
                    console.log("no match");
                    big_callback(null, false);
                } else {
                    console.log("match");
                    big_callback(null, results);
                }
            }
          );
    }
};

// returns a list of [{rider_id, driver_id, rider_end_pint, new_trip_time, leave_earliest, leave_latest },
//                    {rider_id, driver_id, rider_end_pint, new_trip_time, leave_earliest, leave_latest },
//                    {rider_id, driver_id, rider_end_pint, new_trip_time, leave_earliest, leave_latest }] , one per rider
match.map_riders_to_drivers = function(riders, drivers, callback) {
    console.log("Trying to match riders and drivers...");
    console.log("Matching " + riders.length + " rider(s) and " + drivers.length + " driver(s)"); 
    //console.log(riders);
    //console.log(drivers);

	async.map(riders, function(rider, callback1) { 
        async.map(drivers, function(driver, callback2) {
            find_match(rider, driver, function(err, results) {
                if (err) {
                    callback2(err);
                }
                callback2(null, results);
            });
        }, function(err, results) {
            if (err) {
                callback1(err);
            }
            callback1(null, results.filter(function (x) { return x !== false; }));
        });
    }, function(err, results) {
		if (err) {
			console.log("Error: " + err);
            callback(err);
		}
        else {
            flat = [].concat.apply([], results);
            //console.log("outputting flat");
            //console.log(flat);
            console.log("Found " + flat.length + " match(es)");
            callback(null, flat);
        }
	});
};
