const d3 = require('d3');

if(Meteor.isClient){

}


Template.boardingProcess.helpers({

});

Template.boardingProcess.events({

});

Template.boardingProcess.onCreated(function() {
	var self = this;
});

Template.boardingProcess.onRendered(function() {
    width = document.body.clientWidth;
    var board_x = Math.round(document.body.clientWidth/2-(document.body.clientWidth/3)+100);
    var board_y = Math.round(document.body.clientHeight/2);
    var tickspeed = 20;
    var rawPassengerData = samplePassengerData(100);
    var data = ParsePassengerData(rawPassengerData);
    var num_passengers = data.length;
    var plane_length = num_passengers; //how long the plane isle is (how many passengers long)
    var countdown;
    var panel_play = true;

    /*TODO:

    next:
    game stop on 0 data; stop function call
    design chairs and put on grid dynamically - each game length spawns 6 chairs
    settling time stall
    exit on seat number match
    conflict on deeper seated

    gamepanel:
    reset button

    extra:
    animations - may not need since fast game tick
    on mouseover to show passenger data
    color on settling
    color on conflict
    color on settled
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
    var overlay = svg.append("g")
        .append("rect")
        .attr("fill","transparent")
        .attr("width", "100%")
        .attr("height", "100%");

//draw the same and zoom out : way 1 of 2
    var scale = 80;
    zoom.scaleExtent([(width/100)/(num_passengers*2),1]);

    /*
    //draw smaller and zoom in : way 2 of 2
    var scale = Math.floor(width/(num_passengers*1.4));
    zoom.scaleExtent([1, num_passengers/5]);
    */



//grouping for circles and text
    var circleGroup = svg.append("g").attr("x",board_x).attr("y",board_y);


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
                this.innerHTML = ">";
                clearInterval(countdown);
            } else {
                showTempPlayButton(0);
                this.innerHTML = "=";
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
            if(parseInt(data[0].visible_text) === 0) {
                data.forEach(function(d) {
                    d.visible_text = 1;
                });

            } else {
                data.forEach(function(d) {
                    d.visible_text = 0;
                });
            }
            update();
        });

        //temp play button
        d3.select("#temp-pause-play-btn")
            .style("position","fixed")
            .style("left",(document.body.clientWidth/2)+"px")
            .style("top",(document.body.clientHeight/2)+"px")
            .on("click", function(e){
                d3.select("#pause-play-btn").html("=");
                panel_play = false;
                countdown = setInterval(function(){countDown()},tickspeed);
                d3.select(this).style("display","none");
            });

        //reset button; reparse data and reset panel values
        d3.select("#reset-btn").on("click", function(e) {
            //reparse passenger data
            data = ParsePassengerData(rawPassengerData);

            //update panel
            d3.select("#time-btn-value").html(0);
            d3.select("#conflicts-btn-value").html(0);

            //play/pause button update
            panel_play = true;
            d3.select("#pause-play-btn").html(">");

			tickspeed = 20;
            clearInterval(countdown);

            //display temp play buttom
            showTempPlayButton(1);

            update();
        });

        //initial update attributes to draw objects to screen
        update();

    });


//Passenger Docks
    var dock_scale = scale/4;

//start port for passengers
    var dock_x = 0;
    var dock_y = 0;
    var passengerDock = svg.append("g")
        .append("rect")
        .attr("x", (dock_x * scale) + board_x - ((dock_scale/2)) )
        .attr("y", (-dock_y * scale)+ board_y - ((dock_scale/2)) )
        .attr("width", dock_scale)
        .attr("height", dock_scale)
        .style("fill", "#ffc205");


