const random = require('random');

// var RNG = require('rng-js');

dataToVisualize = [];
if(Meteor.isClient){


}


Template.dataGenerator.helpers({
	dataToVisualize(){
		return Template.instance().generatedData.get();
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
	this.generatedData = new ReactiveVar([]);
	// console.log(RNG);
	// var rng = new RNG('Example');




});

Template.dataGenerator.onRendered(function() {
	alert(appScopeVariable.noOfPassengers.get());
	const normal = random.exponential(1);
	var array = [];
	for (var i = 0; i < 100; i++) {
		array.push(normal());
	}
	Template.instance().generatedData.set(array);

});
