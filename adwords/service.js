'use strict';
/**
 * Adwords Service Object
 * This object acts as many adwords objects
 */

const _ = require('lodash');
const soap = require('soap');
const async = require('async');
const AdwordsAuth = require('./auth');
const AdwordsConstants = require('./constants');
const AdwordsRequestParser = require('../lib/request-parser');

class AdwordsService {

    /**
     * @inheritDoc
     */
    constructor(credentials, serviceDescriptor) {
        this.credentials = credentials;
        this.auth = new AdwordsAuth(credentials);
        this.serviceDescriptor = serviceDescriptor;
        this.registerServiceDescriptorMethods(this.serviceDescriptor.methods);
    }

    /**
     * Attaches a function to the current service object
     * This is sort of like using the "Proxy.create" method
     * but have to wait till it is finalized in ES6
     * @access protected
     * @param methods {array} an array of string method names
     */
    registerServiceDescriptorMethods(methods) {
        for (var index in methods) {
            var method = methods[index];
            this[method] = this.callServiceMethod(method);
        }
    }

    /**
     * Helper method to call the service properly
     * @access private
     * @param method {string} the method name for the service
     * @return {function} returns a service call method to invoke.
     */
    callServiceMethod(method) {
        return _.bind(function() {
            var payload =  AdwordsRequestParser.convertToValidAdwordsRequest(arguments[0] || []);
            var callback = arguments[1] || function() {}
            this.callService(method, payload, callback, true);
        }, this);
    }

    /**
     * The bread and butter method that calls the adwords service.
     * This method should never be called directly
     * @access protected
     * @param method {string} the method to call e.g. `get` or `mutate`
     * @param payload {object} the request object to send to adwords
     * @param callback {function}
     * @param shouldRetry {boolean} should retry if there is an oAuth error
     */
    callService(method, payload, callback, shouldRetry) {
        async.parallel([
            this.getClient.bind(this),
            this.getAccessToken.bind(this)
        ], (error) => {
            if (error) {
                return callback(error);
            }

            this.client.setSecurity(
                new soap.BearerSecurity(this.credentials.access_token)
            );

            this.client[method](payload, this.parseResponse((error, response) => {
                if (error
                    && shouldRetry
                    && -1 !== error.toString().indexOf(AdwordsConstants.OAUTH_ERROR)) {
                        this.credentials.access_token = null;
                        return this.callService(method, payload, callback, false);
                }
                callback(error, response);
            }));
        });
    }

    /**
     * Parses the response from adwords
     * @access protected
     * @param callback
     * @return {function} a function that returns a parsed response
     */
    parseResponse(callback) {
        return function(error, response) {
            callback(error, (response && response.rval) || response);
        }
    }

    /**
     * Helper method to get the SOAP client
     * @access protected
     * @param callback {function} returns a function with error, soapclient and meta data
     */
    getClient(callback) {
        if (this.client && this.clientDetails) {
            return callback(null, this.client, this.clientDetails);
        }

        soap.createClient(this.serviceDescriptor.wsdl, (error, client) => {
            if (error) {
                return callback(error);
            }

            this.client = client;
            this.client.on('request', (request) => this.log('request', request));
            this.client.on('response', (response) => this.log('response', response));
            this.client.on('soapError', (error) => this.log('soapError', error));

            var clientDetails = {};
            clientDetails.description = this.client.describe();
            clientDetails.namespace = 'ns1';
            clientDetails.name = _.keys(clientDetails.description)[0];
            clientDetails.port = _.keys(clientDetails.description[clientDetails.name])[0];
            clientDetails.methods = _.keys(clientDetails.description[clientDetails.name][clientDetails.port]);
            this.clientDetails = clientDetails;

            var headers = {
                developerToken: this.credentials.developerToken,
                userAgent: this.credentials.userAgent,
                validateOnly: !!this.credentials.validateOnly
            }

            if (this.credentials.clientCustomerId) {
                headers.clientCustomerId = this.credentials.clientCustomerId;
            }

            this.client.addSoapHeader({
                RequestHeader: headers
            },
            this.clientDetails.name,
            this.clientDetails.namespace,
            this.serviceDescriptor.xmlns);


            return callback(null, this.client, this.clientDetails);
        })

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
     * Helper method to log all the soap calls
     * @access private
     */
    log() {
        if (this.credentials.debug) {
            console.log(arguments);
        }
    }

}

module.exports = AdwordsService;
