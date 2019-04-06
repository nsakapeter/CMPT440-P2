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
		//we got the formulas for average walking speed between certain ages from this website
		//https://www.healthline.com/health/exercise-fitness/average-walking-speed#Average-walking-speed-by-age-
		//using these walking speeds, we change the speed based on age
		//we create the mu for normal distribution from (max+min)/2
		//and we create the sigma from (max-min)/4
		//we can use these formulas because we are given the max and min speed for a range of ages
		//our speed is in METRES PER SECOND, MILES PER HOUR is another option if needed



		for (var i = 0; i < agesToSimulate.get().length; i++) {
			var passenger = {
					age: agesToSimulate.get()[i],
					serialNo: (parseInt(i/6) + 1) + alphabets[i%6] + agesToSimulate.get()[i] + luggagesToSimulate.get()[i],
					luggageWeight: luggagesToSimulate.get()[i],
					walkingSpeed: 5,
					settlingTime: parseInt((Math.log(Math.pow(5, luggagesToSimulate.get()[i])) + 3)), //algorithm => ln(5^x)+3
					// seatNo: (parseInt(i/6) + 1 ) < 10 ? "0" : "" + (parseInt(i/6) + 1) + alphabets[i%6]
			}
			if ((parseInt(i/6) + 1 ) < 10 ) {
				passenger.seatNo = "0" + (parseInt(i/6) + 1) + alphabets[i%6];
			}
			else{
				passenger.seatNo = (parseInt(i/6) + 1) + alphabets[i%6];
			}
			if(agesToSimulate.get()[i] > 17 && agesToSimulate.get()[i] < 30) //speed for age range from 18 to 29
			{
				var maxSpeed = 1.36;
				var minSpeed = 1.34;
				var speedMu = (maxSpeed + minSpeed) / 2;
				var speedSigma = (maxSpeed - minSpeed) / 4;
				const normal = random.normal(speedMu, speedSigma);
				passenger.walkingSpeed = parseFloat(Math.round(normal() * 100) / 100).toFixed(2); // rounding our walking speed to 2 decimals
			} else if(agesToSimulate.get()[i] > 29 && agesToSimulate.get()[i] < 40) //speed for age range from 30 to 39
			{
				var maxSpeed = 1.36;
				var minSpeed = 1.43;
				var speedMu = (maxSpeed + minSpeed) / 2;
				var speedSigma = (maxSpeed - minSpeed) / 4;
				const normal = random.normal(speedMu, speedSigma);
				passenger.walkingSpeed = parseFloat(Math.round(normal() * 100) / 100).toFixed(2);
			} else if(agesToSimulate.get()[i] > 39 && agesToSimulate.get()[i] < 50) //speed for age range from 40 to 49
			{
				var maxSpeed = 1.39;
				var minSpeed = 1.43;
				var speedMu = (maxSpeed + minSpeed) / 2;
				var speedSigma = (maxSpeed - minSpeed) / 4;
				const normal = random.normal(speedMu, speedSigma);
				passenger.walkingSpeed = parseFloat(Math.round(normal() * 100) / 100).toFixed(2);
			} else if(agesToSimulate.get()[i] > 49 && agesToSimulate.get()[i] < 60) //speed for age range from 50 to 59
			{
				maxSpeed = 1.31;
				var minSpeed = 1.43;
				var speedMu = (maxSpeed + minSpeed) / 2;
				var speedSigma = (maxSpeed - minSpeed) / 4;
				const normal = random.normal(speedMu, speedSigma);
				passenger.walkingSpeed = parseFloat(Math.round(normal() * 100) / 100).toFixed(2);
			} else if(agesToSimulate.get()[i] > 59 && agesToSimulate.get()[i] < 70) //speed for age range from 60 to 69
			{
				maxSpeed = 1.24;
				var minSpeed = 1.34;
				var speedMu = (maxSpeed + minSpeed) / 2;
				var speedSigma = (maxSpeed - minSpeed) / 4;
				const normal = random.normal(speedMu, speedSigma);
				passenger.walkingSpeed = parseFloat(Math.round(normal() * 100) / 100).toFixed(2);
			} else if(agesToSimulate.get()[i] > 69 && agesToSimulate.get()[i] < 80) //speed for age range from 70 to 79
			{
				maxSpeed = 1.13;
				var minSpeed = 1.26;
				var speedMu = (maxSpeed + minSpeed) / 2;
				var speedSigma = (maxSpeed - minSpeed) / 4;
				const normal = random.normal(speedMu, speedSigma);
				passenger.walkingSpeed = parseFloat(Math.round(normal() * 100) / 100).toFixed(2);
			}

			// console.log(passenger);
			passengerList.push(passenger);
		}
		instance.passengers.set(passengerList);
		appScopeVariable.passengers.set(passengerList);
		instance.generatingPassengers.set(false);
	},
	'change .sortTypeDropdown'(event, instance) {
		event.preventDefault();
		event.stopPropagation();
		var passengerList = instance.passengers.get(passengerList);
		switch ($(event.target).val()) {
			case "age":
				passengerList.sort(compareAge);
				appScopeVariable.currentlySimulatedProcess.set("By Age " + $(".sortDirectionDropdown").val()); 
				break;
			case "lw":
				passengerList.sort(compareLuggageWeight);
				appScopeVariable.currentlySimulatedProcess.set("By Luggae Weight " + $(".sortDirectionDropdown").val());
				break;
			case "row":
				passengerList.sort(compareRow);
				appScopeVariable.currentlySimulatedProcess.set("By row " + $(".sortDirectionDropdown").val());
				break;
			case "zone":
			appScopeVariable.currentlySimulatedProcess.set("By zone " + $(".sortDirectionDropdown").val());
				break;
			case "wilma":
			appScopeVariable.currentlySimulatedProcess.set("By wilma " + $(".sortDirectionDropdown").val());
				break;
			default:
				break;
		}
		appScopeVariable.passengers.set(passengerList);
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
