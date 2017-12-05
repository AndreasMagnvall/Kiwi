const LOGIN_TOKEN = '';
const WOLFRAM_ALPHA_APP_ID = '';


const fs = require('fs');
const LOGS = true;
const DEBUG_LOGS = false;
const Discord = require('discord.js');

const parseXML = require('xml2js').parseString;
const querystring = require('querystring');
const client = new Discord.Client();
const WolframModule = require('./wolfram');

const wolfram = new WolframModule(WOLFRAM_ALPHA_APP_ID, log);

const customText = require('./customText');
let customTxt = new customText("▰","▱");

function log(message) {
  console.log(message);
  fs.appendFileSync('log.txt', message + "\n");
}

client.on('ready', () => {
  log("");
  log("-------------------------------------------------------------");
  log((new Date()).toString());
  log('Discord MathBot is ready!');
});

class LogHolder {
  constructor() {
    this.messages = [];
  }

  log(msg) {
    this.messages.push(msg);
  }

  finish() {
    for (let i = 0; i < this.messages.length; i++) {
      log(this.messages[i]);
    }
  }
}

client.on('message', message => {
  if (message.content.substring(0, 6) === '!solve') {
    let logHolder = (new LogHolder());
    let logFunction = function (msg) {
      logHolder.log(msg);
    }
    logFunction("--------");
    logFunction(new Date());
    logFunction("User " + message.author.username + " typed \"" + message.content + "\" in " + message.channel.name + ".");
    let equation = message.content.substring(7, message.content.length);
    let thinkingMessage = null;
    message.channel.send({embed: {
      color: 3447003,
      description: "En fundering pågår... :thinking:"
    }}).then(function(msg) {
      if (thinkingMessage == null) {
        thinkingMessage = msg;
      } else {
        msg.delete();
      }
    });
    wolfram.getSolutions(equation, logFunction, function(data) {
      if (thinkingMessage != null) {
        thinkingMessage.edit({embed: {
          color: 3447003,
          description: setMessage()
        }})
        function setMessage() {
          var solutionsCount = data.length;
          if (solutionsCount == 1) {
            return data.length + " lösning hittades... :bulb:";
          } else {
            return data.length + " lösningar hittades... :bulb:";
          }
        }
      }
      if (data.length != 0) {
        for (let i = 0; i < data.length; i++) {
          var embed = new Discord.RichEmbed().setDescription(data[i].name + " for: " + equation).setImage(data[i].imgURL);
          message.channel.send({
            embed
          });
        }
      } else {
        var embed = new Discord.RichEmbed().setDescription("Inga steg för steg lösningar hittades. Gå in på länken för mer info:\n" + "https://www.wolframalpha.com/input/?i=" + encodeURIComponent(equation));
        message.channel.send({
          embed
        });
      }
      logHolder.finish();
    });
  } else if (message.content.substring(0, 7) === '!render') {
    let msg = message.content.substring(8);
    message.channel.send(customTxt.render1(msg));
  } else if (message.content.substring(0, 10) === '!lagrender') {
    let msg = message.content.substring(11);
    if (msg.length <= 6) {
      message.channel.send(customTxt.render(msg));
    } else {
      message.channel.send("Maximum 6 Characters!");
    }
  } else if (message.content.substring(0, 11) === '!lagsymbols') {
    let arr = message.content.split(" ");
    if (arr.length >= 3) {
      customTxt.letter = arr[1];
      customTxt.nonLetter = arr[2];
    }
  }
});

client.login(LOGIN_TOKEN);
