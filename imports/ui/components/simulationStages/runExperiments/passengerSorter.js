export function passengerSorter(passengerList, algorithm) {
  switch (algorithm) {
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
    passengerList.sort(compareZone);
      break;
    case "wilma":
    passengerList = sortByWilma(passengerList);
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
