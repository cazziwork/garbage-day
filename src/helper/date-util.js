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

  static getHourGreeting(hour) {
    switch (hour) {
      case 19:
      case 20:
      case 21:
      case 22:
      case 23:
      case 24:
      case 0:
      case 1:
      case 2:
      case 3:
        return 'こんばんわ。';
      case 4:
      case 5:
      case 6:
      case 7:
      case 8:
      case 9:
      case 10:
        return 'おはようございます。';
      case 11:
      case 12:
      case 13:
      case 14:
      case 15:
      case 16:
      case 17:
      case 18:
      default:
        return 'こんにちは。';
    }
  }

  static getItemList(data_list, target_day) {
    const day = this.getDayAndCount(target_day);
    let itemValue = [];

    _.forEach(data_list, function (data) {
      if (data.day != day.day) {
        return;
      }
      if (data.count === '毎週') {
        itemValue.push(data.item);
        return;
      }
      if (data.count === day.count) {
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

  static isValidDayOfWeek(value) {
    return '' != this.cleansing(value);
  }

  static cleansing(target) {
    switch (target) {
      case '月曜':
      case '月曜日':
      case 'げつよう':
      case 'げつようび':
        return '月曜';

      case '火曜':
      case '火曜日':
      case 'かよう':
      case 'かようび':
        return '火曜';

      case '水曜':
      case '水曜日':
      case 'すいよう':
      case 'すいようび':
        return '水曜';

      case '木曜':
      case '木曜日':
      case 'もくよう':
      case 'もくようび':
        return '木曜';

      case '金曜':
      case '金曜日':
      case 'きんよう':
      case 'きんようび':
        return '金曜';

      case '土曜':
      case '土曜日':
      case 'どよう':
      case 'どようび':
        return '土曜';

      case '日曜':
      case '日曜日':
      case 'にちよう':
      case 'にちようび':
        return '日曜';

      case '今日':
      case 'きょう':
        return '今日';

      case '全て':
      case 'すべて':
      case '全部':
      case 'ぜんぶ':
        return '全て';

      case '毎週':
      case 'まいしゅう':
      case 'マイシュウ':
        return '毎週';

      case '第一':
      case 'だいいち':
      case 'ダイイチ':
        return '第一';

      case '第二':
      case 'だいに':
      case 'ダイニ':
        return '第二';

      case '第三':
      case 'だいさん':
      case 'ダイサン':
        return '第三';

      case '第四':
      case 'だいよん':
      case 'ダイヨン':
        return '第四';

      case '第五':
      case 'だいご':
      case 'ダイゴ':
        return '第五';

      default:
        return '';

    }
  }

}