/**
 * This file warrants its own test due to the 'attributes' attribute of the Adwords FeedService Feed objects, which,
 * unfortunately require special logic to prevent improperly formatted SOAP requests to the FeedService.
 *
 */


const AdwordsUser = require('../../../index').AdwordsUser;
const AdwordsConstants = require('../../../index').AdwordsConstants;

describe('FeedService', function () {
  let config = require('./adwordsuser-config');
  if (!config) {
    return console.log('Adwords User not configured, skipping Feed Service tests');
  }

  let user = new AdwordsUser(config);

  it('should return a feed list', function(done) {
    let service = user.getService('FeedService', config.version, attributesKey = 'attributesKey');
    let selector = {
      fields: [
        'Id', 'Name', 'FeedStatus', 'Attributes', 'Origin', 'SystemFeedGenerationData'
      ]
    };

    service.get({selector: selector}, done);
  });

  it('should create and remove a feed', function(done) {
    let service = user.getService('FeedService', config.version, attributesKey = 'attributesKey');

    let feedDef = {
      name: "Test Feed - " + Date.now().toString().slice(13),
      attributes: [
        {
          name: "testField1",
          type: "INT64"
        },
        {
          name: "testField2",
          type: "FLOAT"
        },
      ]
    };

    let operations = {
      operations: [
        {
          operator: "ADD",
          operand: feedDef
        }
      ]
    };

    service.mutate(operations, (error, result) => {

      if (error) {
        done(error)
      }

      let deleteOperation = {
          operations: [{
            operator: "REMOVE",
            operand: {
              id: result.value[0].id,
              status: 'REMOVED'
            }
          }]
        };

      service.mutate(deleteOperation, done)

    })

  });

  it('should create and remove a feed without specifying the attributeskey', function(done) {

    var service = user.getService('FeedService', config.version, attributesKey = 'attributesKey');

    var feedDef = {
      name: "Test Feed - " + Date.now().toString().slice(13),
      attributes: [
        {
          name: "testField1",
          type: "INT64"
        },
        {
          name: "testField2",
          type: "FLOAT"
        },
      ]
    };

    var operations = {
      operations: [
        {
          operator: "ADD",
          operand: feedDef
        }
      ]
    };

    service.mutate(operations, (error, result) => {

      if (error) {
        done(error)
      }

      var deleteOperation = {
        operations: [{
          operator: "REMOVE",
          operand: {
            id: result.value[0].id,
            status: 'REMOVED'
          }
        }]
      };

      service.mutate(deleteOperation, done)

    })

  })
});