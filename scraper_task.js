#!/usr/bin/env node

var request = require('request'),
    moment = require('moment'),
    mongoose = require('mongoose'),
    scraper = require('./scraper'),
    routes = require('./routes'),
    Menu = require('./models/Menu');

var requestURL = 'https://menus.middlebury.edu/dining?' +
                 encodeURIComponent('field_day_value[value][date]') +
                 '=' + moment(routes.getDateEST(new Date()), 'YYYY-MM-DD').format('dddd, MMMM D, YYYY').replace(/ /g, "%20");

request({
    method: 'GET',
    url: requestURL,
}, function(err, res, body) {
    if (!err && res.statusCode == 200){
        var menu = scraper.parseMenu(routes.getDateEST(new Date()), body);

        var uristring = 
            process.env.MONGOLAB_URI ||
            process.env.MONGOHQ_URL ||
            'mongodb://localhost/middmenuapi';

        mongoose.connect(uristring);

        Menu.create({ 
            date: menu.date,
            dining_halls: {
                atwater: {
                    breakfast: menu.dining_halls.atwater.breakfast,
                    lunch: menu.dining_halls.atwater.lunch
                },
                proctor: {
                    breakfast: menu.dining_halls.proctor.breakfast,
                    lunch: menu.dining_halls.proctor.lunch,
                    dinner: menu.dining_halls.proctor.dinner
                },
                ross: {
                    breakfast: menu.dining_halls.ross.breakfast,
                    lunch: menu.dining_halls.ross.lunch,
                    dinner: menu.dining_halls.ross.dinner
                },
                language_tables: {
                    lunch: menu.dining_halls.language_tables.lunch
                }
            } 
        }, function(err) {
            if (err) { console.log(err); }

            mongoose.connection.close();
        });
    }
});
