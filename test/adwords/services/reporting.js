'use strict';
/**
 * Reporting endpoint
 */
const _ = require('lodash');
const AdwordsReport = require('../../../index').AdwordsReport;

describe('ReportService', function() {

    let config = require('./adwordsuser-config');
    if (!config) {
        return console.log('Adwords User not configured, skipping ReportService Service tests');
    }


    it('should return a valid report', function(done) {
        let report = new AdwordsReport(config);

        report.getReport('v201609', {
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

    it('should return a valid report for xml type reports', function(done) {
        let report = new AdwordsReport(config);

        report.getReport('v201609', {
            reportName: 'Custom Adgroup Performance Report',
            reportType: 'CAMPAIGN_PERFORMANCE_REPORT',
            fields: ['CampaignId', 'Impressions', 'Clicks', 'Cost'],
            filters: [
                {field: 'CampaignStatus', operator: 'IN', values: ['ENABLED', 'PAUSED']}
            ],
            startDate: new Date("07/10/2016"),
            endDate: new Date(),
            format: 'XML'
        }, done);
    });

    it('should return an invalid report for a bad access token', function(done) {
        let newConfig = _.clone(config);
        newConfig.refresh_token = null;
        newConfig.access_token = null;
        let report = new AdwordsReport(newConfig);
        report.getReport('v201609', {
            reportName: 'Custom Adgroup Performance Report',
            reportType: 'CAMPAIGN_PERFORMANCE_REPORT',
            fields: ['CampaignId', 'Impressions', 'Clicks', 'Cost'],
            filters: [
                {field: 'CampaignStatus', operator: 'IN', values: ['ENABLED', 'PAUSED']}
            ],
            startDate: new Date("07/10/2016"),
            endDate: new Date(),
            format: 'XML'
        }, (error, data) => {
            if (error) {
                return done();
            }
            done(new Error('Should have errored with bad access token'));
        });
    });
});
