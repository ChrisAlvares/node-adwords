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

    describe('when definined via XML', function(){
        it('should return a valid report', function(done) {
            let report = new AdwordsReport(config);

            report.getReport('v201710', {
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

            report.getReport('v201710', {
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

        it('should return a valid report for a date type instead of custom dates', function(done) {
            let report = new AdwordsReport(config);
            report.getReport('v201710', {
                reportName: 'Custom Adgroup Performance Report',
                reportType: 'CAMPAIGN_PERFORMANCE_REPORT',
                fields: ['CampaignId', 'Impressions', 'Clicks', 'Cost'],
                filters: [
                    {field: 'CampaignStatus', operator: 'IN', values: ['ENABLED', 'PAUSED']}
                ],
                dateRangeType: 'YESTERDAY',
                format: 'CSV' //defaults to CSV
            }, done);
        });

        it('should return a valid report without a date field', function(done) {
            let report = new AdwordsReport(config);
            report.getReport('v201710', {
                reportName: 'Custom Criteria Performance Report',
                reportType: 'SHARED_SET_CRITERIA_REPORT',
                fields: ['AccountDescriptiveName'],
                dateRangeType: 'ALL_TIME',
                format: 'CSV' //defaults to CSV
            }, done);
        });



        it('should return an invalid report for a bad access token', function(done) {
            let newConfig = _.clone(config);
            newConfig.refresh_token = null;
            newConfig.access_token = null;
            let report = new AdwordsReport(newConfig);
            report.getReport('v201710', {
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

    describe('when defined via AWQL', function(){
        it('should return a valid report', function(done) {
            let report = new AdwordsReport(config);

            report.getReport('v201710', {
                query: 'SELECT CampaignId, Impressions, Clicks, Cost FROM CAMPAIGN_PERFORMANCE_REPORT',
                format: 'CSV' //defaults to CSV
            }, done);
        });

        it('should return a valid report for xml type reports', function(done) {
            let report = new AdwordsReport(config);

            report.getReport('v201710', {
                query: 'SELECT CampaignId, Impressions, Clicks, Cost FROM CAMPAIGN_PERFORMANCE_REPORT',
                format: 'XML'
            }, done);
        });
    });

});
