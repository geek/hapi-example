var Hapi = require('hapi');
var routes = require('./routes');

var config = { }; // See: 
var server = new Hapi.Server('0.0.0.0', 8080, config);
server.pack.require({ lout: { endpoint: '/docs' } }, function (err) {

    if (err) {
        console.log('Failed loading plugins');
    }
});

server.addRoutes(routes);

server.start();