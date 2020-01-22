const Message = require('../message');

module.exports = class WordUtil {

    static getGarbageWord(today_list, tommorow_list) {
        const today_word = this.createRegistWordBody(today_list);
        const tommorow_word = this.createRegistWordBody(tommorow_list);
        return Message.TODAYS_GARBAGE + today_word + Message.TOMMOROW_GARBAGE + tommorow_word;
    }
    static createRegistWordBody(garbage_list) {
        if (garbage_list.length === 0) {
            return Message.NOT_EXITS;
        }
        return garbage_list + 'です。';
    }
}
