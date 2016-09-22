var answer = 'Once I tried to fix a bug. I changed some code, compiled it. Got 100 new bugs. Then I became a Bot. Sad Story, huh ?';
module.exports = function(skill, info, bot, message) {

    console.log('INVOCATION OF NON-CONFIGURED SKILL: ' + skill);

    bot.reply(message, answer);

};
