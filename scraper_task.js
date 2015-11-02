#!/usr/bin/env node

'use strict';

const moment = require('moment-timezone');
const mongoose = require('mongoose');
const scraper = require('./scraper');
const routes = require('./routes');
const Menu = require('./models/Menu');
const config = require('./config');

const today = moment().tz('America/New_York').format('YYYY-MM-DD');

scraper.scrape(today)
.then(function (diningHalls) {
  mongoose.connect(config.mongodbURI);

  const menu = {
    date: today,
    dining_halls: diningHalls
  };

  Menu.create(menu, function (err) {
    if (err)
      throw new Error(err);

    mongoose.connection.close();
  });
});
