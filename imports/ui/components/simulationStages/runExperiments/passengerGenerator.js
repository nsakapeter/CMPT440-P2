function passengerGenerator(agesToSimulate, luggagesToSimulate) {

  console.log("Generating");
  var alphabets = ["A", "B", "C", "D", "E", "F"];
  var passengerList = [];

  for (var i = 0; i < agesToSimulate.length; i++) {
    var passenger = {
      age: agesToSimulate[i],
      serialNo: (parseInt(i / 6) + 1) + alphabets[i % 6] + agesToSimulate[i] + luggagesToSimulate[i],
      luggageWeight: luggagesToSimulate[i],
      walkingSpeed: 5,
      settlingTime: parseInt((Math.log(Math.pow(5, luggagesToSimulate[i])) + 3)), //algorithm => ln(5^x)+3
      // seatNo: (parseInt(i/6) + 1 ) < 10 ? "0" : "" + (parseInt(i/6) + 1) + alphabets[i%6]
    }
    if ((parseInt(i / 6) + 1) < 10) {
      passenger.seatNo = "0" + (parseInt(i / 6) + 1) + alphabets[i % 6];
    } else {
      passenger.seatNo = (parseInt(i / 6) + 1) + alphabets[i % 6];
    }
    if (agesToSimulate[i] > 17 && agesToSimulate[i] < 30) //speed for age range from 18 to 29
    {
      var maxSpeed = 1.36;
      var minSpeed = 1.34;
      var speedMu = (maxSpeed + minSpeed) / 2;
      var speedSigma = (maxSpeed - minSpeed) / 4;
      const normal = random.normal(speedMu, speedSigma);
      passenger.walkingSpeed = parseFloat(Math.round(normal() * 100) / 100).toFixed(2); // rounding our walking speed to 2 decimals
    } else if (agesToSimulate[i] > 29 && agesToSimulate[i] < 40) //speed for age range from 30 to 39
    {
      var maxSpeed = 1.36;
      var minSpeed = 1.43;
      var speedMu = (maxSpeed + minSpeed) / 2;
      var speedSigma = (maxSpeed - minSpeed) / 4;
      const normal = random.normal(speedMu, speedSigma);
      passenger.walkingSpeed = parseFloat(Math.round(normal() * 100) / 100).toFixed(2);
    } else if (agesToSimulate[i] > 39 && agesToSimulate[i] < 50) //speed for age range from 40 to 49
    {
      var maxSpeed = 1.39;
      var minSpeed = 1.43;
      var speedMu = (maxSpeed + minSpeed) / 2;
      var speedSigma = (maxSpeed - minSpeed) / 4;
      const normal = random.normal(speedMu, speedSigma);
      passenger.walkingSpeed = parseFloat(Math.round(normal() * 100) / 100).toFixed(2);
    } else if (agesToSimulate[i] > 49 && agesToSimulate[i] < 60) //speed for age range from 50 to 59
    {
      maxSpeed = 1.31;
      var minSpeed = 1.43;
      var speedMu = (maxSpeed + minSpeed) / 2;
      var speedSigma = (maxSpeed - minSpeed) / 4;
      const normal = random.normal(speedMu, speedSigma);
      passenger.walkingSpeed = parseFloat(Math.round(normal() * 100) / 100).toFixed(2);
    } else if (agesToSimulate[i] > 59 && agesToSimulate[i] < 70) //speed for age range from 60 to 69
    {
      maxSpeed = 1.24;
      var minSpeed = 1.34;
      var speedMu = (maxSpeed + minSpeed) / 2;
      var speedSigma = (maxSpeed - minSpeed) / 4;
      const normal = random.normal(speedMu, speedSigma);
      passenger.walkingSpeed = parseFloat(Math.round(normal() * 100) / 100).toFixed(2);
    } else if (agesToSimulate[i] > 69 && agesToSimulate[i] < 80) //speed for age range from 70 to 79
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
  return passengerList;

}
