var Joi = require('joi');

module.exports = [{
    method: 'GET',
    path: '/products',
    config: {
        handler: getProducts,
        validate: {
            query: {
                name: Joi.string()
            }
        }
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
        validate: {
            payload:  Joi.string().required().min(3)
        }
    }
}];

var products = [{
        id: 1,
        name: 'Guitar'
    },
    {
        id: 2,
        name: 'Banjo'
    }
];

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
    var product = products.filter(function(p) {
        return p.id === parseInt(request.params.id);
    }).pop();

    reply(product);
}

function addProduct(request, reply) {
    var product = {
        id: products[products.length - 1].id + 1,
        name: request.payload.name
    };

    products.push(product);

    reply(product).created('/products/' + product.id);
}