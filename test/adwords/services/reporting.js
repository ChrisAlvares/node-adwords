'use strict';
/**
 * Reporting endpoint
 */
const _ = require('lodash');
const AdwordsReport = require('../../../index').AdwordsReport;
const sinon = require('sinon');
const https = require('https');
const http = require('http');
const os = require('os');
const path = require ('path');
const assert = require('assert');
const MockReq = require('mock-req');
const MockRes = require('mock-res');

describe('ReportService', function() {
    let config = require('./adwordsuser-config');

    describe('streamReport', function() {
        let post;

        beforeEach(() => {
            post = sinon.stub(https, 'request');
        });

        afterEach(() => {
            https.request.restore();
        });

        it('streamReport success', function(done) {
            let report = new AdwordsReport({});

            sinon.stub(report, 'getHeaders').yields(null, {});
            sinon.stub(report, 'buildParams').returns({});

            let responseBody = "Header1,Header2,Header3\n1,2,3\n";

            let response = new MockRes();

            let request = new MockReq({
                method: 'POST'
            });

            let dataSpy = sinon.spy();
            response.on('data', dataSpy);

            post.yields(response).returns(request);

            let callback = (res) => {
              assert.equal(res, response);
              done();
            };

            report.streamReport('v201809', { header: 'test' }, callback);
        });

        it('should error out on getHeaders', function(done){
            let report = new AdwordsReport({});

            sinon.stub(report, 'getHeaders').yields({ error: 'error'}, {});

            let callback = function(_error, status) {
                if (!status) {
                    return done();
                }

                done(new Error('Should have errored with bad access token'));
            };

            report.streamReport('v201809', { header: 'test' }, callback);
        });

        it('should error out on post', function(done) {
            let report = new AdwordsReport({});

            sinon.stub(report, 'getHeaders').yields(null, {});
            sinon.stub(report, 'buildParams').returns({});

            let callback = function(_error, status) {
                if (!status) {
                    return done();
                }

                done(new Error('Should have errored'));
            };

            let response = new MockRes();
            response.statusCode = 400;

            let request = new MockReq({
                method: 'POST'
            });

            post.yields(response).returns(request);

            report.streamReport('v201809', { header: 'test' }, callback);
        });
    });

    if (!config) {
        return console.log('Adwords User not configured, skipping ReportService Service tests');
    }

    describe('when definined via XML', function(){
        it('should return a valid report', function(done) {
            let report = new AdwordsReport(config);

            report.getReport('v201809', {
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

            report.getReport('v201809', {
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
            report.getReport('v201809', {
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
            report.getReport('v201809', {
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
            report.getReport('v201809', {
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

            report.getReport('v201809', {
                query: 'SELECT CampaignId, Impressions, Clicks, Cost FROM CAMPAIGN_PERFORMANCE_REPORT',
                format: 'CSV' //defaults to CSV
            }, done);
        });

        it('should return a valid report for xml type reports', function(done) {
            let report = new AdwordsReport(config);

            report.getReport('v201809', {
                query: 'SELECT CampaignId, Impressions, Clicks, Cost FROM CAMPAIGN_PERFORMANCE_REPORT',
                format: 'XML'
            }, done);
        });
    });
});
