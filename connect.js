var mysql = require('mysql');
var connect = module.exports = {};

var con = mysql.createConnection({
    host: "west-mysql-instance1.cxihylgafwaw.us-west-1.rds.amazonaws.com",
    user: "root",
    password: "sbhacksadmin",
    database: "cera"
});

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

connect.getUserId = function(username) {
    con.query("SELECT id FROM `User` WHERE username = ?", [username], function(err, rows) {
        if ( err ) throw err;
        console.log('User: \n');
        console.log(rows);
        return rows.userId;
    });
}

// Gets individual user based on id
connect.getUser = function (userId) {
    con.query("SELECT * FROM `User` WHERE userId = ?", [userId], function (err, rows) {
        if (err) throw err;
        console.log('User:\n');
        console.log(rows);
        return rows;
    });
}

connect.addUser = function (username, email, phone) {
    con.query("INSERT INTO `User` (username, email, phone) VALUES (?, ?, ?)", [username, email, phone], 
    function (err, rows) {
        if (err) {
            throw err;
        }
        else {
            console.log('Add user success');
        }       
    });
}

connect.deleteUser = function (userId) {
    con.query("DELETE FROM `User` WHERE id = ?", [userId],  function (err, rows) {
        if (err) {
            throw err;
        }
        else {
            console.log('Delete user success');
        }    
    });
}

connect.updateUser = function (userId, username, email, phone) {
    con.query("UPDATE `User` SET username = ?, email = ?, phone = ? WHERE id = ?", [username, email, phone, userId],
    function (err, rows) {
        if (err) {
            throw err;
        }
        else {
            console.log('Update user success');
        }
    });
}

// Rider functions //
// Gets all current riders
connect.getRider = function () {
    con.query("SELECT * FROM `Rider`", function (err, rows) {
        if (err) throw err;
        console.log('Riders:\n');
        console.log(rows); 
        return rows;
    });
}

// Gets rider given id
connect.getRider = function (riderId) {
    con.query("SELECT * FROM `Rider` WHERE id = ?", [riderId], function (err, rows) {
        if (err) throw err;
        console.log('Rider:\n');
        console.log(rows); 
        return rows;
    });
}

connect.addRider = function (userId, leaveEarliest, leaveLatest, startId, endPoints) {
    con.query(
        "INSERT INTO `Rider` (userId, leave_earliest, leave_latest, startId, end_points) VALUES (?, ?, ?, ?, ?)",
        [userId, leaveEarliest, leaveLatest, startId, endPoints],
        function (err, rows) {
            if (err) {
                throw err;
            }
            else {
                console.log('Add rider success');
            }
    });
}

connect.deleteRider = function (riderId) {
    con.query("DELETE FROM `Rider` WHERE id = ?", [riderId], function (err, rows) {
        if (err) {
            throw err;
        }
        else {
            console.log('Delete rider success');
        } 
    });
}

connect.updateRider = function (riderId, leaveEarliest, leaveLatest, startId, endPoints) {
    con.query("UPDATE `Rider` SET leave_earliest = ?, leave_latest = ?, startId = ?, end_points = ?, phone = ? WHERE id = ?", [leaveEarliest, leaveLatest, startId, endPoints, riderId], function (err, rows) {
        if (err) {
            throw err;
        }
        else {
            console.log('Update rider success');
        }
    });
}

// Driver functions
// Gets all current drivers
connect.getDriver = function () {
    con.query("SELECT * FROM `Driver`", function (err, rows) {
        if (err) throw err;
        console.log('Driver:\n');
        console.log(rows); 
        return rows;
    });
}

// Gets rider given id
connect.getDriver = function (driverId) {
    con.query("SELECT * FROM `Driver` WHERE id = ?", [driverId], function (err, rows) {
        if (err) throw err;
        console.log('Driver:\n');
        console.log(rows); 
        return rows;
    });
}

connect.addDriver = function (userId, leaveEarliest, leaveLatest, waypoints, endPoints, startId, threshold, priceSeat, seat) {
    con.query("INSERT INTO `Driver` (userId, leave_earliest, leave_latest, waypoints, end_point, startId, threshold, price_seat, seats) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [userId, leaveEarliest, leaveLatest, waypoints, endPoints, startId, threshold, priceSeat, seat], function (err, rows) {
        if (err) {
            throw err;
        }
        else {
            console.log('Add driver success');
            console.log(rows);
        }
    });
}  

connect.deleteDriver = function (driverId) {
    con.query("DELETE FROM `Driver` WHERE id = ?", [driverId], function (err, rows) {
        if (err) {
            throw err;
        }
        else {
            console.log('Delete driver success');
        } 
    });
}

connect.updateDriver = function (driverId, leaveEarliest, leaveLatest, waypoints, endPoints, startId, threshold, priceSeat, seat) {
    con.query("UPDATE `Driver` SET leave_earliest = ?, leave_latest = ?, waypoint = ?, end_points = ?, startId = ?, threshold = ?, price_seat = ?, seat = ? WHERE id = ?", [leaveEarliest, leaveLatest, waypoints, endPoints, startId, threshold, priceSeat, seat, driverId], function (err, rows) {
        if (err) {
            throw err;
        }
        else {
            console.log('Update driver success');
        }
    });
}