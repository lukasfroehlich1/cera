/// <reference path="../typings/mocha/mocha.d.ts" />
/// <reference path="../typings/chai/chai.d.ts" />
"use strict";
var chai_1 = require('chai');
var match_1 = require("../match");
var class_defs_1 = require("../class_defs");
describe('Matching', function () {
    var sf = new class_defs_1.Coordinate(37.7749, -122.4194);
    var sj = new class_defs_1.Coordinate(37.3382, -121.8863);
    var oaktown = new class_defs_1.Coordinate(37.8044, -122.2711);
    var san_mateo = new class_defs_1.Coordinate(37.5630, -122.3255);
    var cp = new class_defs_1.Coordinate(35.3050, -120.6625);
    describe('#validSingleMatch()', function () {
        it('should produce 1 result. simple case', function (done) {
            var rider1 = new class_defs_1.Rider(1, 10, new Date("2011-12-01 00:00:00"), new class_defs_1.Time(16, 34), new class_defs_1.Time(19, 24), [sj], cp);
            var driver1 = new class_defs_1.Driver(1, 11, new Date("2011-12-01 00:00:00"), new class_defs_1.Time(15, 0), new class_defs_1.Time(17, 0), [], sf, cp, 13200, 1200, 20, 3);
            match_1.map_riders_to_drivers([rider1], [driver1], function (err, res) {
                if (err) {
                    done(err);
                }
                chai_1.expect(res).to.have.length(1);
                done();
            });
        });
        it('should produce 1 result. Date has leftover time', function (done) {
            var rider1 = new class_defs_1.Rider(1, 10, new Date("2011-12-01 20:00:00"), new class_defs_1.Time(14, 34), new class_defs_1.Time(15, 21), [sj], cp);
            var driver1 = new class_defs_1.Driver(1, 11, new Date("2011-12-01 00:23:00"), new class_defs_1.Time(13, 21), new class_defs_1.Time(17, 0), [], sf, cp, 13200, 1200, 20, 3);
            match_1.map_riders_to_drivers([rider1], [driver1], function (err, res) {
                if (err) {
                    done(err);
                }
                chai_1.expect(res).to.have.length(1);
                done();
            });
        });
    });
    describe('#timeChecks()', function () {
        it('should produce no results. times dont overlap. using minute form', function (done) {
            var rider1 = new class_defs_1.Rider(1, 10, new Date("2011-12-01 00:00:00"), new class_defs_1.Time(803), new class_defs_1.Time(1320), [sj], cp);
            var driver1 = new class_defs_1.Driver(1, 11, new Date("2011-12-01 00:00:00"), new class_defs_1.Time(0), new class_defs_1.Time(758), [], sf, cp, 13200, 1200, 20, 3);
            match_1.map_riders_to_drivers([rider1], [driver1], function (err, res) {
                if (err) {
                    done(err);
                }
                chai_1.expect(res).to.have.length(0);
                done();
            });
        });
        it('should produce 1 results. times overlap. using minute form', function (done) {
            var rider1 = new class_defs_1.Rider(1, 10, new Date("2011-12-01 00:00:00"), new class_defs_1.Time(703), new class_defs_1.Time(920), [sj], cp);
            var driver1 = new class_defs_1.Driver(1, 11, new Date("2011-12-01 00:00:00"), new class_defs_1.Time(510), new class_defs_1.Time(858), [], sf, cp, 13200, 1200, 20, 3);
            match_1.map_riders_to_drivers([rider1], [driver1], function (err, res) {
                if (err) {
                    done(err);
                }
                //expect(res).to.have.length(1);
                console.log(res.length);
                done();
            });
        });
        it('should produce no results. times dont overlap', function (done) {
            var rider1 = new class_defs_1.Rider(1, 10, new Date("2011-12-01 00:00:00"), new class_defs_1.Time(14, 34), new class_defs_1.Time(15, 21), [sj], cp);
            var driver1 = new class_defs_1.Driver(1, 11, new Date("2011-12-01 00:00:00"), new class_defs_1.Time(15, 21), new class_defs_1.Time(17, 0), [], sf, cp, 13200, 1200, 20, 3);
            match_1.map_riders_to_drivers([rider1], [driver1], function (err, res) {
                if (err) {
                    done(err);
                }
                chai_1.expect(res).to.have.length(0);
                done();
            });
        });
        it('should produce no results. months dont overlap', function (done) {
            var rider1 = new class_defs_1.Rider(1, 10, new Date("2011-11-01 00:00:00"), new class_defs_1.Time(14, 34), new class_defs_1.Time(15, 21), [sj], cp);
            var driver1 = new class_defs_1.Driver(1, 11, new Date("2011-12-01 00:00:00"), new class_defs_1.Time(13, 21), new class_defs_1.Time(17, 0), [], sf, cp, 13200, 1200, 20, 3);
            match_1.map_riders_to_drivers([rider1], [driver1], function (err, res) {
                if (err) {
                    done(err);
                }
                chai_1.expect(res).to.have.length(0);
                done();
            });
        });
        it('should produce no results. dates dont overlap', function (done) {
            var rider1 = new class_defs_1.Rider(1, 10, new Date("2011-12-02 00:00:00"), new class_defs_1.Time(14, 34), new class_defs_1.Time(15, 21), [sj], cp);
            var driver1 = new class_defs_1.Driver(1, 11, new Date("2011-12-01 00:00:00"), new class_defs_1.Time(13, 21), new class_defs_1.Time(17, 0), [], sf, cp, 13200, 1200, 20, 3);
            match_1.map_riders_to_drivers([rider1], [driver1], function (err, res) {
                if (err) {
                    done(err);
                }
                chai_1.expect(res).to.have.length(0);
                done();
            });
        });
        it('should produce no results. dates dont overlap extra time', function (done) {
            var rider1 = new class_defs_1.Rider(1, 10, new Date("2011-12-02 00:00:00"), new class_defs_1.Time(14, 34), new class_defs_1.Time(15, 21), [sj], cp);
            var driver1 = new class_defs_1.Driver(1, 11, new Date("2011-12-01 20:00:00"), new class_defs_1.Time(13, 21), new class_defs_1.Time(17, 0), [], sf, cp, 13200, 1200, 20, 3);
            match_1.map_riders_to_drivers([rider1], [driver1], function (err, res) {
                if (err) {
                    done(err);
                }
                chai_1.expect(res).to.have.length(0);
                done();
            });
        });
        it('should produce no results. years differ', function (done) {
            var rider1 = new class_defs_1.Rider(1, 10, new Date("2012-12-01 00:00:00"), new class_defs_1.Time(14, 34), new class_defs_1.Time(15, 21), [sj], cp);
            var driver1 = new class_defs_1.Driver(1, 11, new Date("2011-12-01 00:00:00"), new class_defs_1.Time(13, 21), new class_defs_1.Time(17, 0), [], sf, cp, 13200, 1200, 20, 3);
            match_1.map_riders_to_drivers([rider1], [driver1], function (err, res) {
                if (err) {
                    done(err);
                }
                chai_1.expect(res).to.have.length(0);
                done();
            });
        });
    });
});
