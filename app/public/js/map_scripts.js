
function initMap() {
    var directionsService = new google.maps.DirectionsService();
    var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 36.964, lng: -122.015},
        zoom: 18,
    });
    var directionsDisplay = new google.maps.DirectionsRenderer();
    directionsDisplay.setMap(map);

    var start = "san diego, ca";
    var middle = "santa barbara, ca";
    var end = "san francisco, ca";
    var request = {
        origin:start,
        destination:end,
        waypoints:[{'location': middle, 'stopover':true}],
        travelMode: google.maps.TravelMode.DRIVING
    };
    directionsService.route(request, function(result, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(result);
        }
    });
}
