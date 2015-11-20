'use strict';

const Hapi = require('hapi');
const routes = require('./routes');

const config = {};
const server = new Hapi.Server(config);

const port = 8080;
const host = '0.0.0.0';
server.connection({port: port, host: host});

server.route(routes);

server.register([require('vision'), require('inert'), {
    register: require('lout'),
    options: { endpoint: '/docs' }
    }], function(err) {

    if(err) {
        console.log('Failed loading plugins');
        return;
    }

    server.start(function () {
        console.log('Server running at:', server.info.uri);
    });

});