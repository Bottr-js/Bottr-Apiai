var apiai = require('apiai')
var app = apiai("6f898f97b6af48bb9e7a9c966b628925");

// Release as new Library for Bottr

function Apiai() {
  return function(bot) {

    bot.on('message_received', function(message, session, next) {

      // Ignore message if it is an attachment
      if (message.attachments) {
        next()
        return
      }

      var options = {
          sessionId: session.conversation
      }

      var request = app.textRequest(message.text, options);

      request.on('response', function(response) {

        if (response.result.fulfillment.speech) {
          session.send(response.result.fulfillment.speech)
        }

        if (response.result.action) {
          bot.trigger(response.result.action, message, session, next)
        }

        message.data = response.result
      });

      request.on('error', function(error) {
        console.log(error);
        session.send('I seem to be having a few problems at the moment, sorry :(')
      });

      request.end()
    });
  }
}

module.exports = Apiai
