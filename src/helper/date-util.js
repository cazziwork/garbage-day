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

  static convertDayAndCount(target) {

    switch (target) {
      case '毎週月曜':
      case '毎週月曜日':
      case 'まいしゅうげつよう':
      case 'まいしゅうげつようび':
        return { count: '毎週', day: '月曜' };

      case '毎週火曜':
      case '毎週火曜日':
      case 'まいしゅうかよう':
      case 'まいしゅうかようび':
        return { count: '毎週', day: '火曜' };

      case '毎週水曜':
      case '毎週水曜日':
      case 'まいしゅうすいよう':
      case 'まいしゅうすいようび':
        return { count: '毎週', day: '水曜' };

      case '毎週木曜':
      case '毎週木曜日':
      case 'まいしゅうもくよう':
      case 'まいしゅうもくようび':
        return { count: '毎週', day: '木曜' };

      case '毎週金曜':
      case '毎週金曜日':
      case 'まいしゅうきんよう':
      case 'まいしゅうきんようび':
        return { count: '毎週', day: '金曜' };

      case '毎週土曜':
      case '毎週土曜日':
      case 'まいしゅうどよう':
      case 'まいしゅうどようび':
        return { count: '毎週', day: '土曜' };

      case '毎週日曜':
      case '毎週日曜日':
      case 'まいしゅうにちよう':
      case 'まいしゅうにちようび':
        return { count: '毎週', day: '日曜' };

      case '第一月曜':
      case '第一月曜日':
      case 'だいいちげつよう':
      case 'だいいちげつようび':
        return { count: '第一', day: '月曜' };

      case '第一火曜':
      case '第一火曜日':
      case 'だいいちかよう':
      case 'だいいちかようび':
        return { count: '第一', day: '火曜' };

      case '第一水曜':
      case '第一水曜日':
      case 'だいいちすいよう':
      case 'だいいちすいようび':
        return { count: '第一', day: '水曜' };

      case '第一木曜':
      case '第一木曜日':
      case 'だいいちもくよう':
      case 'だいいちもくようび':
        return { count: '第一', day: '木曜' };

      case '第一金曜':
      case '第一金曜日':
      case 'だいいちきんよう':
      case 'だいいちきんようび':
        return { count: '第一', day: '金曜' };

      case '第一土曜':
      case '第一土曜日':
      case 'だいいちどよう':
      case 'だいいちどようび':
        return { count: '第一', day: '土曜' };

      case '第一日曜':
      case '第一日曜日':
      case 'だいいちにちよう':
      case 'だいいちにちようび':
        return { count: '第一', day: '日曜' };

      case '第二月曜':
      case '第二月曜日':
      case 'だいにげつよう':
      case 'だいにげつようび':
        return { count: '第二', day: '月曜' };

      case '第二火曜':
      case '第二火曜日':
      case 'だいにかよう':
      case 'だいにかようび':
        return { count: '第二', day: '火曜' };

      case '第二水曜':
      case '第二水曜日':
      case 'だいにすいよう':
      case 'だいにすいようび':
        return { count: '第二', day: '水曜' };

      case '第二木曜':
      case '第二木曜日':
      case 'だいにもくよう':
      case 'だいにもくようび':
        return { count: '第二', day: '木曜' };

      case '第二金曜':
      case '第二金曜日':
      case 'だいにきんよう':
      case 'だいにきんようび':
        return { count: '第二', day: '金曜' };

      case '第二土曜':
      case '第二土曜日':
      case 'だいにどよう':
      case 'だいにどようび':
        return { count: '第二', day: '土曜' };

      case '第二日曜':
      case '第二日曜日':
      case 'だいににちよう':
      case 'だいににちようび':
        return { count: '第二', day: '日曜' };

      case '第三月曜':
      case '第三月曜日':
      case 'だいさんげつよう':
      case 'だいさんげつようび':
        return { count: '第三', day: '月曜' };

      case '第三火曜':
      case '第三火曜日':
      case 'だいさんかよう':
      case 'だいさんかようび':
        return { count: '第三', day: '火曜' };

      case '第三水曜':
      case '第三水曜日':
      case 'だいさんすいよう':
      case 'だいさんすいようび':
        return { count: '第三', day: '水曜' };

      case '第三木曜':
      case '第三木曜日':
      case 'だいさんもくよう':
      case 'だいさんもくようび':
        return { count: '第三', day: '木曜' };

      case '第三金曜':
      case '第三金曜日':
      case 'だいさんきんよう':
      case 'だいさんきんようび':
        return { count: '第三', day: '金曜' };

      case '第三土曜':
      case '第三土曜日':
      case 'だいさんどよう':
      case 'だいさんどようび':
        return { count: '第三', day: '土曜' };

      case '第三日曜':
      case '第三日曜日':
      case 'だいさんにちよう':
      case 'だいさんにちようび':
        return { count: '第三', day: '日曜' };

      case '第四月曜':
      case '第四月曜日':
      case 'だいよんげつよう':
      case 'だいよんげつようび':
        return { count: '第四', day: '月曜' };

      case '第四火曜':
      case '第四火曜日':
      case 'だいよんかよう':
      case 'だいよんかようび':
        return { count: '第四', day: '火曜' };

      case '第四水曜':
      case '第四水曜日':
      case 'だいよんすいよう':
      case 'だいよんすいようび':
        return { count: '第四', day: '水曜' };

      case '第四木曜':
      case '第四木曜日':
      case 'だいよんもくよう':
      case 'だいよんもくようび':
        return { count: '第四', day: '木曜' };

      case '第四金曜':
      case '第四金曜日':
      case 'だいよんきんよう':
      case 'だいよんきんようび':
        return { count: '第四', day: '金曜' };

      case '第四土曜':
      case '第四土曜日':
      case 'だいよんどよう':
      case 'だいよんどようび':
        return { count: '第四', day: '土曜' };

      case '第四日曜':
      case '第四日曜日':
      case 'だいよんにちよう':
      case 'だいよんにちようび':
        return { count: '第四', day: '日曜' };

      case '第五月曜':
      case '第五月曜日':
      case 'だいごげつよう':
      case 'だいごげつようび':
        return { count: '第五', day: '月曜' };

      case '第五火曜':
      case '第五火曜日':
      case 'だいごかよう':
      case 'だいごかようび':
        return { count: '第五', day: '火曜' };

      case '第五水曜':
      case '第五水曜日':
      case 'だいごすいよう':
      case 'だいごすいようび':
        return { count: '第五', day: '水曜' };

      case '第五木曜':
      case '第五木曜日':
      case 'だいごもくよう':
      case 'だいごもくようび':
        return { count: '第五', day: '木曜' };

      case '第五金曜':
      case '第五金曜日':
      case 'だいごきんよう':
      case 'だいごきんようび':
        return { count: '第五', day: '金曜' };

      case '第五土曜':
      case '第五土曜日':
      case 'だいごどよう':
      case 'だいごどようび':
        return { count: '第五', day: '土曜' };

      case '第五日曜':
      case '第五日曜日':
      case 'だいごにちよう':
      case 'だいごにちようび':
        return { count: '第五', day: '日曜' };

      default:
        return '';
    }
  }
}