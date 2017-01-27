'use strict';
/**
 * Tests / Examples for Campaign Service
 */
const AdwordsUser = require('../../../index').AdwordsUser;
const AdwordsConstants = require('../../../index').AdwordsConstants;

describe('CampaignService', function() {

    let config = require('./adwordsuser-config');
    if (!config) {
        return console.log('Adwords User not configured, skipping Campaign Service tests');
    }

    let user = new AdwordsUser(config);

    it('should return a result with a list of campaigns', function(done) {
        let campaignService = user.getService('CampaignService', config.version);
        let selector = {
            fields: ['Id', 'Name'],
            ordering: [{field: 'Name', sortOrder: 'ASCENDING'}],
            paging: {startIndex: 0, numberResults: AdwordsConstants.RECOMMENDED_PAGE_SIZE}
        }
        campaignService.get({serviceSelector: selector}, done);
    });

});
