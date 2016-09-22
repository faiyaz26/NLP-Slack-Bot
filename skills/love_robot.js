var answer = 'I am a Bot! A bot doesn`t have feelings. So I don`t understand what is love.';
module.exports = function(skill, info, bot, message) {

    console.log('INVOCATION OF NON-CONFIGURED SKILL: ' + skill);

    bot.reply(message, answer);
};
