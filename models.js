var mongoose = require('mongoose');

var menuSchema = new mongoose.Schema({
    date: String,
    diningHalls: {
        atwater: {
            breakfast: Array,
            lunch: Array
        },
        proctor: {
            breakfast: Array,
            lunch: Array,
            dinner: Array
        },
        ross: {
            breakfast: Array,
            lunch: Array,
            dinner: Array
        }
    }
});

var Menu = mongoose.model('Menu', menuSchema);



exports.Menu = Menu;
