
const _ = require('lodash');
const util = require('util');

const DAO = require('../helper/db-access');
const DateUtil = require('../helper/date-util');
const Message = require('../message');

const DeleteIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'DeleteIntent';
  },
  async handle(handlerInput) {

    const { confirmationStatus, slots } = handlerInput.requestEnvelope.request.intent;
    if (confirmationStatus === "DENIED") {
      // 最終確認で「いいえ」と言われたら聞き直す
      let intentObj = handlerInput.requestEnvelope.request.intent;
      intentObj.confirmationStatus = "IN_PROGRESS";
      return handlerInput.responseBuilder
        .speak("何曜日のゴミを削除しますか？")
        .addElicitSlotDirective('day_of_week', intentObj)
        .getResponse();
    }
    let day_of_week = DateUtil.cleansing(slots.day_of_week.value);
    if ('' === day_of_week) {
      let intentObj = handlerInput.requestEnvelope.request.intent;
      intentObj.confirmationStatus = "IN_PROGRESS";
      return handlerInput.responseBuilder
        .speak('ごめんなさい、登録する曜日がわかりませんでした。月曜や火曜のように指定してください')
        .reprompt('もう一度登録する曜日を教えてください。')
        .addElicitSlotDirective('day_of_week', intentObj)
        .getResponse();
    }

    const dynamo = new DAO(handlerInput);
    const garbage_data = await dynamo.getData();

    let delete_data = [];
    if ('今日' === day_of_week) {
      day_of_week = DateUtil.getDayAndCount(DateUtil.getToday()).day;
    }
    if ('全て' === day_of_week) {
      delete_data = _.filter(garbage_data);
    } else {
      delete_data = _.filter(garbage_data, { 'day': day_of_week });
    }
    
    if (delete_data.length === 0) {
      // データが存在しない場合
      let speechText = util.format(Message.DELETE_NOT_FOUND, day_of_week)
      return handlerInput.responseBuilder
        .speak(speechText + Message.DELETE_ANOTHER)
        .reprompt(Message.HELP)
        .getResponse();
    }

    if ('全て' === day_of_week) {
      await dynamo.clearData();
    } else {
      const update_data = _.reject(garbage_data, { "day": day_of_week });
      await dynamo.putData(update_data);
    }

    // util.formatは残念ながらarray未対応！
    let speechText = '';
    _.forEach(delete_data, function (data) {
      if (speechText === '') {
        speechText = util.format(Message.DELETE_ITEM_LIST, data.count, data.day, data.item);
      } else {
        speechText += ',' + util.format(Message.DELETE_ITEM_LIST, data.count, data.day, data.item);
      }
    });
    speechText += Message.DELETE_COMPLETE;

    return handlerInput.responseBuilder
      .speak(speechText + Message.DELETE_AFTER)
      .reprompt(Message.HELP)
      .getResponse();
  },
};

module.exports = DeleteIntentHandler;