const Message = require('../../message');

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('<say-as interpret-as="interjection">ごめんなさい</say-as>、ちょっとわかりませんでした。')
      .withShouldEndSession(true)
      .getResponse();
  },
};

module.exports = ErrorHandler;
