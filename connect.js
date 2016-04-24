var mysql = require('mysql');
var GoogleMapsAPI = require('googlemaps');
var async = require('async');
var match = require('./match');
var connect = module.exports = {};

var con = mysql.createConnection({
    host: "west-mysql-instance1.cxihylgafwaw.us-west-1.rds.amazonaws.com",
    user: "root",
    password: "sbhacksadmin",
    database: "cera"
});

var publicConfig = {
  key: 'AIzaSyB_1bO9S2BzI5TmiQDIIVT1G-9uMbVWUd8',
  stagger_time:       1000, // for elevationPath
  encode_polylines:   false,
  secure:             true, // use https
};

var gmAPI = new GoogleMapsAPI(publicConfig);

connect.start = function () {
    con.connect(function (err) {
        if (err) {
            console.log('Error connecting to Db');
            return;
        }
        console.log('Connection established');
    });
}

connect.end = function () {
    con.end(function(err) {
        // The connection is terminated gracefully
        // Ensures all previously enqueued queries are still
        // before sending a COM_QUIT packet to the MySQL server.
        if (err) throw err;
    });
}

// User functions //
// Gets all current users
connect.getUser = function () {
    con.query("SELECT * FROM `User`", function (err, rows) {
        if (err) throw err;
        console.log('Users:\n');
        console.log(rows); 
        return rows;
    });
}

connect.getUserId = function(username, password, callback) {
    con.query("SELECT id FROM `User` WHERE username = ? AND password = ?", [username, password], function(err, rows) {
        if ( err )
            callback(err);
        else {
            console.log('User: \n');
            console.log(rows);
            callback(null, rows);
        }
    });
}

// Gets individual user based on id
connect.getUser = function (username, callback) {
    con.query("SELECT * FROM `User` WHERE username = ?", [username], function (err, rows) {
        if (err)
            callback(err);
        else {
            console.log('User:\n');
            console.log(rows);
            callback(null, rows);
        }
    });
}

connect.addUser = function (username, email, phone, password, callback) {
    con.query("INSERT INTO `User` (username, email, phone, password) VALUES (?, ?, ?, ?)", [username, email, phone, password], 
    function (err, rows) {
        if (err) {
            callback(err)
        }
        else {
            console.log('Add user success');
            callback(err, rows.insertId);
        }       
    });
}

connect.deleteUser = function (userId, callback) {
    con.query("DELETE FROM `User` WHERE id = ?", [userId],  function (err, rows) {
        if (err) {
            callback(err);
        }
        else {
            console.log('Delete user success');
            connect.update_matches();
            callback(null, null);
        }    
    });
}

connect.updateUser = function (userId, username, email, phone, callback) {
    con.query("UPDATE `User` SET username = ?, email = ?, phone = ? WHERE id = ?", [username, email, phone, userId],
    function (err, rows) {
        if (err) {
            callback(err);
        }
        else {
            console.log('Update user success');
            connect.update_matches();
            callback(null, null);
        }
    });
}

// Calculate the trip time
connect.calculate_trip_time = function (startId, endPoint, callback) {
    con.query("SELECT coordinate FROM `ValidStarts` WHERE id = ?", [startId], function(err, rows) { 
        if ( err )
            throw err;
        startPoint = rows[0]["coordinate"];
        gmAPI.directions({origin: startPoint, destination: endPoint}, function(err, results) {
                    if (err) {
                        console.log('Error :( -> ' + err);
                        console.log('most likely invalid location input');
                    }else {
                        //console.log(startPoint);
                        //console.log(results);
                        var new_trip_time = results.routes[0].legs.map(function (x) { 
                            return x.duration.value;
                        }).reduce(function (a, b) { return a + b; }, 0);
                        callback(new_trip_time);
                    }
                });
        });
}

// Rider functions //
// Gets all current riders
connect.getRider = function (callback) {
    con.query("SELECT * FROM `Rider`", function (err, rows) {
        if (err) callback(err);
        console.log('Riders:\n');
        console.log(rows); 
        callback(null, rows);
    });
}

connect.getRidersByUserId = function (userId, callback) {
    con.query("SELECT * FROM `Rider` WHERE userId = ?", [userId], function (err, rows) {
        if ( err )
            callback(err);
        else {
            console.log("Found " + rows.length + " riders entries associated with " + userId);
            callback(null, rows);
        }
    });
}

// Gets rider given id
connect.getRider = function (riderId, callback) {
    con.query("SELECT * FROM `Rider` WHERE id = ?", [riderId], function (err, rows) {
        if (err) callback(err);
        console.log('Rider:\n');
        console.log(rows); 
        callback(null, rows);
    });
}

connect.addRider = function (userId, leaveDate, leaveEarliest, leaveLatest, startId, endPoints, callback) {
    con.query(
        "INSERT INTO `Rider` (userId, leave_date, leave_earliest, leave_latest, startId, end_points) VALUES (?, ?, ?, ?, ?, ?)",
        [userId, leaveDate, leaveEarliest, leaveLatest, startId, endPoints],
        function (err, rows) {
            if (err) {
                callback(err)
            }
            else {
                console.log('Add rider success ' + rows.insertId);
                connect.update_matches();
                callback(null, rows.insertId);

            }
    });
}

