var fs = require('fs');

var CUSTOM_PHRASE_LOC = __dirname + '/../custom-phrases.json';

module.exports = Train;


function Train(Brain, speech, message) {
    console.log('Inside on-the-fly training module.');
    console.log('Asking user for name of skill.');
    var phraseExamples = [];
    var phraseName;
    var answer;

    speech.startConversation(message, function(err, convo) {
        convo.ask('Sure, what do you want to call this skill? ' +
            'This is the machine name, so pick a good name for a file basename.', [{
                pattern: '.*',
                callback: function(response, convo) {
                    phraseName = response.text;
                    convo.say('Right, I\'ll call it `' + phraseName + '`.');
                    convo.say('Okay, now give me a bunch of ways you might say this. ' +
                        'When you\'re done, just sent me the word done all by itself on a line.');
                    convo.ask('How might you say this?', [{
                        pattern: '.*',
                        callback: function(response, convo) {
                            phraseExamples.push(response.text);
                            reprompt(convo);
                            convo.next();
                        }
                    }]);
                    convo.next();
                }
            }]);

        function reprompt(convo) {
            convo.ask('Okay, how else?', [{
                pattern: '^done$',
                callback: function(response, convo) {
                    getTheAnswer(convo);
                    convo.next();
                }
            }, {
                pattern: '.*',
                callback: function(response, convo) {
                    phraseExamples.push(response.text);
                    reprompt(convo);
                    convo.next();
                }
            }]);
        }

        function getTheAnswer(convo) {
            convo.ask('Ok! I got the idea, can you please tell me the reply I should send ?', [{
                pattern: '.*',
                callback: function(response, convo) {
                    answer = response.text.replace("'", "`");;
                    convo.say('Great, now let me think about that...\nAfter 1-2 minutes, please check whether I understood you correctly!!');
                    Brain.teach(phraseName, phraseExamples);
                    Brain.think();
                    writeSkill(phraseName, phraseExamples, answer, function(err) {
                        if (err) {
                            return convo.say('Shoot, something went wrong while I was trying ' +
                                'to add that to my brain:\n```\n' + JSON.stringify(err) + '\n```');
                        }
                        console.log("done!!");
                        convo.say('All done! You should try seeing if I understood now!');
                    });
                    convo.next();
                }
            }]);
        }

    });
};

function writeSkill(name, vocab, answer, callback) {
    console.log('About to write files for a new empty phrase/skill type...');
    fs.readFile(CUSTOM_PHRASE_LOC, function(err, data) {
            if (err) {
                console.error('Error loading custom phrase JSON into memory.');
                return callback(err);
            }
            console.log('Parsing custom phrase JSON');
            var customPhrases = JSON.parse(data.toString());
            customPhrases[name] = vocab;
            console.log('About to serialize and write new phrase object...');
            fs.writeFile(CUSTOM_PHRASE_LOC, JSON.stringify(customPhrases, null, 2), function(err) {
                    if (err) {
                        console.error('Error while writing new serialized phrase object.');
                        return callback(err);
                    }
                    console.log('Writing updated phrase JSON finished, copying empty.skill.js...');
                    var emptySkillStream = fs.createReadStream(__dirname + '/empty.skill.js');
                    var writeStream = fs.createWriteStream(__dirname + '/../skills/' + name + '.js');

                    var code = "var answer = '" + answer + "';\n"+
                    	`module.exports = function(skill, info, bot, message) {\n
	                    	console.log('INVOCATION OF NON-CONFIGURED SKILL: ' + skill);\n
	                    	bot.reply(message, answer);\n
	                	};`;

	                writeStream.once('open', function(fd) {
					  writeStream.write(code);
					  writeStream.end();
					  callback.bind(null, null);
					});

	                writeStream.on('error', callback);
            });
    });
}
