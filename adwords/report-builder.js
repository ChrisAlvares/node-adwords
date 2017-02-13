'use strict';
/**
 * Helper class to help build a report
 */
const builder = require('xmlbuilder');
const moment = require('moment');

class AdwordsReportBuilder {

    /**
     * Builds a report
     * @access public
     * @param report {object}
     */
    buildReport(report) {
        var xml = builder.create('reportDefinition');
        this.buildSelector(xml, report);
        xml.ele('reportName', {}, report.reportName);
        xml.ele('reportType', {}, report.reportType);    
        xml.ele('dateRangeType', {}, report.dateRangeType ? report.dateRangeType  : 'CUSTOM_DATE');
        xml.ele('downloadFormat', {}, report.format);
        return xml.end();
    }

    /**
     * Builds the fields list in the selector. This function modifies the xmlelement
     * @param fields {array} Array of field names
     * @access private
     * @return null
     */
    buildSelector(xml, report) {
        var selector = xml.ele('selector');
        this.buildFields(selector, report.fields);
        this.buildFilters(selector, report.filters);
        if (report.dateRangeType === undefined) {
            this.buildDateRange(selector, report.startDate, report.endDate);
        }
    }

    /**
     * Builds the fields
     * @access private
     * @param selector {xml}
     * @param fields {array}
     */
    buildFields(selector, fields) {
        for (var index in fields) {
            selector.ele('fields', {}, fields[index]);
        }
    }

    /**
     * Builds the date range
     * @access private
     * @param selector {xml}
     * @param startDate {date}
     * @param endDate {date}
     */
    buildDateRange(selector, startDate, endDate) {
        var dateElement = selector.ele('dateRange');
        dateElement.ele('min', {}, moment(new Date(startDate)).format('YYYYMMDD'));
        dateElement.ele('max', {}, moment(new Date(endDate)).format('YYYYMMDD'));
    }

    /**
     * Builds the Filters
     * @param selector {xml}
     * @param filters {array} an array of filters
     */
    buildFilters(selector, filters) {
        for (var index in filters) {
            var filter = filters[index];
            var element = selector.ele('predicates');
            element.ele('field', {}, filter.field);
            element.ele('operator', {}, filter.operator);
            if (!(filter.values instanceof Array)) {
                filter.values = [filter.values]
            }
            for (var r in filter.values) {
                element.ele('values', {}, filter.values[r]);
            }
        }
    }





}

module.exports = AdwordsReportBuilder;
