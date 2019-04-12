const random = require('random');

export function generateAges(minAges, maxAges, noOfPassengers, ageDistributionType) {
  var ages = [];
  var rand;
  var normalMu = (parseInt(maxAges) + parseInt(minAges)) / 2;
    var normalSigma = (parseInt(maxAges) - parseInt(minAges)) / 4;

    var lambda = 1 / normalMu;
    console.log(lambda);

    switch (ageDistributionType) {
      case "normal":
        //calculating the normal distribution requires the mean and standard deviation
        rand = random.normal(normalMu, normalSigma);
        break;
      case "uniform":
        //calculating the uniform distribution only requires the minimum and maximum values
        rand = random.uniform(parseInt(minAges), parseInt(maxAges));
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

    // var numPassengers = self.data.passengers;
    for (var i = 0; i < noOfPassengers; i++) {
      var newValue = rand();
      while ((newValue < parseInt(minAges)) || (newValue > parseInt(maxAges))) {
        newValue = rand();
      }
      ages.push(Math.round(newValue));
    }

    return ages;
}




export function generateWeights(minLuggaegeWeight, maxLuggaegeWeight, noOfPassengers, LuggageWeightDistributionType) {
  var weights = [];
  var rand;
  var normalMu = (parseInt(maxLuggaegeWeight) + parseInt(minLuggaegeWeight)) / 2;
  var normalSigma = (parseInt(maxLuggaegeWeight) - parseInt(minLuggaegeWeight)) / 4;

  var lambda = 1 / normalMu;
  console.log(lambda);

  switch (LuggageWeightDistributionType) {
    case "normal":
      //calculating the normal distribution requires the mean and standard deviation
      rand = random.normal(normalMu, normalSigma);
      break;
    case "uniform":
      //calculating the uniform distribution only requires the minimum and maximum values
      rand = random.uniform(parseInt(minLuggaegeWeight), parseInt(maxLuggaegeWeight));
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

  // var numPassengers = self.data.passengers;
  for (var i = 0; i < noOfPassengers; i++) {
    var newValue = rand();
    console.log(parseFloat(minLuggaegeWeight));
    while ((newValue < parseFloat(minLuggaegeWeight)) || (newValue > parseFloat(maxLuggaegeWeight))) {
      newValue = rand();
    }
    weights.push(Math.round(newValue));
  }

  return weights;

}
