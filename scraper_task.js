#!/usr/bin/env node

var scraper = require('./scraper'),
    models = require('./models');

menu = scraper.scrapeMenu(new Date());

console.log(menu);

var uristring = 
    process.env.MONGOLAB_URI ||
    process.env.MONGOHQ_URL ||
    'mongodb://localhost/middmenuapi';

var newMenu = new models.Menu ({ 
    date: menu.date,
        diningHalls: {
            atwater: {
                breakfast: menu.diningHalls.atwater.breakfast,
                lunch: menu.diningHalls.atwater.lunch
            },
            proctor: {
                breakfast: menu.diningHalls.proctor.breakfast,
                lunch: menu.diningHalls.proctor.lunch,
                dinner: menu.diningHalls.proctor.dinner
            },
            ross: {
                breakfast: menu.diningHalls.ross.breakfast,
                lunch: menu.diningHalls.ross.lunch,
                dinner: menu.diningHalls.ross.dinner
            }
    } 
});

newMenu.save(function(err) {
    if (err) {
        console.log(err);
    }
});