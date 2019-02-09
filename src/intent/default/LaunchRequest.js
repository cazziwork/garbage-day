const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {

    // TODO 本当はここでDynamoを見に行ってデータが登録済みならいきなりゴミの日を知らせようとおもったけど、
    // フレームワークの作りとしてできないため断念。
    // 今後の機能拡張を期待してTODOのままとしておく。

    const speechText = 'こんにちは。';
    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Hello World', speechText)
      .getResponse();
  },
};

module.exports = LaunchRequestHandler;
