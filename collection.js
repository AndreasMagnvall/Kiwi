module.exports = class Collection extends Map {
  find(key, val) {
    let res;
    this.forEach((item) => {
      if (item[key] == val) res = item;
    });

    return res;
  }

  search(key, val) {
    let res;
    this.forEach((item) => {
      if (item[key].toLowerCase() == val.toLowerCase()) res = item;
    });

    return res;
  }
}
