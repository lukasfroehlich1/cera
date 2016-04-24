var express = require('express');
var app = express();
var parser = require('body-parser');
app.set('view engine', 'pug');

app.set('views', __dirname+'/public/views');
app.use('/', express.static(__dirname + '/public'));
app.use(parser.json());
app.use(parser.urlencoded({
    extended: true
}));

app.get('/', function (req, res) {
    res.render('index.pug');
});

app.post('/drivers', function(req, res) {
    var id = req.body.endPoint;
    console.log(req.body);

    res.writeHead(200, {"Content-Type": "application/json"});
    var json = JSON.stringify({
        stat : "FAIL"
    });

    res.end(json);
});

app.listen(3000, function() {
    console.log('Example app listening on port 3000');
});
