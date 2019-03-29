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
    width = document.body.clientWidth;
    width = document.body.clientWidth;
//height = 400;
    var board_x = document.body.clientWidth/2-(document.body.clientWidth/3)+500;
    var board_y = document.body.clientHeight/2;
    var tickspeed = 1000;
    var max_visible = 5;
    var rawPassengerData = samplePassengerData(10);
    var data = ParsePassengerData(rawPassengerData);
    var num_passengers = data.length;

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

    /*
    //draw the same and zoom out
    var scale = 80;
    zoom.scaleExtent([(width/100)/(num_passengers*2),1]);
    */

// zoom sluggish - fix
//draw smaller and zoom in
    var scale = Math.floor(width/(num_passengers*1.4));
    zoom.scaleExtent([1, num_passengers/5]);



//grouping for circles and text
//var circleGroup = svg.append("g").attr("x",board_x-(scale*max_visible*2)+scale).attr("y",board_y);
    var circleGroup = svg.append("g").attr("x",board_x).attr("y",board_y);

//create circles
    var circles = circleGroup.selectAll("circle")
    //.data(data)
        .data(data.filter(function(d) { return d.visible == 1; }))
        .enter()
        .append("circle")
        .on("mouseover", function(){d3.select(this).style("fill", "aliceblue");})
        .on("mouseout", function(){d3.select(this).style("fill", "#B8DEE6");});

//create text
    var text = circleGroup.selectAll("text")
    //.data(data.filter(function(d) { return d.visible == "1"; }))
        .data(data)
        .enter()
        .append("text");


    text.attr("class","centre-text");

//initial update attributes
    update();



//start port for passengers
    var dock_x = 0;
    var dock_y = 0;
    var dock_scale = scale/6;
    var passengerDock = svg.append("g")
        .append("rect")
        .attr("x", (dock_x * dock_scale) + board_x - ((dock_scale/2)) )
        .attr("y", (-dock_y * dock_scale)+ board_y - ((dock_scale/2)) )
        .attr("width", dock_scale)
        .attr("height", dock_scale)
        .style("fill", "#ffc205")


//set tick speed
    setInterval(function(){countDown()},tickspeed);









//
//update attributes: circles,data,text
    function update() {
        circles.transition().duration(1000).ease(d3.easeElastic)
            .attr("cx", function(d){return (d.x * scale) + parseInt(circleGroup.attr("x"));})
            .attr("cy", function(d){return (-d.y * scale) + parseInt(circleGroup.attr("y"));})
            .attr("r", scale/2)
            .attr("i",function(d,i) {return i;})
            .attr("wait_current",function(d){return d.wait_current;})
            .attr("fill", "#B8DEE6");

        //Add SVG Text Element Attributes
        text.transition().duration(1000).ease(d3.easeElastic)
            .attr("x", function(d){return (d.x * scale) + parseInt(circleGroup.attr("x"));})
            .attr("y", function(d){return (-d.y * scale) + parseInt(circleGroup.attr("y"));})
            .text(function (d) { return d.wait_current; })
            .attr("font-family", "sans-serif")
            .attr("font-size", scale/2+"px")
            .attr("fill", "red");

        //circles.data(data);
        circles.data(data.filter(function(d) { return d.visible === 1; }));
        //text.data(data.filter(function(d) { return d.visible == "1"; }));
        text.data(data);
    }

//countdown every game tick: data
    function countDown() {

        for(let i=0;i<data.length;i++) {
            var curr_passenger = data[i];
            if(curr_passenger.wait_current>0){
                curr_passenger.wait_current--;
            } else {
                if(!adjacentCheck(i)) {
                    curr_passenger.wait_current = curr_passenger.wait_reset;
                    move(parseInt(curr_passenger.x) + 1, parseInt(curr_passenger.y),i);
                }
            }
            if(curr_passenger.x>0) {
                curr_passenger.visible = 1;
            }
        }
        update();
    }

//check if there is an adjacent block: data
    function adjacentCheck(i) {
        //if first element (passenger)
        if (i===0) {return false;}
        //if current object x position equals next object (lower in index) - 1
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

//add new properties to passenger data; x,y,wait_current,wait_reset: uses maxVisable
    function ParsePassengerData(passengerDataRaw) {
        var passengerData = passengerDataRaw;

        //traverse from top to bottom
        for(let i=0;i<passengerData.length;i++){
            //passengers are cued from the -x to 0; 0 being the foremost passenger
            passengerData[i].x = -i;
            passengerData[i].y = 0;
            passengerData[i].wait_current = passengerData[i].walkingSpeed*10;
            passengerData[i].wait_reset = passengerData[i].walkingSpeed*10;
            passengerData[i].visible = 1;
        }
        return passengerData;
    }
});
