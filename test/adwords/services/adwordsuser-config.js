'use strict';
/**
 * Builds an adwords user, or false if it is unable to get all the required fields
 */

var developerToken = process.env.ADWORDS_API_TEST_DEVTOKEN;
var refreshToken = process.env.ADWORDS_API_TEST_REFRESHTOKEN;
var clientId = process.env.ADWORDS_API_TEST_CLIENT_ID;
var clientSecret = process.env.ADWORDS_API_TEST_CLIENT_SECRET;
var clientCustomerId = process.env.ADWORDS_API_TEST_CLIENT_CUSTOMER_ID;

var objToExport = false;

if (developerToken && refreshToken && clientId && clientSecret && clientCustomerId) {
    objToExport = {
        developerToken: developerToken,
        clientCustomerId: clientCustomerId,
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        version: 'v201710'
    };
}

module.exports = objToExport;
