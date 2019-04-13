const d3 = require('d3');


if(Meteor.isClient){

}


Template.boardingProcess.helpers({
	hasResults(){
		return appScopeVariable.results.get();
	}
});

Template.boardingProcess.events({
	// 'click #save-result'(event, instance) {
  //   // event.preventDefault();
  //   // event.stopPropagation();
	//
  // }
});

Template.boardingProcess.onCreated(function() {
	var self = this;

});

Template.boardingProcess.onRendered(function() {

    width = document.body.clientWidth;
    var board_x = Math.round(document.body.clientWidth/2-(document.body.clientWidth/3)+100);
//var board_y = Math.round(document.body.clientHeight/2);
    var board_y = Math.round(Math.max( window.innerHeight, document.body.clientHeight )/2);
    var countdown;
    var panel_play = true;
    var tickspeed = 20; //interval of a game tick in miliseconds

    var conflictStall = 10;
    var conflicts = 0;
    var time = 0;
    var currentTime = 0;
    var newTime = 0;

    var useReactiveVar = true;
    var plane_capacity;
    var num_passengers;
    var rawPassengerData;

    if (useReactiveVar){
        plane_capacity = appScopeVariable.planeCapacity.get();
        num_passengers = appScopeVariable.noOfPassengers.get();
        rawPassengerData = appScopeVariable.passengers.get();
    } else {
        num_passengers = 60;
        plane_capacity = num_passengers;
        rawPassengerData = samplePassengerData(num_passengers, plane_capacity);
    }

    console.log(rawPassengerData);
    var data = ParsePassengerData(rawPassengerData);
    passengerWalkingSpeedScale();

    /*TODO:

    next:
    run experiment to skip, use while(), same condition for auto stop

    bugs:
    should need to filter out settled passengers before adjacent check
    settled passenger HUD
    */

//set up zoom
    zoom_var = 1;
    zoomed = ()=>{
        const {x,y,k} = d3.event.transform
        let t = d3.zoomIdentity
        t =  t.translate(x,y).scale(k).translate(zoom_var,zoom_var)
        svg.attr("transform", t)
    }
    var zoom = d3.zoom()
        .scaleExtent([1, 8])
        .on("zoom", zoomed);

//set up svg inside div
    var svg = d3.select("#boardingProcess-canvas")
        .append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .call(zoom)
        .append("g")
        .attr('transform',"translate("+zoom_var+","+zoom_var+")");

//overlay so zoom can be used on any point and not just objects
    var overlay = svg//.append("g")
        .append("rect")
        .attr("class","zoom_overlay")
        .attr("fill","transparent")
        .attr("width", "150%")
        .attr("height", "150%");

//draw the same and zoom out : way 1 of 2
    var scale = 80;
    zoom.scaleExtent([(width/100)/(num_passengers*2),1]);

    /*
    //draw smaller and zoom in : way 2 of 2
    var scale = Math.floor(width/(num_passengers*1.4));
    zoom.scaleExtent([1, num_passengers/5]);
    */

//groupings for shapes
    var circleGroup = svg.append("g").attr("class","circle_group").attr("x",board_x).attr("y",board_y);
    var planeGroup = svg.append("g").attr("class","plane_group").attr("x",board_x).attr("y",board_y);
    var dockGroup = svg.append("g").attr("class","dock_group").attr("x",board_x).attr("y",board_y);
    var hudGroup = svg.append("g").attr("class","hud_group").attr("x",board_x).attr("y",board_y);
    var hudText;









    var domReady = function(callback) {
        document.readyState === "interactive" || document.readyState === "complete" ? callback() : document.addEventListener("DOMContentLoaded", callback);
    };

    domReady(function() {
        //Panel Bindings

        //skip button
        d3.select("#skip-btn").on("click", function(e){
            showTempPlayButton(0);
            countDown();
        });

        //play/pause button
        d3.select("#pause-play-btn").on("click", function(e){
            if(!panel_play) {
                this.innerHTML = "Play";
                clearInterval(countdown);
            } else {
                showTempPlayButton(0);
                this.innerHTML = "Pause";
                countdown = setInterval(function(){countDown()},tickspeed);
            }
            panel_play = !panel_play;
        });

        //speed button
        d3.select("#speed-btn").on("click", function(e){
            tickspeed = 1000;
            clearInterval(countdown);
            if(!panel_play) {
                countdown = setInterval(function(){countDown()},tickspeed);
            }
        });

        //passenger text toggle
        d3.select("#passenger_text-btn").on("click", function(e) {
            var tempdata = data.filter(function(d) { return (parseInt(d.settled) === 0); });
            if (tempdata.length===0) {return;}

            if(parseInt(tempdata[0].visible_text) === 0) {
                tempdata.forEach(function(d) {
                    d.visible_text = 1;
                });

            } else {
                tempdata.forEach(function(d) {
                    d.visible_text = 0;
                });
            }

            update();
        });

        //temp play button
        d3.select("#temp-pause-play-btn")
            .on("click", function(e){
                d3.select("#pause-play-btn").html("Pause");
                panel_play = false;
                countdown = setInterval(function(){countDown()},tickspeed);
                d3.select(this).style("display","none");
                simulationBegan.set(true);
            });


        //reset button; reparse data and reset panel values
        d3.select("#reset-btn").on("click", function(e) {
            //reparse passenger data
            data = ParsePassengerData(rawPassengerData);

            //update panel
            time = 0;
            conflicts = 0;
            d3.select("#time-btn-value").html(time);
            d3.select("#hidden-time-btn-value").html(time);
            d3.select("#conflicts-btn-value").html(conflicts);

            //play/pause button update
            panel_play = true;
            d3.select("#pause-play-btn").html("Play");

            tickspeed = 20;
            clearInterval(countdown);

            //display temp play buttom
            showTempPlayButton(1);

            update();
        });

        //initial update attributes to draw objects to screen
        update();

        d3.select("#save-result")
            .on("click", function(e){
                var alreadySavedResults = appScopeVariable.results.get();
                alreadySavedResults.push({
                    "name": appScopeVariable.currentlySimulatedProcess.get(),
                    "boardingTime": d3.select("#hidden-time-btn-value").html(),
                    "conflicts": d3.select("#conflicts-btn-value").html()
                });
                appScopeVariable.results.set(alreadySavedResults);
                Bert.alert({
                    title: 'Saved',
                    message: 'Results successfully saved',
                    type: 'success',
                    style: 'growl-bottom-right',
                    icon: 'fas fa-music'
                });
                console.log(appScopeVariable.results.get());
            });
    });


// - Shapes -
//Passenger Docks
    var dock_scale = scale/4;

//start port for passengers
    var dock_x = 0;
    var dock_y = 0;
    var passengerDock = dockGroup.append("g")
        .append("rect")
        .attr("x", (dock_x * scale) + parseInt(dockGroup.attr("x")) - ((dock_scale/2)) )
        .attr("y", (-dock_y * scale)+ parseInt(dockGroup.attr("y")) - ((dock_scale/2)) )
        .attr("width", dock_scale)
        .attr("height", dock_scale)
        .style("fill", "#ffc205");

//end port for passengers:
    var dock2_x = (plane_capacity/6) + 1;

    var dock2_y = 0;
    var passengerDock2 = dockGroup.append("g")
        .append("rect")
        .attr("x", (dock2_x * scale) + parseInt(dockGroup.attr("x")) - ((dock_scale/2)) )
        .attr("y", (-dock2_y * scale)+ parseInt(dockGroup.attr("y")) - ((dock_scale/2)) )
        .attr("width", dock_scale)
        .attr("height", dock_scale)
        .style("fill", "#ffc205");

//Passenger Chairs
    var chair_scale = scale/1.6;

    function chairAt(chair_x,chair_y) {
        var passengerChair = planeGroup.append("g");

        //ass cushion
        passengerChair
            .append("rect")
            .attr("x", (chair_x * scale) + parseInt(planeGroup.attr("x")) - (chair_scale / 2))
            .attr("y", (-chair_y * scale) + parseInt(planeGroup.attr("y")) - (chair_scale / 2))
            .attr("width", chair_scale)
            .attr("height", chair_scale)
            .attr('fill', '#49B2EA');

        //left arm cushion
        passengerChair
            .append("rect")
            .attr("x", (chair_x * scale) + parseInt(planeGroup.attr("x")) - (chair_scale / 2))
            .attr("y", (-chair_y * scale) + parseInt(planeGroup.attr("y")) - (chair_scale / 2) - (chair_scale / 3))
            .attr("width", chair_scale * 1.25)
            .attr("height", chair_scale / 3)
            .attr('fill', '#B2B2B2');

        //right arm cushion
        passengerChair
            .append("rect")
            .attr("x", (chair_x * scale) + parseInt(planeGroup.attr("x")) - (chair_scale/2))
            .attr("y", (-chair_y * scale) + parseInt(planeGroup.attr("y")) - (chair_scale/2) + chair_scale)
            .attr("width", chair_scale * 1.25)
            .attr("height", chair_scale / 3)
            .attr('fill', '#B2B2B2');

        //back cushion
        var v_stretch = 1.7;
        passengerChair
            .append("rect")
            .attr("x", (chair_x * scale) + parseInt(planeGroup.attr("x")) - (chair_scale / 2) - (chair_scale /2))
            .attr("y", (-chair_y * scale) + parseInt(planeGroup.attr("y")) - (v_stretch * chair_scale * 0.5))
            .attr("width", chair_scale / 2)
            .attr("height", chair_scale * v_stretch)
            .attr("stroke", "#3D9CD5")
            .attr("stroke-width", "3px")
            .attr('fill', '#49B2EA');
    }


//make chairs
    for (var i = 1; i < 4; i++) {
        for (var j = 1; j <= (plane_capacity / 6); j++) {
            chairAt(j,i);
        }
    }

    for (var i = 1; i <= (plane_capacity / 6); i++) {
        for (var j = -1; j > -4; j--) {
            chairAt(i,j);
        }
    }

//set planegroup to back of canvas
    planeGroup.lower();
//initial update attributes to draw objects to screen
    update();




//tooltip
    var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);


// -------------------- Functions


    function showTempPlayButton(toggle) {
        if (toggle === 1) {
            d3.select("#temp-pause-play-btn").style("display", "initial");
        } else {
            d3.select("#temp-pause-play-btn").style("display", "none");
        }
    }

//update objects: data
    function update() {

        //in queue passengers
        //update circles: select, data, attributes
        var circles = circleGroup.selectAll("circle")
        //.data(data.filter(function(d) { return ( (parseInt(d.visible) === 1) && (parseInt(d.settled) === 0) && (parseInt(d.settling) === 0) ); }))
            .data(data.filter(function(d) { return ((parseInt(d.visible) === 1) && (parseInt(d.settled) === 0)); }))
            .attr("cx", function(d){return (d.x * scale) + parseInt(circleGroup.attr("x"));})
            .attr("cy", function(d){return (-d.y * scale) + parseInt(circleGroup.attr("y"));})
            .attr("r", scale/2)
            .attr("wait_current",function(d){return d.wait_current;})
            .style("fill", function(d){ return d.settling===1 ? '#6bff80' : '#B8DEE6' });


        //object behaviour for when new data is added: enter, append, attributes
        circles.enter()
            .append("circle")
            .attr("cx", function(d){return (d.x * scale) + parseInt(circleGroup.attr("x"));})
            .attr("cy", function(d){return (-d.y * scale) + parseInt(circleGroup.attr("y"));})
            .attr("r", scale/2)
            .attr("wait_current",function(d){return d.wait_current;})
            .style("fill", function(d){ return d.settling===1 ? '#6bff80' : '#B8DEE6' })
            .on("mouseover", function(d) {
                d3.select(this).style("fill", "aliceblue");
                hudText = hudGroup
                    .append("text")
                    .attr("class","centre-text")
                    .attr("x", d3.select(this).attr("cx"))
                    .attr("y", parseInt(d3.select(this).attr("cy"))-scale/1.5)
                    .text(d.serialNo)
                    .attr("font-family", "sans-serif")
                    .attr("font-size", scale/2+"px")
                    .attr("stroke", "aliceblue")
                    .attr("fill", "#718374");
            })
            .on("mouseout", function(){
                d3.select(this).style("fill", function(d){ return d.settling===1 ? '#6bff80' : '#B8DEE6' });
                hudText.remove();
            });

        //exit behaviour: remove circles that dont have corresponding data (filtered out in update)
        circles.exit().remove();

        //settled passengers
        //update text: select, data, attributes
        var circle2 = planeGroup.selectAll("circle")
            .data(data.filter(function(d) { return (parseInt(d.settled) === 1); }))
            .attr("serialNo",function(d){return d.serialNo;})
            .style("fill", function(d){ return d.conflict===1 ? '#ff5456' : '#E0995E' })
            .attr("cx", function(d){return (d.x * scale) + parseInt(circleGroup.attr("x"));})
            .attr("cy", function(d){return (-d.y * scale) + parseInt(circleGroup.attr("y"));});
        //.attr("fill", "#E0995E");

        //text behaviour for when new data is added: enter, append, attributes
        circle2.enter()
            .append("circle")
            .attr("cx", function(d){return (d.x * scale) + parseInt(circleGroup.attr("x"));})
            .attr("cy", function(d){return (-d.y * scale) + parseInt(circleGroup.attr("y"));})
            .attr("r", Math.floor(scale/3))
            .attr("wait_current",function(d){return d.wait_current;})
            .style("fill", function(d){ return d.conflict===1 ? '#ff5456' : '#E0995E' });
        //.attr("fill", "#E0995E");


        circle2.on("mouseenter", function(d) {
            d3.select(this).style("fill", "aliceblue");
            hudText = hudGroup
                .append("text")
                .attr("class","centre-text")
                .attr("x", d3.select(this).attr("cx"))
                .attr("y", parseInt(d3.select(this).attr("cy"))-scale/1.5)
                .text(d.serialNo)
                .attr("font-family", "sans-serif")
                .attr("font-size", scale/2+"px")
                .attr("fill", "#718374");
        })
            .on("mouseleave", function(){
                d3.select(this).style("fill", "#B8DEE6");
                hudText.remove();
            });

        //exit behaviour: remove text
        circle2.exit().remove();



        //passenger text
        //update text: select, data, attributes
        var text = circleGroup.selectAll("text")
            .data(data.filter(function(d) { return ((parseInt(d.visible) === 1) && (parseInt(d.visible_text) === 1)); }))
            .attr("class","centre-text")
            .attr("x", function(d){return (d.x * scale) + parseInt(circleGroup.attr("x"));})
            .attr("y", function(d){return (-d.y * scale) + parseInt(circleGroup.attr("y"));})
            .text(function (d) { return d.wait_current; })
            .attr("font-family", "sans-serif")
            .attr("font-size", scale/2+"px")
            .attr("fill", "red");


        //text behaviour for when new data is added: enter, append, attributes
        text.enter()
            .append("text")
            .attr("class","centre-text")
            .attr("x", function(d){return (d.x * scale) + parseInt(circleGroup.attr("x"));})
            .attr("y", function(d){return (-d.y * scale) + parseInt(circleGroup.attr("y"));})
            .text(function (d) { return d.wait_current; })
            .attr("font-family", "sans-serif")
            .attr("font-size", scale/2+"px")
            .attr("fill", "red");


        //exit behaviour: remove text
        text.exit().remove();

    }

//actions every game tick: data
    function countDown() {

        //end of simulation: all passengers are visible and settled. click pause and stop interval
        if((data.filter(function(d) { return ((parseInt(d.visible) === 0) || (parseInt(d.settled) === 0)); })).length===0){
            d3.select('#pause-play-btn').dispatch('click');
            clearInterval(countdown);
        }
        //set countdown to ++
        time++;
        d3.select("#hidden-time-btn-value").html(time);
        //convert time to mins and seconds
        currentTime = time;
        newTime = Math.floor(currentTime / 60) + ":" + (currentTime - (Math.floor(currentTime / 60) * 60));
        d3.select("#time-btn-value").html(newTime);

        for(let i=0;i<data.length;i++) {
            var curr_passenger = data[i];

            //skip if settled
            if(parseInt(curr_passenger.settled)===1){continue;}

            //set visible and set real walking speed when in front of dock at pos (1,0)
            if(curr_passenger.x===0) {
                curr_passenger.wait_reset = curr_passenger.walkingSpeed;
            }

            if ((curr_passenger.settling === 1)&&(parseInt(curr_passenger.wait_current)===0)) {
                curr_passenger.settled = 1;
                if(curr_passenger.rowNo==="A") {
                    curr_passenger.y = -3;
                    if((ifSettledPassengerAt(curr_passenger.x,curr_passenger.y+1)||ifSettledPassengerAt(curr_passenger.x,curr_passenger.y+2))){
                        curr_passenger.conflict = 1;
                        conflicts++;
                        time+=conflictStall;
                        d3.select("#conflicts-btn-value").html(conflicts);
                    }
                } else if (curr_passenger.rowNo==="B") {
                    curr_passenger.y = -2;
                    if(ifSettledPassengerAt(curr_passenger.x,curr_passenger.y+1)){
                        curr_passenger.conflict = 1;
                        conflicts++;
                        time+=conflictStall;
                        d3.select("#conflicts-btn-value").html(conflicts);
                    }
                } else if (curr_passenger.rowNo==="C") {
                    curr_passenger.y = -1;
                } else if (curr_passenger.rowNo==="D") {
                    curr_passenger.y = 1;
                } else if (curr_passenger.rowNo==="E") {
                    curr_passenger.y = 2;
                    if(ifSettledPassengerAt(curr_passenger.x,curr_passenger.y-1)){
                        curr_passenger.conflict = 1;
                        conflicts++;
                        time+=conflictStall;
                        d3.select("#conflicts-btn-value").html(conflicts);
                    }
                } else if (curr_passenger.rowNo==="F") {
                    curr_passenger.y = 3;
                    if((ifSettledPassengerAt(curr_passenger.x,curr_passenger.y-1)||ifSettledPassengerAt(curr_passenger.x,curr_passenger.y-2))){
                        curr_passenger.conflict = 1;
                        conflicts++;
                        time+=conflictStall;
                        d3.select("#conflicts-btn-value").html(conflicts);
                    }
                } else {
                    // console.log(curr_passenger.rowNo);
                    curr_passenger.y=6;
                }
                curr_passenger.visible_text = 0;
            }

            //Before move


            //move passengers or countdown
            if(curr_passenger.wait_current>0){
                curr_passenger.wait_current--;
            } else {
                if( (!adjacentCheck(i))&&(curr_passenger.settled===0)) {
                    curr_passenger.wait_current = curr_passenger.wait_reset;
                    move(parseInt(curr_passenger.x)+1, parseInt(curr_passenger.y),i);
                }
            }


            //After move: set for next iteration


            //when passenger is at assigned row, add settling time on to wait time as the final countdown
            if ((curr_passenger.x === parseInt(curr_passenger.seatNo))&&(curr_passenger.settling===0)) {
                curr_passenger.settling = 1;
                curr_passenger.wait_current = parseInt(curr_passenger.wait_current)+parseInt(curr_passenger.settlingTime);
            }

            //if in front of dock at positon (1,0) after move, set visible
            if (curr_passenger.x===1) {
                curr_passenger.visible = 1;
            } else if (curr_passenger.x===dock2_x) {
                curr_passenger.visible = 0;
            }

            //if passenger reached the end of the plane
            //else if (curr_passenger.x===parseInt(passengerDock2.attr("x"))){
        }
        update();
    }

//check if there is an adjacent block: data
    function adjacentCheck(i) {
        //if first element (passenger)
        if (i===0) {return false;}
        //objects are ordered in position ...5 4 3 2 1 0
        return ((data[i].x === (data[i-1].x-1))&&(data[i].y === (data[i-1].y)));
    }

//move to x,y coordinate by changing data: data
    function move(x,y,i) {
        data[i].x = x;
        data[i].y = y;
    }

    function ifSettledPassengerAt(x,y) {
        var tempdata = data.filter(function(d) { return (parseInt(d.settled) === 1);});
        var occupied = false;
        for (let i=0; i<tempdata.length;i++){
            if ((parseInt(tempdata[i].x)===x)&&(parseInt(tempdata[i].y)===y)){
                occupied = true;
            }
        }
        return occupied;
    }

//min max function
    function rando(min_i,max_i) {
        //letters
        var min = min_i;
        var max = max_i;

        if (((min > '@')&&(min < '[')) || ((min > '`')&& (min<'{'))) {
            min = min.charCodeAt(0);
            max = max.charCodeAt(0);
            return String.fromCharCode(Math.floor(Math.random() * (+max - +min)) + +min);
        }
        return Math.floor(Math.random() * max) + min;
    }

//generate smart random passenger data
    function samplePassengerData(n,capacity) {
        if (n>capacity) {return null;}

        var passengerList = [];
        var seatLetter = ["A","B","C","D","E","F"];
        var possibleSeats = [];

        //generate list of possible seat numbers
        for (let i=0;i<capacity;i++){
            possibleSeats.push((Math.floor(i/6)+1)+seatLetter[i%seatLetter.length]);
        }


        //randomly assign seat numbers to passengers, delete each seat assigned
        for (let i=0;i<n;i++){
            var temp_index = Math.floor(Math.random()*possibleSeats.length);
            passengerList.push({
                age: rando(18, 70),
                luggageWeight: rando(1, 40),
                walkingSpeed: rando(100, 150)/100,
                settlingTime: rando(1, 5),
            });

            passengerList[i].serialNo = possibleSeats[temp_index] + passengerList[i].age + passengerList[i].luggageWeight;

            possibleSeats.splice( possibleSeats.indexOf(possibleSeats[temp_index]), 1 );
        }
        //console.log(passengerList);
        return passengerList;
    }

//walking speed is inversley proportional to wait time.
    function passengerWalkingSpeedScale(){
        data.forEach(function(d) {
            //d.walkingSpeed = Math.floor(d.walkingSpeed*10);
            d.walkingSpeed = Math.floor(1/Math.pow(9,d.walkingSpeed)*100)+1;
        });
    }

//add new properties to passenger data; x,y,wait_current,wait_reset: uses maxVisable
    function ParsePassengerData(passengerDataRaw) {
        var passengerData = passengerDataRaw;
        //set every speed to 1 till objects cross 0,0 so que has no wait time before plane boarding

        //traverse from top to bottom, passenger 0 to end
        for(var i=0;i<passengerData.length;i++){
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
            for(let j=0;j<serialNo.length;j++) {
                if (!Number.isInteger(parseInt(serialNo[j]))) {
                    passengerData[i].seatNo = serialNo.substr(0, j);
                    passengerData[i].rowNo = serialNo[j];
                    break;
                }
            }
        }
        return passengerData;
    }
});
