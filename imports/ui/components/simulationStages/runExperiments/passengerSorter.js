export function passengerSorter(passengerList, algorithm) {
  switch (algorithm) {
    case "age-a":
      passengerList.sort(compareAge);
      break;
    case "lw-a":
      passengerList.sort(compareLuggageWeight);
      break;
    case "row-a":
      passengerList.sort(compareRow);
      break;
    case "zone-a":
      passengerList.sort(compareZone);
      break;
    case "wilma":
      passengerList = sortByWilma(passengerList);
      break;
    case "age-d":
      passengerList.sort(compareAge).reverse();
      break;
    case "lw-d":
      passengerList.sort(compareLuggageWeight).reverse();
      break;
    case "row-d":
      passengerList.sort(compareRow).reverse();
      break;
    case "zone-d":
    passengerList.sort(compareZone).reverse();
      break;
    case "amwi":
    passengerList = sortByWilma(passengerList).reverse();
      break;
    case "random":
    passengerList = sortbyRandom(passengerList);
      break;
    default:
      break;
  }
  return passengerList;
}

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

function sortByWilma(passengers) {
  console.log("Sorting by wilma");
	passengers.sort(compareRow);
  // console.log(passengers);
	var sortedByWilma = [];
	var arrayOrder = [0, 5, 1, 4, 2, 3];
	for (var k = 0; k < 6; k++) {
		var i = arrayOrder[k];
		for (var j = 0; j < passengers.length/6; j++) {
			sortedByWilma.push(passengers[(j*6) + i]);
		}
	}
  // console.log(sortedByWilma);
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
