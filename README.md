# Making an API happy with hapi

[Hapi](https://github.com/hapijs/hapi) is a framework for rapidly building RESTful web services.
 Whether you are building a very simple set of RESTful services or a large scale, cache heavy,
 and secure set of services, [hapi](https://github.com/spumko/hapi/) has you covered.

[Hapi](https://github.com/hapijs/hapi/) will help get your server developed quickly with its wide
range of configurable options.

*This example is based on `hapi@11`*

## Building a Products API

The following example will walk you through using hapi to build a RESTful set of services for`
` creating and listing out products.  To get started create a directory named _ProductsAPI_ and
add a `package.json` file to the directory that looks like the following.


```json
{
    "name": "ProductsAPI",
    "version": "0.0.3",
    "main": "server",
    "engines": {
        "node": ">=4.0.0"
    },
    "dependencies": {
        "hapi": "11.x.x",
        "lout": "7.2.x",
        "joi": "7.x.x",
        "handlebars": "1.0.x"
    },
    "private": "true"
}
```

Then run `npm install`.

Create a `server.js file that will serve as the entry point for the service.
 Add the following contents to the `server.js` file.

```javascript
var Hapi = require('hapi');
var routes = require('./routes');

var config = {};
var server = new Hapi.Server(config);
server.register([require('vision'), require('inert'), require('lout')],
     function(err) {
        if(err)
            console.log('Failed loading plugins');
        else
            server.start(function () {
                console.log('Server running at:', server.info.uri);
        });

});
```

In the `server.js` code above a new instance of the hapi server is started using the [server options]
(http://hapijs.com/api#new-serveroptions) specified in `config`.

By registering the lout plugin, the [documentation generator](https://github.com/hapijs/lout) will be enabled.
The documentation generator provides a set of pages that explain what endpoints are available and the requirements
for those endpoints.  The documentation generator will use the validation rules you will create for each route to
construct appropriate documentation pages under the `/docs` path.

[Hapi](https://github.com/hapijs/hapi/) provides a function for adding a single route or an array of routes.
In this example we are adding an array of routes from a routes module, go ahead and create a `routes.js` file,
 which will contain the route information and handlers.  When defining the routes we will also be specifying
 [validation requirements](http://hapijs.com/tutorials/validation).
Therefore, at the top of the file require *Joi*  like below.

```javascript
var Joi = require('joi');
```

For this example three routes will be created.  Below is the code you should use to add the routes,
go ahead and add the code to your `routes.js` file.

```javascript
module.exports = [{
    method: 'GET',
    path: '/products',
    config: {
        handler: getProducts,
        validate: { query: { name: Joi.string() } }
    }
}, {
    method: 'GET',
    path: '/products/{id}',
    handler: getProduct
}, {
    method: 'POST',
    path: '/products',
    config: {
        handler: addProduct,
        validate: { payload:  Joi.string().required().min(3) }
    }
}];
```

The routes are exported as an array so that they can easily be included by the server implementation we added.
For the products listing endpoint we are allowing a querystring parameter for name.
When this querystring parameter exists then we will filter the products for those that have a matching name.

The second route is a very simple route that demonstrates how a parameter can become part of the path definition.
This route will return a product with the matching ID that’s requested.

In the last route, the one used for creating a product, you will notice that extra validation requirements are added.
The request body must contain a parameter for name that has a minimum of 3 characters.

Next add the handlers to the _routes.js_ file.

```javascript
function getProducts(request, reply) {
    if (request.query.name) {
        reply(findProducts(request.query.name));
    }
    else {
        reply(products);
    }
}

function findProducts(name) {
    return products.filter(function(product) {
        return product.name.toLowerCase() === name.toLowerCase();
    });
}

function getProduct(request, reply) {
    const product = products.filter(function(p) {
        return p.id === parseInt(request.params.id);
    }).pop();

    reply(product);
}

function addProduct(request, reply) {
    const product = {
        id: products[products.length - 1].id + 1,
        name: request.payload.name
    };

    products.push(product);

    reply(product).created('/products/' + product.id);
}
```

As you can see in the handlers, hapi provides a simple way to add a response body by using the `reply` function.
Also, in the instance when you have created an item you can use the `reply(product).created('/products/' + product.id)`
 functions to send a `201` response and set a custom `Location` header.

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

## Running the server

Go ahead and run ``npm start`` or ``node server.js`` to start the server.
Now you can navigate to <http://localhost:8080/docs> to see the documentation for the routes.
To see a list of the products navigate to <http://localhost:8080/products>.

 Below is a screenshot of what the response looks like.
<img src="https://raw.github.com/wpreul/hapi-example/master/images/products.png" height="75px" width="auto" />

Go ahead and append ?name=banjo to the URL to try searching for a product by name.

<img src="https://raw.github.com/wpreul/hapi-example/master/images/banjo.png" height="75px" width="auto" />

Use curl or a REST console to create a product.  Make a POST request to the products endpoint with a name in the body.  Using curl the command looks like: ``curl http://localhost:8080/products -i -d "name=Ukelele"``. Below is an example of the response headers from making a request to create a product.

```http
HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8
Location: /products/3
Content-Length: 25
Cache-Control: no-cache
Date: Sat, 29 Jun 2013 16:44:42 GMT
Connection: keep-alive

{"id":3,"name":"Ukelele"}
```


Now if you navigate to the _Location_ specified in the response headers you should see the product that you created.

Other features
There are a lot of different configuration features that you can add to the server.
The extensive list can be found in the API documentation at <http://hapijs.com/api>.

The built-in cache support has providers for memory, mongo and redis.
Setting up cache is as simple as passing `cache: true` as part of the server configuration.

Additionally, there are several configuration options available on a per route basis.
The full list can be found at <http://hapijs.com/api#route-configuration>.
For example, caching expiration times can also be configured on a per route basis.
Also, you can have per-route authentication settings.

## Conclusion

By now you should have a decent understanding of what *hapi* has to offer.

There are still many other features and options available to you when using
hapi that is covered in the [documentation](http://hapijs.com/api) and in
[tutorials](http://hapijs.com/tutorials) .

Please take a look at the github repository and feel free to provide any feedback you may have.

