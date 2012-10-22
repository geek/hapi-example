var hapi = require('hapi');
var routes = require('./routes');

var config = { name: 'Products', docs: true, batch: true };
var http = new hapi.Server('0.0.0.0', 8080, config);

http.addRoutes(routes);

http.start();