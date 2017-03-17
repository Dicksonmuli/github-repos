//getting API key from .env file
var apiKey = require('./../.env').apiKey;

function Repo() {

}

Repo.prototype.getRepos = function (username, displayFunction) {
  $.get('https://api.github.com/users/'+username+'?access_token=' + apiKey).then(function (response) {
    console.log(response);
    displayFunction(name, response.login, response.html_url, response.repo_url);
    console.log(response.login + " " + response.html_url);
  }).fail(function(error) {
    $('#displayUser').text( name + " is " + error.responseJSON.message + ".");
  });
};

exports.githubrepoModule = Repo;
