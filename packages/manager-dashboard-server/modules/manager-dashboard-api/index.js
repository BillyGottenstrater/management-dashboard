'use strict';
var _ = require('lodash');
var CoreModule = require('ardent-core-module');
var PluginModule = require('./lib/plugin.js');

var ManagerDashboardApiModule = CoreModule.extend({
    __dirname: __dirname,
    attributes: {
        name: 'manager-dashboard-apiModule',
        version: '0.0.0',
        module_path: '/manager_dashboard_api'
    },
    init: function(options) {
        this._super(options);

        //Attach the plugin for this controller to the routes
        this.attach('plugin', {
            recursive: true
        }, new PluginModule({
            logger: this.logger
        }));
    },
    formatter: function(data) {
        if (!data.data) {
            data = {
                data: data
            };
        }
        return data;
    }
});
module.exports = ManagerDashboardApiModule;
module.exports.plugin = PluginModule;
module.exports.version = require('./package').version;