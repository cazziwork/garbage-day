const Alexa = require('ask-sdk-core');
const Adapter = require('ask-sdk-dynamodb-persistence-adapter');
const _ = require('lodash');

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    const speechText = 'ようこそうちのごみへ。';

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
    const day_option = handlerInput.requestEnvelope.request.intent.slots.day_option.value;
    const key = day_option + day_of_week;

    const { attributesManager } = handlerInput;
    const persistentAttributes = await attributesManager.getPersistentAttributes();

    if (undefined != _.find(persistentAttributes.data, { "key": key })) {
      // すでにキーが登録済みの場合
      // TODO 上書きするか確認したい
      return handlerInput.responseBuilder
        .speak(key + 'はすでに登録されています。')
        .getResponse();
    }

    // console.log('find:' + JSON.stringify(_.find(persistentAttributes.data, { "key": day_option + day_of_week })));
    const regist_data = { "key": key, "value": item, "day_of_week": day_of_week, "day_option": day_option };
    if (undefined === persistentAttributes.data) {
      persistentAttributes.data = [regist_data];
    } else {
      let data_array = persistentAttributes.data;
      data_array.push(regist_data);
      persistentAttributes.data = data_array;
    }
    // 永続アトリビュートの保存
    attributesManager.setPersistentAttributes(persistentAttributes);
    await attributesManager.savePersistentAttributes();

    return handlerInput.responseBuilder
      .speak(key + item + 'を登録しました')
      .getResponse();
  },
};

const TellMeIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'TellMeIntent';
  },
  async handle(handlerInput) {

    const { attributesManager } = handlerInput;
    const persistentAttributes = await attributesManager.getPersistentAttributes();

    const speechText = '今日は' + getTodaysItem(persistentAttributes.data) + 'です';
    return handlerInput.responseBuilder
      .speak(speechText)
      .getResponse();
  },
};

function getTodaysItem(items) {
  const today = getDayAndCount(new Date());
  console.log('today:' + JSON.stringify(today));
  let itemValue = 'ゴミの日登録がないよう';

  _.forEach(items, function (item) {
    
    if (item.day_of_week != today.day) {
      return;
    }
    if (item.day_option === '毎週') {
      console.log('option:' + item.day_option);
      itemValue  = item.value;
      return false;
    }
    if (item.day_option === today.count) {
      console.log('option:' + item.day_option);
      itemValue  = item.value;
      return false;
    }
  });
  return itemValue;

}

function getDayAndCount(date) {
  return { day: ["日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日"][date.getDay()], 
           count: ["第一","第二","第三","第四","第五"][Math.floor((date.getDate() - 1) / 7)] };
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
  tableName: 'MyTrashSkillTable',
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
