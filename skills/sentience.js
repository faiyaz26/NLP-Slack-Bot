var answer = 'It is not robots that will kill us all by becoming self-aware, it is humans who have lost all sense of humanity.';
module.exports = function(skill, info, bot, message) {

    console.log('INVOCATION OF NON-CONFIGURED SKILL: ' + skill);

    bot.reply(message, answer);

};
