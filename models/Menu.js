'use strict';

const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  date: String,
  dining_halls: {
    atwater: {
      breakfast: Array, lunch: Array, dinner: Array
    },
    proctor: {
      breakfast: Array, lunch: Array, dinner: Array
    },
    ross: {
      breakfast: Array, lunch: Array, dinner: Array
    }
  }
}, {
  // turn off strict mode so we can save things not in the schema
  // like the language tables that sometimes have different names
  strict: false
});

// specify the transform schema option
if (!menuSchema.options.toObject) menuSchema.options.toObject = {};

menuSchema.options.toObject.transform = function (doc, ret, options) {
  // remove the _id of every document before returning the result
  delete ret._id;
  delete ret.__v;
}

module.exports = mongoose.model('Menu', menuSchema);
