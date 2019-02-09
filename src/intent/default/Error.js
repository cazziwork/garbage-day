const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('ごめんなさい、ちょっとわかりませんでした。')
      .getResponse();
  },
};

module.exports = ErrorHandler;
