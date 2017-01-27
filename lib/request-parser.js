'use strict';
/**
 * Parses the request for SOAP attributes to work correctly
 */
var _ = require('lodash');

class RequestParser {

    /**
     * Converts the Adwords Request to a valid request
     * Needed due to adwords WSDL not being 100% accurate
     * @access public
     * @param request {object} the request object for adwords
     * @return {object} the request object formatted correctly
     */
    convertToValidAdwordsRequest(request) {
        return this.convertAttributeTypes(_.cloneDeep(request));
    }

    /**
     * Converts Attribute Types for the xsi:type field
     * @access private
     * @param object the request body
     * @return {object}
     */
    convertAttributeTypes(obj) {
        for (var key in obj) {
            var value = obj[key];
            if ('attributes' === key) {
                continue;
            }
            
            if ('object' === typeof value) {
                obj[key] = this.convertAttributeTypes(value);
                continue;
            }

            if ('xsi:type' ===  key) {
                obj.attributes = obj.attributes || {};
                obj.attributes['xsi:type'] = value;
                delete obj[key];
            }
        }
        return obj;
    }

}

module.exports = new RequestParser();
