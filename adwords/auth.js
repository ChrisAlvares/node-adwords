'use strict';

const {OAuth2Client} = require('google-auth-library');


class AdwordsAuth {

    /**
     * @inheritDoc
     */
    constructor(credentials, redirectUrl) {
        this.credentials = credentials;
        this.oauth2Client = new OAuth2Client(
            this.credentials.client_id,
            this.credentials.client_secret,
            redirectUrl
        );
    }

    /**
     * Generates an Authentication Url
     * @access public
     * @return {string} a URL to redirect to
     */
    generateAuthenticationUrl() {
        return this.oauth2Client.generateAuthUrl({
            access_type: 'offline',
            prompt: 'consent',
            scope: 'https://www.googleapis.com/auth/adwords'
        });
    }

    /**
     * Gets an access+refresh token from an authorization code
     * @access public
     * @param code {string} a coded string
     * @param callback {function}
     */
    getAccessTokenFromAuthorizationCode(code, callback) {
        this.oauth2Client.getToken(code, callback);
    }

    /**
     * Refreshes the access token
     * @access public
     * @param refreshToken {string} a refresh token
     * @param callback {function} a function with error and the new access token
     */
    refreshAccessToken(refreshToken, callback) {
        this.oauth2Client.setCredentials({
            refresh_token: refreshToken
        });
        this.oauth2Client.refreshAccessToken(callback)
    }

}

module.exports = AdwordsAuth;
