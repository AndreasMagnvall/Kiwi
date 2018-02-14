module.exports = class JSONHandler {
  constructor(fs, path, defaultObj, cb) {
    let instance = this;
    this.fs = fs;
    this.path = path;
    this.enc = 'utf8';
    this.obj = {};
    this.defaultObj = defaultObj;
    try {
      this.default = JSON.stringify(defaultObj, null, 2);
    } catch (e) {
      this.default = '{}';
    }
    if (cb) {
      this.load(cb);
    } else {
      this.load();
    }
    this.fn = function(){};
  }

  load(cb) {
    let instance = this;
    let empty = JSON.stringify({});
    this.fs.stat(this.path,(err, stats) => {
      let isFile;
      if (err) {
        isFile = false;
      } else {
        isFile = stats.isFile();
      }
      if (isFile) {
        instance.fs.readFile(instance.path, instance.enc, (err, data) => {
          if (err) throw err;
          try {
            instance.obj = JSON.parse(data);
            if (cb) cb(true,true);
          } catch(e) {
            instance.obj = instance.defaultObj;
            instance.fs.writeFile(instance.path,
              instance.default,
              instance.enc,
              instance.fn);
            if (cb) cb(true,false);
          }
        });
      } else {
        instance.obj = instance.defaultObj;
        instance.fs.writeFile(instance.path,
          instance.default,
          instance.enc,
          instance.fn);
        if (cb) cb(false,false);
      }
    });
  }

  save(cb) {
    let instance = this;
    let text = JSON.stringify(instance.obj, null, 2);
    if (cb) {
      instance.fs.writeFile(instance.path,text,instance.enc,cb);
    } else {
      instance.fs.writeFile(instance.path,text,instance.enc,instance.fn);
    }
  }
}
