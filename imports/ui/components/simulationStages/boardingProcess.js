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
	// Feel free to change or delete any of the code you see in this editor!
	svg = d3.select("#boardingProcess-canvas")
		.append("svg")
		.attr("preserveAspectRatio", "xMinYMin meet")
		.attr("viewBox", "0 0 900 400")
		.call(d3.zoom().on("zoom", function () {
			svg.attr("transform", d3.event.transform)
		}))
		.append("g");

	svg.append("circle")
		.attr("cx", document.body.clientWidth / 2)
		.attr("cy", document.body.clientHeight / 2)
		.attr("r", 50)
		.style("fill", "#B8DEE6");

	svg.append("circle")
		.style("stroke", "gray")
		.style("fill", "white")
		.attr("r", 40)
		.attr("cx", 50)
		.attr("cy", 50)
		.on("mouseover", function(){d3.select(this).style("fill", "aliceblue");})
		.on("mouseout", function(){d3.select(this).style("fill", "white");});
});
