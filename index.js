var express = require('express');
var app = express();
var parser = require('body-parser');
var api = require('./connect');

app.set('view engine', 'pug');

app.set('views', __dirname+'/public/views');
app.use('/', express.static(__dirname + '/public'));
app.use(parser.json());
app.use(parser.urlencoded({
    extended: true
}));

api.start();

app.get('/', function (req, res) {
    res.render('index.pug');
});

app.get('/matches', function(req, res) {
    res.render('matches.pug');
});

app.post('/riders', function(req, res) {
    var packet = req.body;
    api.addRider(1, packet.earliest_leave, packet.latest_leave, parseInt(packet.startId), packet.end_point);

    res.writeHead(200, {"Content-Type": "application/json"});
});

app.post('/drivers', function(req, res) {
    var packet = req.body;

    api.addDriver(1, packet.earliest_leave, packet.latest_leave, "", packet.end_point, parseInt(packet.startId), packet.threshold, packet.price_seat, packet.seats);

    res.writeHead(200, {"Content-Type": "application/json"});
});

//TODO end

app.listen(3000, function() {
    console.log('Example app listening on port 3000');
});
