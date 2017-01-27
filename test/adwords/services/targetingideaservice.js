'use strict';
/**
 * Tests / Examples for Targeting Idea Service
 */
const AdwordsUser = require('../../../index').AdwordsUser;
const AdwordsConstants = require('../../../index').AdwordsConstants;

describe('TargetingIdeaService', function() {

    let config = require('./adwordsuser-config');
    if (!config) {
        return console.log('Adwords User not configured, skipping Campaign Service tests');
    }

    let user = new AdwordsUser(config);

    it('should return a targeting idea list', function(done) {
        let targetingIdeaService = user.getService('TargetingIdeaService', config.version);
        let selector = {
            searchParameters: [{
                'xsi:type': 'RelatedToQuerySearchParameter',
                queries: ['test']
            }, {
                'xsi:type': 'LanguageSearchParameter',
                languages: [{'cm:id': 1000}]
            }],
            ideaType: 'KEYWORD',
            requestType: 'IDEAS',
            requestedAttributeTypes: ['KEYWORD_TEXT'],
            paging: {
                startIndex: 0,
                numberResults: AdwordsConstants.RECOMMENDED_PAGE_SIZE
            },
        };

        targetingIdeaService.get({selector: selector}, done);
    });

});
