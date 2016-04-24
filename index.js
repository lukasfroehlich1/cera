var express = require('express');
var app = express();
var parser = require('body-parser');
var api = require('./connect');
var async = require('async');

app.set('view engine', 'pug');

app.set('views', __dirname+'/public/views');
app.use('/', express.static(__dirname + '/public'));
app.use(parser.json());
app.use(parser.urlencoded({
    extended: true
}));

api.start();

app.get('/', function (req, res) {
    res.render('index.pug', {pageContent: {userId: req.query.id}});
});

app.get('/login', function(req, res) {
    res.render('login.pug');
});

app.post('/login', function(req, res) {
    async.waterfall([
        function getUserId(userIdCallback){
            api.getUserId(req.body.username, req.body.password, userIdCallback);
        },
        function checkUsers(row, checkCallback){
            if(row.length != 1)
                checkCallback("hello");
            else
                res.render("index.pug", {pageData: {UserID: row.id}});
        }
    ], function(error) {
        if ( error ) {
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
            res.redirect('/?id='+user.id);
        }], function(err) {
            if (err) {
                console.log(err);
                console.log("Error in adding new user");
            }
        }
    );
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
