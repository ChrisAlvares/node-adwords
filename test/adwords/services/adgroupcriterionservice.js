'use strict';
/**
 * Tests / Examples for Adgroup Criterion Service
 */
const AdwordsUser = require('../../../index').AdwordsUser;
const AdwordsConstants = require('../../../index').AdwordsConstants;

describe('AdgroupCriterionService', function() {

    let config = require('./adwordsuser-config');
    if (!config) {
        return console.log('Adwords User not configured, skipping AdGroupCriterion Service tests');
    }

    let user = new AdwordsUser(config);
    let adgroup;

    // we need to get a adgroup to add the ad group to for the keyword creation
    before(function(done) {
        let adgroupService = user.getService('AdGroupService', config.version);
        let selector = {
            fields: ['Id'],
            predicates: [
                {field: 'CampaignStatus', operator: 'EQUALS', values: ['ENABLED']},
                {field: 'Status', operator: 'EQUALS', values: ['ENABLED']}
            ],
            ordering: [{field: 'Name', sortOrder: 'ASCENDING'}],
            paging: {startIndex: 0, numberResults: 1}
        }
        adgroupService.get({serviceSelector: selector}, (error, adgroupResult) => {
            if (error) {
                return done(error);
            }
            adgroup = adgroupResult.entries[0];
            done();
        });
    });

    it('should return a result with a list of keywords', function(done) {
        let adgroupCriterionService = user.getService('AdGroupCriterionService', config.version);
        let selector = {
            fields: ['Id', 'KeywordText'],
            ordering: [{field: 'KeywordText', sortOrder: 'ASCENDING'}],
            paging: {startIndex: 0, numberResults: AdwordsConstants.RECOMMENDED_PAGE_SIZE}
        };
        adgroupCriterionService.get({serviceSelector: selector}, done);
    });


    it('should create and delete a keyword', function(done) {
        let adgroupCriterionService = user.getService('AdGroupCriterionService', config.version);

        let keyword = {
            'xsi:type': 'BiddableAdGroupCriterion',
            adGroupId: adgroup.id,
            criterion: {
                'xsi:type': 'Keyword',
                text: 'NodeAdwordsTestKeyword ' + Date.now(),
                matchType: 'EXACT'
            },
            userStatus: 'PAUSED',
            finalUrls: {
                urls: ['http://www.example.com/mars']
            }
        };

        let keywordOperation = {
            operator: 'ADD',
            operand: keyword
        };

        adgroupCriterionService.mutate({operations: [keywordOperation]}, (error, keyword) => {
            if (error) {
                return done(error);
            }

            let adgroupCriterionDeleteOperation = {
                operator: 'REMOVE',
                operand: {
                    adGroupId: keyword.value[0].adGroupId,
                    criterion: {
                        id: keyword.value[0].criterion.id
                    }
                }
            };
            adgroupCriterionService.mutate({operations: [adgroupCriterionDeleteOperation]}, done);
        })

    })

});
