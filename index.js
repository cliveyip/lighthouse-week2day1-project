
var request = require("request");
var fs = require('fs');

var options = {
  url: "",
  headers: {
    'User-Agent': 'request'
  }
};

function getRepoContributors(repoOwner, repoName, cb) {
  // curl https://api.github.com/repos/lighthouse-labs/laser_shark/contributors
  options.url = "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors";
  cb();
}

function callback () {
  request(options, function(err, response, body) {
    // error handling
    if (err) {
      throw err;
    }

    // parse the response JSON file
    var htmlBody = JSON.parse(body);
    // arrays to store avatar_url and login names
    var avatarURL = [];
    var loginName = [];

    // get all the avatar_url and login names and store them in array
    for (i in htmlBody) {
      avatarURL.push(htmlBody[i].avatar_url);
      avatarName.push(htmlBody[i].login);
    }

    // call downloadImageByURL for each object
    for (i in avatarURL){
      downloadImageByURL(avatarURL[i], "./avatar", loginName[i]);
    }
  });
}

function downloadImageByURL(url, filePath, name) {
  // create directory if it doesn't exist
  if (!fs.existsSync(filePath)){
      fs.mkdirSync(filePath);
  }
  // download the image
  request(url).pipe(fs.createWriteStream(filePath + '/' + name + '.png'));
}

getRepoContributors(process.argv[2], process.argv[3], callback);
