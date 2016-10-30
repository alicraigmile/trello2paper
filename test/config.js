'use strict';

var request = require('supertest'),
    app = require('../lib/app'),
		chai = require('chai'),
		expect = chai.expect;

/*
As a developer
I want the set the developer key in the config file
So that I can easily configure the application
*/

describe('Config', function() {
    it('displays the Trello developer key', function(done) {
        request(app)
            .get('/config')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
					  .expect(function(res) {
								expect(res.body['trello-developer-key'], 'body containts \'trello-developer-key\'').to.exist;
						})
						.end(function(err, res) {
                if (err) return done(err);
                done();
            });
		});

});
