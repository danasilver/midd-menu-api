var request = require('request'),
    cheerio = require('cheerio'),
    dateFormat = require('dateformat');

var Menu = {
    date: dateFormat(new Date(), 'yyyy-mm-dd, hh:MM:ss TT'),
    diningHalls: {
        atwater: {
            breakfast: null,
            lunch: null
        },
        proctor: {
            breakfast: null,
            lunch: null,
            dinner: null
        },
        ross: {
            breakfast: null,
            lunch: null,
            dinner: null
        }
    }
}

function requestMenu(callback) {
    var menuURL = 'https://menus.middlebury.edu';
    request({
        method: 'GET',
        url: menuURL
    }, callback);
}

function parseMenu(err, res, body) {
    if (err || res.statusCode !== 200) throw err;

    var $ = cheerio.load(body),
        diningNodes = {
            atwater: null,
            proctor: null,
            ross: null
        },
        parseMeal = function(location, meal, $node) {
            var itemsArr = $node.find('.views-field-body').text().trim().split('\n');
            Menu.diningHalls[location][meal] = itemsArr;
        };

    // Separate Atwater, Proctor, Ross
    $('div.view-content h3').each(function(i, elem) {
        var $this = $(elem);
        switch ($this.text()) {
            case 'Atwater':
                diningNodes.atwater = $this.next();
                break;
            case 'Proctor':
                diningNodes.proctor = $this.next();
                break;
            case 'Ross':
                diningNodes.ross = $this.next();
                break;
        }
    });

    // Separate meals
    for (var node in diningNodes) {
        $(diningNodes[node]).find('td').each(function(i, elem) {
            var $this = $(this);
            switch ($this.find('span.views-field-field-meal').text().trim()) {
                case 'Breakfast':
                    parseMeal(node, 'breakfast', $this);
                    break;
                case 'Lunch':
                    parseMeal(node, 'lunch', $this);
                    break;
                case 'Dinner':
                    parseMeal(node, 'dinner', $this);
                    break;
            }
        });
    };

    // return {
    //     'date': date,
    //     'atwater': diningHalls.atwater || [noInfoMessage],
    //     'proctor': diningHalls.proctor || [noInfoMessage],
    //     'ross': diningHalls.ross || [noInfoMessage],
    // };

}

function scrapeMenu() {
    requestMenu(parseMenu);
    return Menu;
}

exports.scrapeMenu = scrapeMenu;