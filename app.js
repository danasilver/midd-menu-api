var express = require('express'),
    mongoose = require('mongoose'),
    dateFormat = require('dateformat'),
    models = require('./models');

var uristring = 
    process.env.MONGOLAB_URI ||
    process.env.MONGOHQ_URL ||
    'mongodb://localhost/middmenuapi';

var app = express();

var port = process.env.PORT || 3000;
app.listen(port, function() {
    console.log('Listening on ' + port);
});

var db = mongoose.connect(uristring, function(err, res) {
    if (err) {
        console.log('ERROR connecting to: ' + uristring + '. ' + err);
    }
    else {
        console.log('Succeeded connected to: ' + uristring);
    }
});

app.get('/', function(req, res) {
    var date = dateFormat(new Date(), 'yyyy/mm/dd');
    models.Menu.find({}).exec(function(err, result) {
        if (!err) {
            res.send(result);
        }
        else {
            res.send(500, 'Something broke');
        }
    });
});

app.get('/:date', function(req, res) {
    models.Menu.find({date: req.params.date}).exec(function(err, result) {
        if (!err) {
            res.send(result);
        }
        else {
            res.send(500, 'Something broke!');
        }
    })
});
