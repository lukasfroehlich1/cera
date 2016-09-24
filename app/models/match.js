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

function lookup_trip(conf, callback) {
  gmAPI.directions(conf, (err, results) => {
    if (err) {
      callback(null, null);   // treating errors as no results
      return;
    }

    callback(null, results);
  });
}


// valid_trip consumes a driver, rider, current_endpoint and determines if the current trip is valid
// returns match if valid and null if not
function valid_trip(rider, driver, current_endpoint, valid_trip_callback) {
  const rider_leave_earliest = rider.leave_earliest.getMinutes();
  const rider_leave_latest = rider.leave_latest.getMinutes();

  const driver_leave_earliest = driver.leave_earliest.getMinutes();
  const driver_leave_latest = driver.leave_latest.getMinutes();

  const leave_earliest = Math.max(rider_leave_earliest, driver_leave_earliest);
  const leave_latest = Math.min(rider_leave_latest, driver_leave_latest);


  // departure_time: (leave_earliest + leave_latest) / 2
  // TODO could use leave date to calcuate time in the future. incorporate into both calls

  const new_trip_conf = {
    origin: driver.start_point.toString(), destination: driver.end_point.toString(),
    waypoints: `optimize:true|${driver.stringify_waypoints()}|${current_endpoint.toString()}`,
  };

  // TODO does not consider the drivers current waypoints
  const old_trip_conf = {
    origin: driver.start_point.toString(), destination: driver.end_point.toString(),
  };

  async.map([new_trip_conf, old_trip_conf], lookup_trip, (err, results) => {
    if (err) {
      valid_trip_callback(err);
      return;
    }

    const new_trip_time = trip_time(results[0]);
    const old_trip_time = trip_time(results[1]);

    if (driver.threshold >= new_trip_time - old_trip_time) {
      const new_match = new Match(rider.id,
                                  driver.id,
                                  current_endpoint,
                                  new_trip_time,
                                  rider.leave_date,
                                  new Time(leave_earliest),
                                  new Time(leave_latest));

      valid_trip_callback(null, new_match);
    } else {
      valid_trip_callback(null, null);
    }
  });
}


// valid_trip consumes a single rider, driver and returns a match if one was found or null if none.
// will consider the riders endpoint preference.
function find_match(rider, driver, match_callback) {
  const rider_leave_earliest = rider.leave_earliest.getMinutes();
  const rider_leave_latest = rider.leave_latest.getMinutes();

  const driver_leave_earliest = driver.leave_earliest.getMinutes();
  const driver_leave_latest = driver.leave_latest.getMinutes();

  if (!driver.start_point.equals(rider.start_point) ||
      !same_date(rider, driver) ||
      driver_leave_earliest >= rider_leave_latest ||
      driver_leave_latest <= rider_leave_earliest) {
    match_callback(null, null);
    return;
  }

  const connector = (item, callback) => valid_trip(rider, driver, item, callback);

  async.map(rider.end_points, connector, (err, res) => {
    if (err) {
      match_callback(err);
      return;
    }

    for (let i = 0; i < res.length; i++) {
      if (res[i]) {
        match_callback(null, res[i]);
        return;
      }
    }

    match_callback(null, null);
  });
}

export function map_riders_to_drivers(riders, drivers, map_callback) {
  async.map(riders, (rider, callback1) => {
    async.map(drivers, (driver, callback2) => {
      find_match(rider, driver, (err, results) => {
        if (err) {
          callback2(err, null);
          return;
        }

        callback2(null, results);
      });
    }, (err, results) => {
      if (err) {
        callback1(err, null);
        return;
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
