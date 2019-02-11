const _ = require('lodash');

module.exports = class WordUtil {

  static getRegistItemWord(item_list) {
    if (item_list.length === 0) {
      return '登録されているデータがありません。';
    }

    let body = '';
    _.forEach(item_list, function(item){
      if (body === '') {
        body = item;
      } else {
        body = body + '<break time="0.5s"/>' + item;
      }
    });
    return '登録されているのは' + body + 'です。';
  }


  static getGarbageWord(today_list, tommorow_list) {
    const today_word = this.createRegistWordBody(today_list);
    const tommorow_word = this.createRegistWordBody(tommorow_list);
    return '今日のゴミは' + today_word + '明日のゴミは' + tommorow_word;
  }

  static createRegistWordBody(garbage_list) {
    if (garbage_list.length === 0) {
      return 'ありません。';
    }

    let body = '';
    _.forEach(garbage_list, function (garbage) {
      console.log('garbage:' + garbage);
      
      if (body === '') {
        body = garbage;
      } else {
        body = body + 'と' + garbage; 
      }
    });
    return body + 'です。';
  }
}