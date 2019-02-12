const _ = require('lodash');

const DAO = require('../helper/db-access');
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
    
    const speechText = this.getGarbageWord(today_list, tommorow_list);

    return handlerInput.responseBuilder
      .speak(speechText)
      .getResponse();
  },
  getGarbageWord(today_list, tommorow_list) {
    const today_word = this.createRegistWordBody(today_list);
    const tommorow_word = this.createRegistWordBody(tommorow_list);
    return '今日のゴミは' + today_word + '明日のゴミは' + tommorow_word;
  },
  createRegistWordBody(garbage_list) {
    if (garbage_list.length === 0) {
      return 'ありません。';
    }
    return garbage_list + 'です。';
  }
};

module.exports = GetGarbageIntentHandler;