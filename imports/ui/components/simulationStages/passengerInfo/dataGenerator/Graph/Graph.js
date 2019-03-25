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

  // template_instance.susceptible_derivative.get();
  setTimeout(function(){
    function sin(x) {
        return Math.sin(x);
        // return template_instance.susceptible_derivative.get();
    }


    const xValues = math.range(0, appScopeVariable.noOfPassengers.get(), 1).toArray();

// Trying to check to see if checkbox for dynamic population is checked
// if it is checked, we add in the birth and death rate
// currently not working, but almost there

    const yValues = xValues.map(function (x) {

      x;

    })

    var trace = {
      x: xValues,
      y: yValues,
      mode: 'line',
      name: 'Susceptible'
    };

    var data = [trace];

    // adding x and y axis titles
    var layout = {
      xaxis: {
        title: {
          text: 'Time(days)'
        },
      },
      yaxis: {
        title: {
          text: 'Population'
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
