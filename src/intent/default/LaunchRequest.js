
const _ = require('lodash');

const DAO = require('../../helper/db-access');
const DateUtil = require('../../helper/date-util');
const WordUtil = require('../../helper/word-util');
const Message = require('../../message');

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  async handle(handlerInput) {

    console.log('userId:', handlerInput.requestEnvelope.context.System.user.userId);

    const dynamo = new DAO(handlerInput);
    const template_mode = await dynamo.getTemplateActionMode();
    console.log('mode:', template_mode);

    if (!template_mode) {
      let speechText = DateUtil.getHourGreeting((new Date().getHours()));
      speechText += Message.LAUNCH;
      speechText += Message.HELP;
  
      return handlerInput.responseBuilder
        .speak(speechText)
        .reprompt(Message.HELP)
        .getResponse();
    }

    const garbage_data = await dynamo.getData();
    if ((_.filter(garbage_data)).length === 0) {
      // データ登録がない場合
      return handlerInput.responseBuilder
        .speak(Message.TELLME_NOT_FOUND)
        .reprompt(Message.HELP)
        .getResponse();
    }
    
    const today_list = DateUtil.getItemList(garbage_data, DateUtil.getToday());
    const tommorow_list = DateUtil.getItemList(garbage_data, DateUtil.getTommorow());
    let speechText = WordUtil.getGarbageWord(today_list, tommorow_list);
    return handlerInput.responseBuilder
      .speak(speechText)
      .withShouldEndSession(true)
      .getResponse();
  },
};

module.exports = LaunchRequestHandler;
