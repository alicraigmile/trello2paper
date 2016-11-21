'use strict';

var request = require('supertest'),
    app = require('../lib/app'),
		chai = require('chai'),
		expect = chai.expect;

describe('Cards', function() {
    it('displays the card title');
    it('displays the card description');
    it('displays html markup in the card description');
});
