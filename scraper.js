'use strict';

const Promise = require('bluebird');
const $ = require('cheerio');
const request = Promise.promisifyAll(require('request'));
const moment = require('moment-timezone');
const Menu = require('./models/Menu');

const baseUrl = 'http://menus.middlebury.edu/?field_day_value[value][date]=';
const inputDateFormat = 'YYYY-MM-DD';
const webDateFormat = 'dddd, MMMM D, YYYY';

function scrape(date) {
  const url = baseUrl + moment(date, inputDateFormat).format(webDateFormat);

  return new Promise(function (resolve, reject) {
    request.getAsync(url)
    .then(function (response) {
      const menu = parseMenu(response.body);

      resolve(menu);
    })
    .catch(function (err) {
      reject(err);
    });
  });
}

function parseMenu(html) {
  let menu = new Menu().toObject().dining_halls;

  $(html).find('.view-content h3').each(function (i, el) {
    const diningHall = $(el).text().toLowerCase();

    menu[diningHall] = parseDiningHall($(el).next());
  });

  return menu;
}

function parseDiningHall($html) {
  let meals = {breakfast: [], lunch: [], dinner: []};

  $html.find('td').each(function (i, el) {
    const mealName = $(el).find('.views-field-field-meal').text().trim().toLowerCase();
    const mealItems = $(el).find('.views-field-body').text().trim();

    meals[mealName] = mealItems.split('\n');
  });

  return meals;
}

exports.scrape = scrape;
