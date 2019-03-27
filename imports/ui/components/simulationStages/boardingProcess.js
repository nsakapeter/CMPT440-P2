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

	svg = d3.select("#boardingProcess-canvas")
		.append("svg")
		.attr("preserveAspectRatio", "xMinYMin meet")
		.attr("viewBox", "0 0 "+width+" "+height)
		.style("background-color", mycolor)
		.append("g");

	//d3.select("body").style("background-color", mycolor)

	var zoom = d3.zoom()
		.scaleExtent([0.5, 8])
		.translateExtent([[0, 0], [width, height]])
		.extent([[0, 0], [width, height]])
		.on("zoom", function () {
			svg.attr("transform", d3.event.transform)
		});

	svg.call(zoom);

	svg.append("circle")
		.attr("cx", width / 2)
		.attr("cy", height / 2)
		.attr("r", 50)
		.style("fill", "#B8DEE6");

	svg.append("circle")
		.style("stroke", "gray")
		.style("fill", "white")
		.attr("r", 40)
		.attr("cx", 0)
		.attr("cy", 0)
		.on("mouseover", function(){d3.select(this).style("fill", "aliceblue");})
		.on("mouseout", function(){d3.select(this).style("fill", "white");});

	svg.append("circle")
		.style("stroke", "gray")
		.style("fill", "white")
		.attr("r", 40)
		.attr("cx", width)
		.attr("cy", height)
		.on("mouseover", function(){d3.select(this).style("fill", "aliceblue");})
		.on("mouseout", function(){d3.select(this).style("fill", "white");});
});
