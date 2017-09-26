var ardent = require('ardent.io');
var options = require('../../config.json') || {};
var package = require('../../package.json');

ardent.init(options)
    .swagger({ info: { version: package.version } });
