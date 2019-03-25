import * as RNG from 'rng-js';
// var RNG = require('rng-js');

dataToVisualize = [];
if(Meteor.isClient){


}


Template.dataGenerator.helpers({
	dataToVisualize(){
		return Template.instance().dataToVisualize.get();
	}
});

Template.dataGenerator.events({
	'click .visualize'(event, instance) {
		event.preventDefault();
		event.stopPropagation();
		dataToVisualize = instance.generatedData.get();
		Modal.show("Graph");
	}
});

Template.dataGenerator.onCreated(function() {

	var self = this;
	// console.log(RNG);
	// var rng = new RNG('Example');




});

Template.dataGenerator.onRendered(function() {
	alert(appScopeVariable.noOfPassengers.get());
	var array = [];
	for (var i = 0; i < appScopeVariable.noOfPassengers.get(); i++) {
		array.push(RNG.uniform());
	}
	Template.instance().generatedData = new ReactiveVar(array);

});
