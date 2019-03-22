import { Template } from 'meteor/templating'
import { Meteor } from 'meteor/meteor'
import * as math from 'mathjs'
// var Calculess = require('calculess');
// var Calc = Calculess.prototype;
// var Calculess = require('calculess');


Template.Graph.helpers({
  modelName () {
    return Template.instance().modelName.get();
  },
  random_id(){
    return Template.instance().random_id.get();
  }


});

Template.Graph.events({

});

Template.Graph.onCreated(function() {
  Meteor.Loader.loadJs("/js/plotly.js");
  // Meteor.Loader.loadJs("/js/math.js");
  var instance;
  instance = this;
  var context_data = this.data;
  // alert("Hi");
  instance.susceptible_population = new ReactiveVar(parseFloat(context_data.s));
  instance.infected_population = new ReactiveVar(parseFloat(context_data.i));
  instance.recovered_population = new ReactiveVar(parseFloat(context_data.r));
  instance.total_population = new ReactiveVar(instance.susceptible_population.get() + instance.infected_population.get() + instance.recovered_population.get());
  instance.beta = new ReactiveVar(parseFloat(context_data.beta));
  instance.gamma = new ReactiveVar(parseFloat(context_data.gamma));
  instance.birth_rate = new ReactiveVar(parseFloat(context_data.birth));
  instance.death_rate = new ReactiveVar(parseFloat(context_data.death));
  instance.days = new ReactiveVar(parseFloat(context_data.days));
  instance.percent_immune = new ReactiveVar(parseFloat(context_data.immunity));
  instance.modelName = new ReactiveVar("SIRS");
  instance.random_id = new ReactiveVar(Math.random().toString(36).slice(2));

  if (instance.percent_immune.get() > 0) {
    //logic is % of susceptible people immunized
    instance.recovered_population.set(instance.susceptible_population.get() * instance.percent_immune.get());

    //also need to update susceptible
    instance.susceptible_population.set(instance.susceptible_population.get() - instance.recovered_population.get());

  }

  instance.modelName.set("SIR");

  Meteor.call('callScript', function(err, result) {
    if (err) {
      console.warn("Error : ", err)
    }
    console.log(result);
  });



});

Template.Graph.onRendered(function() {
  // alert("Hi");
  var self = this;
  var template_instance = Template.instance();
  console.log(template_instance.days.get());
  // template_instance.susceptible_derivative.get();
  setTimeout(function(){
    function sin(x) {
        return Math.sin(x);
        // return template_instance.susceptible_derivative.get();
    }

    var B, k, initInf, initPop, ds, dr, di, sus, inf, rec, timeStep, time;

    var bRate, dRate;

    var if_dynamic = document.getElementById("switch3").checked;

    //console.log(if_dynamic);

    B = template_instance.beta.get();
    k = template_instance.gamma.get();

    sus = template_instance.susceptible_population.get();
    inf = template_instance.infected_population.get();
    rec = template_instance.recovered_population.get();
    pop = sus + inf + rec;
    console.log("sus" + sus);
    console.log("inf" + inf);
    console.log("rec" + rec);
    console.log("Popuplation" + pop);

    bRate = template_instance.birth_rate.get();
    dRate = template_instance.death_rate.get();
    const xValues = math.range(0, template_instance.days.get(), 1).toArray();

// Trying to check to see if checkbox for dynamic population is checked
// if it is checked, we add in the birth and death rate
// currently not working, but almost there

const yValues = xValues.map(function (x) {

      if (if_dynamic == true)
      {
        template_instance.modelName.set("SIR w/Dynamics")
        ds = (bRate * pop) - ((B * sus * inf) / pop) - (dRate * sus);
        sus += ds;
        di = ((B * sus * inf) / pop) - (k * inf) - (dRate * inf);
        inf += di;
        dr = (k * inf) - (dRate * rec);
        rec += dr;
        //return sus;
      } else {
        ds = -B * (sus * inf / pop);
        sus += ds;
        di = (B * (sus * inf / pop) - (k * inf));
        inf += di;
        dr = k * inf;
        rec += dr;
        //return sus;
        console.log("Susceptible" + sus);
      }

      return sus;

    })

    // calculating di
    // have to reassign SIR for our model to work
    sus = template_instance.susceptible_population.get();
    inf = template_instance.infected_population.get();
    rec = template_instance.recovered_population.get();
    const yValuesI = xValues.map(function (x) {

      if (if_dynamic == true)
      {
        template_instance.modelName.set("SIR w/Dynamics")
        ds = (bRate * pop) - ((B * sus * inf) / pop) - (dRate * sus);
        sus += ds;
        di = ((B * sus * inf) / pop) - (k * inf) - (dRate * inf);
        inf += di;
        dr = (k * inf) - (dRate * rec);
        rec += dr;
        //return inf;
      } else {
        ds = -B * (sus * inf / pop);
        sus += ds;
        di = (B * (sus * inf / pop) - (k * inf));
        inf += di;
        dr = k * inf;
        rec += dr;
        //return inf;
      }
      return inf;
    })


    // calculating dr
    sus = template_instance.susceptible_population.get();
    inf = template_instance.infected_population.get();
    rec = template_instance.recovered_population.get();
    const yValuesR = xValues.map(function (x) {
      if (if_dynamic == true)
      {
        template_instance.modelName.set("SIR w/Dynamics")
        ds = (bRate * pop) - ((B * sus * inf) / pop) - (dRate * sus);
        sus += ds;
        di = ((B * sus * inf) / pop) - (k * inf) - (dRate * inf);
        inf += di;
        dr = (k * inf) - (dRate * rec);
        rec += dr;
        //return rec;
      } else {
        ds = -B * (sus * inf / pop);
        sus += ds;
        di = (B * (sus * inf / pop) - (k * inf));
        inf += di;
        dr = k * inf;
        rec += dr;
        //return rec;
      }
      return rec;
    })


    // console.log(xValues);
    // console.log(yValues);
    // console.log(yValuesI);
    // console.log(yValuesR);

    // drawing the trace lines on the graph for the susceptible, infected and recovered
    var trace = {
      x: xValues,
      y: yValues,
      mode: 'line',
      name: 'Susceptible'
    };
    var trace2 = {
      x: xValues,
      y: yValuesI,
      mode: 'line',
      name: 'Infected'
    };
    var trace3 = {
      x: xValues,
      y: yValuesR,
      mode: 'line',
      name: 'Recovered'
    };

    var data = [trace, trace2, trace3];

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

    var chart_id = "chart-" + template_instance.random_id.get();

    self.autorun(function(){
      Plotly.newPlot(chart_id, data, layout, {displaylogo: false});
    }.bind(self));
    // Plotly.addTraces(chart_id, {y: [2,1,2]});

}, 1000);
});

Template.Graph.onDestroyed(function() {

});
