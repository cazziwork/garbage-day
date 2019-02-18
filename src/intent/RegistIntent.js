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

    const day_of_week = DateUtil.cleansing(slots.day_of_week.value);
    if ('' === day_of_week) {
      let intentObj = handlerInput.requestEnvelope.request.intent;
      intentObj.confirmationStatus = "IN_PROGRESS";
      return handlerInput.responseBuilder
        .speak('ごめんなさい、登録する曜日がわかりませんでした。月曜や火曜のように指定してください')
        .reprompt('もう一度登録する曜日を教えてください。')
        .addElicitSlotDirective('day_of_week', intentObj)
        .getResponse();
    }

    const count_of_week = DateUtil.cleansing(slots.count_of_week.value);
    if ('' === count_of_week) {
      let intentObj = handlerInput.requestEnvelope.request.intent;
      intentObj.confirmationStatus = "IN_PROGRESS";
      return handlerInput.responseBuilder
        .speak('ごめんなさい、登録する曜日間隔がわかりませんでした。毎週や第一のように指定してください')
        .reprompt('もう一度登録する曜日間隔を教えてください。')
        .addElicitSlotDirective('count_of_week', intentObj)
        .getResponse();
    }

    const item = slots.item.value;
    const key = count_of_week + day_of_week + item;

    const dynamo = new DAO(handlerInput);
    const garbage_data = await dynamo.getData();

    if (_.filter(garbage_data, { 'key': key }).length != 0) {
      // すでにキーが登録済みの場合
      let speechText = util.format(Message.REGIST_DUPLICATE, count_of_week, day_of_week, item);
      return handlerInput.responseBuilder
        .speak(speechText + Message.REGIST_AFTER)
        .reprompt(Message.HELP)
        .getResponse();
    }

    const regist_data = { 'key': key, 'count': count_of_week, 'day': day_of_week, 'item': item };
    if (_.isNil(garbage_data)) {
      dynamo.createData(regist_data);
    } else {
      dynamo.pushData(regist_data);
    }

    let speechText = util.format(Message.REGIST_COMPLETE, count_of_week, day_of_week, item);
    return handlerInput.responseBuilder
      .speak(speechText + Message.REGIST_AFTER)
      .reprompt(Message.HELP)
      .getResponse();
  },
};

module.exports = RegistIntentHandler;