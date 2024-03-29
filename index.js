
var fs = require('fs');

var Train = require('./src/train');
var Brain = require('./src/brain');
var Ears = require('./src/ears');
var builtinPhrases = require('./builtins');

var Bottie = {
  Brain: new Brain(),
  Ears: new Ears(process.env.SLACK_TOKEN)
};

var customPhrasesText;
var customPhrases;
try {
  customPhrasesText = fs.readFileSync(__dirname + '/custom-phrases.json').toString();
} catch (err) {
  throw new Error('Uh oh, Augmedix Bot could not find the ' +
    'custom-phrases.json file, did you move it?');
}
try {
  customPhrases = JSON.parse(customPhrasesText);
} catch (err) {
  throw new Error('Uh oh, custom-phrases.json was ' +
    'not valid JSON! Fix it, please? :)');
}

console.log('Bottie is learning...');
Bottie.Teach = Bottie.Brain.teach.bind(Bottie.Brain);
eachKey(customPhrases, Bottie.Teach);
eachKey(builtinPhrases, Bottie.Teach);
Bottie.Brain.think();
console.log('Bottie finished learning, time to listen...');
Bottie.Ears
  .listen()
  .hear('start-training', function(speech, message) {
    console.log('Delegating to on-the-fly training module...');
    Train(Bottie.Brain, speech, message);
  })
  .hear('.*', function(speech, message) {
    var interpretation = Bottie.Brain.interpret(message.text);
    console.log('Bottie heard: ' + message.text);
    console.log('Bottie interpretation: ', interpretation);
    if (interpretation.guess) {
      console.log('Invoking skill: ' + interpretation.guess);
      Bottie.Brain.invoke(interpretation.guess, interpretation, speech, message);
    } else {
      speech.reply(message, 'Sorry! I am not able to understand your words. Hey, @faiyaz26 can you help me out here ?');
      //speech.reply(message, '```\n' + JSON.stringify(interpretation) + '\n```');
    }
  });



function eachKey(object, callback) {
  Object.keys(object).forEach(function(key) {
    callback(key, object[key]);
  });
}
