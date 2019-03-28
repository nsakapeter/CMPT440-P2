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

	/*svg.append("circle")
            .style("stroke", "gray")
            .style("fill", "white")
            .attr("r", 40)
            .attr("cx", 0)
            .attr("cy", 0)
            .on("mouseover", function(){d3.select(this).style("fill", "aliceblue");})
            .on("mouseout", function(){d3.select(this).style("fill", "white");});
            */

	var data = [{
		"x": 0,
		"y": 1,
		"r": 50,
		"speed" : 7
	}, {
		"x": 0,
		"y": 0,
		"r": 30,
		"speed" : 3
	}, {
		"x": -2,
		"y": 0,
		"r": 40,
		"speed" : 4
	}];

	var circles = svg.selectAll("circle")
		.data(data)
		.enter()
		.append("circle")
		.attr("cx", 200)
		.attr("cy", function (d, i) {
			return i * 100 + 60;
		})
		.attr("r", function(d){
			return d.r;
		})
		.attr("i",function(d,i) {return i;})
		.attr("speed",function(d){return d.speed;})
		.attr("fill", "#B8DEE6");

	//circles event
	circles.on("mousedown",moveCircles);

	var text = svg.selectAll("text")
		.data(data)
		.enter()
		.append("text");

	//Add SVG Text Element Attributes
	var textLabels = text
		.attr("x", 200)
		.attr("y", function (d, i) {
			return i * 100 + 60;
		})
		.text(function (d) { return d.speed; })
		.attr("font-family", "sans-serif")
		.attr("font-size", "20px")
		.attr("fill", "red");


	function moveCircles() {
		var my_i = d3.select(this).attr("i");

		var label = textLabels.filter(function(d,i) {return i===parseInt(my_i,10)});
		var circle = d3.select(this);

		//move this object
		circle.transition().duration(1500)
			.attr("cx",parseInt(circle.attr("cx"),10)+200);

		//move text label matching index
		label
			.transition().duration(1500)
			.attr("x",parseInt(label.attr("x"),10)+200);
	}
	//createPassenger(0,1,60,10);
	//createPassenger(-2,0,6,70);
	//createPassenger(-3,0,60,30);

	/*
    function createPassenger(x_pos,y_pos,pScale,speed) {
        var x = x_pos;
        var y = y_pos;
        var cx = (width/2)+(x*pScale*2);
        var cy = (height/2)+(y*pScale*2);
        //var currPassenger = d3.select(this);

        svg.append("circle")
                .attr("x",x)
                .attr("y",x)
                .attr("cx", cx)
                .attr("cy", cy)
                .attr("r", pScale)
                .on("mousedown",function(){
                    //d3.select(this).transition().attr("cx",d3.select(this).attr("cx")+10);
                    d3.select(this).transition().duration(1000).attr("cx",cx+10);
                })
                //.attr("advance",function(){})
                .style("fill", "#B8DEE6");

    }
    */
});
