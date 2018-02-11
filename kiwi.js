const fs = require('fs');
const LOGS = true;
const DEBUG_LOGS = false;
const Discord = require('discord.js');
let tokens;
if (fs.existsSync('tokens.json')) {
  tokens = JSON.parse(fs.readFileSync('tokens.json','utf8'));
} else {
  console.log("No tokens.json exist, creating one...");
  let defaultTokenObj = {
    discord_bot_token : "PasteTokenHere",
    wolfram_app_id : "PasteAppIdHere",
    bot_owner_discord_id : "PasteIdHere",
    default_server_id : "PasteIdHere",
    default_channel_id : "PasteIdHere",
    prison_role_name : "NameHere",
    prison_channel_id : "idHere",
    users : [
      {
        id : "PasteIdHere",
        defaultNickname : "NameHere",
        defaultRoles : [
          "role1",
          "role2"
        ],
        defaultNonRoles : [
          "role1",
          "role2"
        ]
      }
    ]
  };
  let defaultTokenString = JSON.stringify(defaultTokenObj, null, 2);
  fs.writeFileSync('tokens.json',defaultTokenString);
  console.log("Edit discord token and wolfram app id in the file tokens.json")
  process.exit();
}
const LOGIN_TOKEN = tokens.discord_bot_token;
const WOLFRAM_ALPHA_APP_ID = tokens.wolfram_app_id;
const BOT_OWNER = tokens.bot_owner_discord_id;
const USERS = tokens.users;
const DEFAULT_SERVER = tokens.default_server_id;
const DEFAULT_CHANNEL = tokens.default_channel_id;
const PRISON_CHANNEL = tokens.prison_channel_id;
const PRISON_ROLE = tokens.prison_role_name;
let users = new Map();
for (let i = 0; i < tokens.users.length; i++) {
  users.set(tokens.users[i].id, tokens.users[i]);
}

const parseXML = require('xml2js').parseString;
const querystring = require('querystring');
const client = new Discord.Client();
const WolframModule = require('./wolfram');

const wolfram = new WolframModule(WOLFRAM_ALPHA_APP_ID, log);

const customText = require('./customText');
let customTxt = new customText("▰","▱");

// Notifications
const JSONHandler = require('./jsonhandler.js');
let notify;
let checkEntries;
let addEntry;
let updateList;

// Prison
let prison;
class Prison {
  constructor(client) {
    this.client = client;
    this.users = new Map();
    for (let i = 0; i < USERS.length; i++) {
      let name = USERS[i].defaultNickname.toLowerCase();
      this.users.set(name, USERS[i]);
    }
    this.votesRequired = 3;
    this.votingExpiration = 60;
  }

  jailVote(userNickname, message) {
    let user = this.users.get(userNickname.toLowerCase());
    if (user !== undefined) {
      if (user.votePrison === undefined) {
        user.votePrison = new Set();
        user.cancelPrison = setTimeout(() => {
          user.votePrison = undefined;
          user.cancelPrison = undefined;
          sendTemp(message.channel, "Voting for prison expired for user " + user.defaultNickname, 20000);
        }, this.votingExpiration * 1000);
        if (this.votesRequired === 1) {
          clearTimeout(user.cancelPrison);
          user.cancelPrison = undefined;
          user.votePrison = undefined;
          return this.jail(user);
        }
        user.votePrison.add(message.author.id);
        return "Vote for un-prison started for " + user.defaultNickname + "\nAuto cancel in " + this.votingExpiration + " seconds.\n" +
          (this.votesRequired - user.votePrison.size) + " vote(s) needed.";
      } else {
        if(!user.votePrison.has(message.author.id)) {
          user.votePrison.add(message.author.id);
          if (user.votePrison.size >= this.votesRequired) {
            clearTimeout(user.cancelPrison);
            user.cancelPrison = undefined;
            user.votePrison = undefined;
            return this.jail(user);
          }
        } return "You have already voted! " + (this.votesRequired - user.votePrison.size) + " more vote(s) needed";
      }
    } else return "This user does not exist!";
  }

