"use strict";

import {Rider, Driver, Coordinate, Match, Time} from "./class_defs";

declare function require(name: string);

let GoogleMapsAPI = require("googlemaps");
let async = require("async");

let publicConfig = {
    key: "AIzaSyB_1bO9S2BzI5TmiQDIIVT1G-9uMbVWUd8",
    stagger_time: 1000,
    encode_polylines: false,
    secure: true
};

let gmAPI = new GoogleMapsAPI(publicConfig);

function same_date(rider: Rider, driver: Driver): boolean {
    let r = rider.leave_date;
    let d = driver.leave_date;

    return r.getFullYear() === d.getFullYear() &&
           r.getMonth() === d.getMonth() &&
           r.getDate() === d.getDate();
};

function trip_time(trip): number {
    return trip.routes[0].legs.map(function (x) {
        return x.duration.value;
    }).reduce(function (a, b) { return a + b; }, 0);
}


function valid_trips(driver: Driver, rider: Rider, this_endpoint: Coordinate, callback: (err: any, res: Match) => any) {
    let rider_leave_earliest = rider.leave_earliest.getMinutes();
    let rider_leave_latest = rider.leave_latest.getMinutes();

    let driver_leave_earliest = driver.leave_earliest.getMinutes();
    let driver_leave_latest = driver.leave_latest.getMinutes();

    let leave_earliest = Math.max(rider_leave_earliest, driver_leave_earliest);
    let leave_latest = Math.min(rider_leave_latest, driver_leave_latest);

    // departure_time: (leave_earliest + leave_latest) / 2
    // TODO could use leave date to calcuate time in the future. incorporate into both calls
    gmAPI.directions(
        {
            origin: driver.start_point.toString(), destination: driver.end_point.toString(),
            waypoints: "optimize:true|" + (driver.stringify_waypoints() + "|" +
                                           this_endpoint.toString())
        }, (err, results_new_time) => {
            if (err)
                callback(null, null);   // treating errors as failed matches

            gmAPI.directions(
                {
                    origin: driver.start_point.toString(), destination: driver.end_point.toString()
                }, (err, results_old_time) => {
                    if (err)
                        callback(null, null);   // treating errors as failed matches

                    let old_trip_time = trip_time(results_old_time);
                    let new_trip_time = trip_time(results_new_time);

                    if (driver.threshold >= new_trip_time - old_trip_time) {
                        callback(null, new Match(rider.id, driver.id,
                                                 this_endpoint,
                                                 new_trip_time, rider.leave_date,
                                                 new Time(leave_earliest),
                                                 new Time(leave_latest)));
                    }
                    else {
                        callback(null, null);
                    }
                });
        });
};

function find_match(rider: Rider, driver: Driver,
                    find_match_callback: (err: any, res: Match) => any): void {
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


    async.map(rider.end_points, (x: Coordinate, callback) => { valid_trips(driver, rider, x, callback); },
              (err: any, res: Array<Match>) => {

        if (err)
            find_match_callback(err, null);

        for (let i = 0; i < res.length; i++)
            if (res[i])
                find_match_callback(null, res[i]);

        find_match_callback(null, null);
    });
};


export function map_riders_to_drivers(riders: Array<Rider>,
                                      drivers: Array<Driver>,
                                      map_callback: (err: any, res: Array<Match>) => any) {
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
            map_callback(err, null);
        }
        else {
            results = [].concat.apply([], results);
            map_callback(null, results);
        }
    });
};
