const Lab = require('lab');
const Code = require('code');

const lab = exports.lab = Lab.script();
const describe = lab.describe;
const it = lab.it;
const expect = Code.expect;

const server = require('../server');

describe('Example Server', function() {

    it('GET /docs', function(done){
        server.inject('/docs', function(res){
            expect(res.statusCode).to.equal(200);
            done();
        })
    });

    it('GET /junk', function(done){
        server.inject('/junk', function(res){
            expect(res.statusCode).to.equal(404);
            expect(res.result).to.deep.equal({"statusCode":404,"error":"Not Found"});
            done();
        })
    });

    describe('/products endpoints', function () {
        describe('GET /products', function(){

            it('handle naked request', function(done){
                server.inject('/products', function(res){
                    expect(res.statusCode).to.equal(200);
                    expect(res.result[0]).to.deep.equal({ id: 1, name: 'Guitar' });
                    expect(res.result[1]).to.deep.equal({ id: 2, name: 'Banjo' });
                    done();
                })
            });

            it('handle request with param name', function(done){
                server.inject('/products?name=Guitar', function(res){
                    expect(res.statusCode).to.equal(200);
                    expect(res.result[0]).to.deep.equal({ id: 1, name: 'Guitar' });
                    expect(res.result).to.have.length(1);
                    done();
                })
            });



        });

        function testFor(id, value, callback){
            server.inject('/products/'+id, function(res){
                expect(res.statusCode).to.equal(200);
                expect(res.result).to.deep.equal(value);
                callback();
            })
        }

        it('GET /products/x', function(done){
            testFor(1, { id: 1, name: 'Guitar' }, function(){
                testFor(2, { id: 2, name: 'Banjo' }, done)
            })
        });

        describe('POST /products',function(){
            it('handle correct input',function(done) {
                server.inject({url: '/products', method: 'POST', payload: {name: 'Bass'}}, function (res) {
                    expect(res.statusCode).to.equal(201);
                    expect(res.headers.location).to.equal('/products/3');
                    expect(res.result).to.deep.equal({id: 3, name: 'Bass'});
                    testFor(3, {id: 3, name: 'Bass'}, done);
                });
            });
            it('reject wrong input',function(done) {
                server.inject({url: '/products', method: 'POST', payload: "THIS IS JUNK"}, function (res) {
                    expect(res.statusCode).to.equal(400);
                    expect(res.result).to.deep.equal({"statusCode":400,"error":"Bad Request","message":"Invalid request payload JSON format"})
                        done();
                });
            });


        });

    });


});