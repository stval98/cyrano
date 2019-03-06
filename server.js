// Setting things up. 
 var tracery = require('tracery-grammar'),
    rawGrammar = require('./grammar.json'), 
    grammar = tracery.createGrammar(rawGrammar);
    grammar.addModifiers(tracery.baseEngModifiers); 

var path = require('path'),
    express = require('express'),
    app = express(),   
    Twit = require('twit'),
    config = {     
      twitter: {
        consumer_key: process.env.CONSUMER_KEY,
        consumer_secret: process.env.CONSUMER_SECRET,
        access_token: process.env.ACCESS_TOKEN,
        access_token_secret: process.env.ACCESS_TOKEN_SECRET
      }
    },
    T = new Twit(config.twitter);

// Use cron-job.org to hit /BOT_ENDPOINT to wake up app and make Twitter bot tweet. 
app.use(express.static('public'));
grammar.addModifiers(tracery.baseEngModifiers); 

app.all("/" + process.env.BOT_ENDPOINT, function (req, res) {
  tweet();
});

// Generate a new tweet using grammar.
const generateStatus = function() {
  return `${grammar.flatten("#origin#")}`; 
}

// Tweet!
const tweet = function() {
  var status = generateStatus();
  console.log(status);
  T.post('statuses/update', { status: status }, function(err, data, response) {
    if (err){
      console.log('Error! Try again, ugly!', err);
    }
    else {
      console.log('It tweeted!');
    }
  });
}

var listener = app.listen(process.env.PORT, function () {
  console.log('Your bot is running on port ' + listener.address().port);
});