connect.deleteRider = function (riderId, callback) {
    con.query("DELETE FROM `Rider` WHERE id = ?", [riderId], function (err, rows) {
        if (err) {
            callback(err);
        }
        else {
            console.log('Delete rider success');
            connect.update_matches();
            callback(null, null);
        } 
    });
}

connect.updateRider = function (riderId, leaveEarliest, leaveLatest, startId, endPoints, callback) {
    con.query("UPDATE `Rider` SET leave_earliest = ?, leave_latest = ?, startId = ?, end_points = ?, phone = ? WHERE id = ?", [leaveEarliest, leaveLatest, startId, endPoints, riderId], function (err, rows) {
        if (err) {
            callback(err);
        }
        else {
            console.log('Update rider success');
            connect.update_matches();
            callback(null, null);
        }
    });
}

// Driver functions
// Gets all current drivers
connect.getDriver = function (callback) {
    con.query("SELECT * FROM `Driver`", function (err, rows) {
        if (err) callback(err);
        console.log('Driver:\n');
        console.log(rows); 
        callback(null, rows);
    });
}

connect.getDriversByUserId = function(userId, callback) {
    con.query("SELECT * FROM `Driver` WHERE userId = ?", [userId], function (err, rows) {
        if ( err )
            callback(err);
        else {
            console.log("Found " + rows.length + " driver entries associated with " + userId);
            callback(null, rows);
        }
    });
}

// Gets rider given id
connect.getDriver = function (driverId, callback) {
    con.query("SELECT * FROM `Driver` WHERE id = ?", [driverId], function (err, rows) {
        if (err) callback(err);
        console.log('Driver:\n');
        console.log(rows); 
        callback(null, rows);
    });
}

connect.addDriver = function (userId, leaveDate, leaveEarliest, leaveLatest, waypoints, endPoint, startId, threshold, priceSeat, seat, callback) {
    connect.calculate_trip_time(startId, endPoint, function(result){
        var trip_time = result;
        con.query("INSERT INTO `Driver` (userId, leave_date, leave_earliest, leave_latest, waypoints, end_point, startId, trip_time, threshold, price_seat, seats) VALUES (?, str_to_date(?, \"%e %M, %Y\"), ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [userId, leaveDate, leaveEarliest, leaveLatest, waypoints, endPoint, startId, trip_time, threshold, priceSeat, seat], function (err, rows) {
            if (err) {
                callback(err);
            }
            else {
                console.log(userId + " " + leaveEarliest);
                console.log('Add driver success' + rows.insertId);
                connect.update_matches();
                callback(null, rows.insertId);
            }
        });
    });
}  

connect.deleteDriver = function (driverId, callback) {
    con.query("DELETE FROM `Driver` WHERE id = ?", [driverId], function (err, rows) {
        if (err) {
            callback(err);
        }
        else {
            console.log('Delete driver success');
            connect.update_matches();
            callback(null, null);
        } 
    });
}

connect.updateDriver = function (driverId, leaveDate, leaveEarliest, leaveLatest, waypoints, endPoints, startId, threshold, priceSeat, seat, callback) {
    con.query("UPDATE `Driver` SET leave_date = str_to_date(?, \"%e %M, %Y\"), leave_earliest = ?, leave_latest = ?, waypoint = ?, end_points = ?, startId = ?, threshold = ?, price_seat = ?, seat = ? WHERE id = ?", 
            [leaveDate, leaveEarliest, leaveLatest, waypoints, endPoints, startId, threshold, priceSeat, seat, driverId], function (err, rows) {
        if (err) {
            callback(err);
        }
        else {
            console.log('Update driver success');
            callback(null, null);
            connect.update_matches();
        }
    });
}

//connect.addDriver(2,"5 April, 2016","15:04","17:20","","UCLA",2,500,20,5);


connect.get_matches_rider = function(riderId, callback) {
    con.query("SELECT * FROM `Match` WHERE id = ?", [riderId], function(err, rows) { 
        console.log("Requesting matches for rider " + riderId);
        if ( err )
            callback(err);
        else
            callback(null, rows);
    });
}

connect.get_matches_driver = function(driverId, callback) {
    con.query("SELECT * FROM `Match` WHERE driverId = ?", [driverId], function(err, rows) { 
        console.log("Requesting matches for driver " + driverId);
        if ( err )
            callback(err);
        else
            callback(null, rows);
    });
}

connect.update_matches = function() {
    con.query("SELECT Driver.id `id`, leave_date, leave_earliest, leave_latest, waypoints, end_point, coordinate start_point, trip_time, threshold from `Driver` join `ValidStarts` where startId = ValidStarts.id", [], function(err, drivers) {
        if (err) throw err;
        con.query("SELECT Rider.id `id`, leave_date, leave_earliest, leave_latest, coordinate start_point, end_points from `Rider` join `ValidStarts` where startId = ValidStarts.id", [], function(err, riders) {
            if (err) 
                throw err;
            con.query("Truncate table `Match`", [], function(err, throwAway) {
                if (err) 
                    throw err;
                match.map_riders_to_drivers(riders, drivers, function(results) {
                    console.log('ay');              
                    async.each(results, function(result, callback) {
                        con.query("INSERT INTO `Match` values (?, ?, ?, ?)", 
                            [result.rider_id, result.driver_id, result.rider_end_point, 
                            result.new_trip_time], function(err, extra) {

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

connect.update_matches();
