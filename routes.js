'use strict';

const moment = require('moment-timezone');
const scraper = require('./scraper');
const Menu = require('./models/Menu');

function routeDate (req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");

  const date = req.params.date;

  if (!moment(date, 'YYYY-MM-DD').isValid()) {
    res.status(404).send({
      date: date,
      error: 'Invalid date.'
    });
  }

  Menu.findOne({date: date}, function(err, result) {
    if (result)
      res.send(result.toObject());

    else {
      // menu not in database
      scraper.scrape(date)
      .then(function (menu) {
        res.send({
          date: date,
          dining_halls: menu
        });
      })
      .catch(function (error) {
        res.status(500).send({
          date: date,
          error: 'Unable to retrieve menu.'
        });
      });
    }
  });
}

exports.routeDate = routeDate;
exports.routeToday = function (req, res) {
  const today = moment().tz('America/New_York').format('YYYY-MM-DD');
  req.params.date = today;

  routeDate(req, res);
}
