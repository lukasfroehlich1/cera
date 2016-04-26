var match = require("../match");
var assert = require('chai').assert;

describe('Array', function() {
	describe('#indexOf()', function () {
		it('should return a valid response', function (done) {
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

			match.map_riders_to_drivers(test_riders, test_drivers, function(res) {
                if (err) throw err;

                asser.equal
                
            });
		});
	});
});
