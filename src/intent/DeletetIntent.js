
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

    const day_and_count = DateUtil.convertDayAndCount(handlerInput.requestEnvelope.request.intent.slots.day_and_count.value);

    const dynamo = new DAO(handlerInput);
    const garbage_data = await dynamo.getData();

    const delete_data = _.filter(garbage_data, { "day": day_and_count.day, "count": day_and_count.count });
    if (delete_data.length === 0) {
      // データが存在しない場合
      return handlerInput.responseBuilder
        .speak(util.format(Message.DELETE_NOT_FOUND, day_and_count.count, day_and_count.day))
        .getResponse();
    }

    const update_data = _.reject(garbage_data, { "day": day_and_count.day, "count": day_and_count.count });
    dynamo.putData(update_data);

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
      .speak(speechText)
      .getResponse();
  },
};

module.exports = DeleteIntentHandler;