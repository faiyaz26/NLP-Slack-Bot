var answer = 'William E. Gladstone said-\n' + '>Be happy with what you have and are, be generous with both, and you won\'t have to hunt for happiness.';
module.exports = function(skill, info, bot, message) {

    console.log('INVOCATION OF NON-CONFIGURED SKILL: ' + skill);

    bot.reply(message, answer);

};
