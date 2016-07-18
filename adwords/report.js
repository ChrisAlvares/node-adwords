'use strict';
/**
 * Adwords Reporting Module
 * Unfortunately, the adwords reporting is seperated from the rest of the sdk
 */

const request = require('request');
const util = require('util');
const fs = require('fs');
const AdwordsConstants = require('./constants');
const AdwordsReportBuilder = require('./report-builder');
const AdwordsAuth = require('./auth');

class AdwordsReport {

    /**
     * @inheritDoc
     */
    constructor(credentials) {
        this.auth = new AdwordsAuth(credentials);
        this.credentials = credentials;
    }

    /**
     * Gets a report from the api
     * @access public
     * @param apiVersion {string} the version in the api
     * @param report {object} the report object
     * @param callback {function}
     * @param retryRequest {boolean} used to determine if we need to retry the request
     *                               for internal use only
     */
    getReport(apiVersion, report, callback, retryRequest) {
        if (typeof retryRequest === 'undefined') {
            retryRequest = true;
        }

        apiVersion = apiVersion || AdwordsConstants.DEFAULT_ADWORDS_VERSION;

        this.getHeaders((error, headers) => {
            if (error) {
                return callback(error);
            }
            var b = new AdwordsReportBuilder();
            var xml = b.buildReport(report);
            request({
                uri: 'https://adwords.google.com/api/adwords/reportdownload/' + apiVersion,
                method: 'POST',
                headers: headers,
                form: {
                    '__rdxml': xml
                }
            }, (error, response, body) => {
                if (error || -1 !== body.indexOf('<?xml')) {
                    error = error || body;
                    if (-1 !== error.toString().indexOf(AdwordsConstants.OAUTH_ERROR)) {
                        this.credentials.access_token = null;
                        return this.getReport(apiVersion, report, callback, false);
                    }
                    return callback(error, null);
                }
                return callback(null, body);
            });
        });
    }


    /**
     * Gets the headers for the request
     */
    getHeaders(callback) {
        this.getAccessToken((error, accessToken) => {
            if (error) {
                return callback(error);
            }
            var headers = {
                Authorization: 'Bearer ' + accessToken,
                developerToken: this.credentials.developerToken,
                clientCustomerId: this.credentials.clientCustomerId
            };
            return callback(null, headers);
        });
    }

    /**
     * Gets an access token
     * @access protected
     * @param callback {function}
     */
    getAccessToken(callback) {
        if (this.credentials.access_token) {
            return callback(null, this.credentials.access_token);
        }

        this.auth.refreshAccessToken(this.credentials.refresh_token, (error, tokens) => {
            if (error) {
                return callback(error);
            }
            this.credentials.access_token = tokens.access_token;
            callback(null, this.credentials.access_token);
        });
    }


}

module.exports = AdwordsReport;
