var answer = 'The imparting or exchanging of information by speaking, writing, or using some other medium.';
module.exports = function(skill, info, bot, message) {

	                    	console.log('INVOCATION OF NON-CONFIGURED SKILL: ' + skill);

	                    	bot.reply(message, answer);

	                	};