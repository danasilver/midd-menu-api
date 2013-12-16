var express = require('express'),
    scraper = require('./scraper');

var app = express();

app.get('/', function(req, res) {
    results = scraper.scrapeMenu();
    res.send(results);
});

var port = process.env.PORT || 3000;
app.listen(port, function() {
    console.log('Listening on ' + port);
});
