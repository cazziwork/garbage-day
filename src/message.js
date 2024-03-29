module.exports = {
  SKILL_NAME: 'ゴミ出しコンシェルジュ',

  // Launch
  LAUNCH: 'このスキルでゴミの日を登録しておけば、今日のゴミを教えて というだけで今日と明日のゴミをお知らせします。',

  // Regist
  REGIST_DUPLICATE: '%s%s<break time="0.3s"/>%sはすでに登録されています。',
  REGIST_COMPLETE: '%s%s<break time="0.3s"/>%sを登録しました。',
  REGIST_AFTER: '続けて登録したい場合は<break time="0.3s"/>登録して<break time="0.3s"/>といってください。',

  // TellMe
  TELLME_NOT_FOUND: '登録されているデータがありませんでした。データを登録したい場合は<break time="0.3s"/>登録して<break time="0.3s"/>といってください。',
  TELLME_ITEM_LIST: '%s%s<break time="0.3s"/>%s',
  TELLME_ITEM_REGISTED: 'が登録されています。他の曜日を知りたい場合は、例えば<break time="0.3s"/>月曜日のゴミを教えて<break time="0.3s"/>のように言ってください。',

  // Delete
  DELETE_NOT_FOUND: '%sにはまだデータが登録されていません。',
  DELETE_ITEM_LIST: '%s%s<break time="0.3s"/>%s',
  DELETE_COMPLETE: 'を削除しました。',
  DELETE_AFTER: '続けて削除したい場合は<break time="0.3s"/>削除して<break time="0.3s"/>といってください。',
  DELETE_ANOTHER: '他の曜日を削除したい場合は、たとえば<break time="0.3s"/>月曜を削除して<break time="0.3s"/>のように言ってください。',

  // Switch
  SWITCH_COMPLETE: '定型アクションモードを %s にしました。',

  // etc
  TODAYS_GARBAGE: '今日のゴミは',
  TOMMOROW_GARBAGE: '明日のゴミは',
  NOT_EXITS: 'ありません。',

  HELP: '詳しい使い方を知りたい場合は<break time="0.3s"/>ヘルプ<break time="0.3s"/>といってください。',
  HELP_DETAIL: '登録して<break time="0.3s"/>というとゴミの日を登録できます。 \
                削除して<break time="0.3s"/>というと登録済みのゴミの日を削除できます。\
                教えて<break time="0.3s"/>というと今日と明日のゴミをお知らせします。\
                それぞれ例えば<break time="0.3s"/>月曜日のゴミを教えて<break time="0.3s"/>のように曜日を指定することもできます。\
                定型アクションモードを有効にして<break time="0.3s"/>というと定型アクションから起動できるように、スキル呼び出しと同時に今日と明日のゴミをお知らせします。',
}
