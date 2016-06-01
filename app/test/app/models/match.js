"use strict";
const class_defs_1 = require("./class_defs");
let GoogleMapsAPI = require("googlemaps");
let async = require("async");
let publicConfig = {
    key: "AIzaSyB_1bO9S2BzI5TmiQDIIVT1G-9uMbVWUd8",
    stagger_time: 1000,
    encode_polylines: false,
    secure: true
};
let gmAPI = new GoogleMapsAPI(publicConfig);
function same_date(rider, driver) {
    let r = rider.leave_date;
    let d = driver.leave_date;
    return r.getFullYear() === d.getFullYear() &&
        r.getMonth() === d.getMonth() &&
        r.getDate() === d.getDate();
}
;
function trip_time(trip) {
    return trip.routes[0].legs.map(function (x) {
        return x.duration.value;
    }).reduce(function (a, b) { return a + b; }, 0);
}
function valid_trips(driver, rider, this_endpoint, callback) {
    let rider_leave_earliest = rider.leave_earliest.getMinutes();
    let rider_leave_latest = rider.leave_latest.getMinutes();
    let driver_leave_earliest = driver.leave_earliest.getMinutes();
    let driver_leave_latest = driver.leave_latest.getMinutes();
    let leave_earliest = Math.max(rider_leave_earliest, driver_leave_earliest);
    let leave_latest = Math.min(rider_leave_latest, driver_leave_latest);
    // departure_time: (leave_earliest + leave_latest) / 2
    // TODO could use leave date to calcuate time in the future. incorporate into both calls
    gmAPI.directions({
        origin: driver.start_point.toString(), destination: driver.end_point.toString(),
        waypoints: "optimize:true|" + (driver.stringify_waypoints() + "|" +
            this_endpoint.toString())
    }, (err, results_new_time) => {
        if (err)
            callback(null, null); // treating errors as failed matches
        gmAPI.directions({
            origin: driver.start_point.toString(), destination: driver.end_point.toString()
        }, (err, results_old_time) => {
            if (err)
                callback(null, null); // treating errors as failed matches
            let old_trip_time = trip_time(results_old_time);
            let new_trip_time = trip_time(results_new_time);
            if (driver.threshold >= new_trip_time - old_trip_time) {
                callback(null, new class_defs_1.Match(rider.id, driver.id, this_endpoint, new_trip_time, rider.leave_date, new class_defs_1.Time(leave_earliest), new class_defs_1.Time(leave_latest)));
            }
            else {
                callback(null, null);
            }
        });
    });
}
;
function find_match(rider, driver, find_match_callback) {
    let rider_leave_earliest = rider.leave_earliest.getMinutes();
    let rider_leave_latest = rider.leave_latest.getMinutes();
    let driver_leave_earliest = driver.leave_earliest.getMinutes();
    let driver_leave_latest = driver.leave_latest.getMinutes();
    if (!driver.start_point.equals(rider.start_point) ||
        !same_date(rider, driver) ||
        driver_leave_earliest >= rider_leave_latest ||
        driver_leave_latest <= rider_leave_earliest) {
        find_match_callback(null, null);
    }
    async.map(rider.end_points, (x, callback) => { valid_trips(driver, rider, x, callback); }, (err, res) => {
        if (err)
            find_match_callback(err, null);
        for (let i = 0; i < res.length; i++)
            if (res[i])
                find_match_callback(null, res[i]);
        find_match_callback(null, null);
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
//# sourceMappingURL=match.js.map