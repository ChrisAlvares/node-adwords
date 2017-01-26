/**
 * Tests for User
 */

var assert = require('assert');

describe('AdwordsUser', function() {
    var AdwordsUser = require('../../adwords/user');

    describe('#getService', function() {
        var a = new AdwordsUser();
        it('should throw an error if a service does not exist', function(done) {
            try {
                a.getService('doesnotexist')
            } catch(e) {
                if (e.message.indexOf("No Service Named") !== -1) {
                    return done();
                }
                throw e;
            }
            done('Should have thrown an error if service does not exist');
        });

        it('should return a service object for a valid service', function() {
            var service = a.getService('CampaignService');
            assert.strictEqual(typeof service, 'object');
        });
    });

    describe('#populateServiceDescriptor', function() {
        it('should return a service descriptor with version values changed', function() {
            var descriptor = {
                test: '{{version}}',
                nonString: []
            };
            var a = new AdwordsUser();
            var newdescriptor = a.populateServiceDescriptor(descriptor, '--version--');
            assert.strictEqual(newdescriptor.test, '--version--');
            assert.strictEqual(typeof descriptor.nonString, 'object');
        })
    });

});
