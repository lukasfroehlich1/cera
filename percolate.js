var match = require('./match');

get_matches = function(riderId) {
    con.query("SELECT * FROM `Match` WHERE id = ?", [riderId], function(err, rows) { 
        if ( err ) throw err;
        console.log("Requesting matches");
        return rows;
    });
}

update_matches = function() {
    con.query("SELECT id, leave_date, leave_earliest, leave_latest, waypoints, end_point, coordinate start_point, trip_time, threshold from `Driver` join `ValidStarts` where startId = ValidStarts.id", [], function(err, drivers) {
        if (err) throw err;


        con.query("SELECT id, leave_date, leave_earliest, leave_latest, coordinate start_point, end_points from `Rider` join `ValidStarts` where startId = ValidStarts.id", [], function(err, riders) {

            if (err) throw err;

            con.query("Truncate table `Match`", [], function(err, riders) {

                if (err) throw err;

                match.map_riders_to_drivers(riders, drivers, function(results) {

                    con.query("INSERT INTO `Match` values (?, ?, ?, ?)", [results.rider_id, results.driver_id, results.rider_end_point, results.new_trip_time], function(err, riders) {

                        if (err) throw err;
                    }
                }
            }
        }
    }
}
