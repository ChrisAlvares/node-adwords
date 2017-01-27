'use strict';
/**
 * Test for the Adwords Request Parser
 */

const assert = require('assert');
const _ = require('lodash');
describe('RequestParser', function() {

    const RequestParser = require('../../lib/request-parser');

    describe('#convertToValidAdwordsRequest', function() {

        it('should convert the xsi:type fields to attributes', function() {
            let operation = {
                criterion: {
                    'xsi:type': 'Test123',
                },
                'xsi:type': 'Test123',
                attributes: {
                    'xsi:type': 'test'
                }
            };
            var newOperation = RequestParser.convertToValidAdwordsRequest(operation);
            assert.strictEqual('string', typeof newOperation.attributes['xsi:type']);
            assert.strictEqual('string', typeof newOperation.criterion.attributes['xsi:type']);
            assert.strictEqual('string', typeof operation['xsi:type']);
        });
    });


});
