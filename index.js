var express = require('express');
var app = express();
var parser = require('body-parser');
var api = require('./connect');
var async = require('async');
var cookieParser = require('cookie-parser');
var session = require('express-session');

app.set('view engine', 'pug');
app.set('port', (process.env.PORT || 5000));

app.set('views', __dirname+'/public/views');
app.use('/', express.static(__dirname + '/public'));
app.use(parser.json());
app.use(parser.urlencoded({
    extended: true
}));
app.use(cookieParser());
app.use(session({secret: '1231923871sdflskjflsjflsdk'}));

api.start();

app.get('/home', function (req, res) {
    var driverRequests;
    var riderRequests;
    async.waterfall([
        function getDriversRequests(requestDriversCallback) {
            api.getDriversByUserId(req.session.userId, requestDriversCallback);
        },
        function setDriversRequests(requests, setDriversCallback) {
            console.log(requests);
            driverRequests = requests;
            setDriversCallback(null, null);
        },
        function getRidersRequests(holder, requestsRidersCallback) {
            api.getRidersByUserId(req.session.userId, requestsRidersCallback);
        },
        function setRidersRequests(requests, setRidersCallback) {
            console.log(requests);
            riderRequests = requests;
            setRidersCallback(null, null);
        }, function loadPage( holder, loadCallback) {
            res.render('index.pug', {pageContent: {userId: req.session.userId, drivers: driverRequests, riders: riderRequests}});
        }], function (err) {
            if ( err ) 
                console.log(err);
        });
});

app.get('/', function(req, res) {
    res.render('login.pug');
});

app.post('/login', function(req, res) {
    async.waterfall([
        function getUserId(userIdCallback){
            api.getUserId(req.body.username, req.body.password, userIdCallback);
        },
        function checkUsers(row, checkCallback){
            if(row.length != 1)
                checkCallback("User credentials match nothing");
            else {
                req.session.userId = row[0].id;
                console.log(row[0].id);
                res.send(JSON.stringify({code: 1, url: '/home'}));
            }
        }
    ], function(error) {
        if ( error ) {
            console.log(error);
            res.send(JSON.stringify({code: 2}));
        }
    });
});

app.post('/register', function(req, res) {
    async.waterfall([
        function getUser(getCallback) {
            api.getUser(req.body.username, getCallback);
        },
        function checkUser(userRows, checkCallback) {
            // only allow unique names
            if ( userRows.length != 0 )
                checkCallback("username exists");
            else
                checkCallback(null, null);
        },
        function addUser(holder, userCallback) {
            api.addUser(req.body.username, req.body.email, req.body.phone, req.body.password, userCallback);
        },
        function loadPage(user, loadCallback) {
            req.session.userId = user;
            res.send(JSON.stringify({code: 1, url: '/home'}));
        }], function(err) {
            if (err) {
                console.log(err);
                console.log("Error in adding new user");
                res.send(JSON.stringify({code: 2}));
            }
        }
    );
});

app.get('/matches', function(req, res) {
    res.render('matches.pug');
});

app.post('/riders', function(req, res) {
    var packet = req.body;
    console.log(packet);
    async.waterfall([
        function addRider(riderCallback) {
            api.addRider(req.session.userId, packet.departure_date, packet.leave_earliest, packet.leave_latest, parseInt(packet.startId), packet.end_point, riderCallback);
        },
        function loadMatches(requestId, matchesCallback) {
            //TODO
            matchesCallback(null, null);
        },
        function loadPage(matches, loadCallback) {
            res.writeHead(200, {"Content-Type": "application/json"});
        }], function(err) {
            if ( err ) {
                console.log(err);
                console.log("Error with adding trip");
            }
        }
    );
});

app.post('/drivers', function(req, res) {
    var packet = req.body;
    console.log(packet);
    async.waterfall([
        function addDriver(driverCallback) {
            api.addDriver(req.session.userId, packet.departure_date, packet.leave_earliest, 
                          packet.leave_latest, "", packet.end_point,
                          parseInt(packet.startId), packet.threshold, 
                          packet.price_seat, packet.seats, driverCallback);
        },
        function loadMatches(tripId, matchesCallback) {
            matchesCallback(null, null);
            //TODO
        },
        function loadPage(matches, loadCallback) {
            res.writeHead(200, {"Content-Type": "application/json"});
        }], function(err) {
            if ( err ) {
                console.log(err);
                console.log("Error with adding trip");
            }
        }
    );
});

//TODO end



app.listen(app.get('port'), function() {
      console.log('Node app is running on port', app.get('port'));
});