  unJailVote(userNickname, message) {
    let user = this.users.get(userNickname.toLowerCase());
    if (user !== undefined) {
      if (user.voteUnPrison === undefined) {
        user.voteUnPrison = new Set();
        user.cancelUnPrison = setTimeout(() => {
          user.voteUnPrison = undefined;
          user.cancelUnPrison = undefined;
          message.channel.send("Voting for un-prison expired for user " + user.defaultNickname);
        }, this.votingExpiration * 1000);
        if (this.votesRequired === 1) {
          clearTimeout(user.cancelUnPrison);
          user.cancelUnPrison = undefined;
          user.voteUnPrison = undefined;
          return this.unJail(user);
        }
        user.voteUnPrison.add(message.author.id);
        return "Vote for un-prison started for " + user.defaultNickname + "\nAuto cancel in " + this.votingExpiration + " seconds.\n" +
          (this.votesRequired - user.voteUnPrison.size) + " vote(s) needed.";
      } else {
        if(!user.voteUnPrison.has(message.author.id)) {
          user.voteUnPrison.add(message.author.id);
          if (user.voteUnPrison.size >= this.votesRequired) {
            clearTimeout(user.cancelUnPrison);
            user.cancelUnPrison = undefined;
            user.voteUnPrison = undefined;
            return this.unJail(user);
          }
        } return "You have already voted! " + (this.votesRequired - user.voteUnPrison.size) + " more vote(s) needed";
      }
    } else return "This user does not exist!";
  }

  jail(user) {
    let guild = this.client.guilds.get(DEFAULT_SERVER);
    let member = guild.members.get(user.id);
    if (user !== undefined) {
      let rawArr = Array.from(member.roles);
      let roleArr = new Array();

      for (let i = 0; i < rawArr.length; i++) {
        let role = rawArr[i][1];
        if (role.name !== "@everyone") member.removeRole(role);
      }

      for (let i = 0; i < user.defaultNonRoles.length; i++) {
        let role = guild.roles.find("name", user.defaultNonRoles[i]);
        member.addRole(role);
      }

      return user.defaultNickname + " have been sent to prison!";
    }
  }

  unJail(user) {
    let guild = this.client.guilds.get(DEFAULT_SERVER);
    let member = guild.members.get(user.id);
    for (let i = 0; i < user.defaultRoles.length; i++) {
      let role = guild.roles.find("name", user.defaultRoles[i]);
      member.addRole(role);
    }

    for (let i = 0; i < user.defaultNonRoles.length; i++) {
      let role = guild.roles.find("name", user.defaultNonRoles[i]);
      member.removeRole(role);
    }
    return user.defaultNickname + " have been released from prison!";
  }
}

// Log file
function log(message) {
  console.log(message);
  fs.appendFileSync('log.txt', message + "\n");
}

// Get date string
Number.prototype.padLeft = function(base,chr){
    var  len = (String(base || 10).length - String(this).length)+1;
    return len > 0? new Array(len).join(chr || '0')+this : this;
}
function timeToString(time) {
  let d = new Date();
  d.setTime(time);
  return  [d.getFullYear(),
     (d.getMonth()+1).padLeft(),
     d.getDate().padLeft()].join('-') +' ' +
    [d.getHours().padLeft(),
     d.getMinutes().padLeft()].join(':');
}

