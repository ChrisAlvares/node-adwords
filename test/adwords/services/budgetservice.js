'use strict';
/**
 * Tests / Examples for Budget Service
 */
const AdwordsUser = require('../../../index').AdwordsUser;
const AdwordsConstants = require('../../../index').AdwordsConstants;

describe('BudgetService', function() {

    let config = require('./adwordsuser-config');
    if (!config) {
        return console.log('Adwords User not configured, skipping Budget Service tests');
    }

    let user = new AdwordsUser(config);

    it('should return a result with a list of budgets', function(done) {
        let budgetService = user.getService('BudgetService', config.version);
        let selector = {
            fields: ['BudgetId', 'Amount', 'BudgetStatus'],
            ordering: [{field: 'Amount', sortOrder: 'ASCENDING'}],
            paging: {startIndex: 0, numberResults: AdwordsConstants.RECOMMENDED_PAGE_SIZE}
        }
        budgetService.get({selector: selector}, done);
    });

    it('should create a sample budget', function(done) {
        let budgetService = user.getService('BudgetService', config.version);
        let budgetOperation = {
            operator: 'ADD',
            operand: {
                name: 'Budget ' + Date.now(),
                amount: {
                    microAmount: 1000000
                },
                deliveryMethod: 'STANDARD'
            }
        }

        budgetService.mutate({operations: [budgetOperation]}, (error, budget) => {
            if (error) {
                return done(error);
            }
            var budget = budget.value[0];

            //delete the budget
            let budgetOperation = {
                operator: 'REMOVE',
                operand: {
                    budgetId: budget.budgetId
                }
            }
            budgetService.mutate({operations: [budgetOperation]}, done);
        })
    });

});
