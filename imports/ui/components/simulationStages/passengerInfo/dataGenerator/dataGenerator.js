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

		//testing to see if i can use max and min
		// var max = parseInt(this.data.max);
		// var min = parseInt(this.data.min);
		// var normalMu = ((max - min) / 2) + min;
		// var normalSigma = (max - min) / 4;
		// console.log(max + " " + min);

		//the mu and sigma for normal distribution
		var normalMu = (parseInt(this.data.max) + parseInt(this.data.min)) / 2;
		var normalSigma = (parseInt(this.data.max) - parseInt(this.data.min)) / 4;

		//lambda is 1 / the average 
		//so we can use normalMu b/c normalMu is just the mean of the given max and mim values
		//do more research on this to confirm that this is what lambda is 
		var lambda = 1 / normalMu;
		console.log(lambda);

		switch (Template.instance().distributionType.get()) {
			case "normal":
				//calculating the normal distribution requires the mean and standard deviation 
				// rand = random.normal(normalMu, normalSigma);
				rand = random.normal(normalMu, normalSigma);
				break;
			case "uniform":
				//calculating the uniform distribution only requires the minimum and maximum values
				rand = random.uniform(parseInt(this.data.min), parseInt(this.data.max));
				break;
			case "exponential":
				//caclulating the exponential distribution only requires the lambda
				//need to make changes because we get crazy high numbers which should be expected
				//but we want to cut these out.
				rand = random.exponential(lambda);
				break;
			default:
				rand = random.normal(normalMu, normalSigma);
				break;
		}
		var array = [];
		for (var i = 0; i < 100; i++) {
			var newValue = rand();
			console.log("Original value " + newValue);
			if (self.data.title == "Ages") {
				while((newValue < 18) || (newValue > 78)){
					newValue = rand();
					console.log("Newly generated" + newValue);
				}
				array.push(Math.round(newValue));
			}
			else{
				while((newValue < 1) || (newValue > 15)){
					newValue = rand();
					console.log("Newly generated" + newValue);
				}
				array.push(Math.round(newValue));
			}
			
		}
		if (self.data.title == "Ages") {
			agesToSimulate.set(array);
		}else{
			luggagesToSimulate.set(array);
		}
		Template.instance().generatedData.set(array);
  });


});
