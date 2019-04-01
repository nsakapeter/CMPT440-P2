const random = require('random');

if(Meteor.isClient){


}


Template.passengerGenerator.helpers({
	passengers(){
		return Template.instance().passengers.get();
	}
});

Template.passengerGenerator.events({
	'click .generatePassengers'(event, instance) {
		event.preventDefault();
		event.stopPropagation();
		console.log("Generating");
		var alphabets = ["A","B","C","D","E","F"];
		var passengerList =[];

		//we want to create a normal distribution for walking speed
		//everyone from 18 to 45 will have the same dsitribution for walking speed
		//after that not sure
		var maxSpeed = 20; //max speed for 18 to 55, randomly picked but we can make it more real life
		var minSpeed = 10; //min speed for 18 to 55, randomly picked but we can make it more real life

		var speedMu = (parseInt(maxSpeed) + parseInt(minSpeed)) / 2;
		var speedSigma = (parseInt(maxSpeed) - parseInt(minSpeed)) / 4;

		console.log(speedMu + " " + speedSigma);

		const normal = random.normal(speedMu, speedSigma);
		console.log(normal());

		//what the code aboves is generates a normal distribution of speed from 30 to 10
		//can do something like if age is between 18 to 55, generate a random speed from this distribution
		//not sure what to do for older people

		for (var i = 0; i < agesToSimulate.get().length; i++) {
			//if age is between 18 to 55, use this distribution for walking speed
			if(agesToSimulate.get()[i] > 17  && agesToSimulate.get()[i] < 56)
			{
				var passenger = {
					age: agesToSimulate.get()[i],
					serialNo: (parseInt(i/6) + 1) + alphabets[i%6] + agesToSimulate.get()[i] + luggagesToSimulate.get()[i],
					luggageWeight: luggagesToSimulate.get()[i],
					walkingSpeed: parseInt(normal()), 
					settlingTime: parseInt((Math.log(Math.pow(5, luggagesToSimulate.get()[i])) + 3)), //algorithm => ln(5^x)+3
					seatNo: (parseInt(i/6) + 1) + alphabets[i%6]
				}
			} else
			{
				//if age is > 55, use a different distribution
				var passenger = {
					age: agesToSimulate.get()[i],
					serialNo: (parseInt(i/6) + 1) + alphabets[i%6] + agesToSimulate.get()[i] + luggagesToSimulate.get()[i],
					luggageWeight: luggagesToSimulate.get()[i],
					// walkingSpeed: Math.atan(-agesToSimulate.get()[i] + 75), //algorithm => tan^-1(-x+75)
					// walkingSpeed: parseInt((-Math.log(Math.pow(2, luggagesToSimulate.get()[i])) + 75)), //algorithm => -ln(2^x) + 75
					walkingSpeed: parseInt((-Math.log(Math.pow(agesToSimulate.get()[i], 5)) + 30)), //algorithm => -ln(x^5) + 30
					settlingTime: parseInt((Math.log(Math.pow(5, luggagesToSimulate.get()[i])) + 3)), //algorithm => ln(5^x)+3
					seatNo: (parseInt(i/6) + 1) + alphabets[i%6]
				}
			}
			
			// console.log(passenger);
			passengerList.push(passenger);
		}
		instance.passengers.set(passengerList);
		instance.generatingPassengers.set(false);
	},
	'change .sortTypeDropdown'(event, instance) {
		event.preventDefault();
		event.stopPropagation();
		var passengerList = instance.passengers.get(passengerList);
		switch ($(event.target).val()) {
			case "age":
				passengerList.sort(compareAge);
				break;
			case "lw":
				passengerList.sort(compareLuggageWeight);
				break;
			case "row":
				passengerList.sort(compareRow);
				break;
			case "zone":
				break;
			case "wilma":
				break;
			default:
				break;
		}
		instance.passengers.set(passengerList);
	},
	// 'change .sortDirectionDropdown'(event, instance) {
	// 	event.preventDefault();
	// 	event.stopPropagation();
	// 	var passengerList = instance.passengers.get(passengerList);
	// 	switch ($(event.target).val()) {
	// 		case "age":
	// 			passengerList.sort(compareAge);
	// 			break;
	// 		case "lw":
	// 			passengerList.sort(compareLuggageWeight);
	// 			break;
	// 		case "row":
	// 			passengerList.sort(compareRow);
	// 			break;
	// 		case "zone":
	// 			break;
	// 		case "wilma":
	// 			break;
	// 		default:
	// 			break;
	// 	}
	// 	instance.sortDirectionDropdown.set(passengerList);
	// }
});

Template.passengerGenerator.onCreated(function() {

	var self = this;
	this.passengers = new ReactiveVar([]);
	this.sortDirection = new ReactiveVar("asc");
	this.generatingPassengers = new ReactiveVar(false);

	Tracker.autorun(() => {

	});
});

Template.passengerGenerator.onRendered(function() {


});


function compareAge(a, b) {
  // Use toUpperCase() to ignore character casing
	const ageA = a.age;
  const ageB = b.age;
  let comparison = 0;
  if (ageA > ageB) {
    comparison = 1;
  } else if (ageA < ageB) {
    comparison = -1;
  }
  return comparison;
}

function compareLuggageWeight(a, b) {
  // Use toUpperCase() to ignore character casing
	const luggageWeightA = a.luggageWeight;
  const luggageWeightB = b.luggageWeight;
  let comparison = 0;
  if (luggageWeightA > luggageWeightB) {
    comparison = 1;
  } else if (luggageWeightA < luggageWeightB) {
    comparison = -1;
  }
  return comparison;
}

function compareRow(a, b) {
  // Use toUpperCase() to ignore character casing
	const seatNoA = a.seatNo;
  const seatNoB = b.seatNo;
  let comparison = 0;
  if (seatNoA > seatNoB) {
    comparison = 1;
  } else if (seatNoA < seatNoB) {
    comparison = -1;
  }
  return comparison;
}
