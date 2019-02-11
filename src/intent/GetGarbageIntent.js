const DAO = require('../helper/db-access');
const WordUtil = require('../helper/word-util');
const DateUtil = require('../helper/date-util');

const GetGarbageIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'GetGarbageIntent';
  },
  async handle(handlerInput) {

    const dynamo = new DAO(handlerInput);

    const data_list = await dynamo.getData();
    const today_list = DateUtil.getItemList(data_list, DateUtil.getToday());
    const tommorow_list = DateUtil.getItemList(data_list, DateUtil.getTommorow());
    
    const speechText = WordUtil.getGarbageWord(today_list, tommorow_list);

    return handlerInput.responseBuilder
      .speak(speechText)
      .getResponse();
  },
};

module.exports = GetGarbageIntentHandler;