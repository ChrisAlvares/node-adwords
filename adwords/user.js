'use strict';
/**
 * Adwords user
 */

const util = require('util');
const _ = require('lodash');
const AdwordsServiceDescriptors = require('../services');
const AdwordsService = require('./service');
const AdwordsConstants = require('./constants');

class AdwordsUser {

    /**
     * @inheritDoc
     */
    constructor(obj) {
        this.credentials = _.extend({
            developerToken: '',
            userAgent: 'node-adwords',
            clientCustomerId: '',
            client_id: '',
            client_secret: '',
            refresh_token: '',//@todo implement refesh token instead of access token
            access_token: '',
        }, obj);
    }


    /**
     * Returns an Api Service Endpoint
     * @access public
     * @param service {string} the name of the service to load
     * @param adwordsversion {string} the adwords version, defaults to 201609
     * @return {AdwordsService} An adwords service object to call methods from
     */
    getService(service, adwordsVersion) {
        adwordsVersion = adwordsVersion || AdwordsConstants.DEFAULT_ADWORDS_VERSION;
        var serviceDescriptor = AdwordsServiceDescriptors[service];
        if (!serviceDescriptor) {
            throw new Error(
                util.format('No Service Named %s in %s of the adwords api', service, adwordsVersion)
            );
        }

        var service = new AdwordsService(
            this.credentials,
            this.populateServiceDescriptor(serviceDescriptor, adwordsVersion)
        );

        return service;
    }

    /**
     * Populates the service descriptor with dynamic values
     * @access protected
     * @param serviceDescriptor {object} the obejct from the service descriptor object
     * @param adwordsVersion {string} the adwords version to replace inside the service descriptors
     * @return {object} a new service descriptor with the proper versioning
     */
    populateServiceDescriptor(serviceDescriptor, adwordsVersion) {
        var finalServiceDescriptor = _.clone(serviceDescriptor);
        for (var index in finalServiceDescriptor) {
            if ('string' === typeof finalServiceDescriptor[index]) {
                finalServiceDescriptor[index] = finalServiceDescriptor[index].replace(/\{\{version\}\}/g, adwordsVersion);
            }
        }
        return finalServiceDescriptor;
    }

}

module.exports = AdwordsUser;
