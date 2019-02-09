const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const speechText = 'さようなら!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('うちのゴミ', speechText)
      .getResponse();
  },
};

module.exports = CancelAndStopIntentHandler;
