const _ = require('lodash');

const DAO = require('../helper/db-access');
const DateUtil = require('../helper/date-util');

const GetRegistItemIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'GetRegistItemIntent';
  },
  async handle(handlerInput) {

    const day_of_week = DateUtil.cleansing(handlerInput.requestEnvelope.request.intent.slots.day_of_week.value);

    const dynamo = new DAO(handlerInput);
    const garbage_data = await dynamo.getData();

    let items = [];
    _.forEach(garbage_data, function (data) {
      if (!_.isNil(day_of_week) && data.day_of_week != day_of_week) {
        return;
      }
      items.push(data.key);
    });

    let speechText = '';
    if (items.length === 0) {
      speechText = '登録されているデータがありませんでした';
    } else {
      speechText = items + 'が登録されています';
    }

    return handlerInput.responseBuilder
      .speak(speechText)
      .getResponse();
  },
};

module.exports = GetRegistItemIntentHandler;