'use strict';

var request = require('supertest'),
    app = require('../lib/app'),
    chai = require('chai'),
    expect = chai.expect;

describe('Authorisation', function() {
    it('allows me to log in');
    it('displays my name');
    it('allows me to log out');
});

/*
@manual
As a logged-in user
I want to see my name
So I can see that this service is personalised for me

@manual
As a logged-in user
I want to log out
So that I can remove my personal details from the application
*/
