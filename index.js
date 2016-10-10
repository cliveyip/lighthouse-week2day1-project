var request = require("request");
var fs = require('fs');

var options = {
  url: "",
  // auth: {
  //   bearer: process.env.token
  // },
  headers: {
    'User-Agent': 'request'
  }
};

// Handle error - the .env file is missing
if (fs.existsSync("./.env")){
  require('dotenv').config();
  options.auth = {
    bearer: process.env.token
  }
} else {
  throw '.Env does not exist';
}

// Handle error - an incorrect number of arguments given to program (0, 1, 3, etc.)
if (process.argv.length !== 4) {
  console.log('Please provide 2 arguments only');
  return;
}

// // Handle error: the .env file is missing
// if (!fs.existsSync("./.env")){
//   console.log('Please create a .env file');
// }

function getRepoContributors(repoOwner, repoName, cb) {
  // curl https://api.github.com/repos/lighthouse-labs/laser_shark/contributors
  options.url = "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors";
  cb();
}

function downloadImageByURL(url, filePath, name) {
  // Handle error: the folder to store images to does not exist
  if (!fs.existsSync(filePath)){
      fs.mkdirSync(filePath);
  }
  // download the image
  request(url).pipe(fs.createWriteStream(filePath + '/' + name + '.png'));
}

function callback () {
  request(options, function(err, response, body) {
    // parse the response JSON file
    var htmlBody = JSON.parse(body);
    // arrays to store avatar_url and login names
    var avatarURL = [];
    var loginName = [];

    // if (!fs.existsSync("./.env")){
    //   throw 'Please create a .env file';
    // }

    // Error Handling - the provided owner/repo does not exist
    if (JSON.parse(body).message == 'Not Found'){
      throw "Incorrect username and/or repo";
    }

    // get all the avatar_url and login names and store them in array
    for (i in htmlBody) {
      avatarURL.push(htmlBody[i].avatar_url);
      loginName.push(htmlBody[i].login);
    }

    // call downloadImageByURL for each object
    for (i in avatarURL){
      downloadImageByURL(avatarURL[i], "./avatar", loginName[i]);
    }
  });
}

getRepoContributors(process.argv[2], process.argv[3], callback);
