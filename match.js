var GoogleMapsAPI = require('googlemaps');


var publicConfig = {
  key: 'AIzaSyB_1bO9S2BzI5TmiQDIIVT1G-9uMbVWUd8',
  stagger_time:       1000, // for elevationPath
  encode_polylines:   false,
  secure:             true, // use https
};

var gmAPI = new GoogleMapsAPI(publicConfig);


find_match = function() { // drivers, riders) {
    gmAPI.directions({origin: "UCSB", destination: "SF"}, function(err, results) {
        if (err) {
            console.log('Error' + err);
        }
        else if (results['status'] == 'NOT_FOUND')
		{
			console.log("Location not found");
			return res.status("404").send("Not found");
		}
        else {
            console.log(results.routes[0].legs[0].duration.value);
        }
	});
}

find_match();


