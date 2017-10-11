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

    it('should preform an adwords query', function(done) {
        let campaignService = user.getService('CampaignService', config.version);
        campaignService.query({query: 'SELECT Id, Name WHERE Status = "ENABLED" ORDER BY Name DESC LIMIT 0,50'}, done);
    });

    it('should return a result with a list of campaigns', function(done) {
        let campaignService = user.getService('CampaignService', config.version);
        let selector = {
            fields: ['Id', 'Name'],
            ordering: [{field: 'Name', sortOrder: 'ASCENDING'}],
            paging: {startIndex: 0, numberResults: AdwordsConstants.RECOMMENDED_PAGE_SIZE}
        }
        campaignService.get({serviceSelector: selector}, done);
    });

    it('should create and delete a campaign', function(done) {
        let campaignService = user.getService('CampaignService', config.version);
        let budgetService = user.getService('BudgetService', config.version);

        //first create a budget for the campaign
        let budget = {
            name: 'budget for ' + Date.now(),
            amount: {
                microAmount: 1000000,
                'xsi:type': 'Money'
            },
            deliveryMethod: 'STANDARD'
        };

        let budgetOperation = {
            operator: 'ADD',
            operand: budget
        }

        budgetService.mutate({operations:[budgetOperation]}, (error, budgetResult) => {
            if (error) {
                done(error);
            }
            let budget = budgetResult.value[0];

            //actually create the campaign
            let campaign = {
                name: 'NodeAdwordsTestCampaign - ' + Date.now(),
                status: 'PAUSED',
                budget: {
                    budgetId: budget.budgetId
                },
                advertisingChannelType: 'SEARCH',
                biddingStrategyConfiguration: {
                    biddingStrategyType: 'MANUAL_CPC'
                }
            };

            let operation = {
                operator: 'ADD',
                operand: campaign
            }

            campaignService.mutate({operations: [operation]}, (error, campaignResult) => {
                if (error) {
                    return done(error);
                }

                //delete the campaign by changing the operator to set
                let campaignDeleteOperation = {
                    operator: 'SET',
                    operand: {
                        id: campaignResult.value[0].id,
                        status: 'REMOVED'
                    }
                }
                campaignService.mutate({operations: [campaignDeleteOperation]}, (error) => {
                    if (error) {
                        return done(error);
                    }
                    //delete the budget
                    let budgetOperation = {
                        operator: 'REMOVE',
                        operand: {
                            budgetId: budget.budgetId
                        }
                    }
                    budgetService.mutate({operations: [budgetOperation]}, done);
                });
            });
        });
    });
});
