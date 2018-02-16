const JSONHandler = require('./jsonhandler.js');
const Collection = require('./collection');

module.exports = class collectionJSON extends Collection {
  constructor(fs, path, sync, defaultArray, cb) {
    super();
    this.jsonHandler = new JSONHandler(fs, path, sync, defaultArray, function() {
      for (let i = 0; i < this.jsonHandler.obj.length; i++) {
        this.set(this.jsonHandler.obj[i][0],this.jsonHandler.obj[i][1]);
      }
      cb.apply(this, arguments);
    });
    for (let i = 0; i < this.jsonHandler.obj.length; i++) {
      this.set(this.jsonHandler.obj[i][0],this.jsonHandler.obj[i][1]);
    }
  }

  save(cb) {
    this.jsonHandler.obj = Array.from(this);
    this.jsonHandler.save(cb);
  }

  saveSync() {
    this.jsonHandler.obj = Array.from(this);
    this.jsonHandler.saveSync();
  }

  loadSync() {
    this.jsonHandler.loadSync();
    this.clear();
    for (let i = 0; i < this.jsonHandler.obj.length; i++) {
      this.set(this.jsonHandler.obj[i][0],this.jsonHandler.obj[i][1]);
    }
  }

  load(cb) {
    this.jsonHandler.load(function() {
      this.clear();
      for (let i = 0; i < this.jsonHandler.obj.length; i++) {
        this.set(this.jsonHandler.obj[i][0],this.jsonHandler.obj[i][1]);
      }
      cb.apply(this, arguments);
    });
  }
}
