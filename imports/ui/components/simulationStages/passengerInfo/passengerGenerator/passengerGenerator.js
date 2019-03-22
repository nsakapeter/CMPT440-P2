
if(Meteor.isClient){


}


Template.passengerGenerator.helpers({
	passengers(){
		return Template.instance().passengers.get();
	}
});

Template.passengerGenerator.events({

});

Template.passengerGenerator.onCreated(function() {

	var self = this;
	this.passengers = new ReactiveVar([
		{
			age: 24,
			serialNo: "11A2409",
			luggageWeight: 9,
			walkingSpeed: 0.5,
			settlingTime: 8
		},
		{
			age: 32,
			serialNo: "13B3211",
			luggageWeight: 11,
			walkingSpeed: 0.3,
			settlingTime: 3
		},
		{
			age: 43,
			serialNo: "12F4304",
			luggageWeight: 4,
			walkingSpeed: 0.8,
			settlingTime: 5
		},
		{
			age: 74,
			serialNo: "11B7401",
			luggageWeight: 1,
			walkingSpeed: 0.1,
			settlingTime: 9
		}
	])






});

Template.passengerGenerator.onRendered(function() {


});
