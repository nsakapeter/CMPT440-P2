import { Template } from 'meteor/templating'
import { Meteor } from 'meteor/meteor'
import * as math from 'mathjs'
// var Calculess = require('calculess');
// var Calc = Calculess.prototype;
// var Calculess = require('calculess');


Template.Graph.helpers({


});

Template.Graph.events({

});

Template.Graph.onCreated(function() {
  Meteor.Loader.loadJs("/js/plotly.js");
  // Meteor.Loader.loadJs("/js/math.js");
  var instance;
  instance = this;
  // alert("Hi");


});

Template.Graph.onRendered(function() {
  // alert("Hi");
  var self = this;
  var template_instance = Template.instance();
  
  setTimeout(function(){
    function sin(x) {
        return Math.sin(x);
        
    }

    console.log(dataToVisualize);
    const yValues = dataToVisualize;
    const xValues = math.range(0, dataToVisualize.length, 1).toArray();

    var trace = {
      x: yValues,
      type: 'histogram'
      // autobinx: false,
      // xbins: {
      //   start: 18,
      //   size: 5,
      //   end: 78, 
      // }
    };

    var data = [trace];

    // adding x and y axis titles
    var layout = {
      xaxis: {
        title: {
          text: 'Age of Passengers'
        },
      },
      yaxis: {
        title: {
          text: 'Frequency'
        }
      }
    };

    // var chart_id = "chart-" + template_instance.random_id.get();

    self.autorun(function(){
      Plotly.newPlot("chart", data, layout, {displaylogo: false});
    }.bind(self));
    // Plotly.addTraces(chart_id, {y: [2,1,2]});

}, 1000);
});

Template.Graph.onDestroyed(function() {

});
