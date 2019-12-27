const util = require('util');

const DAO = require('../helper/db-access');
const Message = require('../message');

const SwitchActionModeIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'SwitchActionModeIntent';
  },
  async handle(handlerInput) {

    const slots = handlerInput.requestEnvelope.request.intent.slots;
    const id = slots.mode.resolutions.resolutionsPerAuthority[0].values[0].value.id;
    const name = slots.mode.resolutions.resolutionsPerAuthority[0].values[0].value.name;
    
    console.log('mode:', name);

    const dynamo = new DAO(handlerInput);
    await dynamo.setTemplateActionMode(Number(id));

    return handlerInput.responseBuilder
      .speak(util.format(Message.SWITCH_COMPLETE, name))
      .withShouldEndSession(true)
      .getResponse();
  }
};

module.exports = SwitchActionModeIntentHandler;