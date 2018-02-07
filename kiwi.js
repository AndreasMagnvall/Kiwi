const fs = require('fs');
const LOGS = true;
const DEBUG_LOGS = false;
const Discord = require('discord.js');
let tokens;
if (fs.existsSync('tokens.json')) {
  tokens = JSON.parse(fs.readFileSync('tokens.json','utf8'));
} else {
  console.log("No tokens.json exist, creating one...");
  let defaultTokenString = "{\n  \"discord_bot_token\" : \"PasteTokenHere\"\,\n  \"wolfram_app_id\" : \"PasteAppIdHere\"\n}";
  fs.writeFileSync('tokens.json',defaultTokenString);
  console.log("Edit discord token and wolfram app id in the file tokens.json")
  process.exit();
}
const LOGIN_TOKEN = tokens.discord_bot_token;
const WOLFRAM_ALPHA_APP_ID = tokens.wolfram_app_id;

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
  let msgArgs = message.content.split(" "); // An array of all user arguments including the command
  if (msgArgs.length < 1) return;
  let cmd = msgArgs[0].substring(1); // Only the command without the "!"
  let msgTxt = message.content.split(/ (.+)/)[1]; // All the users text (not including command)

  if (cmd === 'solve') {
    let logHolder = (new LogHolder());
    let logFunction = function (msg) {
      logHolder.log(msg);
    }
    logFunction("--------");
    logFunction(new Date());
    logFunction("User " + message.author.username + " typed \"" + message.content + "\" in " + message.channel.name + ".");
    let equation = msgTxt;
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
  } else if (cmd === 'render1') {
    let msg = msgTxt;
    message.channel.send(customTxt.render1(msg));
    message.delete();
  } else if (cmd === 'render') {
    let msg = msgTxt;
    if (msg.length <= 6) {
      message.channel.send(customTxt.render(msg));
    } else {
      message.channel.send("Maximum 6 Characters!");
    }
    message.delete();
  } else if (cmd === 'sym') {
    let arr = msgArgs;
    if (arr.length >= 3) {
      customTxt.letter = arr[1];
      customTxt.nonLetter = arr[2];
    }
    message.delete();
  }
});

client.login(LOGIN_TOKEN);
