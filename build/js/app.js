(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
exports.apiKey = "c4ccf384ab6234ba4197a710da6e32ba8246b1c7";

},{}],2:[function(require,module,exports){
//getting API key from .env file
var apiKey = require('./../.env').apiKey;

function Repo() {

}

Repo.prototype.getRepos = function (username, displayFunction) {
  $.get('https://api.github.com/users/'+username+'?access_token='+apiKey).then(function (response) {
    console.log(response);
    displayFunction(name, response.login, response.html_url, response.repo_url);
    console.log(response.login + " " + response.html_url);
  }).fail(function(error) {
    $('#displayUser').text( name + " is " + error.responseJSON.message + ".");
  });
};

exports.githubrepoModule = Repo;

},{"./../.env":1}],3:[function(require,module,exports){
//require apilookup file
var Repo = require('./../js/apilookup.js').githubrepoModule;

var displayData = function(name, userData, reposData, moreData) {
  $('#displayUser').append("<h2> The username " + name + " is found as " + userData + ". </h2>");

  $('#showRepos').append("<h2> <a href=" + reposData + ">Click to view " + name + " repositories.</a>" + "</h2>");

  console.log(userData, " ", reposData + " YES");
};



$(document).ready(function () {
  //creating a new object
  var repos = new Repo();
  // repos.getRepos();


  $('#button').click(function () {
console.log("mwiti");
    var username = $('#userInput').val();
    $('#userInput').val("");
console.log(username);
    repos.getRepos(username, displayData);

    $('#displayUser').empty();
    $('#showRepos').empty();
  });
});

},{"./../js/apilookup.js":2}]},{},[3]);
