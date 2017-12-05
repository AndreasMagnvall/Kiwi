(function() {
  const parseXML = require('xml2js').parseString;
  const https = require('https');

  module.exports = class Wolfram {
    constructor(appId, log) {
      this.APP_ID = appId;
      this.log = log;
    }

    async getSolutions(equation, log, callback) {
      let packet = new Packet(equation, callback, this, log);

      this.addSolutionURLs(packet, function() {
        if (packet.solutionURLs.length == 0) {
          packet.callback(packet.solutionImageURLs);
          return;
        }
        packet.wolfram.addImagesFromUrls(packet, function() {
          packet.callback(packet.solutionImageURLs);
        });
      });
    }

    async addSolutionURLs(packet, callback) {
      let wolfram = this;
      try {
        https.get(packet.generalURL, function(res) {
          var body = '';
          var body = '';
          res.on('data', function(chunk) {
            body += chunk;
          });
          res.on('end', function() {
            try {
              var bodyString = body.toString();
              //console.log(bodyString);
              parseXML(bodyString, function(err, result) {
                try {
                  for (var i = 0; i < result["queryresult"].pod.length; i++) {
                    try {
                      for (var j = 0; j < result["queryresult"].pod[i].states.length; j++) {
                        try {
                          for (var k = 0; k < result["queryresult"].pod[i].states[j].state.length; k++) {
                            try {
                              if (result["queryresult"].pod[i].states[j].state[k]["$"].name == "Step-by-step solution") {
                                var nameArr = result["queryresult"].pod[i].states[j].state[k]["$"].input.split("_");
                                var name = nameArr[0];
                                packet.addSolutionURL(name);
                                packet.log("Found step-by-step: " + name);
                              } else {
                                //wolfram.log(result["queryresult"].pod[i].states[j].state[k]["$"].name);
                              }
                            } catch (err) {
                              packet.log("Nothing here... " + JSON.stringify(result["queryresult"].pod[i].states[j].state[0]["$"].name));
                            }
                          }
                        } catch (err) {
                          packet.log("Error: No step-by-step in this state");
                        }
                      }
                    } catch (err) {
                      //wolfram.log("Error: No states found in pod " + i);
                    }
                  }
                  packet.log("Search completed! Found " + packet.solutionURLs.length + " step-by-step solutions!");
                  callback();
                } catch (err) {
                  packet.log("Error, No pods found: " + err);
                  callback();
                }
              });
            } catch (err) {
              packet.log("Parsing error: " + err);
              callback();
            }
          });
        });
      } catch (err) {
        packet.log("HTTPS-request error: " + err);
        callback();
      }
    }

    async addImagesFromUrls(packet, callback) {
      let addedURLs = 0;
      let wolfram = this;
      for (var i = 0; i < packet.solutionURLs.length; i++) {
        try {
          var index = i;

          function getWrapper(url,index,cb) {
            https.get(url, function(res) {
              cb(res,index);
            });
            return;
          }
          getWrapper(packet.solutionURLs[index].url,i, function(res,i) {
            var body = '';
            res.on('data', function(chunk) {
              body += chunk;
            });
            res.on('end', function() {
              try {
                var bodyString = body.toString();
                //console.log(bodyString);
                parseXML(bodyString, function(err, result) {
                  for (var j = 0; j < result["queryresult"].pod[0].subpod.length; j++) {
                    if (result["queryresult"].pod[0].subpod[j]["$"].title == "Possible intermediate steps") {
                      var imgurl = result["queryresult"].pod[0].subpod[j].img[0]["$"].src;
                      packet.solutionImageURLs.push({
                        imgURL: imgurl,
                        name: packet.solutionURLs[i].name
                      });
                      addedURLs++;
                      if (addedURLs >= packet.solutionURLs.length) {
                        callback();
                      }
                    }
                  }
                });
              } catch (err) {
                packet.log("Parsing error: " + err);
                callback();
              }
            });
            res.on("data", function(chunk) {});
          });
        } catch (err) {
          packet.log("HTTPS-request error: " + err);
          callback();
        }
      }
    }
  }

  class Packet {
    constructor(equation, callback, wolfram, log) {
      this.equation = equation;
      this.equationURI = encodeURIComponent(this.equation);
      this.log = log;
      this.APP_ID = wolfram.APP_ID;
      this.callback = callback;
      this.wolfram = wolfram;
      this.retries = 1;
      this.generalURL = "https://api.wolframalpha.com" +
        "/v2/query.jsp?" +
        "appid=" + this.APP_ID +
        "&format=image" +
        "&countrycode=US" +
        "&languagecode=en" +
        "&reinterpret=true" +
        "&input=" + this.equationURI;

      this.solutionURLs = [];
      this.solutionImageURLs = [];

      this.imageMagnification = 2;
    }

    addSolutionURL(solutionName) {
      var solutionUrl = "https://api.wolframalpha.com" +
        "/v2/query.jsp?" + "appid=" + this.APP_ID +
        "&banners=image" +
        "&mag=" + this.imageMagnification +
        "&width=2000" +
        "&format=image" +
        "&countrycode=SE" +
        "&languagecode=sv" +
        "&reinterpret=true" +
        "&podtitle=Solutions" +
        "&includepodid=" + solutionName +
        "&podstate=" + solutionName +
        "__Step-by-step+solution" +
        "&input=" + this.equationURI;

      this.solutionURLs.push({
        "url": solutionUrl,
        "name": solutionName
      });
    }
  }
})();
