
// const _ = require('lodash');
// const Aigle = require('aigle');
// Aigle.mixin(_);

// const DAO = require('../helper/db-access');
// const DateUtil = require('../helper/date-util');

const DeleteIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'DeleteIntent';
  },
  async handle(handlerInput) {

    const day_of_week = DateUtil.cleansing(handlerInput.requestEnvelope.request.intent.slots.day_of_week.value);
    const week_count = DateUtil.cleansing(handlerInput.requestEnvelope.request.intent.slots.week_count.value);

    return handlerInput.responseBuilder
      .speak(week_count * day_of_week)
      .getResponse();

    // const day_of_week = DateUtil.cleansing(handlerInput.requestEnvelope.request.intent.slots.day_of_week.value);
    // const week_count = handlerInput.requestEnvelope.request.intent.slots.week_count.value;
    // const item = handlerInput.requestEnvelope.request.intent.slots.item.value;

    // const key = week_count + day_of_week + item;

    // const dynamo = new DAO(handlerInput);
    // const garbage_data = await dynamo.getData();

    // if (!await Aigle.isNil(await Aigle.find(garbage_data, { "key": key }))) {
    //   // すでにキーが登録済みの場合
    //   return handlerInput.responseBuilder
    //     .speak(week_count + day_of_week + '<break time="0.5s"/>' + item + 'はすでに登録されています。他のゴミを登録する場合は 登録して といってください。')
    //     .getResponse();
    // }

    // const regist_data = { "key": key, "item": item, "day_of_week": day_of_week, "week_count": week_count };
    // if (await Aigle.isNil(garbage_data)) {
    //   dynamo.createData([regist_data]);
    // } else {
    //   dynamo.pushData(regist_data);
    // }

    // return handlerInput.responseBuilder
    //   .speak(week_count + day_of_week + '<break time="0.5s"/>' + item + 'を登録しました。他にも登録する場合は 登録して といってください。')
    //   .getResponse();
  },
};

module.exports = DeleteIntentHandler;