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
      if (data.week_count === '毎週') {
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
      day: ["日曜", "月曜", "火曜", "水曜", "木曜", "金曜", "土曜"][date.getDay()],
      count: ["第一", "第二", "第三", "第四", "第五"][Math.floor((date.getDate() - 1) / 7)]
    };
  }

  // 表記の揺れをクレンジング
  static cleansing(target) {

    switch (target) {
      case 'げつ':
      case 'げつよう':
      case 'げつようび':
      case '月':
      case '月曜':
      case '月曜日':
        return '月曜';

      case 'か':
      case 'かよう':
      case 'かようび':
      case '火':
      case '火曜':
      case '火曜日':
        return '火曜';

      case 'すい':
      case 'すいよう':
      case 'すいようび':
      case '水':
      case '水曜':
      case '水曜日':
        return '水曜';

      case 'もく':
      case 'もくよう':
      case 'もくようび':
      case '木':
      case '木曜':
      case '木曜日':
        return '木曜';

      case 'きん':
      case 'きんよう':
      case 'きんようび':
      case '金':
      case '金曜':
      case '金曜日':
        return '金曜';

      case 'ど':
      case 'どよう':
      case 'どようび':
      case '土':
      case '土曜':
      case '土曜日':
        return '土曜';

      case 'にち':
      case 'にちよう':
      case 'にちようび':
      case '日':
      case '日曜':
      case '日曜日':
        return '日曜';

      case 'まいしゅう':
      case '毎週':
        return '毎週';

      case 'だいいち':
      case '第一':
        return '第一';

      case 'だいに':
      case '第二':
        return '第二';

      case 'だいさん':
      case '第三':
        return '第三';

      case 'だいよん':
      case '第四':
        return '第四';

      case 'だいご':
      case '第五':
        return '第五';

      default:
        return target;
    }
  }

}