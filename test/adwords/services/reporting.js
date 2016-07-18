'use strict';
/**
 * Reporting endpoint
 */

const AdwordsReport = require('../../../index').AdwordsReport;

describe('ReportService', function() {

    var config = require('./adwordsuser-config');
    if (!config) {
        return console.log('Adwords User not configured, skipping ReportService Service tests');
    }


    it('should return a valid report', function(done) {
        let report = new AdwordsReport(config);

        report.getReport('v201605', {
            reportName: 'Custom Adgroup Performance Report',
            reportType: 'CAMPAIGN_PERFORMANCE_REPORT',
            fields: ['CampaignId', 'Impressions', 'Clicks', 'Cost'],
            filters: [
                {field: 'CampaignStatus', operator: 'IN', values: ['ENABLED', 'PAUSED']}
            ],
            startDate: new Date("07/10/2016"),
            endDate: new Date(),
            format: 'CSV' //defaults to CSV
        }, done);
 });

});
