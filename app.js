'use strict';

require('newrelic');

const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');
const config = require('./config')

const app = express();

mongoose.connect(config.mongodbURI, function(err, res) {
  if (err)
    throw new Error(err);
  else
    console.log('Connected to MongoDB.');
});

app.get('/', routes.routeToday);
app.get('/:date', routes.routeDate);

const port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log('Listening on port: ' + port);
});
