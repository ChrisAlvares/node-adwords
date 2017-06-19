'use strict';
/**
 * Tests / Examples for Adgroup Service
 */
const AdwordsUser = require('../../../index').AdwordsUser;
const AdwordsConstants = require('../../../index').AdwordsConstants;

describe('AdgroupService', function() {

    let config = require('./adwordsuser-config');
    if (!config) {
        return console.log('Adwords User not configured, skipping AdGroup Service tests');
    }

    let user = new AdwordsUser(config);
    let campaign;

    //we need to get a campaign to add the ad group to for the adgroup creation
    before(function(done) {
        let campaignService = user.getService('CampaignService', config.version);
        let selector = {
            fields: ['Id', 'Name'],
            ordering: [{field: 'Name', sortOrder: 'ASCENDING'}],
            paging: {startIndex: 0, numberResults: 1}
        }
        campaignService.get({serviceSelector: selector}, (error, campaignResult) => {
            if (error) {
                return done(error);
            }
            campaign = campaignResult.entries[0];
            done();
        });
    });

    it('should return a result with a list of adgroups', function(done) {
        let adgroupService = user.getService('AdGroupService', config.version);
        let selector = {
            fields: ['Id', 'Name'],
            ordering: [{field: 'Name', sortOrder: 'ASCENDING'}],
            paging: {startIndex: 0, numberResults: AdwordsConstants.RECOMMENDED_PAGE_SIZE}
        }
        adgroupService.get({serviceSelector: selector}, done);
    });


    it('should create and delete an adgroup', function(done) {
        let adgroupService = user.getService('AdGroupService', config.version);

        let adgroup = {
            campaignId: campaign.id,
            name: 'NodeAdwordsTestAdgroup ' + Date.now(),
            status: 'PAUSED',
            biddingStrategyConfiguration: {
                bids: [{
                    'xsi:type': 'CpaBid',
                    bid: {
                        'xsi:type': 'Money',
                        microAmount: 1000000
                    }
                }]
            }
        };

        let adgroupOperation = {
            operator: 'ADD',
            operand: adgroup
        };

        adgroupService.mutate({operations: [adgroupOperation]}, (error, adgroup) => {
            if (error) {
                return done(error);
            }

            let adgroupDeleteOperation = {
                operator: 'SET',
                operand: {
                    id: adgroup.value[0].id,
                    status: 'REMOVED'
                }
            };
            adgroupService.mutate({operations: [adgroupDeleteOperation]}, done);
        })

    })

});
