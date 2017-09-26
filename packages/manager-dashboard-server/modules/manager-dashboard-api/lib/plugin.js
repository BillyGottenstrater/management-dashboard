var _ = require('lodash');
var promise = require('bluebird');

var BasePlugin = require('base-plugin');

var managerDashboardApiPlugin = BasePlugin.extend({
    attributes: {
        name: 'manager-dashboard-apiPlugin'
    },
    // **OVERRIDEABLE Functions**
    // init: function(options) {
    // 	this._super(options);
    //   
    //  //Needed to access cacheflow 
    //  //this.cf = options.cf; 
    // },
    // setup: function(done) {
    // 	this._super(done);
    // },
    // default_error_handler: function(err) {
    // 	return this._super(err);
    // }.
    // **THERE COMMENTS CAN BE DELETED**
    echo: function(message) {
        return new promise(function(resolve, reject) {
            resolve(message);
        });
    }
});

module.exports = managerDashboardApiPlugin;
