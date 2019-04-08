import { Meteor } from 'meteor/meteor'


var exec = Npm.require('child_process').exec;
var Fiber = Npm.require('fibers');
var Future = Npm.require('fibers/future');

Meteor.methods({
  updateDefaultVariables: function() {
    // var childProcess = Meteor.require("child_process"),
    // Fiber = Meteor.require('fibers');
    console.log("h1");
    return Meteor.settings.appScopeVariables.planeCapacity;
  },

});
