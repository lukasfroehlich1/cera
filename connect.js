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

// User functions
connect.getUser = function () {
    con.query("SELECT * FROM Driver", function (err, rows) {
        if (err) throw err;
        console.log('Data received from Db:\n');
        console.log(rows); 
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
    con.query("DELETE FROM User WHERE id = ?", [userId],  function (err, rows) {
        if (err) {
            throw err;
        }
        else {
            console.log('Delete user success');
        }    
    });
}

connect.updateUser = function (userId, username, email, phone) {
    con.query("UPDATE User SET username = ?, email = ?, phone = ? WHERE id = ?", [username, email, phone, userId],
    function (err, rows) {
        if (err) {
            throw err;
        }
        else {
            console.log('Update user success');
        }
    });
}

// Rider functions

// Driver functions
