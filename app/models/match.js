import { Match, Time } from './class_defs';

import GoogleMapsAPI from 'googlemaps';
import async from 'async';

const publicConfig = {
  key: 'AIzaSyB_1bO9S2BzI5TmiQDIIVT1G-9uMbVWUd8',
  stagger_time: 1000,
  encode_polylines: false,
  secure: true,
};

const gmAPI = new GoogleMapsAPI(publicConfig);

function same_date(rider, driver) {
  const r = rider.leave_date;
  const d = driver.leave_date;

  return r.getFullYear() === d.getFullYear() &&
    r.getMonth() === d.getMonth() &&
    r.getDate() === d.getDate();
}

function trip_time(trip) {
  return trip.routes[0].legs.map(x => x.duration.value).reduce((a, b) => a + b, 0);
}

function valid_trips(driver, rider, this_endpoint, callback) {
  const rider_leave_earliest = rider.leave_earliest.getMinutes();
  const rider_leave_latest = rider.leave_latest.getMinutes();

  const driver_leave_earliest = driver.leave_earliest.getMinutes();
  const driver_leave_latest = driver.leave_latest.getMinutes();

  const leave_earliest = Math.max(rider_leave_earliest, driver_leave_earliest);
  const leave_latest = Math.min(rider_leave_latest, driver_leave_latest);

  // departure_time: (leave_earliest + leave_latest) / 2
  // TODO could use leave date to calcuate time in the future. incorporate into both calls
  gmAPI.directions({
    origin: driver.start_point.toString(), destination: driver.end_point.toString(),
    waypoints: `optimize:true|${driver.stringify_waypoints()}|${this_endpoint.toString()}`,
  }, (err_new, results_new_time) => {
    if (err_new) {
      callback(null, null);   // treating errors as failed matches
    }

    gmAPI.directions({
      origin: driver.start_point.toString(), destination: driver.end_point.toString(),
    }, (err_old, results_old_time) => {
      if (err_old) {
        callback(null, null);   // treating errors as failed matches
      }

      const old_trip_time = trip_time(results_old_time);
      const new_trip_time = trip_time(results_new_time);

      if (driver.threshold >= new_trip_time - old_trip_time) {
        callback(null, new Match(rider.id, driver.id,
                                 this_endpoint,
                                 new_trip_time, rider.leave_date,
                                 new Time(leave_earliest),
                                 new Time(leave_latest)));
      } else {
        callback(null, null);
      }
    });
  });
}

function find_match(rider, driver, find_match_callback) {
  const rider_leave_earliest = rider.leave_earliest.getMinutes();
  const rider_leave_latest = rider.leave_latest.getMinutes();

  const driver_leave_earliest = driver.leave_earliest.getMinutes();
  const driver_leave_latest = driver.leave_latest.getMinutes();

  if (!driver.start_point.equals(rider.start_point) ||
      !same_date(rider, driver) ||
      driver_leave_earliest >= rider_leave_latest ||
      driver_leave_latest <= rider_leave_earliest) {
    find_match_callback(null, null);
  }


  async.map(rider.end_points, (x, callback) => valid_trips(driver, rider, x, callback),
            (err, res) => {
              if (err) {
                find_match_callback(err, null);
              }

              for (let i = 0; i < res.length; i++) {
                if (res[i]) {
                  find_match_callback(null, res[i]);
                }
              }

              find_match_callback(null, null);
            });
}


export function map_riders_to_drivers(riders, drivers, map_callback) {
  async.map(riders, (rider, callback1) => {
    async.map(drivers, (driver, callback2) => {
      find_match(rider, driver, (err, results) => {
        if (err) {
          callback2(err, null);
        }
        callback2(null, results);
      });
    }, (err, results) => {
      if (err) {
        callback1(err, null);
      }
      callback1(null, results.filter((x) => x != null));
    });
  }, (err, results) => {
    if (err) {
      map_callback(err, null);
    } else {
      map_callback(null, [].concat.apply([], results));
    }
  });
}
