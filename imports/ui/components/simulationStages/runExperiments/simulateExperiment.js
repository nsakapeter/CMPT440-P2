export function simulateExperiment(rawPassengerData,num_passengers,plane_capacity) {

  console.log(rawPassengerData + " " + num_passengers + " " + plane_capacity);
      var results = [];
      var conflicts = 0;
      var time = 0;
      var newTime;
      var currentTime;

      width = document.body.clientWidth;
      var board_x = Math.round(document.body.clientWidth / 2 - (document.body.clientWidth / 3) + 100);
  //var board_y = Math.round(document.body.clientHeight/2);
      var board_y = Math.round(Math.max(window.innerHeight, document.body.clientHeight) / 2);
      var countdown;
      var panel_play = true;
      var tickspeed = 20; //interval of a game tick in miliseconds

  //console.log(rawPassengerData);
      var data = ParsePassengerData(rawPassengerData);
      passengerWalkingSpeedScale();

  //Run Experiment till completion and return results
      while(!((data.filter(function (d) {return ((parseInt(d.visible) === 0) || (parseInt(d.settled) === 0));})).length === 0)){
          countDown();
      }
      return [time,conflicts,newTime];



  // -------------------- Functions


      function showTempPlayButton(toggle) {
          if (toggle === 1) {
              d3.select("#temp-pause-play-btn").style("display", "initial");
          } else {
              d3.select("#temp-pause-play-btn").style("display", "none");
          }
      }

  //actions every game tick: data
      function countDown() {
          //set countdown to ++
          time++;

          //convert time to mins and seconds
          currentTime = time;
          newTime = Math.floor(currentTime / 60) + ":" + (currentTime - (Math.floor(currentTime / 60) * 60));

          for (let i = 0; i < data.length; i++) {
              var curr_passenger = data[i];

              //skip if settled
              if (parseInt(curr_passenger.settled) === 1) {
                  continue;
              }

              //set visible and set real walking speed when in front of dock at pos (1,0)
              if (curr_passenger.x === 0) {
                  curr_passenger.wait_reset = curr_passenger.walkingSpeed;
              }

              if ((curr_passenger.settling === 1) && (parseInt(curr_passenger.wait_current) === 0)) {
                  curr_passenger.settled = 1;
                  if (curr_passenger.rowNo === "A") {
                      curr_passenger.y = -3;
                      if ((ifSettledPassengerAt(curr_passenger.x, curr_passenger.y + 1) || ifSettledPassengerAt(curr_passenger.x, curr_passenger.y + 2))) {
                          curr_passenger.conflict = 1;
                         conflicts++;
                      }
                  } else if (curr_passenger.rowNo === "B") {
                      curr_passenger.y = -2;
                      if (ifSettledPassengerAt(curr_passenger.x, curr_passenger.y + 1)) {
                          curr_passenger.conflict = 1;
                          conflicts++;
                      }
                  } else if (curr_passenger.rowNo === "C") {
                      curr_passenger.y = -1;
                  } else if (curr_passenger.rowNo === "D") {
                      curr_passenger.y = 1;
                  } else if (curr_passenger.rowNo === "E") {
                      curr_passenger.y = 2;
                      if (ifSettledPassengerAt(curr_passenger.x, curr_passenger.y - 1)) {
                          curr_passenger.conflict = 1;
                          conflicts++;
                      }
                  } else if (curr_passenger.rowNo === "F") {
                      curr_passenger.y = 3;
                      if ((ifSettledPassengerAt(curr_passenger.x, curr_passenger.y - 1) || ifSettledPassengerAt(curr_passenger.x, curr_passenger.y - 2))) {
                          curr_passenger.conflict = 1;
                          conflicts++;
                      }
                  } else {
                      // console.log(curr_passenger.rowNo);
                      curr_passenger.y = 6;
                  }
                  curr_passenger.visible_text = 0;
              }

              //Before move


              //move passengers or countdown
              if (curr_passenger.wait_current > 0) {
                  curr_passenger.wait_current--;
              } else {
                  if ((!adjacentCheck(i)) && (curr_passenger.settled === 0)) {
                      curr_passenger.wait_current = curr_passenger.wait_reset;
                      move(parseInt(curr_passenger.x) + 1, parseInt(curr_passenger.y), i);
                  }
              }

              //After move: set for next iteration

              //when passenger is at assigned row, add settling time on to wait time as the final countdown
              if ((curr_passenger.x === parseInt(curr_passenger.seatNo)) && (curr_passenger.settling === 0)) {
                  curr_passenger.settling = 1;
                  curr_passenger.wait_current = parseInt(curr_passenger.wait_current) + parseInt(curr_passenger.settlingTime);
              }

              //if in front of dock at positon (1,0) after move, set visible
              if (curr_passenger.x === 1) {
                  curr_passenger.visible = 1;
              }
          }
      }

  //check if there is an adjacent block: data
      function adjacentCheck(i) {
          //if first element (passenger)
          if (i === 0) {
              return false;
          }
          //objects are ordered in position ...5 4 3 2 1 0
          return ((data[i].x === (data[i - 1].x - 1)) && (data[i].y === (data[i - 1].y)));
      }

  //move to x,y coordinate by changing data: data
      function move(x, y, i) {
          data[i].x = x;
          data[i].y = y;
      }

      //check if settled passenger at x,y: data
      function ifSettledPassengerAt(x, y) {
          var tempdata = data.filter(function (d) {
              return (parseInt(d.settled) === 1);
          });
          var occupied = false;
          for (let i = 0; i < tempdata.length; i++) {
              if ((parseInt(tempdata[i].x) === x) && (parseInt(tempdata[i].y) === y)) {
                  occupied = true;
              }
          }
          return occupied;
      }

  //walking speed is inversley proportional to wait time: data
      function passengerWalkingSpeedScale() {
          data.forEach(function (d) {
              //d.walkingSpeed = Math.floor(d.walkingSpeed*10);
              d.walkingSpeed = Math.floor(1 / Math.pow(9, d.walkingSpeed) * 100) + 1;
          });
      }

  //add new properties to passenger data; x,y,wait_current,wait_reset: uses maxVisable
      function ParsePassengerData(passengerDataRaw) {
          var passengerData = passengerDataRaw;
          //set every speed to 1 till objects cross 0,0 so que has no wait time before plane boarding

          //traverse from top to bottom, passenger 0 to end
          for (var i = 0; i < passengerData.length; i++) {
              //passengers are cued from the -x to 0; 0 being the foremost passenger
              // passengerData[i].walkingSpeed = passengerData[i].walkingSpeed * 100;
              passengerData[i].x = -i;
              passengerData[i].y = 0;
              passengerData[i].wait_current = 0;
              passengerData[i].wait_reset = 0;
              passengerData[i].visible = 0;
              passengerData[i].visible_text = 1;
              passengerData[i].settling = 0;
              passengerData[i].settled = 0;
              passengerData[i].conflict = 0;

              var serialNo = passengerData[i].serialNo;

              //parse seat and row numbers from serial number
              for (let j = 0; j < serialNo.length; j++) {
                  if (!Number.isInteger(parseInt(serialNo[j]))) {
                      passengerData[i].seatNo = serialNo.substr(0, j);
                      passengerData[i].rowNo = serialNo[j];
                      break;
                  }
              }
          }
          return passengerData;
      }
}
