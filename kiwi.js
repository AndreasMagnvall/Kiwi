const fs = require('fs');
const Bot = require('./bot');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const LogManager = require('./logManager');

// Unhandeled promises fix
process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
});

let on = false;

let logs = "";
let log = function(msg) {
  console.log.apply(null, arguments);
  io.emit('log', msg);
  logs += "<div><p>" + msg + "</p></div>";
}

let lm = new LogManager('log.txt', log);

let bot = new Bot(lm);

app.use('/', express.static('web'))

io.on('connection', function(socket) {
  socket.emit('init-logs', logs);

  socket.on('start', () => {
    log("Bot starting...");
    if (!on) bot.start();
    on = true;
  });

  socket.on('clear', () => {
    logs = "";
  });

  socket.on('stop', () => {
    log("Bot terminating...");
    if (on) bot.stop();
    else lm.log("Bot already terminated");
    on = false;
  });

  socket.on('full-reset', () => {
    process.exit();
  });
});

http.listen(2018, function() {
  let lb = lm.buffer();
  lb.log('-------------------------------------------------------------');
  lb.log('Server started');
  lb.send();
});

log("Bot starting...");
bot.start();
on = true;
