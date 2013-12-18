var cheerio = require('cheerio');

exports.parseMenu = function(menuDate, html) {
    var $ = cheerio.load(html),
        diningNodes = {
            atwater: null,
            proctor: null,
            ross: null,
            language_tables: null
        },
        menu = {
            date: menuDate,
            dining_halls: {
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
                },
                language_tables: {
                    lunch: null
                }
            }
        },
        parseMeal = function(location, meal, $node) {
            var itemsArr = $node.find('.views-field-body').text().trim().split('\n');
            menu.dining_halls[location][meal] = itemsArr;
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
            case 'Language Tables':
                diningNodes.language_tables = $this.next();
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

    return menu;

}
