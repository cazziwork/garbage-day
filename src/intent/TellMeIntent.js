const _ = require('lodash');
const util = require('util');

const DAO = require('../helper/db-access');
const DateUtil = require('../helper/date-util');
const Message = require('../message');

const TellMeIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'TellMeIntent';
  },
  async handle(handlerInput) {

    const { slots } = handlerInput.requestEnvelope.request.intent;
    if (undefined != slots.day_of_week.value && !DateUtil.isValidDayOfWeek(slots.day_of_week.value)) {
      let intentObj = handlerInput.requestEnvelope.request.intent;
      intentObj.confirmationStatus = "IN_PROGRESS";
      return handlerInput.responseBuilder
        .speak('ごめんなさい、曜日がわかりませんでした。月曜や火曜のように指定してください')
        .reprompt('もう一度曜日を教えてください。')
        .addElicitSlotDirective('day_of_week', intentObj)
        .getResponse();
    }

    const dynamo = new DAO(handlerInput);
    const garbage_data = await dynamo.getData();
    if ((_.filter(garbage_data)).length === 0) {
      // データ登録がない場合
      return handlerInput.responseBuilder
        .speak(Message.TELLME_NOT_FOUND)
        .reprompt(Message.HELP)
        .getResponse();
    }

    const day_of_week = DateUtil.cleansing(slots.day_of_week.value);

    if ('' != day_of_week) {
      // 曜日指定がある場合はその曜日の登録データを返す
      const filter_data = _.filter(garbage_data, { 'day': day_of_week });

      let speechText = '';

      // TODO keyの配列を渡したいけど、それだと発話が微妙なので小細工する
      _.forEach(filter_data, function (data) {
        if (speechText === '') {
          speechText = util.format(Message.TELLME_ITEM_LIST, data.count, data.day, data.item);
        } else {
          speechText += ',' + util.format(Message.TELLME_ITEM_LIST, data.count, data.day, data.item);
        }
      });
      speechText += Message.TELLME_ITEM_REGISTED;

      return handlerInput.responseBuilder
        .speak(speechText)
        .reprompt(Message.HELP)
        .getResponse();
    }

    // 曜日指定がない場合は今日と明日のゴミを返す
    // 唯一このパターンのみrepromptさせずにセッションを切る。
    const today_list = DateUtil.getItemList(garbage_data, DateUtil.getToday());
    const tommorow_list = DateUtil.getItemList(garbage_data, DateUtil.getTommorow());

    const speechText = this.getGarbageWord(today_list, tommorow_list);
    return handlerInput.responseBuilder
      .speak(speechText)
      .withShouldEndSession(true)
      .getResponse();

  },
  getGarbageWord(today_list, tommorow_list) {
    const today_word = this.createRegistWordBody(today_list);
    const tommorow_word = this.createRegistWordBody(tommorow_list);
    return Message.TODAYS_GARBAGE + today_word + Message.TOMMOROW_GARBAGE + tommorow_word;
  },
  createRegistWordBody(garbage_list) {
    if (garbage_list.length === 0) {
      return Message.NOT_EXITS;
    }
    return garbage_list + 'です。';
  }
};

module.exports = TellMeIntentHandler;