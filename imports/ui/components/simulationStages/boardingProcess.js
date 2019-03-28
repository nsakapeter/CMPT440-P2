const d3 = require('d3');

var svg;

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
    width = 900;
    height = 400;

    var mycolor = d3.rgb("#4e555b");
//var mycolor2 = d3.rgb("#76daff");

//create canvas
    svg = d3.select("#boardingProcess-canvas")
        .append("svg")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 "+width+" "+height)
        .style("background-color", mycolor)
        .append("g");

//zoomable canvas
    var zoom = d3.zoom()
        .scaleExtent([1, 8])
        .translateExtent([[0, 0], [width, height]])
        .extent([[0, 0], [width, height]])
        .on("zoom", function () {
            svg.attr("transform", d3.event.transform)
        });
    svg.call(zoom);

    /*
    var samplepassengerList = [{
        age: 32,
        serialNo: "13B3211",
        luggageWeight: 11,
        walkingSpeed: 0.3,
        settlingTime: 3
    }, {
        age:30,
        serialNo: "13B3212",
        luggageWeight: 3,
        walkingSpeed: 0.5,
        settlingTime: 1
    }];
    */

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
    function samplePassengerData(n){
        passengerList = [];

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

//add x,y coordinates to dict
    function ParsePassengerData(passengerDataRaw) {
        var passengerData = passengerDataRaw;
        for(let i=0;i<passengerData.length;i++){
            passengerData[i].x = i;
            passengerData[i].y = 0;
            passengerData[i].wait_current = passengerData[i].walkingSpeed*10;
            passengerData[i].wait_reset = passengerData[i].walkingSpeed*10;
        }
        return passengerData;
    }

//console.log(passengerList);
    var passengerList = ParsePassengerData(samplePassengerData(10));
    data = passengerList;
    var board_x = 200;
    var board_y = 200;
    var tickspeed = 1000;
    var num_passengers = passengerList.length;


    /*
    //draw the same and zoom out
    var scale = 80;
    zoom.scaleExtent([(width/100)/(num_passengers*2),1]);
    */

// zoom sluggish - fix
//draw smaller and zoom in
    var scale = width/(num_passengers*1.5);
    zoom.scaleExtent([1, num_passengers/5]);

//grouping for circles and text
    var circleGroup = svg.append("g").attr("x",board_x).attr("y",board_y);

//create circles
    var circles = circleGroup.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .on("mouseover", function(){d3.select(this).style("fill", "aliceblue");})
        .on("mouseout", function(){d3.select(this).style("fill", "#B8DEE6");});

//create text
    var text = circleGroup.selectAll("text")
        .data(data)
        .enter()
        .append("text");

//update attributes
    update();


//update attributes
    function update() {
        circles.data(data);
        text.data(data);

        circles.transition().duration(1000).ease(d3.easeElastic)
            .attr("cx", function(d){return (d.x * scale) + board_x;})
            .attr("cy", function(d){return (-d.y * scale) + board_y;})
            .attr("r", scale/2)
            .attr("i",function(d,i) {return i;})
            .attr("wait_current",function(d){return d.wait_current;})
            .attr("fill", "#B8DEE6");

        //Add SVG Text Element Attributes
        text.transition().duration(1000).ease(d3.easeElastic)
            .attr("x", function(d){return (d.x * scale) + board_x;})
            .attr("y", function(d){return (-d.y * scale) + board_y;})
            .text(function (d) { return d.wait_current; })
            .attr("font-family", "sans-serif")
            .attr("font-size", scale/2+"px")
            .attr("fill", "red");
    }

//countdown every game tick
    function countDown() {
        //traverse from right to left
        for(let i=data.length-1;i>=0;i--) {
            var curr_passenger = data[i];
            if(curr_passenger.wait_current>0){
                curr_passenger.wait_current--;
            } else {
                if(adjacentCheck(i)) {
                    curr_passenger.wait_current = curr_passenger.wait_reset;
                    move(parseInt(curr_passenger.x) + 1, parseInt(curr_passenger.y),i);
                }
            }
        }
        update();
    }

//check if adjacent block is present
    function adjacentCheck(i) {
        if (i===data.length-1) {return true;}
        return !(data[i].x === data[i+1].x-1);
    }

//move to x,y coordinate by changing data
    function move(x,y,i) {
        data[i].x = x;
        data[i].y = y;
    }

//set tick speed
    setInterval(function(){countDown()},tickspeed);

});
