"use strict";
let mysql = require("mysql");
let GoogleMapsAPI = require("googlemaps");
let async = require("async");
let match = require("../models/match");
exports.con = mysql.createConnection({
    host: "playground.ro.lt",
    user: "cera",
    password: "cera",
    database: "testing",
    multipleStatements: true
});
let publicConfig = {
    key: "AIzaSyB_1bO9S2BzI5TmiQDIIVT1G-9uMbVWUd8",
    stagger_time: 1000,
    encode_polylines: false,
    secure: true,
};
let gmAPI = new GoogleMapsAPI(publicConfig);
function start() {
    exports.con.connect(function (err) {
        if (err) {
            console.log("Error connecting to Db");
            // TODO: peloperly handle errors
            return err;
        }
        // console.log("Connection established");
    });
}
exports.start = start;
function end() {
    exports.con.end(function (err) {
        // The connection is terminated gracefully
        // Ensures all previously enqueued queries are still
        // before sending a COM_QUIT packet to the MySQL server.
        if (err)
            throw err;
    });
}
exports.end = end;
// User functions //
// Gets all current users
function getAllUser() {
    exports.con.query("SELECT * FROM `User`", function (err, rows) {
        if (err)
            throw err;
        console.log("Users:\n");
        console.log(rows);
        return rows;
    });
}
exports.getAllUser = getAllUser;
function getUserId(username, password, callback) {
    exports.con.query("SELECT id FROM `User` WHERE username = ? AND password = ?", [username, password], function (err, rows) {
        if (err)
            callback(err);
        else {
            console.log("User: \n");
            console.log(rows);
            callback(null, rows);
        }
    });
}
exports.getUserId = getUserId;
// Gets individual user based on id
function getUser(username, callback) {
    exports.con.query("SELECT * FROM `User` WHERE username = ?", [username], function (err, rows) {
        if (err)
            callback(err);
        else {
            console.log("User:\n");
            console.log(rows);
            callback(null, rows);
        }
    });
}
exports.getUser = getUser;
function addUser(username, email, phone, password, callback) {
    exports.con.query("INSERT INTO `User` (username, email, phone, password) VALUES (?, ?, ?, ?)", [username, email, phone, password], function (err, rows) {
        if (err) {
            callback(err);
        }
        else {
            console.log("Add user success");
            callback(err, rows.insertId);
        }
    });
}
exports.addUser = addUser;
function deleteUser(userId, callback) {
    exports.con.query("DELETE FROM `User` WHERE id = ?", [userId], function (err, rows) {
        if (err) {
            callback(err);
        }
        else {
            console.log("Delete user success");
            update_matches();
            callback(null, null);
        }
    });
}
exports.deleteUser = deleteUser;
function updateUser(userId, username, email, phone, callback) {
    exports.con.query("UPDATE `User` SET username = ?, email = ?, phone = ? WHERE id = ?", [username, email, phone, userId], function (err, rows) {
        if (err) {
            callback(err);
        }
        else {
            console.log("Update user success");
            update_matches();
            callback(null, null);
        }
    });
}
exports.updateUser = updateUser;
// Calculate the trip time
function calculate_trip_time(startId, endPoint, callback) {
    exports.con.query("SELECT coordinate FROM `ValidStarts` WHERE id = ?", [startId], function (err, rows) {
        if (err)
            throw err;
        let startPoint = rows[0]["coordinate"];
        gmAPI.directions({ origin: startPoint, destination: endPoint }, function (err, results) {
            if (err) {
                console.log("Error :( -> " + err);
                console.log("most likely invalid location input");
            }
            else {
                let new_trip_time = results.routes[0].legs.map(function (x) {
                    return x.duration.value;
                }).reduce(function (a, b) { return a + b; }, 0);
                callback(new_trip_time);
            }
        });
    });
}
exports.calculate_trip_time = calculate_trip_time;
// Rider functions //
// Gets all current riders
function getRider(callback) {
    exports.con.query("SELECT * FROM `Rider`", function (err, rows) {
        if (err)
            callback(err);
        console.log("Riders:\n");
        console.log(rows);
        callback(null, rows);
    });
}
exports.getRider = getRider;
function getRidersByUserId(userId, callback) {
    exports.con.query("SELECT * FROM `Rider` WHERE userId = ?", [userId], function (err, rows) {
        if (err)
            callback(err);
        else {
            console.log("Found " + rows.length + " riders entries associated with " + userId);
            callback(null, rows);
        }
    });
}
exports.getRidersByUserId = getRidersByUserId;
// Gets rider given id
function getAllRider(riderId, callback) {
    exports.con.query("SELECT * FROM `Rider` WHERE id = ?", [riderId], function (err, rows) {
        if (err)
            callback(err);
        console.log("Rider:\n");
        console.log(rows);
        callback(null, rows);
    });
}
exports.getAllRider = getAllRider;
function addRider(userId, leaveDate, leaveEarliest, leaveLatest, startId, endPoints, callback) {
    exports.con.query("INSERT INTO `Rider` (userId, leave_date, leave_earliest, leave_latest, startId, end_points) VALUES (?, ?, ?, ?, ?, ?)", [userId, leaveDate, leaveEarliest, leaveLatest, startId, endPoints], function (err, rows) {
        if (err) {
            callback(err);
        }
        else {
            console.log("Add rider success " + rows.insertId);
            update_matches();
            callback(null, rows.insertId);
        }
    });
}
exports.addRider = addRider;
function deleteRider(riderId, callback) {
    exports.con.query("DELETE FROM `Rider` WHERE id = ?", [riderId], function (err, rows) {
        if (err) {
            callback(err);
        }
        else {
            console.log("Delete rider success");
            update_matches();
            callback(null, null);
        }
    });
}
exports.deleteRider = deleteRider;
function updateRider(riderId, leaveEarliest, leaveLatest, startId, endPoints, callback) {
    exports.con.query("UPDATE `Rider` SET leave_earliest = ?, leave_latest = ?, startId = ?, end_points = ?, phone = ? WHERE id = ?", [leaveEarliest, leaveLatest, startId, endPoints, riderId], function (err, rows) {
        if (err) {
            callback(err);
        }
        else {
            console.log("Update rider success");
            update_matches();
            callback(null, null);
        }
    });
}
exports.updateRider = updateRider;
// Driver functions
// Gets all current drivers
function getAllDriver(callback) {
    exports.con.query("SELECT * FROM `Driver`", function (err, rows) {
        if (err)
            callback(err);
        console.log("Driver:\n");
        console.log(rows);
        callback(null, rows);
    });
}
exports.getAllDriver = getAllDriver;
function getDriversByUserId(userId, callback) {
    exports.con.query("SELECT * FROM `Driver` WHERE userId = ?", [userId], function (err, rows) {
        if (err)
            callback(err);
        else {
            console.log("Found " + rows.length + " driver entries associated with " + userId);
            callback(null, rows);
        }
    });
}
exports.getDriversByUserId = getDriversByUserId;
// Gets rider given id
function getDriver(driverId, callback) {
    exports.con.query("SELECT * FROM `Driver` WHERE id = ?", [driverId], function (err, rows) {
        if (err)
            callback(err);
        console.log("Driver:\n");
        console.log(rows);
        callback(null, rows);
    });
}
exports.getDriver = getDriver;
function addDriver(userId, leaveDate, leaveEarliest, leaveLatest, waypoints, endPoint, startId, threshold, priceSeat, seat, callback) {
    calculate_trip_time(startId, endPoint, function (result) {
        let trip_time = result;
        exports.con.query("INSERT INTO `Driver` (userId, leave_date, leave_earliest, leave_latest, waypoints, end_point, startId, trip_time, threshold, price_seat, seats) VALUES (?, str_to_date(?, \"%e %M, %Y\"), ?, ?, ?, ?, ?, ?, ?, ?, ?)", [userId, leaveDate, leaveEarliest, leaveLatest, waypoints, endPoint, startId, trip_time, threshold, priceSeat, seat], function (err, rows) {
            if (err) {
                callback(err);
            }
            else {
                console.log(userId + " " + leaveEarliest);
                console.log("Add driver success" + rows.insertId);
                update_matches();
                callback(null, rows.insertId);
            }
        });
    });
}
exports.addDriver = addDriver;
function deleteDriver(driverId, callback) {
    exports.con.query("DELETE FROM `Driver` WHERE id = ?", [driverId], function (err, rows) {
        if (err) {
            callback(err);
        }
        else {
            console.log("Delete driver success");
            update_matches();
            callback(null, null);
        }
    });
}
exports.deleteDriver = deleteDriver;
function updateDriver(driverId, leaveDate, leaveEarliest, leaveLatest, waypoints, endPoints, startId, threshold, priceSeat, seat, callback) {
    exports.con.query("UPDATE `Driver` SET leave_date = str_to_date(?, \"%e %M, %Y\"), leave_earliest = ?, leave_latest = ?, waypoint = ?, end_points = ?, startId = ?, threshold = ?, price_seat = ?, seat = ? WHERE id = ?", [leaveDate, leaveEarliest, leaveLatest, waypoints, endPoints, startId, threshold, priceSeat, seat, driverId], function (err, rows) {
        if (err) {
            callback(err);
        }
        else {
            console.log("Update driver success");
            callback(null, null);
            update_matches();
        }
    });
}
exports.updateDriver = updateDriver;
function get_matches_rider(riderId, callback) {
    exports.con.query("SELECT * FROM `Match` WHERE id = ?", [riderId], function (err, rows) {
        console.log("Requesting matches for rider " + riderId);
        if (err)
            callback(err);
        else
            callback(null, rows);
    });
}
exports.get_matches_rider = get_matches_rider;
function get_matches_driver(driverId, callback) {
    exports.con.query("SELECT * FROM `Match` WHERE driverId = ?", [driverId], function (err, rows) {
        console.log("Requesting matches for driver " + driverId);
        if (err)
            callback(err);
        else
            callback(null, rows);
    });
}
exports.get_matches_driver = get_matches_driver;
function update_matches() {
    exports.con.query("SELECT Driver.id `id`, leave_date, leave_earliest, leave_latest, waypoints, end_point, coordinate start_point, trip_time, threshold from `Driver` join `ValidStarts` where startId = ValidStarts.id", [], function (err, drivers) {
        if (err)
            throw err;
        exports.con.query("SELECT Rider.id `id`, leave_date, leave_earliest, leave_latest, coordinate start_point, end_points from `Rider` join `ValidStarts` where startId = ValidStarts.id", [], function (err, riders) {
            if (err)
                throw err;
            exports.con.query("Truncate table `Match`", [], function (err, throwAway) {
                if (err)
                    throw err;
                match.map_riders_to_drivers(riders, drivers, function (results) {
                    console.log("ay");
                    async.each(results, function (result, callback) {
                        exports.con.query("INSERT INTO `Match` values (?, ?, ?, ?)", [result.rider_id, result.driver_id, result.rider_end_point,
                            result.new_trip_time], function (err, extra) {
                            if (err) {
                                throw err;
                            }
                        });
                    });
                });
            });
        });
    });
}
exports.update_matches = update_matches;
//# sourceMappingURL=database.js.map