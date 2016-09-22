var answer = 'I am Online, that means I am Alive!!';
module.exports = function(skill, info, bot, message) {

    console.log('INVOCATION OF NON-CONFIGURED SKILL: ' + skill);

    bot.reply(message, answer);

};
