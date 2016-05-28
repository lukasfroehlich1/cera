/// <reference path="../../typings/globals/mocha/index.d.ts" />
/// <reference path="../../typings/modules/chai/index.d.ts" />

import {expect} from 'chai';
import {map_riders_to_drivers} from "../../models/match";
import {Rider, Driver, Coordinate, Match, Time} from "../../models/class_defs";

describe('Matching', () => {

    var sf = new Coordinate(37.7749, -122.4194);
    var sj = new Coordinate(37.3382, -121.8863);
    var oaktown = new Coordinate(37.8044, -122.2711);
    var san_mateo = new Coordinate(37.5630, -122.3255);
    var cp = new Coordinate(35.3050, -120.6625);

    describe('#validSingleMatch()', () => {
        it('should produce 1 result. simple case', (done) => {
            var rider1 = new Rider(1, 
                                   10, 
                                   new Date("2011-12-01 00:00:00"),
                                   new Time(16, 34),
                                   new Time(19, 24),
                                   [sj],
                                   cp);

            var driver1 = new Driver(1, 
                                     11,
                                     new Date("2011-12-01 00:00:00"),
                                     new Time(15, 0),
                                     new Time(17, 0),
                                     [],
                                     sf,
                                     cp,
                                     13200,
                                     1200,
                                     20,
                                     3);

             map_riders_to_drivers([rider1], [driver1], (err: any, res: Array<Match>) => {
                 if (err) { done(err); }

                 expect(res).to.have.length(1);
                 done();
             });
        });
        it('should produce 1 result. Date has leftover time', (done) => {
            var rider1 = new Rider(1, 
                                   10, 
                                   new Date("2011-12-01 20:00:00"),
                                   new Time(14, 34),
                                   new Time(15, 21),
                                   [sj],
                                   cp);

            var driver1 = new Driver(1, 
                                     11,
                                     new Date("2011-12-01 00:23:00"),
                                     new Time(13, 21),
                                     new Time(17, 0),
                                     [],
                                     sf,
                                     cp,
                                     13200,
                                     1200,
                                     20,
                                     3);

             map_riders_to_drivers([rider1], [driver1], (err: any, res: Array<Match>) => {
                 if (err) { done(err); }

                 expect(res).to.have.length(1);
                 done();
             });
        });
    });
    describe('#timeChecks()', () => {
        it('should produce no results. times dont overlap', (done) => {
            var rider1 = new Rider(1, 
                                   10, 
                                   new Date("2011-12-01 00:00:00"),
                                   new Time(14, 34),
                                   new Time(15, 21),
                                   [sj],
                                   cp);

            var driver1 = new Driver(1, 
                                     11,
                                     new Date("2011-12-01 00:00:00"),
                                     new Time(15, 21),
                                     new Time(17, 0),
                                     [],
                                     sf,
                                     cp,
                                     13200,
                                     1200,
                                     20,
                                     3);

             map_riders_to_drivers([rider1], [driver1], (err: any, res: Array<Match>) => {
                 if (err) { done(err); }

                 expect(res).to.have.length(0);
                 done();
             });
        });
        it('should produce no results. dates dont overlap', (done) => {
            var rider1 = new Rider(1, 
                                   10, 
                                   new Date("2011-13-01 00:00:00"),
                                   new Time(14, 34),
                                   new Time(15, 21),
                                   [sj],
                                   cp);

            var driver1 = new Driver(1, 
                                     11,
                                     new Date("2011-12-01 00:00:00"),
                                     new Time(13, 21),
                                     new Time(17, 0),
                                     [],
                                     sf,
                                     cp,
                                     13200,
                                     1200,
                                     20,
                                     3);

             map_riders_to_drivers([rider1], [driver1], (err: any, res: Array<Match>) => {
                 if (err) { done(err); }

                 expect(res).to.have.length(0);
                 done();
             });
        });
        it('should produce no results. dates dont overlap extra time', (done) => {
            var rider1 = new Rider(1, 
                                   10, 
                                   new Date("2011-13-01 00:00:00"),
                                   new Time(14, 34),
                                   new Time(15, 21),
                                   [sj],
                                   cp);

            var driver1 = new Driver(1, 
                                     11,
                                     new Date("2011-12-01 20:00:00"),
                                     new Time(13, 21),
                                     new Time(17, 0),
                                     [],
                                     sf,
                                     cp,
                                     13200,
                                     1200,
                                     20,
                                     3);

             map_riders_to_drivers([rider1], [driver1], (err: any, res: Array<Match>) => {
                 if (err) { done(err); }

                 expect(res).to.have.length(0);
                 done();
             });
        });
    });
});