client.on('ready', () => {
  log("");
  log("-------------------------------------------------------------");
  log((new Date()).toString());
  log('Kiwi is ready!');

  prison = new Prison(client);

  notify = new JSONHandler(fs, 'notifications.json', (fileExists, loadSuccessful) => {
    checkEntries = function(cb) {
      let d = new Date();
      let time = d.getTime();
      for (let i = notify.obj.scheduled.length; i >= 0; i--) {
        let entry = notify.obj.scheduled[i];
        if (entry === undefined) continue;
        if ((entry.time-30000) <= time) {
          notify.obj.scheduled.splice(i, 1);
          if (cb) {
            cb(entry.message);
          } else {
            console.log("No callback specified, notification will display here:");
            console.log(entry.message);
          }
        }
      }
      updateList();
      setTimeout(() => {notify.save()}, 10000);
      // Calculate next check
      setTimeout(() => {
        checkEntries(cb);
      }, 60000-((d.getSeconds())*1000));
    }

    updateList = function() {
      notify.list = "index : date and time : message\n";
      for (let i = 0; i < notify.obj.scheduled.length; i++) {
        let entry =  notify.obj.scheduled[i];
        notify.list += i + ": " + entry.timeString + " : " + entry.message + "\n";
      }
    }
    updateList();

    addEntry = function(timeOrDateAndTime, message) {
      if (notify.obj.scheduled.length >= 5) return [false, "Too many notifications, remove notifications by !notify-remove <index>\nGet a list of all notifications by typing !notify-list"];
      let d = new Date();
      let now = new Date();
      let timeReg = /\d{1,2}:\d{1,2}/;
      let timeAndDateReg = /\d\d\d\d-\d\d-\d\d \d{1,2}:\d{1,2}/;
      let timeError = "Someting wrong with time or date input?";
      if (timeOrDateAndTime.length <= 20) {
        if (timeAndDateReg.test(timeOrDateAndTime)) {
          let theTime = Date.parse(timeOrDateAndTime);
          d.setTime(theTime);
        } else if (timeReg.test(timeOrDateAndTime)) {
          let time = timeOrDateAndTime.split(":");
          //if (time[0].length === 1) time[0] = "0" + time[0];
          d.setHours(time[0]);
          d.setMinutes(time[1]);
          d.setSeconds(0);
          d.setMilliseconds(0);
          let diff = d.getTime() - now.getTime();
          if (diff <= 0) d.setDate(d.getDate() + 1);
        } else return [false, timeError];
      } else return [false, timeError];
      timeString = timeToString(d.getTime());
      notify.obj.scheduled.push({
        message : message,
        time : d.getTime(),
        timeString : timeString
      });
      let res = "Notification set: " + timeString + " : " + message;
      updateList();
      return [true,res];
    }
    if (!fileExists) {
      console.log("notifications.json not found, creating...");
      notify.obj = {
        scheduled : []
      };
      notify.save();
    } else {
      console.log("Load of notifications.json successful!");
      if (notify.obj.scheduled === undefined) {
        notify.obj = {
          scheduled : []
        };
        notify.save();
      }
    }
    let channel = client.guilds.get(DEFAULT_SERVER)
      .channels.get(DEFAULT_CHANNEL);
    checkEntries((message) => {
      channel.send({embed: {
        color: 0xFFEEA0,
        title: "Notification",
        description: message
      }});
    });
  });
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
  // Code that runs on every message
  let r = Math.random();
  if (r <= 1 / 10000) {
    message.react("🎉");
  }

  // if (censor) {
  //   if (USERS[4].id == message.author.id) {
  //     message.delete();
  //   }
  // }

  // Check if command
  if (message.content.charAt(0) !== "!") return;
  // Parse command
  let msgArgs = message.content.split(" "); // An array of all user arguments including the command
  let cmd = msgArgs[0].substring(1); // Only the command without the "!"
  let tmpArr = message.content.split(/ (.+)/);
  let msgTxt;
  if (tmpArr.length > 1) msgTxt = tmpArr[1]; // All the users text (not including command)
  else msgTxt = "";
  // Function for sending message temporarily (removes senders message)
  function send(msg) {
    sendTemp(message.channel, msg, 20000, [message]);
  }
  // Only messages starting with ! will be processed below this line
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
  } else if (cmd === 'user-info') {
    if (msgTxt === "") {
      let uuu = users.get(message.author.id);
      if (uuu !== undefined) {
        send("```java\n" + JSON.stringify(uuu, null, 2) + "\n```");
      } else {
        send("```java\n{\n  \"not registered\"\n}\n```");
      }
    } else {
      let found = false;
      for (let i = 0; i < USERS.length; i++) {
        if (USERS[i].defaultNickname.toLowerCase() === msgTxt) {
          send("```java\n" + JSON.stringify(USERS[i], null, 2) + "\n```");
          found = true;
          break;
        }
      }
      if (!found) send("```java\n{\n  \"not registered\"\n}\n```");
    }
  } else if (cmd === 'notify') {
    let message;
    let time;
    if (msgArgs.length >= 3) {
      if (/\d{1,2}:\d{1,2}/.test(msgArgs[2])) {
        message = "";
        for (let i = 3; i < msgArgs.length; i++) {
          message += msgArgs[i] + " ";
        }
        message = message.slice(0, -1);
        time = msgArgs[1] + " " + msgArgs[2];
      } else {
        message = "";
        for (let i = 2; i < msgArgs.length; i++) {
          message += msgArgs[i] + " ";
        }
        message = message.slice(0, -1);
        time = msgArgs[1];
      }
    } else return;
    let response = addEntry(time, message);
    send(response[1]);
  } else if (cmd === 'notify-list') {
    sendTemp(message.channel, "```\n" + notify.list + "```", 60000, [message]);
  } else if (cmd === 'notify-remove') {
    if (msgArgs.length > 1) {
      let index = Number(msgArgs[1]);
      if (index >= 0 && index < notify.obj.scheduled.length) {
        notify.obj.scheduled.splice(index, 1);
        send("Entry " + index + " was removed successfuly!");
        updateList();
      } else send("Index not found!\nType !notify-list to get a list of all entries!")
    } else send("Type !notify-remove <index>");
  } else if (cmd === 'jail') {
    if (msgArgs.length > 1) {
      message.channel.send(prison.jailVote(msgArgs[1], message));
    }
  } else if (cmd === 'unjail') {
    if (msgArgs.length > 1) {
      message.channel.send(prison.unJailVote(msgArgs[1], message));
    }
  }
});

function sendTemp(channel, msg, duration, otherMessagesArray) {
  channel.send(msg)
    .then((message) => {
      setTimeout(() => {
         message.delete();
         if (otherMessagesArray !== undefined) {
           for (let i = 0; i < otherMessagesArray.length; i++) {
             otherMessagesArray[i].delete();
           }
         }
       }, duration);
    });
}

client.login(LOGIN_TOKEN);
