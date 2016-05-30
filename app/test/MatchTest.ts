"use strict";

import {expect} from "chai";
import {map_riders_to_drivers} from "../models/match";
import {Rider, Driver, Coordinate, Match, Time} from "../models/class_defs";

describe("Matching", () => {

    let sf = new Coordinate(37.7749, -122.4194);
    let sj = new Coordinate(37.3382, -121.8863);
    let oaktown = new Coordinate(37.8044, -122.2711);
    let san_mateo = new Coordinate(37.5630, -122.3255);
    let cp = new Coordinate(35.3050, -120.6625);

    describe("#validSingleMatch()", () => {
        it("should produce 1 result. simple case", (done) => {
            let rider1 = new Rider(1, 10, new Date("2011-12-01 00:00:00"), new Time(16, 34), new Time(19, 24), [sj], cp);
            let driver1 = new Driver(1, 11, new Date("2011-12-01 00:00:00"), new Time(15, 0), new Time(17, 0), [], sf, cp, 12420, 1600, 20, 3);
             map_riders_to_drivers([rider1], [driver1], (err: any, res: Array<Match>) => {
                 if (err) { done(err); }
                 expect(res).to.have.length(1);
                 done();
             });
        });

        it("should produce 1 result. Date has leftover time", (done) => {
            let rider1 = new Rider(1, 10, new Date("2011-12-01 20:00:00"), new Time(14, 34), new Time(15, 21), [sj], cp);
            let driver1 = new Driver(1, 11, new Date("2011-12-01 00:23:00"), new Time(13, 21), new Time(17, 0), [], sf, cp, 13200, 1200, 20, 3);
             map_riders_to_drivers([rider1], [driver1], (err: any, res: Array<Match>) => {
                 if (err) { done(err); }
                 expect(res).to.have.length(1);
                 done();
             });
        });
    });

    describe("#timeChecks()", () => {
        it("should produce no results. times dont overlap. using minute form", (done) => {
            let rider1 = new Rider(1, 10, new Date("2011-12-01 00:00:00"), new Time(803), new Time(1320), [sj], cp);
            let driver1 = new Driver(1, 11, new Date("2011-12-01 00:00:00"), new Time(0), new Time(758), [], sf, cp, 13200, 1200, 20, 3);
             map_riders_to_drivers([rider1], [driver1], (err: any, res: Array<Match>) => {
                 if (err) { done(err); }
                 expect(res).to.have.length(0);
                 done();
             });
        });

        // it("should produce 1 results. times overlap. using minute form", (done) => {
        //     let rider1 = new Rider(1, 10, new Date("2011-12-01 00:00:00"), new Time(703), new Time(920), [sj], cp);
        //     let driver1 = new Driver(1, 11, new Date("2011-12-01 00:00:00"), new Time(510), new Time(858), [], sf, cp, 13200, 1200, 20, 3);

        //     map_riders_to_drivers([rider1], [driver1], (err: any, res: Array<Match>) => {
        //         if (err) { done(err); }
        //         // expect(res).to.have.length(1);
        //         // Something is weird here
        //         // TODO look into this and its effects
        //         done();
        //     });
        // });

        it("should produce no results. times dont overlap", (done) => {
            let rider1 = new Rider(1,
                                   10,
                                   new Date("2011-12-01 00:00:00"),
                                   new Time(14, 34),
                                   new Time(15, 21),
                                   [sj],
                                   cp);
            let driver1 = new Driver(1, 11, new Date("2011-12-01 00:00:00"), new Time(15, 21), new Time(17, 0), [], sf, cp, 13200, 1200, 20, 3);
             map_riders_to_drivers([rider1], [driver1], (err: any, res: Array<Match>) => {
                 if (err) { done(err); }
                 expect(res).to.have.length(0);
                 done();
             });
        });

        it("should produce no results. months dont overlap", (done) => {
            let rider1 = new Rider(1, 10, new Date("2011-11-01 00:00:00"), new Time(14, 34), new Time(15, 21), [sj], cp);
            let driver1 = new Driver(1, 11, new Date("2011-12-01 00:00:00"), new Time(13, 21), new Time(17, 0), [], sf, cp, 13200, 1200, 20, 3);
             map_riders_to_drivers([rider1], [driver1], (err: any, res: Array<Match>) => {
                 if (err) { done(err); }
                 expect(res).to.have.length(0);
                 done();
             });
        });

        it("should produce no results. dates dont overlap", (done) => {
            let rider1 = new Rider(1, 10, new Date("2011-12-02 00:00:00"), new Time(14, 34), new Time(15, 21), [sj], cp);
            let driver1 = new Driver(1, 11, new Date("2011-12-01 00:00:00"), new Time(13, 21), new Time(17, 0), [], sf, cp, 13200, 1200, 20, 3);
             map_riders_to_drivers([rider1], [driver1], (err: any, res: Array<Match>) => {
                 if (err) { done(err); }
                 expect(res).to.have.length(0);
                 done();
             });
        });

        it("should produce no results. dates dont overlap extra time", (done) => {
            let rider1 = new Rider(1, 10, new Date("2011-12-02 00:00:00"), new Time(14, 34), new Time(15, 21), [sj], cp);
            let driver1 = new Driver(1, 11, new Date("2011-12-01 20:00:00"), new Time(13, 21), new Time(17, 0), [], sf, cp, 13200, 1200, 20, 3);
             map_riders_to_drivers([rider1], [driver1], (err: any, res: Array<Match>) => {
                 if (err) { done(err); }
                 expect(res).to.have.length(0);
                 done();
             });
        });

        it("should produce no results. years differ", (done) => {
            let rider1 = new Rider(1, 10, new Date("2012-12-01 00:00:00"), new Time(14, 34), new Time(15, 21), [sj], cp);
            let driver1 = new Driver(1, 11, new Date("2011-12-01 00:00:00"), new Time(13, 21), new Time(17, 0), [], sf, cp, 13200, 1200, 20, 3);
             map_riders_to_drivers([rider1], [driver1], (err: any, res: Array<Match>) => {
                 if (err) { done(err); }
                 expect(res).to.have.length(0);
                 done();
             });
        });
    });
});
