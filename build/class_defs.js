"use strict";
var Coordinate = (function () {
    function Coordinate(x, y) {
        this.x = x;
        this.y = y;
    }
    Coordinate.prototype.equals = function (other) {
        return other.x == this.x && other.y == this.y;
    };
    Coordinate.prototype.toString = function () {
        return this.x.toString() + "," + this.y.toString();
    };
    return Coordinate;
}());
exports.Coordinate = Coordinate;
var Time = (function () {
    function Time(first, second) {
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
    Time.prototype.getMinutes = function () {
        return this.hour * 60 + this.minute;
    };
    return Time;
}());
exports.Time = Time;
var User = (function () {
    function User() {
    }
    User.prototype.constuctor = function (id, username, password, email, phone) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.email = email;
        this.phone = phone;
    };
    return User;
}());
exports.User = User;
var Driver = (function () {
    function Driver(id, user_id, leave_date, leave_earliest, leave_latest, waypoints, end_point, start_point, trip_time, threshold, price_seat, seats) {
        this.id = id;
        this.user_id = user_id;
        this.leave_date = leave_date;
        this.leave_earliest = leave_earliest;
        this.leave_latest = leave_latest;
        this.waypoints = waypoints;
        this.end_point = end_point;
        this.start_point = start_point;
        this.trip_time = trip_time;
        this.threshold = threshold;
        this.price_seat = price_seat;
        this.seats = seats;
    }
    Driver.prototype.stringify_waypoints = function () {
        var res = "";
        for (var i in this.waypoints) {
            res += this.waypoints[i].toString() + "|";
        }
        return res.slice(0, -1);
    };
    return Driver;
}());
exports.Driver = Driver;
var Rider = (function () {
    function Rider(id, user_id, leave_date, leave_earliest, leave_latest, end_points, start_point) {
        this.id = id;
        this.user_id = user_id;
        this.leave_date = leave_date;
        this.leave_earliest = leave_earliest;
        this.leave_latest = leave_latest;
        this.end_points = end_points;
        this.start_point = start_point;
    }
    return Rider;
}());
exports.Rider = Rider;
var Match = (function () {
    function Match(rider_id, driver_id, rider_end_point, new_trip_time, leave_date, leave_earliest, leave_latest) {
        this.rider_id = rider_id;
        this.driver_id = driver_id;
        this.rider_end_point = rider_end_point;
        this.new_trip_time = new_trip_time;
        this.leave_date = leave_date;
        this.leave_earliest = leave_earliest;
        this.leave_latest = leave_latest;
    }
    return Match;
}());
exports.Match = Match;
