var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var menuSchema = new Schema({
    date: String,
    dining_halls: {
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
        },
        language_tables: {
            lunch: Array
        }
    }
});

if (!menuSchema.options.toObject) menuSchema.options.toObject = {};

menuSchema.options.toObject.transform = function(doc, ret, options) {
    delete ret._id;
    delete ret.__v;
}

module.exports = mongoose.model('Menu', menuSchema);