//end port for passengers:
    var dock2_x = num_passengers;
    var dock2_y = 0;
    var passengerDock2 = svg.append("g")
        .append("rect")
        .attr("x", (dock2_x * scale) + board_x - ((dock_scale/2)) )
        .attr("y", (-dock2_y * scale)+ board_y - ((dock_scale/2)) )
        .attr("width", dock_scale)
        .attr("height", dock_scale)
        .style("fill", "#ffc205");



























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
        //.transition().ease(d3.easeBounce).duration(1000)
        /* circleGroup.selectAll("circle").transition().duration(1000).ease(d3.easeElastic)
             .attr("cx", function(d){return (d.x * scale) + parseInt(circleGroup.attr("x"))-1;})*/

        //update circles: select, data, attributes
        var circles = circleGroup.selectAll("circle")
            .data(data.filter(function(d) { return parseInt(d.visible) === 1; }))
            .attr("cx", function(d){return ((d.x * scale) + parseInt(circleGroup.attr("x")) );})
            .attr("cy", function(d){return (-d.y * scale) + parseInt(circleGroup.attr("y"));})
            .attr("r", scale/2)
            .attr("wait_current",function(d){return d.wait_current;});

        //object behaviour for when new data is added: enter, append, attributes
        circles.enter()
            .append("circle")
            .attr("cx", function(d){return (d.x * scale) + parseInt(circleGroup.attr("x"));})
            .attr("cy", function(d){return (-d.y * scale) + parseInt(circleGroup.attr("y"));})
            .attr("r", scale/2)
            .attr("wait_current",function(d){return d.wait_current;})
            .attr("fill", "#B8DEE6");

        circles.on("mouseover", function(){d3.select(this).style("fill", "aliceblue");})
            .on("mouseout", function(){d3.select(this).style("fill", "#B8DEE6");});

        //exit behaviour: remove circles that dont have corresponding data (filtered out in update)
        circles.exit().remove();


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
        //set countdown to ++
        d3.select("#time-btn-value").html(parseInt(d3.select("#time-btn-value").html())+1);

        for(let i=0;i<data.length;i++) {
            var curr_passenger = data[i];

            //set visible and set real walking speed when in front of dock at pos (1,0)
            if(curr_passenger.x===0) {
                curr_passenger.wait_reset = curr_passenger.walkingSpeed*10;
            }

            //Before move


            //move passengers or countdown
            if(curr_passenger.wait_current>0){
                curr_passenger.wait_current--;
            } else {
                if(!adjacentCheck(i)) {
                    curr_passenger.wait_current = curr_passenger.wait_reset;
                    move(parseInt(curr_passenger.x)+1, parseInt(curr_passenger.y),i);
                }
            }


            //After move: set for next iteration


            //if in front of dock at positon (1,0) after move, set visible
            if (curr_passenger.x===1) {
                curr_passenger.visible = 1;
            }
            //if passenger reached the end of the plane
            else if (curr_passenger.x===plane_length){
                curr_passenger.visible = 0;
            }
        }
        update();
    }

//check if there is an adjacent block: data
    function adjacentCheck(i) {
        //if first element (passenger)
        if (i===0) {return false;}
        //objects are ordered in position ...5 4 3 2 1 0
        return (data[i].x === (data[i-1].x-1));
    }

//move to x,y coordinate by changing data: data
    function move(x,y,i) {
        data[i].x = x;
        data[i].y = y;
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

//generate random passenger data
    function samplePassengerData(n) {
        var passengerList = [];
        for(let i=0;i<n;i++) {
            passengerList.push({
                age: rando(18, 70),
                serialNo: rando(10, 99) + rando("A", "Z") + rando(1000, 9999),
                luggageWeight: rando(1, 40),
                walkingSpeed: rando(1, 9) / 10,
                settlingTime: rando(1, 5)
            });
        }
        return passengerList;
    }

//add new properties to passenger data; x,y,wait_current,wait_reset: uses maxVisable
    function ParsePassengerData(passengerDataRaw) {
        var passengerData = passengerDataRaw;
        //set every speed to 1 till objects cross 0,0 so que has no wait time before plane boarding

        //traverse from top to bottom, passenger 0 to end
        for(var i=0;i<passengerData.length;i++){
            //passengers are cued from the -x to 0; 0 being the foremost passenger
            passengerData[i].x = -i;
            passengerData[i].y = 0;
            passengerData[i].wait_current = 0;
            passengerData[i].wait_reset = 0;
            passengerData[i].visible = 0;
            passengerData[i].visible_text = 1;
        }
        return passengerData;
    }
});
