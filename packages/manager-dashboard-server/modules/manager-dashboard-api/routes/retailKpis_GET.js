var ArdentRoute = require('ardent-route');
var fs = require('fs');
var process = require('process');

var IndexRoute = ArdentRoute.extend({
    method: 'GET',
    path: '/retailKpis',
    description: 'default description',
    handler: function(request, reply) {
        console.log(process.cwd());
        reply(JSON.parse(fs.readFileSync('fixtures/retailKpi.json').toString()));
    }
});

module.exports = IndexRoute;