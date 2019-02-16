const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const GOOD_BYE = [
      '<say-as interpret-as="interjection">ごきげんよう</say-as>',
      '<say-as interpret-as="interjection">さようなら</say-as>',
      '<say-as interpret-as="interjection">失礼します</say-as>',
      '<say-as interpret-as="interjection">じゃね</say-as>',
      '<say-as interpret-as="interjection">それでは</say-as>',
      '<say-as interpret-as="interjection">バイバイ</say-as>',
      '<say-as interpret-as="interjection">また明日</say-as>',
      '<say-as interpret-as="interjection">またいつでも聞いてください</say-as>',
      '<say-as interpret-as="interjection">またいつでもどうぞ</say-as>',
      '<say-as interpret-as="interjection">またね</say-as>',
      '<say-as interpret-as="interjection">よい一日を</say-as>',
      '<say-as interpret-as="interjection">んじゃ</say-as>',
    ];
    const speechText = GOOD_BYE[Math.floor( Math.random() * 12 )];

    return handlerInput.responseBuilder
      .speak(speechText)
      .withShouldEndSession(true)
      .getResponse();
  },
};

module.exports = CancelAndStopIntentHandler;
