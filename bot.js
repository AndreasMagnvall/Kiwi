/*
  Require statements
*/

const fs = require('fs');
const LOGS = true;
const DEBUG_LOGS = false;
const Discord = require('discord.js');
const Lang = require('./lang.js');
const JSONHandler = require('./jsonhandler.js');
const Collection = require('./collection');
const CollectionJSON = require('./collectionJSON');
const WolframModule = require('./wolfram');
const customText = require('./customText');

/*
  VARIABLES
*/

  // Discord
let client,
  LOGIN_TOKEN,
  BOT_OWNER,
  DEFAULT_SERVER,
  DEFAULT_CHANNEL,
  tokens,

  // Wolframalpha
  wolfram,
  WOLFRAM_ALPHA_APP_ID,

  // Language
  language, l,

  // Users list
  CITIZENS,
  CITIZENS_RAM,

  // Text generator
  customTxt,

  // Prison system
  PRISON_CHANNEL,
  PRISON_ROLE,
  prison,

  // Notifications
  notify,
  checkEntries,
  addEntry,
  updateList;

module.exports = class Bot {

  constructor(lm) {
    this.lm = lm;
  }

  /*
    THE SETUP FUNCTION, RUNS ON BOT STARTUP
  */
  async start() {
    let instance = this;

    language = new Lang('SV');
    l = language.dict;

    tokens = new JSONHandler(fs, 'tokens.json', true, {
      discord_bot_token : "PasteTokenHere",
      wolfram_app_id : "PasteAppIdHere",
      bot_owner_discord_id : "PasteIdHere",
      default_server_id : "PasteIdHere",
      default_channel_id : "PasteIdHere",
      prison_role_name : "NameHere",
      prison_channel_id : "idHere"
    });

    LOGIN_TOKEN = tokens.obj.discord_bot_token;
    WOLFRAM_ALPHA_APP_ID = tokens.obj.wolfram_app_id;

    CITIZENS = new CollectionJSON(fs, 'users.json', true, [
      [
        "PasteIdHere",
        {
          id : "PasteIdHereAlso",
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
    ]);

    setInterval(() => {
      CITIZENS.save();
    }, 60000);

    CITIZENS_RAM = new Collection();
    let citizensArrStr = JSON.stringify(Array.from(CITIZENS));
    let citizensArr = JSON.parse(citizensArrStr);
    for (let i = 0; i < citizensArr.length; i++) {
      CITIZENS_RAM.set(citizensArr[i][0],citizensArr[i][1]);
    }


    client = new Discord.Client();


    wolfram = new WolframModule(WOLFRAM_ALPHA_APP_ID, (msg) => this.lm.log(msg));

    customTxt = new customText("▰","▱");

    class Prison {
      constructor(client) {
        this.client = client;
        this.votesRequired = 3;
        this.votingExpiration = 60;
      }

      jailVote(userNickname, message) {
        let user = CITIZENS.search('defaultNickname', userNickname.toLowerCase());
        let user_ram = CITIZENS_RAM.search('defaultNickname', userNickname.toLowerCase());
        if (user !== undefined) {
          if (user_ram.votePrison === undefined) {
            user_ram.votePrison = new Set();
            user_ram.cancelPrison = setTimeout(() => {
              user_ram.votePrison = undefined;
              user_ram.cancelPrison = undefined;
              message.channel.send(l.vote_prison_expire + user.defaultNickname);
            }, this.votingExpiration * 1000);
            if (this.votesRequired === 1) {
              clearTimeout(user_ram.cancelPrison);
              user_ram.cancelPrison = undefined;
              user_ram.votePrison = undefined;
              CITIZENS.get(user.id).inJail = {state:true, duration:Date.now()};
              return this.jail(user);
            }
            user_ram.votePrison.add(message.author.id);
            return l.vote_prison_start1 + user.defaultNickname + l.vote_prison_start2 + this.votingExpiration + l.vote_prison_start3 +
              (this.votesRequired - user_ram.votePrison.size) + l.vote_prison_start4;
          } else {
            if(!user_ram.votePrison.has(message.author.id)) {
              user_ram.votePrison.add(message.author.id);
              if (user_ram.votePrison.size >= this.votesRequired) {
                clearTimeout(user_ram.cancelPrison);
                user_ram.cancelPrison = undefined;
                user_ram.votePrison = undefined;
                CITIZENS.get(user.id).inJail = {state:true, duration:Date.now()};
                return this.jail(user);
              }
              return l.vote_prison1 + user.defaultNickname + ". " + (this.votesRequired - user_ram.votePrison.size) + l.vote_prison2;
            } else return l.vote_prison3 + (this.votesRequired - user_ram.votePrison.size) + l.vote_prison2;
          }
        } else return l.user_not_found;
      }

      unJailVote(userNickname, message) {
        let user = CITIZENS.search('defaultNickname', userNickname.toLowerCase());
        let user_ram = CITIZENS_RAM.search('defaultNickname', userNickname.toLowerCase());
        if (user !== undefined) {
          if (user_ram.voteUnPrison === undefined) {
            user_ram.voteUnPrison = new Set();
            user_ram.cancelUnPrison = setTimeout(() => {
              user_ram.voteUnPrison = undefined;
              user.cancelUnPrison = undefined;
              message.channel.send(l.vote_prison_expire + user.defaultNickname);
            }, this.votingExpiration * 1000);
            if (this.votesRequired === 1) {
              clearTimeout(user_ram.cancelUnPrison);
              user_ram.cancelUnPrison = undefined;
              user_ram.voteUnPrison = undefined;
              CITIZENS.get(user.id).inJail = undefined;
              return this.unJail(user);
            }
            user_ram.voteUnPrison.add(message.author.id);
            return l.vote_prison_start1 + user.defaultNickname + l.vote_prison_start2 + this.votingExpiration + l.vote_prison_start3 +
                (this.votesRequired - user_ram.voteUnPrison.size) + l.vote_prison_start4;
          } else {
            if(!user_ram.voteUnPrison.has(message.author.id)) {
              user_ram.voteUnPrison.add(message.author.id);
              if (user_ram.voteUnPrison.size >= this.votesRequired) {
                clearTimeout(user_ram.cancelUnPrison);
                user_ram.cancelUnPrison = undefined;
                user_ram.voteUnPrison = undefined;
                CITIZENS.get(user.id).inJail = undefined;
                return this.unJail(user);
              }
              return l.vote_prison1 + user.defaultNickname + ". " + (this.votesRequired - user_ram.voteUnPrison.size) + l.vote_prison2;
            } else return l.vote_prison3 + (this.votesRequired - user_ram.voteUnPrison.size) + l.vote_prison2;
          }
        } else return l.user_not_found;
      }

      jail(user) {
        let member = DEFAULT_SERVER.members.get(user.id);
        if (user !== undefined) {
          let rawArr = Array.from(member.roles);
          let roleArr = new Array();

          for (let i = 0; i < rawArr.length; i++) {
            let role = rawArr[i][1];
            let isNonRole = false;
            for (let i = 0; i < user.defaultNonRoles.length; i++) {
              let roleC = DEFAULT_SERVER.roles.find("name", user.defaultNonRoles[i]);
              if (role.id == roleC.id) isNonRole = true;
            }
            if (role.name !== "@everyone" && !isNonRole) {
              member.removeRole(role);
            }
          }

          for (let i = 0; i < user.defaultNonRoles.length; i++) {
            let role = DEFAULT_SERVER.roles.find("name", user.defaultNonRoles[i]);
            member.addRole(role);
          }

          return user.defaultNickname + l.vote_prison4;
        }
      }

      unJail(user) {
        let member = DEFAULT_SERVER.members.get(user.id);
        for (let i = 0; i < user.defaultRoles.length; i++) {
          let role = DEFAULT_SERVER.roles.find("name", user.defaultRoles[i]);
          member.addRole(role);
        }

        for (let i = 0; i < user.defaultNonRoles.length; i++) {
          let role = DEFAULT_SERVER.roles.find("name", user.defaultNonRoles[i]);
          member.removeRole(role);
        }
        return user.defaultNickname + l.vote_prison5;
      }
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
      let instance = this;
      let lb = this.lm.buffer();
      lb.log("");
      lb.log("-------------------------------------------------------------");
      lb.log((new Date()).toString());
      lb.log(l.ready_message);
      lb.send();

      prison = new Prison(client);
      DEFAULT_SERVER = client.guilds.get(tokens.obj.default_server_id);
      PRISON_ROLE = DEFAULT_SERVER.roles.find('name', tokens.obj.prison_role_name);
      PRISON_CHANNEL = DEFAULT_SERVER.channels.get(tokens.obj.prison_channel_id);
      DEFAULT_CHANNEL = DEFAULT_SERVER.channels.get(tokens.obj.default_channel_id);


      notify = new JSONHandler(fs, 'notifications.json', false, {scheduled:[]}, (fileExists, loadSuccessful) => {
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
                this.lm.log(l.notify_no_callback);
                this.lm.log(entry.message);
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
          notify.list = l.notify_header;
          for (let i = 0; i < notify.obj.scheduled.length; i++) {
            let entry =  notify.obj.scheduled[i];
            notify.list += i + ": " + entry.timeString + " : " + entry.message + "\n";
          }
        }

        addEntry = function(timeOrDateAndTime, message) {
          if (notify.obj.scheduled.length >= 5) return [false, l.notify_overflow];
          let d = new Date();
          let now = new Date();
          let timeReg = /\d{1,2}:\d{1,2}/;
          let timeAndDateReg = /\d\d\d\d-\d\d-\d\d \d{1,2}:\d{1,2}/;
          let timeError = l.notify_time_or_date_input_error;
          if (timeOrDateAndTime.length <= 20) {
            if (timeAndDateReg.test(timeOrDateAndTime)) {
              let theTime = Date.parse(timeOrDateAndTime);
              d.setTime(theTime);
            } else if (timeReg.test(timeOrDateAndTime)) {
              let time = timeOrDateAndTime.split(":");
              d.setHours(time[0]);
              d.setMinutes(time[1]);
              d.setSeconds(0);
              d.setMilliseconds(0);
              let diff = d.getTime() - now.getTime();
              if (diff <= 0) d.setDate(d.getDate() + 1);
            } else return [false, timeError];
          } else return [false, timeError];
          let timeString = timeToString(d.getTime());
          notify.obj.scheduled.push({
            message : message,
            time : d.getTime(),
            timeString : timeString
          });
          let res = l.notify_set + timeString + " : " + message;
          updateList();
          return [true, res];
        }
        if (!fileExists) this.lm.log(l.notify_json_not_found);
        else this.lm.log(l.notify_json_found);

        checkEntries((message) => {
          DEFAULT_CHANNEL.send({embed: {
            color: 0xFFEEA0,
            title: l.notify_notification_title,
            description: message
          }});
        });
        updateList();
      });
    });

    client.on('message', message => {
      let instance = this;
      // Code that runs on every message
      let user = CITIZENS.get(message.author.id);

      let r = Math.random();
      if (r <= 1 / 10000) {
        message.react("🎉");
      }

      if (user !== undefined) {
        if (user.inJail) {
          if (message.channel.id != PRISON_CHANNEL.id) {
            message.delete();
            return;
          }
        }
      }

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
        message.channel.send(msg);
      }
      // Only messages starting with ! will be processed below this line
      let lb = instance.lm.buffer();
      lb.log("--------");
      lb.log(new Date());
      lb.log("User " + message.author.username + " typed \"" + message.content + "\" in " + message.channel.name + ".");
      if (cmd === 'help-kiwi') {
        message.channel.send({embed: {
          color: 3447003,
          title: l.help_info_title,
          description: l.help_info
        }}).then(() => lb.send());

      } else if (cmd === 'solve') {
        let equation = msgTxt;
        let thinkingMessage = null;
        message.channel.send({embed: {
          color: 3447003,
          description: l.wolfram_thinking
        }}).then(function(msg) {
          if (thinkingMessage == null) {
            thinkingMessage = msg;
          } else {
            msg.delete();
          }
        });
        wolfram.getSolutions(equation, (msg) => lb.log(msg), function(data) {
          if (thinkingMessage != null) {
            thinkingMessage.edit({embed: {
              color: 3447003,
              description: setMessage()
            }})
            function setMessage() {
              var solutionsCount = data.length;
              if (solutionsCount == 1) {
                return data.length + l.wolfram_solution_found1;
              } else {
                return data.length + l.wolfram_solution_found1;
              }
            }
          }
          if (data.length != 0) {
            for (let i = 0; i < data.length; i++) {
              var embed = new Discord.RichEmbed().setDescription(data[i].name + l.wolfram_for + equation).setImage(data[i].imgURL);
              message.channel.send({
                embed
              });
            }
          } else {
            var embed = new Discord.RichEmbed().setDescription(l.wolfram_no_step_by_step + "https://www.wolframalpha.com/input/?i=" + encodeURIComponent(equation));
            message.channel.send({
              embed
            });
          }
          lb.send();
        });
      } else if (cmd === 'render-line') {
        let msg = msgTxt;
        message.channel.send(customTxt.render1(msg));
        message.delete();
        lb.send();
      } else if (cmd === 'render') {
        let msg = msgTxt;
        if (msg.length <= 6) {
          message.channel.send(customTxt.render(msg));
        } else {
          message.channel.send(l.render_max_6_chars);
        }
        message.delete();
        lb.send();
      } else if (cmd === 'sym') {
        let arr = msgArgs;
        if (arr.length >= 3) {
          customTxt.letter = arr[1];
          customTxt.nonLetter = arr[2];
        }
        message.delete();
        lb.send();
      } else if (cmd === 'user-info') {
        if (msgTxt === "") {
          let user = CITIZENS.get(message.author.id);
          if (user !== undefined) {
            send("```java\n" + JSON.stringify(user, null, 2) + "\n```");
          } else {
            send("```java\n{\n  \"" + l.user_info_not_registered + "\"\n}\n```");
          }
        } else {
          let user = CITIZENS.search('defaultNickname', msgTxt);
          if (user !== undefined) {
              send("```java\n" + JSON.stringify(user, null, 2) + "\n```");
          } else {
            send("```java\n{\n  \"" + l.user_info_not_registered + "\"\n}\n```");
          }
        }
        lb.send();
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
        lb.send();
      } else if (cmd === 'notify-list') {
        send("```\n" + notify.list + "```");
        lb.send();
      } else if (cmd === 'notify-remove') {
        if (msgArgs.length > 1) {
          let index = Number(msgArgs[1]);
          if (index >= 0 && index < notify.obj.scheduled.length) {
            notify.obj.scheduled.splice(index, 1);
            send("Entry " + index + " was removed successfuly!");
            updateList();
          } else send(l.notify_index_not_found)
        } else send(l.notify_remove_syntax_error);
        lb.send();
      } else if (cmd === 'imprison') {
        if (msgArgs.length > 1) {
          message.channel.send(prison.jailVote(msgArgs[1], message));
        }
        lb.send();
      } else if (cmd === 'pardon') {
        if (msgArgs.length > 1) {
          message.channel.send(prison.unJailVote(msgArgs[1], message));
        }
        lb.send();
      } else if (cmd === 'revive') {
        let resMsg = "Dina roller har återställts!";
        if (user !== undefined) {
          if (user.inJail) {
            if (user.inJail.duration) {
              let timeInJail = Date.now() - user.inJail.duration;
              let stay = 5*60*1000;
              if (timeInJail > stay) {
                user.inJail = undefined;
                prison.unJail(user);
                send(resMsg);
              } else {
                let minutes = Math.floor((stay - timeInJail) / (1000*60));
                let seconds = Math.floor((stay - timeInJail) / 1000) % 60;
                send("Du måste vänta " + minutes + " min och " + seconds + " sekunder!");
              }
            } else {
              prison.unJail(user);
              send(resMsg);
            }
          } else {
            prison.unJail(user);
            send(resMsg);
          }
        }
        lb.send();
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
  }

  async stop() {
    let instance = this;
    client.destroy()
    .then(() => {instance.lm.log("Bot has been stopped!")})
    .catch(console.error);
  }
}
