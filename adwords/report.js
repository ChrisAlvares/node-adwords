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

        report = report || {};
        apiVersion = apiVersion || AdwordsConstants.DEFAULT_ADWORDS_VERSION;

        this.getHeaders(report.additionalHeaders, (error, headers) => {
            if (error) {
                return callback(error);
            }

            request({
                uri: 'https://adwords.google.com/api/adwords/reportdownload/' + apiVersion,
                method: 'POST',
                headers: headers,
                form: this.buildReportBody(report)
            }, (error, response, body) => {
                if (error || this.reportBodyContainsError(report, body)) {
                    error = error || body;
                    if (-1 !== error.toString().indexOf(AdwordsConstants.OAUTH_ERROR) && retryRequest) {
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
     * Determines if the body contains an error message
     * @param report {object} the report object
     * @param body {string} the body string
     * @return {boolean}
     */
    reportBodyContainsError(report, body) {
        if ('xml' !== (''+report.format).toLowerCase() && -1 !== body.indexOf('<?xml')) {
            return true;
        }
        return false;
    }

    /**
     * Gets the headers for the request
     * @param additionalHeaders {object} gets additional headers
     */
    getHeaders(additionalHeaders, callback) {
        this.getAccessToken((error, accessToken) => {
            if (error) {
                return callback(error);
            }
            var headers = {
                Authorization: 'Bearer ' + accessToken,
                developerToken: this.credentials.developerToken,
                clientCustomerId: this.credentials.clientCustomerId
            };
            Object.assign(headers, additionalHeaders);
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

    /**
     * Builds the report body
     * @access protected
     * @param report {object} the adwords report
     * @return {object} a formated formData
     */
    buildReportBody(report) {
        var b = new AdwordsReportBuilder();
        var form;
        if (report.query) {
            form = {
                '__rdquery': report.query,
                '__fmt': report.format || 'CSV'
            };
        } else {
            form = {
                '__rdxml': b.buildReport(report)
            }
        }
        return form;
    }


}

module.exports = AdwordsReport;
