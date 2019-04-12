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

			// normal mu and normal sigma calculations for getting the normal distribution
			// for settling speed
			var maxSettling = parseInt((Math.log(Math.pow(5, luggagesToSimulate.get()[i])) + 3)) + 3;
			var minSettling = parseInt((Math.log(Math.pow(5, luggagesToSimulate.get()[i])) + 3)) - 3;
			var settlingMu = (maxSettling + minSettling) / 2;
			var settlingSigma = (maxSettling - minSettling) / 4;
			const normalSet = random.normal(settlingMu, settlingSigma);

			var passenger = {
					age: agesToSimulate.get()[i],
					serialNo: (parseInt(i/6) + 1) + alphabets[i%6] + agesToSimulate.get()[i] + luggagesToSimulate.get()[i],
					luggageWeight: luggagesToSimulate.get()[i],
					settlingTime: parseInt(normalSet()), //algorithm => ln(5^x)+3
			}

			// this code adds a 0 in front of single digit numbers
			if ((parseInt(i/6) + 1 ) < 10 ) {
				passenger.seatNo = "0" + (parseInt(i/6) + 1) + alphabets[i%6];
			}
			else{
				passenger.seatNo = (parseInt(i/6) + 1) + alphabets[i%6];
			}

			// this code divides the number of passengers we have by 4
			// and then assigns a zone to passenger
			// the first quarter of passengrs are zone 1, the second quarter zone 2 and so on
			var firstZone = parseInt(agesToSimulate.get().length/4); //if in first quarter
			var secondZone = parseInt(agesToSimulate.get().length/2); //if in second quarter
			var thirdZone = firstZone + secondZone; 									//if in third quarter

			if(i < firstZone) //if i is in the first quarter of passengers, zoneNo = 1
			{
				passenger.zoneNo = 1;
			} else if (i < secondZone) // if i is in second quarter of passengers, zoneNo = 2
			{
				passenger.zoneNo = 2;
			} else if (i < thirdZone)
			{
				passenger.zoneNo = 3;
			} else passenger.zoneNo = 4;


			// these if statements below check to see what age range the passenger is in
			// then we create a normal distribution for the walking speed based on the max and min speed
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
			case "age-a":
				passengerList.sort(compareAge);
				appScopeVariable.currentlySimulatedProcess.set("By Age " + $(".sortDirectionDropdown").val());
				break;
			case "lw-a":
				passengerList.sort(compareLuggageWeight);
				appScopeVariable.currentlySimulatedProcess.set("By Luggae Weight " + $(".sortDirectionDropdown").val());
				break;
			case "row-a":
				passengerList.sort(compareRow);
				appScopeVariable.currentlySimulatedProcess.set("By row " + $(".sortDirectionDropdown").val());
				break;
			case "zone-a":
				passengerList.sort(compareZone);
				appScopeVariable.currentlySimulatedProcess.set("By zone " + $(".sortDirectionDropdown").val());
				break;
			case "wilma":
				passengerList = sortByWilma(passengerList);
				appScopeVariable.currentlySimulatedProcess.set("By wilma " + $(".sortDirectionDropdown").val());
				break;
			case "age-d":
				passengerList.sort(compareAge).reverse();
				appScopeVariable.currentlySimulatedProcess.set("By Age " + $(".sortDirectionDropdown").val());
				break;
			case "lw-d":
				passengerList.sort(compareLuggageWeight).reverse();
				appScopeVariable.currentlySimulatedProcess.set("By Luggae Weight " + $(".sortDirectionDropdown").val());
				break;
			case "row-d":
				passengerList.sort(compareRow).reverse();
				appScopeVariable.currentlySimulatedProcess.set("By row " + $(".sortDirectionDropdown").val());
				break;
			case "zone-d":
			passengerList.sort(compareZone).reverse();
			appScopeVariable.currentlySimulatedProcess.set("By zone " + $(".sortDirectionDropdown").val());
				break;
			case "amwi":
			passengerList = sortByWilma(passengerList).reverse();
			appScopeVariable.currentlySimulatedProcess.set("By wilma " + $(".sortDirectionDropdown").val());
				break;
			case "random":
			passengerList = sortbyRandom(passengerList);
			appScopeVariable.currentlySimulatedProcess.set("By random " + $(".sortDirectionDropdown").val());
				break;
			default:
				break;
		}
		appScopeVariable.passengers.set(passengerList);
		instance.passengers.set(passengerList);
	},
	// allows us to sort our passengers in descending order
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
	// 			passengerList.sort(compareZone);
	// 			break;
	// 		case "wilma":
	// 			passengerList.sortByWilma(passengerList);
	// 			break;
	// 		case "random":
	// 			passengerList = sortbyRandom(passengerList);
	// 			break;
	// 		default:
	// 			break;
	// 	}
	// 	instance.passengers.set(passengerList.reverse());
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
	const luggageWeightA = parseFloat(a.luggageWeight);
  const luggageWeightB = parseFloat(b.luggageWeight);
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

function compareZone(a, b) {
  // Use toUpperCase() to ignore character casing
	const zoneNoA = a.zoneNo;
  const zoneNoB = b.zoneNo;
  let comparison = 0;
  if (zoneNoA > zoneNoB) {
    comparison = 1;
  } else if (zoneNoA < zoneNoB) {
    comparison = -1;
  }
  return comparison;
}

function sortByWilma(passengerList) {
	passengerList.sort(compareRow);
	var sortedByWilma = [];
	var arrayOrder = [0, 5, 1, 4, 2, 3];
	for (var k = 0; k < 6; k++) {
		var i = arrayOrder[k];
		for (var j = 0; j < passengerList.length/6; j++) {
			sortedByWilma.push(passengerList[(j*6) + i]);
		}
	}
	return sortedByWilma;
}

function sortbyRandom(passengerList)
{
	var ctr = passengerList.length, temp, index;
	// While there are elements in the array
	while (ctr > 0) {
		// Pick a random index
	 	index = Math.floor(Math.random() * ctr);
		// Decrease ctr by 1
	  ctr--;
		// And swap the last element with it
	  temp = passengerList[ctr];
	  passengerList[ctr] = passengerList[index];
	  passengerList[index] = temp;
	}
	return passengerList;
}
