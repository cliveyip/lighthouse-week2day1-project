/*
curl https://api.github.com/repos/lighthouse-labs/laser_shark/contributors
*/
var request = require("request");
var fs = require('fs');

var options = {
  url: "",
  headers: {
    'User-Agent': 'request'
  }
};

function getRepoContributors(repoOwner, repoName, cb) {
  options.url = "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors";
  // curl https://api.github.com/repos/lighthouse-labs/laser_shark/contributors
  cb();
}

function callback () {
  request(options, function(err, response, body) {
    if (err) {
      throw err;
    }

    var htmlBody = JSON.parse(body);
    var avatarURL = [];
    var avatarName = [];

    for (i in htmlBody) {
      avatarURL.push(htmlBody[i].avatar_url);
      avatarName.push(htmlBody[i].login);
    }
    for (i in avatarURL){
      downloadImageByURL(avatarURL[i], "./avatar", avatarName[i]);
    }
  });
}

function downloadImageByURL(url, filePath, name) {
  if (!fs.existsSync(filePath)){
      fs.mkdirSync(filePath);
  }
  request(url).pipe(fs.createWriteStream(filePath + '/' + name + '.png'));
}

getRepoContributors(process.argv[2], process.argv[3], callback);
