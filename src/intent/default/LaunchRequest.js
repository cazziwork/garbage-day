
const DAO = require('../../helper/db-access');
const DateUtil = require('../../helper/date-util');
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

    if (template_mode) {
      // TellMeIntentへ
      return handlerInput.responseBuilder
        .addDelegateDirective({
          name: 'TellMeIntent',
          confirmationStatus: 'NONE',
          slots: {}
        })
        .speak(DateUtil.getHourGreeting((new Date().getHours())))
        .getResponse();
    }

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
