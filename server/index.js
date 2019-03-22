import { Meteor } from 'meteor/meteor'

import '../imports/config/SecurityConfig.js'
// import '../imports/ui/main.js'
import loadUsers from '../imports/loaders/UsersLoader.js'
//import loadFixtures from '../imports/loaders/FixturesLoader.js'

Meteor.startup(() => {
  loadUsers()
  //loadFixtures([{ foo: 'bar' }], myCollection)
})

var exec = Npm.require('child_process').exec;
var Fiber = Npm.require('fibers');
var Future = Npm.require('fibers/future');

Meteor.methods({
  callScript: function() {
    // var childProcess = Meteor.require("child_process"),
    // Fiber = Meteor.require('fibers');

    new Fiber(function(){
        console.log('test python file');
        var file_path =process.env.PWD + '/python/script.py';
        exec("python " + file_path, function (error, stdout, stderr) {
            if (error) console.log(error);
            if (stdout) console.log("tyhe oputpus is " + stdout);
            if (stderr) console.log(stderr);
        });
    }).run();
  },

});
