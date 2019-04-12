const random = require('random');

export function passengerGenerator(agesToSimulate, luggagesToSimulate) {

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

  for (var i = 0; i < agesToSimulate.length; i++) {

    // normal mu and normal sigma calculations for getting the normal distribution
    // for settling speed
    var maxSettling = parseInt((Math.log(Math.pow(5, luggagesToSimulate[i])) + 3)) + 3;
    var minSettling = parseInt((Math.log(Math.pow(5, luggagesToSimulate[i])) + 3)) - 3;
    var settlingMu = (maxSettling + minSettling) / 2;
    var settlingSigma = (maxSettling - minSettling) / 4;
    const normalSet = random.normal(settlingMu, settlingSigma);

    var passenger = {
        age: agesToSimulate[i],
        serialNo: (parseInt(i/6) + 1) + alphabets[i%6] + agesToSimulate[i] + luggagesToSimulate[i],
        luggageWeight: luggagesToSimulate[i],
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
    var firstZone = parseInt(agesToSimulate.length/4); //if in first quarter
    var secondZone = parseInt(agesToSimulate.length/2); //if in second quarter
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
    if(agesToSimulate[i] > 17 && agesToSimulate[i] < 30) //speed for age range from 18 to 29
    {
      var maxSpeed = 1.36;
      var minSpeed = 1.34;
      var speedMu = (maxSpeed + minSpeed) / 2;
      var speedSigma = (maxSpeed - minSpeed) / 4;
      const normal = random.normal(speedMu, speedSigma);
      passenger.walkingSpeed = parseFloat(Math.round(normal() * 100) / 100).toFixed(2); // rounding our walking speed to 2 decimals
    } else if(agesToSimulate[i] > 29 && agesToSimulate[i] < 40) //speed for age range from 30 to 39
    {
      var maxSpeed = 1.36;
      var minSpeed = 1.43;
      var speedMu = (maxSpeed + minSpeed) / 2;
      var speedSigma = (maxSpeed - minSpeed) / 4;
      const normal = random.normal(speedMu, speedSigma);
      passenger.walkingSpeed = parseFloat(Math.round(normal() * 100) / 100).toFixed(2);
    } else if(agesToSimulate[i] > 39 && agesToSimulate[i] < 50) //speed for age range from 40 to 49
    {
      var maxSpeed = 1.39;
      var minSpeed = 1.43;
      var speedMu = (maxSpeed + minSpeed) / 2;
      var speedSigma = (maxSpeed - minSpeed) / 4;
      const normal = random.normal(speedMu, speedSigma);
      passenger.walkingSpeed = parseFloat(Math.round(normal() * 100) / 100).toFixed(2);
    } else if(agesToSimulate[i] > 49 && agesToSimulate[i] < 60) //speed for age range from 50 to 59
    {
      maxSpeed = 1.31;
      var minSpeed = 1.43;
      var speedMu = (maxSpeed + minSpeed) / 2;
      var speedSigma = (maxSpeed - minSpeed) / 4;
      const normal = random.normal(speedMu, speedSigma);
      passenger.walkingSpeed = parseFloat(Math.round(normal() * 100) / 100).toFixed(2);
    } else if(agesToSimulate[i] > 59 && agesToSimulate[i] < 70) //speed for age range from 60 to 69
    {
      maxSpeed = 1.24;
      var minSpeed = 1.34;
      var speedMu = (maxSpeed + minSpeed) / 2;
      var speedSigma = (maxSpeed - minSpeed) / 4;
      const normal = random.normal(speedMu, speedSigma);
      passenger.walkingSpeed = parseFloat(Math.round(normal() * 100) / 100).toFixed(2);
    } else if(agesToSimulate[i] > 69 && agesToSimulate[i] < 80) //speed for age range from 70 to 79
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
    // console.log(passengerList);
  return passengerList;

}
