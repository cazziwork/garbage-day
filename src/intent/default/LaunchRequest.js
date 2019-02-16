
const DateUtil = require('../../helper/date-util');
const Message = require('../../message');

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {

    // TODO 本当はここでDynamoを見に行ってデータが登録済みならいきなりゴミの日を知らせようとおもったけど、
    // フレームワークの作りとしてできないため断念。
    // 今後の機能拡張を期待してTODOのままとしておく。

    let speechText = DateUtil.getHourGreeting((new Date().getHours()));
    speechText += Message.LAUNCH;
    speechText += Message.HELP;

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(Message.HELP)
      .getResponse();
  },
};

module.exports = LaunchRequestHandler;
