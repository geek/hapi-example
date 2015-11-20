var Hapi = require('hapi');
var routes = require('./routes');

var config = {};
var server = new Hapi.Server(config);

var port = 8080;
var host = '0.0.0.0';
server.connection({port: port, host: host});

server.route(routes);

server.register([require('vision'), require('inert'), {
    register: require('lout'),
    options: { endpoint: '/docs' }
    }], function(err) {

    if(err) {
        console.log('Failed loading plugins');
        return
    }

    server.start(function () {
        console.log('Server running at:', server.info.uri);
    });

});