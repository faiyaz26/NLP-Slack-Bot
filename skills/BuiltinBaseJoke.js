var jokes = require('one-liner-joke');
module.exports = function(skill, info, bot, message) {
  var joke = jokes.getRandomJoke();
  var msg = "A Random Joke\n```"+joke.body+"```";
  
  bot.reply(message, msg);
};
