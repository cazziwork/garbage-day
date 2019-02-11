const Alexa = require('ask-sdk-core');
const Adapter = require('ask-sdk-dynamodb-persistence-adapter');

const LaunchRequestHandler = require('./intent/default/LaunchRequest');
const HelpIntentHandler = require('./intent/default/HelpIntent');
const CancelAndStopIntentHandler = require('./intent/default/CancelAndStopIntent');
const SessionEndedRequestHandler = require('./intent/default/SessionEndedRequest');
const ErrorHandler = require('./intent/default/Error');

const RegistIntentHandler = require('./intent/RegistIntent');
const DeleteIntentHandler = require('./intent/DeletetIntent');
const GetGarbageIntentHandler = require('./intent/GetGarbageIntent');
const GetRegistItemIntentHandler = require('./intent/GetRegistItemIntent');

const config = {
  tableName: 'GarbageDayTable',
  createTable: true
};
const DynamoDBAdapter = new Adapter.DynamoDbPersistenceAdapter(config);

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    RegistIntentHandler,
    DeleteIntentHandler,
    GetRegistItemIntentHandler,
    GetGarbageIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .withPersistenceAdapter(DynamoDBAdapter)
  .lambda();
