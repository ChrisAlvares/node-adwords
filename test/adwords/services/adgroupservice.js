'use strict';
/**
 * Tests / Examples for Adgroup Service
 */
const AdwordsUser = require('../../../index').AdwordsUser;
const AdwordsConstants = require('../../../index').AdwordsConstants;

describe('AdgroupService', function() {

    var config = require('./adwordsuser-config');
    if (!config) {
        return console.log('Adwords User not configured, skipping AdGroup Service tests');
    }

    var user = new AdwordsUser(config);


    it('should return a result with a list of adgroups', function(done) {
        let adgroupService = user.getService('AdGroupService', config.version);
        let selector = {
            fields: ['Id', 'Name'],
            ordering: [{field: 'Name', sortOrder: 'ASCENDING'}],
            paging: {startIndex: 0, numberResults: AdwordsConstants.RECOMMENDED_PAGE_SIZE}
        }
        adgroupService.get({serviceSelector: selector}, done);
    });

});
