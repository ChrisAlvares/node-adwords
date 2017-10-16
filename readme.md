# Node Adwords Api

This is an unofficial Adwords sdk for NodeJS > 6.0. This Api mirrors the official
api pretty well so you can always look at the
[Adwords documentation](https://developers.google.com/adwords/api/docs/reference/)
and even the PHP sdk if something doesn't stand out.

This API is the first feature complete Adwords Api for Node.

You will need an Adwords developer token. Apply [here](https://developers.google.com/adwords/api/docs/guides/signup)

## Getting Started

The main adwords user object follows the [auth](https://github.com/googleads/googleads-php-lib/blob/19.0.0/src/Google/Api/Ads/AdWords/auth.ini) parameters
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
let campaignService = user.getService('CampaignService', 'v201710')

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
regular api.

```js
const AdwordsReport = require('node-adwords').AdwordsReport;

let report = new AdwordsReport({/** same config as AdwordsUser above */});
report.getReport('v201710', {
    reportName: 'Custom Adgroup Performance Report',
    reportType: 'CAMPAIGN_PERFORMANCE_REPORT',
    fields: ['CampaignId', 'Impressions', 'Clicks', 'Cost'],
    filters: [
        {field: 'CampaignStatus', operator: 'IN', values: ['ENABLED', 'PAUSED']}
    ],
    dateRangeType: 'CUSTOM_DATE', //defaults to CUSTOM_DATE. startDate or endDate required for CUSTOM_DATE
    startDate: new Date("07/10/2016"),
    endDate: new Date(),
    format: 'CSV' //defaults to CSV
}, (error, report) => {
    console.log(error, report);
});
```

You can also pass in additional headers in case you need to remove the header rows

```js
report.getReport('v201710', {
    ...
    additionalHeaders: {
        skipReportHeader: true,
        skipReportSummary: true
    }
}, (error, report) => {
    console.log(error, report);
});
```


## Adwords Query Language (AWQL)

If you do not want to use the reporting / getters, you can also get the data via
AWQL.

```js
const AdwordsUser = require('node-adwords').AdwordsUser;
const AdwordsConstants = require('node-adwords').AdwordsConstants;

let user = new AdwordsUser({...});
let campaignService = user.getService('CampaignService')

let params = {
    query: 'SELECT Id, Name WHERE Status = "ENABLED" ORDER BY Name DESC LIMIT 0,50'
};

campaignService.get(params, (error, result) => {
    console.log(error, result);
})
```

You can also use AWQL with Performance Reports

```js
let report = new AdwordsReport({/** same config as AdwordsUser above */});
report.getReport('v201710', {
    query: 'SELECT Criteria FROM KEYWORDS_PERFORMANCE_REPORT DURING 20170101,20170325',
    format: 'CSV'
});


```
## Authentication
Internally, the node-adwords sdk use the [official google api client](https://github.com/google/google-api-nodejs-client)
for authenticating users. Using the `https://www.googleapis.com/auth/adwords` scope.
The node-adwords sdk has some helper methods for you to authenticate if you do not
need additional scopes.

```js
const AdwordsAuth = require('node-adwords').AdwordsAuth;

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


## Service account Authentication
How does it work?

When using Google APIs from the server (or any non-browser based application), authentication is performed through a Service Account, which is a special account representing your application. This account has a unique email address that can be used to grant permissions to. If a user wants to give access to his Google Drive to your application, he must share the files or folders with the Service Account using the supplied email address.

Now that the Service Account has permission to some user resources, the application can query the API with OAuth2. When using OAuth2, authentication is performed using a token that has been obtained first by submitting a JSON Web Token (JWT). The JWT identifies the user as well as the scope of the data he wants access to. The JWT is also signed with a cryptographic key to prevent tampering. Google generates the key and keeps only the public key for validation. You must keep the private key secure with your application so that you can sign the JWT in order to guarantee its authenticity.

The application requests a token that can be used for authentication in exchange with a valid JWT. The resulting token can then be used for multiple API calls, until it expires and a new token must be obtained by submitting another JWT.

Creating a Service Account using the Google Developers Console

From the Google Developers Console, select your project or create a new one.

Under "APIs & auth", click "Credentials".

Under "OAuth", click the "Create new client ID" button.

Select "Service account" as the application type and click "Create Client ID".

The key for your new service account should prompt for download automatically. Note that your key is protected with a password. IMPORTANT: keep a secure copy of the key, as Google keeps only the public key.

Convert the downloaded key to PEM, so we can use it from the Node crypto module.

To do this, run the following in Terminal:

`openssl pkcs12 -in downloaded-key-file.p12 -out your-key-file.pem -nodes`

You will be asked for the password you received during step 5.  
hint: notasecret

That's it! You now have a service account with an email address and a key that you can use from your Node application.

```js
const AdwordsClient = require('node-adwords').AdwordsClient;
const AdwordsConstants = require('node-adwords').AdwordsConstants;
const googleapis = require('googleapis');

const SERVICE_ACCOUNT_KEY_FILE = 'INSERT_PATH_TO_KEYFILE.pem';

const jwtClient = new googleapis.auth.JWT(
    // use the email address of the service account, as seen in the API console
    'my-service-account@developer.gserviceaccount.com',
    // use the PEM file we generated from the downloaded key
    SERVICE_ACCOUNT_KEY_FILE,
    null,
    // specify the scopes you wish to access
    ['https://www.googleapis.com/auth/adwords'],
    // sub email
    'user-email'
)

jwtClient.authorize((err) => {
    if(err) throw err;

    const client = new AdwordsClient(jwtClient, {
        developerToken: 'INSERT_DEVELOPER_TOKEN_HERE', //your adwords developerToken
        userAgent: 'INSERT_COMPANY_NAME_HERE', //any company name
        clientCustomerId: 'INSERT_CLIENT_CUSTOMER_ID_HERE', //the Adwords Account id (e.g. 123-123-123)
        client_id: 'INSERT_OAUTH2_CLIENT_ID_HERE', //this is the api console client_id     
    })

   const campaignService = client.getService('CampaignService')

    //create selector
    let selector = {
        fields: ['Id', 'Name'],
        ordering: [{field: 'Name', sortOrder: 'ASCENDING'}],
        paging: {startIndex: 0, numberResults: AdwordsConstants.RECOMMENDED_PAGE_SIZE}
    }

    campaignService.get({serviceSelector: selector}, (error, result) => {
        console.log(error, result);
    })
})

```

# Troubleshooting

## Adwords.Types
Sometimes, in the Adwords documentation, you will see "Specify xsi:type instead".
As of version 201609.1.0, you can specify this in the request as another attribute.

```js
let operation = {
    operator: 'ADD',
    operand: {
        campaignId: '1234567',
        criterion: {
            type: 'IP_BLOCK',
            'xsi:type': 'IpBlock',
            ipAddress: '123.12.123.12',
        },
        'xsi:type': 'NegativeCampaignCriterion'
    }
}
```

## Ordering
Because the Adwords Api uses a non-standard SOAP implementation, the order of the
elements are required to be in the order of the elements in the documentation.
When drafting api calls, make sure the order matches the order in the documentation.
For more information, see [issue #20](https://github.com/ChrisAlvares/node-adwords/issues/20)

```js
//this will work
let operation = {
    operator: 'ADD',
    operand: {
     ....
    }
}
```

```js
//this will not work
let operation = {
    operand: {
     ....
    },
    operator: 'ADD',
}
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

## Credits
While this is not a fork of
the [googleads-node-lib library](https://github.com/ErikEvenson/googleads-node-lib/), it
did help with some debugging while creating this one.
