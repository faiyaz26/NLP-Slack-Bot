var jokes = require('jokes');
module.exports = function(skill, info, bot, message) {
  var joke = jokes();
  bot.reply(message, 'A Random Joke');
  bot.reply(message, '```'+joke.text+'```');
};
