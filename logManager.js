const fs = require('fs');

class LogBuffer {
  constructor(log) {
    this.messages = [];
    this.logFunc = log;
  }

  log(msg) {
    this.messages.push(msg);
  }

  send() {
    if (this.messages.length !== 0) {
      this.logFunc(this.messages);
      this.messages = [];
      this.sent = true;
    }
  }
}

module.exports = class LogManager {
  constructor(path, log) {
    let instance = this;
    if (log instanceof Function) instance.logF = log;
    else instance.logF = console.log;
    instance.path = path;
    instance.que = [];
    instance.cooldown = 10;
    instance.since = 0;
    this.waitingCooldown = false;
  }

  buffer() {
    let instance = this;
    return new LogBuffer(arr => instance.logArr(arr));
  }

  log(msg) {
    this.que.push(msg);
    this.logF(msg);
    this.save();
  }

  logArr(arr) {
    for (let i = 0; i < arr.length; i++) {
      this.que.push(arr[i]);
      this.logF(arr[i]);
    }
    this.save();
  }

  save() {
    if (this.que.length === 0 || this.waitingCooldown) return;
    let time = new Date().getTime();
    let diff = time - this.since;
    if (diff >= this.cooldown*1000) { // Cooldown OK
      let str = this.buildString(this.que);
      this.que = [];
      fs.appendFile(this.path, str.plain, (err) => {
        if (err) console.error(err);
      });
      this.waitingCooldown = false;
      this.since = time;
    } else {
      this.waitingCooldown = true;
      setTimeout(() => {
        this.waitingCooldown = false;
        this.save();
      }, this.cooldown*1000 - diff + 1000);
    }
  }

  buildString(que) {
    let strHtml = "";
    let strPlain = "";
    for (let i = 0; i < que.length; i++) {
      strPlain += que[i] + "\n";
      strHtml += "</p>" + que[i] + "</p>";
    }
    return {
      plain: strPlain,
      html: strHtml
    }
  }
}
