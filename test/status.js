'use strict';

var request = require('supertest'),
    app = require('../lib/app'),
		chai = require('chai'),
		expect = chai.expect;

describe('GET /status', function() {
    it('the app name is displayed', function(done) {
        request(app)
            .get('/status')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
					  .expect(function(res) {
								expect(res.body.app, 'body.app').to.exist;
						})
						.end(function(err, res) {
                if (err) return done(err);
                done();
            });
		});

    it('the version number is displayed', function(done) {
        request(app)
            .get('/status')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
						.expect(200)
					  .expect(function(res) {
								expect(res.body.version, 'body.version').to.exist;
						})
            .expect(200, done);
    });

});
