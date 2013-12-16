var express = require('express'),
    scraper = require('./scraper');

var app = express();

app.get('/', function(req, res) {
    results = scraper.scrapeMenu();
    res.send(results);
});

app.listen(3000);

console.log('Listening on port 3000...');