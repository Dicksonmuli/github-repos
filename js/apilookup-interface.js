//require apilookup file
var Repo = require('./../js/apilookup.js').githubrepoModule;

var displayData = function(name, userData, reposData, moreData) {
  $('#displayUser').append("<h2> The username " + name + " is found as " + userData + ". </h2>");

  $('#showRepos').append("<h2> <a href=" + reposData + ">Click to view " + name + " repositories.</a>" + "</h2>");

  console.log(userData, " ", reposData + " on github ");
};



$(document).ready(function () {
  //creating a new object
  var repos = new Repo();

  $('#button').click(function () {

    var username = $('#userInput').val();
    $('#userInput').val("");
    repos.getRepos(username, displayData);

    $('#displayUser').empty();
    $('#showRepos').empty();
  });
});
