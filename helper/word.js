const _ = require('lodash');

module.exports = class Word {

  getGarbageWord(today_list, tommorow_list) {
    const today_word = this.createBody(today_list);
    const tommorow_word = this.createBody(tommorow_list);
    return '今日のゴミは' + today_word + '明日のゴミは' + tommorow_word;
  }

  createBody(garbage_list) {
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