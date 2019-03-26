const random = require('random');

// var RNG = require('rng-js');

dataToVisualize = [];
if(Meteor.isClient){


}


Template.dataGenerator.helpers({
	dataToVisualize(){
		return Template.instance().generatedData.get();
	},
	distributionType(){
		return Template.instance().distributionType.get();
	}
});

Template.dataGenerator.events({
	'click .visualize'(event, instance) {
		event.preventDefault();
		event.stopPropagation();
		dataToVisualize = instance.generatedData.get();
		Modal.show("Graph");
	},
	'change .distributionTypeDropdown'(event, instance) {
		event.preventDefault();
		event.stopPropagation();
		instance.distributionType.set($(event.target).val());
	}
});

Template.dataGenerator.onCreated(function() {

	var self = this;
	this.generatedData = new ReactiveVar([]);
	this.distributionType = new ReactiveVar("uniform");
	// console.log(RNG);
	// var rng = new RNG('Example');




});

Template.dataGenerator.onRendered(function() {
	// alert(appScopeVariable.noOfPassengers.get());
	var self = this;
	this.autorun(() => {
		console.log("Min is" + this.data.min);
		console.log("Max is" + this.data.max);
		var rand;
		switch (Template.instance().distributionType.get()) {
			case "normal":
				rand = random.normal(48, 15);
				break;
			case "uniform":
				rand = random.uniform(1);
				break;
			case "exponential":
				rand = random.exponential(1);
				break;
			default:
				rand = random.normal(48, 15);
				break;
		}
		var array = [];
		for (var i = 0; i < 100; i++) {
			array.push(Math.round(rand()));
		}
		if (self.data.title == "Ages") {
			agesToSimulate.set(array);
		}else{
			luggagesToSimulate.set(array);
		}
		Template.instance().generatedData.set(array);
  });


});
