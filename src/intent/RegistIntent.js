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

    const { slots } = handlerInput.requestEnvelope.request.intent;
    
    const day_and_count = DateUtil.convertDayAndCount(slots.day_and_count.value);
    if ('' === day_and_count) {
      let intentObj = handlerInput.requestEnvelope.request.intent;
      intentObj.confirmationStatus = "IN_PROGRESS";
      return handlerInput.responseBuilder
        .speak('ごめんなさい、登録する曜日がわかりませんでした。毎週月曜や第一火曜のように指定してください')
        .reprompt('もう一度登録する曜日を教えてください。')
        .addElicitSlotDirective('day_and_count', intentObj)
        .getResponse();
    }

    const item = slots.item.value;
    const key = day_and_count.count + day_and_count.day + item;

    const dynamo = new DAO(handlerInput);
    const garbage_data = await dynamo.getData();

    if (_.filter(garbage_data, { 'key': key }).length != 0) {
      // すでにキーが登録済みの場合
      let speechText = util.format(Message.REGIST_DUPLICATE, day_and_count.count, day_and_count.day, item);
      return handlerInput.responseBuilder
        .speak(speechText + Message.REGIST_AFTER)
        .reprompt(Message.HELP)
        .getResponse();
    }

    const regist_data = { 'key': key, 'count': day_and_count.count, 'day': day_and_count.day, 'item': item };
    if (_.isNil(garbage_data)) {
      dynamo.createData(regist_data);
    } else {
      dynamo.pushData(regist_data);
    }

    let speechText = util.format(Message.REGIST_COMPLETE, day_and_count.count, day_and_count.day, item);
    return handlerInput.responseBuilder
      .speak(speechText + Message.REGIST_AFTER)
      .reprompt(Message.HELP)
      .getResponse();
  },
};

module.exports = RegistIntentHandler;