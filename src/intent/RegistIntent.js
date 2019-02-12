const _ = require('lodash');

const DAO = require('../helper/db-access');
const DateUtil = require('../helper/date-util');

const RegistIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'RegistIntent';
  },
  async handle(handlerInput) {
    
    const day_and_count = DateUtil.convertDayAndCount(handlerInput.requestEnvelope.request.intent.slots.day_and_count.value);
    const item = handlerInput.requestEnvelope.request.intent.slots.item.value;

    const key = day_and_count.count + day_and_count.day + item;

    const dynamo = new DAO(handlerInput);
    const garbage_data = await dynamo.getData();

    if (_.filter(garbage_data, { 'key': key }).length != 0) {
      // すでにキーが登録済みの場合
      return handlerInput.responseBuilder
        .speak(day_and_count.count + day_and_count.day + '<break time="0.3s"/>' + item + 'はすでに登録されています')
        .getResponse();
    }

    const regist_data = { 'key': key, 'item': item, 'day': day_and_count.day, 'count': day_and_count.count };
    if (_.isNil(garbage_data)) {
      dynamo.createData(regist_data);
    } else {
      dynamo.pushData(regist_data);
    }

    return handlerInput.responseBuilder
      .speak(day_and_count.count + day_and_count.day + '<break time="0.3s"/>' + item + 'を登録しました')
      .getResponse();
  },
};

module.exports = RegistIntentHandler;