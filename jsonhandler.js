module.exports = class JSONHandler {
  constructor(fs, path, sync, defaultObj, cb, overwriteJSON) {
    let instance = this;

    this.sync = sync;
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
    if (sync) {
      this.loadSync(overwriteJSON);
    } else if (cb) {
      this.load(cb, overwriteJSON);
    } else {
      this.load(undefined, overwriteJSON);
    }
    this.fn = function(){};
  }

  load(cb, overwriteJSON) {
    let instance = this;
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
            if (overwriteJSON) {
              instance.obj = instance.defaultObj;
              instance.fs.writeFile(instance.path,
                instance.default,
                instance.enc,
                instance.fn);
              console.log('Overwriting file...');
              if (cb) cb(true,false);
            } else {
              console.log('Error reading \"' + instance.path + '\", exiting... fix ' + instance.path);
              process.exit();
            }
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

  loadSync(overwriteJSON) {
    let instance = this;
    if(instance.fs.existsSync(instance.path)) {
      let data = instance.fs.readFileSync(instance.path, instance.enc);
      try {
        instance.obj = JSON.parse(data);
      } catch(e) {
        console.log(e);
        if (overwriteJSON) {
          instance.obj = instance.defaultObj;
          instance.fs.writeFile(instance.path,
            instance.default,
            instance.enc,
            instance.fn);
          console.log('Overwriting file...');
          if (cb) cb(true,false);
        } else {
          console.log('Error reading \"' + instance.path + '\", exiting... fix ' + instance.path);
          process.exit();
        }
      }
    } else {
      instance.obj = instance.defaultObj;
      instance.fs.writeFileSync(instance.path,
        instance.default,
        instance.enc);
    }
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

  saveSync() {
    let instance = this;
    let text = JSON.stringify(instance.obj, null, 2);
    instance.fs.writeFileSync(instance.path,text,instance.enc);
  }
}
