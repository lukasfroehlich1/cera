"use strict";
var class_defs_1 = require("./class_defs");
var GoogleMapsAPI = require('googlemaps');
var async = require('async');
var publicConfig = {
    key: 'AIzaSyB_1bO9S2BzI5TmiQDIIVT1G-9uMbVWUd8',
    stagger_time: 1000,
    encode_polylines: false,
    secure: true
};
var gmAPI = new GoogleMapsAPI(publicConfig);
function same_date(rider, driver) {
    var r = rider.leave_date;
    var d = driver.leave_date;
    return r.getFullYear() == d.getFullYear() &&
        r.getMonth() == d.getMonth() &&
        r.getDate() == d.getDate();
}
;
function valid_trips(driver, rider, this_endpoint, callback) {
    var rider_leave_earliest = rider.leave_earliest.getMinutes();
    var rider_leave_latest = rider.leave_latest.getMinutes();
    var driver_leave_earliest = driver.leave_earliest.getMinutes();
    var driver_leave_latest = driver.leave_latest.getMinutes();
    var leave_earliest = Math.max(rider_leave_earliest, driver_leave_earliest);
    var leave_latest = Math.min(rider_leave_latest, driver_leave_latest);
    gmAPI.directions({
        origin: driver.start_point.toString(), destination: driver.end_point.toString(),
        waypoints: "optimize:true|" + (driver.stringify_waypoints() + "|" +
            this_endpoint.toString()) }, function (err, results) {
        if (err)
            callback(null, null); // treating errors as failed distances
        // i expect invalid locations. This may be reworked in the future
        var new_trip_time = results.routes[0].legs.map(function (x) {
            return x.duration.value;
        }).reduce(function (a, b) { return a + b; }, 0);
        if (driver.threshold >= new_trip_time - driver.trip_time) {
            callback(null, new class_defs_1.Match(rider.id, driver.id, this_endpoint, new_trip_time, rider.leave_date, new class_defs_1.Time(leave_earliest), new class_defs_1.Time(leave_latest)));
        }
        else {
            callback(null, null);
        }
    });
}
;
function find_match(rider, driver, find_match_callback) {
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
    async.map(rider.end_points, function (x, callback) { valid_trips(driver, rider, x, callback); }, function (err, res) {
        if (err)
            find_match_callback(err, null);
        for (var i = 0; i < res.length; i++)
            if (res[i])
                break;
        find_match_callback(null, res[i]);
    });
}
;
function map_riders_to_drivers(riders, drivers, map_callback) {
    async.map(riders, function (rider, callback1) {
        async.map(drivers, function (driver, callback2) {
            find_match(rider, driver, function (err, results) {
                if (err) {
                    callback2(err, null);
                }
                callback2(null, results);
            });
        }, function (err, results) {
            if (err) {
                callback1(err, null);
            }
            callback1(null, results.filter(function (x) { return x != null; }));
        });
    }, function (err, results) {
        if (err) {
            map_callback(err, null);
        }
        else {
            results = [].concat.apply([], results);
            map_callback(null, results);
        }
    });
}
exports.map_riders_to_drivers = map_riders_to_drivers;
;
