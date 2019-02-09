const _ = require('lodash');

module.exports = class DateUtil {

  static getToday() {
    return new Date();
  }

  static getTommorow() {
    let day = this.getToday();
    day.setDate(day.getDate() + 1);
    return day;
  }

  static getItemList(data_list, target_day) {
    const day = this.getDayAndCount(target_day);
    console.log('day:' + JSON.stringify(day));
    let itemValue = [];

    _.forEach(data_list, function (data) {
      console.log('data:' + JSON.stringify(data));

      if (data.day_of_week != day.day) {
        return;
      }
      if (data.week_count === 'まいしゅう') {
        itemValue.push(data.item);
        return;
      }
      if (data.week_count === day.count) {
        itemValue.push(data.item);
        return;
      }
    });
    return itemValue;

  }

  static getDayAndCount(date) {
    return {
      day: ["にちよう", "げつよう", "かよう", "すいよう", "もくよう", "きんよう", "どよう"][date.getDay()],
      count: ["だいいち", "だいに", "だいさん", "だいよん", "だいご"][Math.floor((date.getDate() - 1) / 7)]
    };
  }

  static cleansing(target) {

    switch (target) {
      case 'げつ':
      case 'げつようび':
        return 'げつよう';
        break;

      case 'か':
      case 'かようび':
        return 'かよう';
        break;

      case 'すい':
      case 'すいようび':
        return 'すいよう';
        break;

      case 'もく':
      case 'もくようび':
        return 'もくよう';
        break;

      case 'きん':
      case 'きんようび':
        return 'きんよう';
        break;

      case 'ど':
      case 'どようび':
        return 'どよう';
        break;

      case 'にち':
      case 'にちようび':
        return 'にちよう';
        break;
      
        default:
          return target;
    }
  }

}