/**
 * Tests for authentication
 */
var assert = require('assert');

describe('AdwordsAuth', function() {

    var AdwordsAuth = require('../../adwords/auth');

    var client_id = process.env.ADWORDS_API_TEST_CLIENT_ID;
    var client_secret = process.env.ADWORDS_API_TEST_CLIENT_SECRET;
    var refresh_token = process.env.ADWORDS_API_TEST_REFRESHTOKEN;

    if (!client_id || !client_secret) {
        return console.log('client_id and client_secret not set, skipping AdwordsAuth tests');
    }

    describe('#generateAuthenticationUrl', function() {
        var auth = new AdwordsAuth({
            client_id: client_id,
            client_secret: client_secret,
            redirectUrl: 'server'
        });
        it('should return a string', function() {
            assert.strictEqual('string', typeof auth.generateAuthenticationUrl());
        });
        it('should be a URL', function() {
            assert.strictEqual(0, auth.generateAuthenticationUrl().indexOf('https://'));
        });
    });

    if (!refresh_token) {
        return console.log('refresh token not set, skipping AdwordsAuth refreshAccessToken test');
    }

    describe('#refreshAccessToken', function() {
        var auth = new AdwordsAuth({
            client_id: client_id,
            client_secret: client_secret,
            redirectUrl: 'server'
        });
        
        it('should refresh the access token', function(done) {
            auth.refreshAccessToken(refresh_token, done);
        });
    });

});
