# Node Adwords Api

This is an unofficial Adwords sdk for NodeJS > 3.0. This Api mirrors the official
PHP api pretty well so you can always look at that documentation if
something doesn't stand out.

This API is the first feature complete Adwords Api for Node.

You will need an Adwords developer token. Apply [here](https://developers.google.com/adwords/api/docs/guides/signup)

## Getting Started

The main adwords user object follows the [auth] (https://github.com/googleads/googleads-php-lib/blob/master/src/Google/Api/Ads/AdWords/auth.ini) parameters
of the PHP library.

```js
const AdwordsUser = require('node-adwords').AdwordsUser;

let user = new AdwordsUser({
    developerToken: 'INSERT_DEVELOPER_TOKEN_HERE', //your adwords developerToken
    userAgent: 'INSERT_COMPANY_NAME_HERE', //any company name
    clientCustomerId: 'INSERT_CLIENT_CUSTOMER_ID_HERE', //the Adwords Account id (e.g. 123-123-123)
    client_id: 'INSERT_OAUTH2_CLIENT_ID_HERE', //this is the api console client_id
    client_secret: 'INSERT_OAUTH2_CLIENT_SECRET_HERE',
    refresh_token: 'INSERT_OAUTH2_REFRESH_TOKEN_HERE'
});
```

## Usage

The following shows how to retrieve a list of campaigns. The biggest difference
from the PHP library is the node library does not have special objects for
`Selector` and `Page` and other entity types. It uses standard object notation.


```js
const AdwordsUser = require('node-adwords').AdwordsUser;
const AdwordsConstants = require('node-adwords').AdwordsConstants;

let user = new AdwordsUser({...});
let campaignService = user.getService('CampaignService', 'v201605')

//create selector
let selector = {
    fields: ['Id', 'Name'],
    ordering: [{field: 'Name', sortOrder: 'ASCENDING'}],
    paging: {startIndex: 0, numberResults: AdwordsConstants.RECOMMENDED_PAGE_SIZE}
}

campaignService.get({serviceSelector: selector}, (error, result) => {
    console.log(error, result);
})

```

## Reporting

The Adwords SDK also has a reporting endpoint, which is separate from
the `user.getService` endpoint since the reporting api is not part of the
regular sdk.

```js
const AdwordsReport = require('node-adwords').AdwordsReport;

let report = new AdwordsReport({/** same config as AdwordsUser above */});
report.getReport('v201606', {
    reportName: 'Custom Adgroup Performance Report',
    reportType: 'CAMPAIGN_PERFORMANCE_REPORT',
    fields: ['CampaignId', 'Impressions', 'Clicks', 'Cost'],
    filters: [
        {field: 'CampaignStatus', operator: 'IN', values: ['ENABLED', 'PAUSED']}
    ],
    startDate: new Date("07/10/2016"),
    endDate: new Date(),
    format: 'CSV' //defaults to CSV
}, (error, report) => {
    console.log(error, report);
});
```



## Authentication
Internally, the node-adwords sdk use the [official google api client](https://github.com/google/google-api-nodejs-client)
for authenticating users. Using the `https://www.googleapis.com/auth/adwords` scope.
The node-adwords sdk has some helper methods for you to authenticate if you do not
need additional scopes.

```js
const AdwordsUser = require('node-adwords').AdwordsAuth;

let auth = new AdwordsAuth({
    client_id: 'INSERT_OAUTH2_CLIENT_ID_HERE', //this is the api console client_id
    client_secret: 'INSERT_OAUTH2_CLIENT_SECRET_HERE'
}, 'https://myredirecturlhere.com/adwords/auth' /** insert your redirect url here */);

//assuming express
app.get('/adwords/go', (req, res) => {
    res.redirect(auth.generateAuthenticationUrl());
})

app.get('/adwords/auth', (req, res) => {
    auth.getAccessTokenFromAuthorizationCode(req.query.code, (error, tokens) => {
        //save access and especially the refresh tokens here
    })
});

```


## Testing
For testing, you will need a refresh token as well as a developer token.
These should be placed as environmental variables:

```
$ ADWORDS_API_TEST_DEVTOKEN=123453152342352352
$ ADWORDS_API_TEST_REFRESHTOKEN=INSERT_OAUTH2_REFRESH_TOKEN_HERE
$ ADWORDS_API_TEST_CLIENT_ID=INSERT_OAUTH2_CLIENT_ID_HERE
$ ADWORDS_API_TEST_CLIENT_SECRET=INSERT_OAUTH2_CLIENT_SECRET_HERE
$ ADWORDS_API_TEST_CLIENT_CUSTOMER_ID=INSERT_CLIENT_CUSTOMER_ID_HERE

$ npm test
```
