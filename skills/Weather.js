var weather = require('weather-js');

module.exports = function(skill, info, bot, message) {

	var places = [
		{
			city : 'dhaka',
			search : 'Dhaka, Bangladesh'
		},
		{
			city : 'san francisco',
			search : 'San Francisco, CA'
		},
		{
			city : 'sf',
			search : 'San Francisco, CA'
		}
	];
	var selectPlace = -1;
	for(var i = 0 ; i < places.length ; i++){
		if(message.text.toLowerCase().indexOf(places[i].city) != -1){
			selectPlace = i;
			break;
		}
	}

	if(selectPlace == -1){
		var msg = "Sorry! Maybe you didn't provide any city name or maybe a wrong one.\nCurrently I only support 'Dhaka, Bangladesh' and ''San Francisco, CA'";
		bot.reply(message, msg);
		return;
	}

	weather.find({search: places[selectPlace].search, degreeType: 'C'}, function(err, result) {
	  if(err || result.length == 0){
	  	var msg = "Sorry! My friend who is responsible for the weather is not responding. Sigh!";
		bot.reply(message, msg);
		console.log(err);
		return;
	  }

	  var res = result[0];
	  console.log(res);
	  var msg = {
		    "attachments": [
		        {
		            "fallback": "",
		            "color": "#36a64f",
		            "pretext": "Current weather report for "+places[i].search,
		            "fields": [
		                {
		                    "title": "Temparature",
		                    "value": res.current.temperature+"' C",
		                    "short": false
		                },
						{
		                    "title": "Feels like",
		                    "value": res.current.feelslike+"' C",
		                    "short": false
		                },
						{
		                    "title": "Wind",
		                    "value": res.current.winddisplay,
		                    "short": false
		                }
						
		            ],
		            "mrkdwn_in": ["text","fields"],
		            "thumb_url": res.current.imageUrl
		        }
		    ]
		};

	  	bot.reply(message, msg)
	});

};