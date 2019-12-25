// const _ = require('lodash');
// const util = require('util');

// const DAO = require('../helper/db-access');
// const DateUtil = require('../helper/date-util');
const Message = require('../message');

const SwitchActionModeIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'SwitchActionModeIntent';
  },
  async handle(handlerInput) {

    const slots = handlerInput.requestEnvelope.request.intent.slots;
    const flag = slots.flag.resolutions.resolutionsPerAuthority[0].values[0].value.id;
    console.log('flag:', flag);

    // フラグをDynamoDBに突っ込む
    
    return handlerInput.responseBuilder
      .speak('スウィッチ')
      .withShouldEndSession(true)
      .getResponse();
  }
};

module.exports = SwitchActionModeIntentHandler;