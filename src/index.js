const Alexa = require('ask-sdk-core');
const Adapter = require('ask-sdk-dynamodb-persistence-adapter');
const _ = require('lodash');
const Aigle = require('aigle');
Aigle.mixin(_);

const DAO = require('./helper/db-access');
const WordUtil = require('./helper/word-util');
const DateUtil = require('./helper/date-util');

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

const RegistIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'RegistIntent';
  },
  async handle(handlerInput) {

    const day_of_week = DateUtil.cleansing(handlerInput.requestEnvelope.request.intent.slots.day_of_week.value);
    const week_count = handlerInput.requestEnvelope.request.intent.slots.week_count.value;
    const item = handlerInput.requestEnvelope.request.intent.slots.item.value;

    const key = week_count + day_of_week + item;

    const dynamo = new DAO(handlerInput);
    const garbage_data = await dynamo.getData();

    if (!await Aigle.isNil(await Aigle.find(garbage_data, { "key": key }))) {
      // すでにキーが登録済みの場合
      return handlerInput.responseBuilder
        .speak(week_count + day_of_week + '<break time="0.5s"/>' + item + 'はすでに登録されています。他のゴミを登録する場合は 登録して といってください。')
        .getResponse();
    }

    const regist_data = { "key": key, "item": item, "day_of_week": day_of_week, "week_count": week_count };
    if (await Aigle.isNil(garbage_data)) {
      dynamo.createData([regist_data]);
    } else {
      dynamo.pushData(regist_data);
    }

    return handlerInput.responseBuilder
      .speak(week_count + day_of_week + '<break time="0.5s"/>' + item + 'を登録しました。他にも登録する場合は 登録して といってください。')
      .getResponse();
  },
};

const TellMeIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'TellMeIntent';
  },
  async handle(handlerInput) {

    const dynamo = new DAO(handlerInput);

    const data_list = await dynamo.getData();
    const today_list = DateUtil.getItemList(data_list, DateUtil.getToday());
    const tommorow_list = DateUtil.getItemList(data_list, DateUtil.getTommorow());
    
    const speechText = WordUtil.getGarbageWord(today_list, tommorow_list);

    return handlerInput.responseBuilder
      .speak(speechText)
      .getResponse();
  },
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speechText = 'おしえてというと今日と明日のゴミをお知らせします';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('うちのゴミ', speechText)
      .getResponse();
  },
};

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

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

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

const config = {
  tableName: 'GarbageDayTable',
  createTable: true
};
const DynamoDBAdapter = new Adapter.DynamoDbPersistenceAdapter(config);

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    RegistIntentHandler,
    TellMeIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .withPersistenceAdapter(DynamoDBAdapter)
  .lambda();
