var apiai = require('apiai')

function Apiai(token) {

  var app = apiai(token);

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
