const Alexa = require('ask-sdk-core');
const Adapter = require('ask-sdk-dynamodb-persistence-adapter');
const _ = require('lodash');
const Aigle = require('aigle');

const DAO = require('./db-access');

Aigle.mixin(_);

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

    const item = handlerInput.requestEnvelope.request.intent.slots.item.value;
    const day_of_week = handlerInput.requestEnvelope.request.intent.slots.day_of_week.value;
    const week_count = handlerInput.requestEnvelope.request.intent.slots.week_count.value;
    const key = week_count + day_of_week + item;

    const dynamo = new DAO(handlerInput);
    const garbage_data = await dynamo.getData();
    
    if (!await Aigle.isNil(await Aigle.find(garbage_data, { "key": key }))) {
      // すでにキーが登録済みの場合
      return handlerInput.responseBuilder
        .speak(key + 'はすでに登録されています。他のゴミを登録する場合は 登録して といってください。')
        .getResponse();
    }

    const regist_data = { "key": key, "item": item, "day_of_week": day_of_week, "week_count": week_count };
    if (await Aigle.isNil(garbage_data)) {
      dynamo.createData([regist_data]);
    } else {
      dynamo.insertData(regist_data);
    }

    return handlerInput.responseBuilder
      .speak(key + 'を登録しました。他にも登録する場合は 登録して といってください。')
      .getResponse();
  },
};

const TellMeIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'TellMeIntent';
  },
  async handle(handlerInput) {

    let dynamo = new DAO(handlerInput);
    let items = await getTodaysItemList(await dynamo.getData());
    console.log(items);

    //const speechText = '今日は' + getTodaysItem(persistentAttributes.data) + 'です';
    return handlerInput.responseBuilder
      .speak('test')
      .getResponse();
  },
};

async function getTodaysItemList(data_list) {
  const today = getDayAndCount(new Date());
  console.log('today:' + JSON.stringify(today));
  let itemValue = [];

  await Aigle.forEach(data_list, function (data) {

    if (data.day_of_week != today.day) {
      return;
    }
    if (data.week_count === 'まいしゅう') {
      console.log('option:' + data.week_count);
      itemValue.push(data.item);
      return;
    }
    if (data.week_count === today.count) {
      console.log('option:' + data.week_count);
      itemValue.push(data.item);
      return;
    }
  });
  return itemValue;

}

function getDayAndCount(date) {
  return {
    day: ["にちよう", "げつよう", "かよう", "すいよう", "もくよう", "きんよう", "どよう"][date.getDay()],
    count: ["だいいち", "だいに", "だいさん", "だいよん", "だいご"][Math.floor((date.getDate() - 1) / 7)]
  };
}

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speechText = 'おしえてというと今日のゴミをお知らせします';

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
