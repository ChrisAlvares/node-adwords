# Node Adwords Api

This Api mirrors the offical PHP api pretty well so you can always look
at that documentation if something doesn't stand out.

## Authentication
Please use the [official google api client](https://github.com/google/google-api-nodejs-client)
for authenticating users. Use the `https://www.googleapis.com/auth/adwords` scope.

You will also need an adwords developer token.



## Testing
For testing, you will need a refresh token as well as a developer token.
These should be placed as environmental variables:

```
$ ADWORDS_API_TEST_DEVTOKEN=123453152342352352
$ ADWORDS_API_TEST_REFRESHTOKEN=a45ikg94k3994kg94kg4k
$ npm test
```
