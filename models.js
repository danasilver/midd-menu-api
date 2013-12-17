var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var menuSchema = new Schema({
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

exports.Menu = mongoose.model('Menu', menuSchema);
