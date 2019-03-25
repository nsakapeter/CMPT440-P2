import { Template } from 'meteor/templating'
import { Meteor } from 'meteor/meteor'

import '../layout/main.html'
import '../base/Container.html'
import '../base/Link.html'
import '../base/Button.html'
import './HomeComponent.html'
import '../simulationStages/passengerInfo/passengerInfo.html';
import '../simulationStages/passengerInfo/passengerInfo.js';
import '../simulationStages/passengerInfo/dataGenerator/dataGenerator.html';
import '../simulationStages/passengerInfo/dataGenerator/dataGenerator.js';
import '../simulationStages/passengerInfo/dataGenerator/Graph/Graph.html';
import '../simulationStages/passengerInfo/dataGenerator/Graph/Graph.js';
import '../simulationStages/passengerInfo/passengerGenerator/passengerGenerator.html';
import '../simulationStages/passengerInfo/passengerGenerator/passengerGenerator.js';
import '../simulationStages/capacityForm.html';
import '../simulationStages/capacityForm.js';
import '../simulationStages/boardingProcess.html';
import '../simulationStages/boardingProcess.js';

activeTab = "";
appScopeVariable = {};

Template.Home.helpers({
	isCurrentTab: function(tabName){
		return activeTab.get() === tabName;
	},

});

Template.Home.events({
	'click .step-trigger'(event, instance) {
		event.preventDefault();
		event.stopPropagation();

		var el = $(event.currentTarget);
		var tab_name = el.data('name');

		if(tab_name == "capacityForm"){
			activeTab.set(tab_name);

		}
		if(tab_name == "passengerInfo"){
			activeTab.set(tab_name);
		}
		if(tab_name == "boardingProcess"){
			activeTab.set(tab_name);
		}
	},

});

Template.Home.onCreated(function() {
  var context_data = this.data;

	var self = this;
	activeTab = new ReactiveVar("capacityForm");
	appScopeVariable.ages = new ReactiveVar([]);
	appScopeVariable.luggages = new ReactiveVar([]);
	appScopeVariable.passengers = new ReactiveVar([]);
	appScopeVariable.planeCapacity = new ReactiveVar(0);
	appScopeVariable.noOfPassengers = new ReactiveVar(0);
	appScopeVariable.totalBoardingTime = new ReactiveVar(0);
	appScopeVariable.totalConflicts = new ReactiveVar(0);
});

Template.Home.onRendered(function() {
	Meteor.Loader.loadJs("/js/main.js");
	Meteor.Loader.loadJs("/js/parsley.js");
	Meteor.Loader.loadJs("/js/jquery-asRange.js");
	Meteor.Loader.loadJs("/js/bootstrap/dist/js/bootstrap.js");
	Meteor.Loader.loadCss("/js/bootstrap/dist/css/bootstrap.css");
});



Template.Home.onDestroyed(function() {

});


function makeid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 7; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}
