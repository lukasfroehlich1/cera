"use strict";

export class Coordinate {
    x: number;
    y: number;

    constructor (x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    equals(other: Coordinate): boolean {
        return other.x === this.x && other.y === this.y;
    }

    toString(): string {
        return this.x.toString() + "," + this.y.toString();
    }
}

export class Time {
    hour: number;
    minute: number;

    constructor(minutes: number);
    constructor(hour: number, minute: number);
    constructor(first: number, second?: number) {
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

    getMinutes(): number {
        return this.hour * 60 + this.minute;
    }
}


export class User {
    id: number;
    username: string;
    password: string;
    email: string;
    phone: string;

    constuctor(id: number, username: string, password: string,
               email: string, phone: string) {

        this.id = id;
        this.username = username;
        this.password = password;
        this.email = email;
        this.phone = phone;
    }
}

export interface Traveler {
    leave_date: Date;
    leave_earliest: Time;
    leave_latest: Time;
    start_point: Coordinate;
}

export class Driver implements Traveler {
    id: number;
    user_id: number;
    leave_date: Date;
    leave_earliest: Time;
    leave_latest: Time;
    waypoints: Array<Coordinate>;
    end_point: Coordinate;
    start_point: Coordinate;
    threshold: number;
    price_seat: number;
    seats: number;

    constructor(id: number, user_id: number, leave_date: Date,
                leave_earliest: Time, leave_latest: Time,
                waypoints: Array<Coordinate>, end_point: Coordinate,
                start_point: Coordinate, threshold: number,
                price_seat: number, seats: number) {

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

    stringify_waypoints(): string {
        let res = "";

        for (let i in this.waypoints) {
            res += this.waypoints[i].toString() + "|";
        }

        return res.slice(0, -1);
    }
}

export class Rider implements Traveler {
    id: number;
    user_id: number;
    leave_date: Date;
    leave_earliest: Time;
    leave_latest: Time;
    end_points: Array<Coordinate>;
    start_point: Coordinate;

    constructor(id: number, user_id: number, leave_date: Date,
                leave_earliest: Time, leave_latest: Time,
                end_points: Array<Coordinate>, start_point: Coordinate) {

        this.id = id;
        this.user_id = user_id;
        this.leave_date = leave_date;
        this.leave_earliest = leave_earliest;
        this.leave_latest = leave_latest;
        this.end_points = end_points;
        this.start_point = start_point;
    }
}


export class Match {
    rider_id: number;
    driver_id: number;
    rider_end_point: Coordinate;
    new_trip_time: number;
    leave_date: Date;
    leave_earliest: Time;
    leave_latest: Time;

    constructor(rider_id: number, driver_id: number, rider_end_point: Coordinate,
                new_trip_time: number, leave_date: Date, leave_earliest: Time,
                leave_latest: Time) {

        this.rider_id = rider_id;
        this.driver_id = driver_id;
        this.rider_end_point = rider_end_point;
        this.new_trip_time = new_trip_time;
        this.leave_date = leave_date;
        this.leave_earliest = leave_earliest;
        this.leave_latest = leave_latest;
    }
}
