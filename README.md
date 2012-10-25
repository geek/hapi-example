**Making an API happy with hapi**

[Hapi](http://walmartlabs.github.com/hapi/) is a framework for rapidly building RESTful web services.  Whether you are building a very simple set of RESTful services or a large scale, cache heavy, and secure set of services, [hapi](http://walmartlabs.github.com/hapi/) has you covered.  [Hapi](http://walmartlabs.github.com/hapi/) will help get your server developed quickly with its wide range of configurable options.

***Building a Products API***

The following example will walk you through using hapi to build a RESTful set of services for creating and listing out products.  To get started create a directory named _ProductsAPI_ and add a _package.json_ file to the directory that looks like the following.


```json
{
    "name": "ProductsAPI",
    "version": "0.0.1",
    "main": "server",
    "engines": {
        "node": ">=0.8.0"
    },
    "dependencies": {
        "hapi": "0.8.x"
    },
    "private": "true"
}
```

Then run `npm install`.

Create a _server.js_ file that will serve as the entry point for the service.  Add the following contents to the _server.js_ file.

```javascript
var hapi = require('hapi');
var routes = require('./routes');

var config = { docs: true };
var http = new hapi.Server('0.0.0.0', 8080, config);        // 8080 is the port to listen on

http.addRoutes(routes);

http.start();
```

In the _server.js_ code above a new instance of the hapi server is started using the configuration specified in _config_.  

By setting docs to true the [documentation generator](https://github.com/walmartlabs/hapi#documentation) will be enabled.  The documentation generator provides a set of pages that explain what endpoints are available and the requirements for those endpoints.  The documentation generator will use the validation rules you will create for each route to construct appropriate documentation pages under the _/docs_ path.

[Hapi](http://walmartlabs.github.com/hapi/) provides a function for adding a single route or an array of routes.  In this example we are adding an array of routes from a routes module, go ahead and create a _routes.js_ file, which will contain the route information and handlers.  When defining the routes we will also be specifying [validation requirements](https://github.com/walmartlabs/hapi/#data-validation).  Therefore, at the top of the file require _hapi_ and assign its _Types_ property to a local variable like below.

```javascript
var Types = require('hapi').Types;
```

For this example three routes will be created.  Below is the code you should use to add the routes, go ahead and add the code to your _routes.js_ file.

```javascript
module.exports = [
    { method: 'GET', path: '/products', config: { handler: getProducts, query: { name: Types.String() } } },
    { method: 'GET', path: '/products/{id}', config: { handler: getProduct } },
    { method: 'POST', path: '/products', config: { handler: addProduct, payload: 'parse', schema: { name: Types.String().required().min(3) }, response: { id: Types.Number().required() } } }
];
```

The routes are exported as an array so that they can easily be included by the server implementation we added.  For the products listing endpoint we are allowing a querystring parameter for name.  When this querystring parameter exists then we will filter the products for those that have a matching name.

The second route is a very simple route that demonstrates how a parameter can become part of the path definition.  This route will return a product with the matching ID that’s requested.

In the last route, the one used for creating a product, you will notice that extra validation requirements are added, even those on the response body.  The request body must contain a parameter for name that has a minimum of 3 characters and the response body must contain an ID to be validated.

Next add the handlers to the _routes.js_ file.

```javascript
function getProducts(request) {

    if (request.query.name) {
        request.reply(findProducts(request.query.name));
    }
    else {
        request.reply(products);
    }
}

function findProducts(name) {
    return products.filter(function(product) {
        return product.name.toLowerCase() === name.toLowerCase();
    });
}

function getProduct(request) {
    var product = products.filter(function(p) {
        return p.id == request.params.id;
    }).pop();

    request.reply(product);
}

function addProduct(request) {
    var product = {
        id: products[products.length - 1].id + 1,
        name: request.payload.name
    };

    products.push(product);

    request.reply.created('/products/' + product.id)({
        id: product.id
    });
}
```

As you can see in the handlers, hapi provides a simple way to add a response body by using the _request.reply_ function.  Also, in the instance when you have created an item you can use the _request.reply.created_ function to send a 201 response.

Lastly, add a simple array to contain the products that the service will serve.

```javascript
var products = [{
        id: 1,
        name: 'Guitar'
    },
    {
        id: 2,
        name: 'Banjo'
    }
];
```

***Running the server***

Go ahead and run ``npm start`` or ``node server.js`` to start the server.  Now you can navigate to <http://localhost:8080/docs> to see the documentation for the routes.  To see a list of the products navigate to <http://locahost:8080/products>.  Below is a screenshot of what the response looks like.

<img src="https://raw.github.com/wpreul/hapi-example/master/images/products.png" height="75px" width="auto" />

Go ahead and append ?name=banjo to the URL to try searching for a product by name.

<img src="https://raw.github.com/wpreul/hapi-example/master/images/banjo.png" height="75px" width="auto" />

Use curl or a REST console to create a product.  Make a POST request to the products endpoint with a name in the body.  Using curl the command looks like: ``curl http://localhost:8080/products -d "name=test"``. Below is an example of the response headers from making a request to create a product.

<img src="https://raw.github.com/wpreul/hapi-example/master/images/headers.png" height="225px" width="auto" />


Now if you navigate to the _Location_ specified in the response headers you should see the product that you created.

Other features
There are a lot of different configuration features that you can add to the server.  The extensive list can be found in the readme at <https://github.com/walmartlabs/hapi/#server-configuration>.

The built-in cache support has providers for mongo and redis.  Setting up cache is as simple as passing cache: true as part of the server configuration.

Additionally, there are several configuration options available on a per route basis.  The full list can be found at <https://github.com/walmartlabs/hapi/#route-configuration>.  For example, caching expiration times can also be configured on a per route basis.  Also, you can have per-route authentication settings.

***Conclusion***

By now you should have a decent understanding of what hapi has to offer.  There are still many other features and options available to you when using hapi that is covered in the documentation.  Please take a look at the github repository and feel free to provide any feedback you may have.

