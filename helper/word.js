const _ = require('lodash');
const Aigle = require('aigle');
Aigle.mixin(_);

module.exports = class Word {

  constructor() {}

  async getGarbageWord(items) {

    if (items.length === 0) {
      return 'ゴミの日データの登録がありませんでした。データを登録する場合は 登録して といってください。';
    }

    let item_word = '';
    await Aigle.forEach(items, function (item) {
      console.log('item:' + item);
      
      if (item_word === '') {
        item_word = item;
      } else {
        item_word = item_word + 'と' + item; 
      }
    });

    return '今日のゴミは' + item_word + 'です。';
  }
}