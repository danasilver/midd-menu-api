require('newrelic');

var express = require('express'),
    mongoose = require('mongoose'),
    Menu = require('./models/Menu'),
    routes = require('./routes');

var app = express();

app.configure(function() {
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(app.router);
});

var uristring = 
    process.env.MONGOLAB_URI ||
    process.env.MONGOHQ_URL ||
    'mongodb://localhost/middmenuapi';

mongoose.connect(uristring, function(err, res) {
    if (err) {
        console.log('Error connecting to: ' + uristring + '. ' + err);
    }
    else {
        console.log('Succeeded connecting to: ' + uristring);
    }
});

app.get('/', routes.today);
app.get('/:date', routes.findDate);

var port = process.env.PORT || 3000;
app.listen(port, function() {
    console.log('Listening on ' + port);
});
