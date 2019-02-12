const _ = require('lodash');
const util = require('util');

const DAO = require('../helper/db-access');
const DateUtil = require('../helper/date-util');
const Message = require('../message');

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
        .speak(util.format(Message.REGIST_DUPLICATE, day_and_count.count,day_and_count.day,item) + Message.REGIST_AFTER)
        .reprompt(Message.HELP)
        .getResponse();
    }

    const regist_data = { 'key': key, 'item': item, 'day': day_and_count.day, 'count': day_and_count.count };
    if (_.isNil(garbage_data)) {
      dynamo.createData(regist_data);
    } else {
      dynamo.pushData(regist_data);
    }

    return handlerInput.responseBuilder
      .speak(util.format(Message.REGIST_COMPLETE, day_and_count.count,day_and_count.day,item) + Message.REGIST_AFTER)
      .reprompt(Message.HELP)
      .getResponse();
  },
};

module.exports = RegistIntentHandler;