var match = require("../match");
var assert = require('chai').assert;

describe('Matching', function() {
	describe('#validSingleMatch()', function () {
		it('should match this simple case', function (done) {
			var test_drivers = [ { id: 1,
				leave_earliest: 100,
				leave_latest: 200,
				waypoints: '',
				end_point: 'Berkeley,CA',
				start_point: "UCLA,CA",
				trip_time: 19260,
				threshold: 3600,
				price_seat: 20,
				seats: 4 } ];

			var test_riders = [ { id: 3,
				leave_earliest: 150,
				leave_latest: 160,
				end_points: 'San Jose,CA',
				start_point: "UCLA,CA"
			}];

			match.map_riders_to_drivers(test_riders, test_drivers, function(err, res) {
                assert.lengthOf(res, 1, 'found one match');
                done();
            });
		});
		it('should match endpoints in provided', function (done) {
			var test_drivers = [ { id: 1,
				leave_earliest: 100,
				leave_latest: 200,
				waypoints: '',
				end_point: 'Berkeley,CA',
				start_point: "UCLA,CA",
				trip_time: 19260,
				threshold: 3600,
				price_seat: 20,
				seats: 4 } ];

			var test_riders = [ { id: 3,
				leave_earliest: 150,
				leave_latest: 160,
				end_points: 'San Jose,CA|Berkeley,CA',
				start_point: "UCLA,CA"
			}];

			match.map_riders_to_drivers(test_riders, test_drivers, function(err, res) {
                assert.lengthOf(res, 1, 'found one match');
                assert(res[0].rider_end_point == 'San Jose,CA',
                        'should match with riders first choice even though the second choice takes less time');
                done();
            });
		});
		it('should ignore first two endpoints as they are invalid locations', function (done) {
			var test_drivers = [ { id: 1,
				leave_earliest: 100,
				leave_latest: 200,
				waypoints: '',
				end_point: 'Berkeley,CA',
				start_point: "UCLA,CA",
				trip_time: 19260,
				threshold: 3600,
				price_seat: 20,
				seats: 4 } ];

			var test_riders = [ { id: 3,
				leave_earliest: 150,
				leave_latest: 160,
				end_points: 'New York|doesntexist|San Mateo,CA',
				start_point: "UCLA,CA"
			}];

			match.map_riders_to_drivers(test_riders, test_drivers, function(err, res) {
                assert.lengthOf(res, 1, 'found one match');
                assert(res[0].rider_end_point == 'San Mateo,CA', 'all other choices are invalid'); 
                done();
            });
		});
	});
	describe('#invalidSingleMatch()', function () {
		it('should return nothing. starting locations differ', function (done) {
			var test_drivers = [ { id: 1,
				leave_earliest: 100,
				leave_latest: 200,
				waypoints: '',
				end_point: 'Berkeley,CA',
				start_point: "UCSD,CA",
				trip_time: 19260,
				threshold: 3600,
				price_seat: 20,
				seats: 4 } ];

			var test_riders = [ { id: 3,
				leave_earliest: 150,
				leave_latest: 160,
				end_points: 'San Mateo,CA',
				start_point: "UCLA,CA"
			}];

			match.map_riders_to_drivers(test_riders, test_drivers, function(err, res) {
                assert.lengthOf(res, 0, 'no match found, different starting');
                done();
            });
		});
		it('should return nothing. times dont overlap locations differ', function (done) {
			var test_drivers = [ { id: 1,
				leave_earliest: 100,
				leave_latest: 200,
				waypoints: '',
				end_point: 'Berkeley,CA',
				start_point: "UCLA,CA",
				trip_time: 19260,
				threshold: 3600,
				price_seat: 20,
				seats: 4 } ];

			var test_riders = [ { id: 3,
				leave_earliest: 250,
				leave_latest: 300,
				end_points: 'San Mateo,CA',
				start_point: "UCLA,CA"
			}];

			match.map_riders_to_drivers(test_riders, test_drivers, function(err, res) {
                assert.lengthOf(res, 0, 'no match found. times do not overlap');
                done();
            });
		});
	});
});
