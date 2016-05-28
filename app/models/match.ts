import {Rider, Driver, Match, Traveler, Time} from "./class_defs";

declare function require(name: string);
var GoogleMapsAPI = require('googlemaps');
var async = require('async');

var publicConfig = {
    key: 'AIzaSyB_1bO9S2BzI5TmiQDIIVT1G-9uMbVWUd8',
    stagger_time: 1000,
    encode_polylines: false,
    secure: true
};

var gmAPI = new GoogleMapsAPI(publicConfig);

function same_date(rider: Rider, driver: Driver): boolean {
    var r = rider.leave_date;
    var d = driver.leave_date;

    return r.getFullYear() == d.getFullYear() &&
           r.getMonth() == d.getMonth() &&
           r.getDate() == d.getDate();
}

function find_match(rider: Rider, driver: Driver,
                    find_match_callback: (err: any, res: Match) => any): void {
    var rider_leave_earliest = rider.leave_earliest.getMinutes();
    var rider_leave_latest = rider.leave_latest.getMinutes();

    var driver_leave_earliest = driver.leave_earliest.getMinutes();
    var driver_leave_latest = driver.leave_latest.getMinutes();

    if (!driver.start_point.equals(rider.start_point) || 
        !same_date(rider, driver) ||
        driver_leave_earliest >= rider_leave_latest || 
        driver_leave_latest <= rider_leave_earliest) {

        find_match_callback(null, null);
    }
    var i = 0;
    var leave_earliest = Math.max(rider_leave_earliest, driver_leave_earliest);
    var leave_latest = Math.min(rider_leave_latest, driver_leave_latest);
    var additional_time;

    async.doUntil((callback: (err: any, res: Match) => any) => {
        gmAPI.directions({ 
            origin: driver.start_point.toString(), 
            destination: driver.end_point.toString(),
            waypoints: "optimize:true|" + 
                (driver.stringify_waypoints() + "|" + 
                 rider.end_points[i].toString()),
            departure_time: (leave_earliest + leave_latest) / 2
        }, function (err, results) {
            if (err) {
                console.log("Error: end point being ignored:", rider.end_points[i]);
                console.log(err);
                i++;
                // not raising an error just quietly ignoring 
                
                additional_time = driver.threshold + 1;
                callback(null, null);
            }
            else {
                var new_trip_time = results.routes[0].legs.map(function (x) {
                    return x.duration.value;
                }).reduce(function (a, b) { return a + b; }, 0);

                additional_time = new_trip_time - driver.trip_time;

                callback(null, new Match(rider.id, driver.id,
                                         rider.end_points[i++], 
                                         new_trip_time, rider.leave_date, 
                                         new Time(leave_earliest), 
                                         new Time(leave_latest)));
            }
        });
    }, function () {
        return additional_time <= driver.threshold || 
            i == rider.end_points.length;
    }, function (err, results: Match) {
        if (err) {
            find_match_callback(err, null);
        }
        else if (i == rider.end_points.length && 
                 additional_time > driver.threshold) {
            find_match_callback(null, null);
        }
        else {
            find_match_callback(null, results);
        }
    });
};



export function map_riders_to_drivers(riders: Array<Rider>, 
                                      drivers: Array<Driver>, 
                                      map_callback: (err: any, res: Array<Match>) => any) {
    console.log("Trying to match riders and drivers...");
    console.log("Matching " + riders.length + " rider(s) and " + drivers.length + " driver(s)");
    async.map(riders, 
              function (rider: Rider, 
                        callback1: (err: any, res: Array<Match>) => any) {
        async.map(drivers, function (driver: Driver, 
                                     callback2: (err: any, res: Match) => any) {
            find_match(rider, driver, function (err: any, results: Match) {
                if (err) {
                    callback2(err, null);
                }
                callback2(null, results);
            });
        }, function (err, results: Array<Match>) {
            if (err) {
                callback1(err, null);
            }
            callback1(null, results.filter(function (x) { return x != null; }));
        });
    }, function (err, results) {
        if (err) {
            console.log("Error: " + err);
            map_callback(err, null);
        }
        else {
            var flat = [].concat.apply([], results);
            console.log("Found " + flat.length + " match(es)");
            map_callback(null, flat);
        }
    });
};
