
const _ = require('lodash');

const DAO = require('../helper/db-access');
const DateUtil = require('../helper/date-util');

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
    if (_.isNil(delete_data)) {
      // データが存在しない場合
      return handlerInput.responseBuilder
        .speak(day_and_count.count + day_and_count.day + 'にはまだデータが登録されていません')
        .getResponse();
    }

    const update_data = _.without(garbage_data, delete_data);
    dynamo.putData(update_data);

    return handlerInput.responseBuilder
      .speak(_.map(delete_data, 'key') + 'を削除しました')
      .getResponse();

  },
};

module.exports = DeleteIntentHandler;