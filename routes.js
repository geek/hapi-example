'use strict';

const Joi = require('joi');

let internals = {};

internals.getProducts = function (request, reply) {

    if (request.query.name) {
        return reply(internals.findProducts(request.query.name));
    }
    reply(internals.products);
}

internals.findProducts = function (name) {

    return internals.products.filter((product) => {

        return product.name.toLowerCase() === name.toLowerCase();
    });
}

internals.getProduct = function (request, reply) {

    const filtered = internals.products.filter((product) => {

        return product.id === parseInt(request.params.id);
    }).pop();

    reply(filtered);
}

internals.addProduct = function (request, reply) {

    const product = {
        id: internals.products[internals.products.length - 1].id + 1,
        name: request.payload.name
    };

    internals.products.push(product);

    reply(product).created('/products/' + product.id);
}

internals.getUsers = function (request, reply) {

    if (request.query.name) {
        return reply(internals.findUser(request.query.name));
    }
    reply(internals.users);
}

internals.findUser = function (name) {

    return internals.users.filter((user) => {

        return user.name.toLowerCase() === name.toLowerCase();
    });
}

internals.getUser = function (request, reply) {

    const filtered = internals.users.filter((user) => {

        return user.id === parseInt(request.params.id);
    }).pop();

    reply(filtered);
}

internals.addUser = function (request, reply) {

    const user = {
        id: internals.users[internals.users.length - 1].id + 1,
        name: request.payload.name
    };

    internals.users.push(user);

    reply(user).created('/users/' + user.id);
}

module.exports = [{
    method: 'GET',
    path: '/products',
    config: {
        validate: {
            query: {
                name: Joi.string()
            }
        },
        handler: internals.getProducts
    }
}, {
    method: 'GET',
    path: '/products/{id}',
    handler: internals.getProduct
}, {
    method: 'POST',
    path: '/products',
    config: {
        validate: {
            payload: { name: Joi.string().required().min(3) }
        },
        handler: internals.addProduct
    }
}, {
    method: 'GET',
    path: '/users',
    config: {
        validate: {
            query: {
                name: Joi.string()
            }
        },
        handler: internals.getUsers
    }
}, {
    method: 'GET',
    path: '/users/{id}',
    handler: internals.getUser
}, {
    method: 'POST',
    path: '/users',
    config: {
        validate: {
            payload: { name: Joi.string().required().min(3) }
        },
        handler: internals.addUser
    }
}];



internals.products = [
    {
        id: 1,
        name: 'Guitar'
    },
    {
        id: 2,
        name: 'Banjo'
    }
];

internals.users = [
    {
        id: 1,
        name: 'Sally'
    },
    {
        id: 2,
        name: 'Joe'
    }
];