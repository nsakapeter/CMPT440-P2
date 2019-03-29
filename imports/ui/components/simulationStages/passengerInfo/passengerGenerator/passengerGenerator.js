
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
		for (var i = 0; i < agesToSimulate.get().length; i++) {
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
