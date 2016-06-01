"use strict";
class Coordinate {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    equals(other) {
        return other.x === this.x && other.y === this.y;
    }
    toString() {
        return this.x.toString() + "," + this.y.toString();
    }
}
exports.Coordinate = Coordinate;
class Time {
    constructor(first, second) {
        if (second != null) {
            if (first < 0 || first > 24 || second < 0 || second > 60) {
                throw new Error("Invalid time input");
            }
            this.hour = first;
            this.minute = second;
        }
        else {
            if (first > 1440 || first < 0) {
                throw new Error("Invalid time input");
            }
            this.hour = Math.floor(first / 60);
            this.minute = first % 60;
        }
    }
    getMinutes() {
        return this.hour * 60 + this.minute;
    }
}
exports.Time = Time;
class User {
    constuctor(id, username, password, email, phone) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.email = email;
        this.phone = phone;
    }
}
exports.User = User;
class Driver {
    constructor(id, user_id, leave_date, leave_earliest, leave_latest, waypoints, end_point, start_point, threshold, price_seat, seats) {
        this.id = id;
        this.user_id = user_id;
        this.leave_date = leave_date;
        this.leave_earliest = leave_earliest;
        this.leave_latest = leave_latest;
        this.waypoints = waypoints;
        this.end_point = end_point;
        this.start_point = start_point;
        this.threshold = threshold;
        this.price_seat = price_seat;
        this.seats = seats;
    }
    stringify_waypoints() {
        let res = "";
        for (let i in this.waypoints) {
            res += this.waypoints[i].toString() + "|";
        }
        return res.slice(0, -1);
    }
}
exports.Driver = Driver;
class Rider {
    constructor(id, user_id, leave_date, leave_earliest, leave_latest, end_points, start_point) {
        this.id = id;
        this.user_id = user_id;
        this.leave_date = leave_date;
        this.leave_earliest = leave_earliest;
        this.leave_latest = leave_latest;
        this.end_points = end_points;
        this.start_point = start_point;
    }
}
exports.Rider = Rider;
class Match {
    constructor(rider_id, driver_id, rider_end_point, new_trip_time, leave_date, leave_earliest, leave_latest) {
        this.rider_id = rider_id;
        this.driver_id = driver_id;
        this.rider_end_point = rider_end_point;
        this.new_trip_time = new_trip_time;
        this.leave_date = leave_date;
        this.leave_earliest = leave_earliest;
        this.leave_latest = leave_latest;
    }
}
exports.Match = Match;
//# sourceMappingURL=class_defs.js.map