'use strict';

const mongodbURI =
  process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL ||
  'mongodb://localhost/middmenuapi';

module.exports = {
  mongodbURI: mongodbURI
};
