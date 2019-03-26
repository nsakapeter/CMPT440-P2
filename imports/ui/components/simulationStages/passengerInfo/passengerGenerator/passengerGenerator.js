
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
				walkingSpeed: 0.1,
				settlingTime: 9
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
				break;
			case "row":
				break;
			case "zone":
				break;
			case "wilma":
				break;
			default:
				break;
		}
		instance.passengers.set(passengerList);
	}
});

Template.passengerGenerator.onCreated(function() {

	var self = this;
	this.passengers = new ReactiveVar([]);
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
