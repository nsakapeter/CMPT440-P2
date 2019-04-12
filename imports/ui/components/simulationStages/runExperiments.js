import {generateAges, generateWeights} from './runExperiments/dataGenerator.js';
import {passengerGenerator} from './runExperiments/passengerGenerator.js';
import {passengerSorter} from './runExperiments/passengerSorter.js';
import {simulateExperiment} from './runExperiments/simulateExperiment.js';
reactiveTrialResults = [];
runningExperiment = false;
if(Meteor.isClient){


}


Template.runExperiments.helpers({
  results(){
    return reactiveTrialResults.get();
  },
  isRunningExperiment(){
    return runningExperiment.get();
  }
});

Template.runExperiments.events({
  'change .configFileInput'(e, instance) {
    event.preventDefault();
    event.stopPropagation();
    var fileName = e.target.files[0].name;
     runningExperiment.set(true);
    setTimeout(function(){
      runExperiments(e.target.files[0]);
    }, 1000);


  }
});

Template.runExperiments.onCreated(function() {
  reactiveTrialResults = new ReactiveVar([]);
  runningExperiment = new ReactiveVar(false);
});

Template.runExperiments.onRendered(function() {
  var self = this;
 //  $(document).ready(function(){
 //    $('input[type=file]').click(function(e){
 //        $('input[type="file"]').attr("value", "");
 //    });
 //     $('input[type="file"]').change(function(e){
 //
 //
 //     });
 // });

});


function runExperiments(file){

  var resultsToGraph = [];
  if (file) {
    var reader = new FileReader();
    // Closure to capture the file information.
    reader.onload = (function (theFile) {
      return function (e) {
        console.log('e readAsText = ', e);
        console.log('e readAsText target = ', e.target);
        try {
          json = JSON.parse(e.target.result);
          console.log(json);
          var trialResult = [];
          var passengers = generatePassengers(json.simulationData.minAges, json.simulationData.maxAges, json.simulationData.minLuggaegeWeight, json.simulationData.maxLuggaegeWeight, json.simulationData.noOfPassengers, json.simulationData.ageDistributionType,json.simulationData.LuggageWeightDistributionType);
          console.log(passengers);

          for (var i = 0; i < json.experimentialData.noOfTrails; i++) {
            console.log(i);
            for (var j = 0; j < json.experimentialData.algorithms.length; j++) {
              var currentAlgorithm = json.experimentialData.algorithms[j];
              var sortedPassengers = sortPassengers(passengers, currentAlgorithm);

              var simulationResult = simulate(sortedPassengers, json.simulationData.planeCapacity, json.simulationData.noOfPassengers);
              trialResult.push({
                "name": currentAlgorithm,
                "boardingTime": simulationResult[0],
                "conflicts": simulationResult[1],
                "trailName": "Trial " + (i + 1) + " - " + currentAlgorithm
              });
            }
            // console.log(trialResult);
            reactiveTrialResults.set(trialResult);
            // resultsToGraph.push(trialResult);
          }
          console.log(trialResult);
          runningExperiment.set(false);
          setTimeout(function(){ graph(trialResult, json.experimentialData.algorithms) }, 3000);


          // alert('json global var has been set to parsed json of this file here it is unevaled = \n' + JSON.stringify(json));
        } catch (ex) {
          alert('ex when trying to parse json = ' + ex);
        }
      }
    })(file);
  reader.readAsText(file);
}
}

function generatePassengers(minAges, maxAges, minLuggaegeWeight, maxLuggaegeWeight, noOfPassengers, ageDistributionType, LuggageWeightDistributionType){
    var ages = generateAges(minAges, maxAges, noOfPassengers, ageDistributionType);
    var luggageWeights = generateWeights(minLuggaegeWeight, maxLuggaegeWeight, noOfPassengers, LuggageWeightDistributionType);
    return passengerGenerator(ages, luggageWeights);
}


function sortPassengers(passengerList, algorithm){
  return passengerSorter(passengerList, algorithm);
}


function simulate(passengerList,noOfPassengers,planeCapacity){
  return simulateExperiment(passengerList,noOfPassengers,planeCapacity)
  // return ["2", "4"];
}


function graph(resultsToGraph, algorithms){
  var BoardingTimeData = [];
  for (var i = 0; i < algorithms.length; i++) {
    var currentAlgorithm = algorithms[i];
    var baordingTimes = [];
    for (var j = 0; j < resultsToGraph.length; j++) {
      var currentResult = resultsToGraph[j];
      if (currentResult.name == currentAlgorithm) {
        baordingTimes.push(currentResult.boardingTime);
      }
    }
    BoardingTimeData.push({
      y: baordingTimes,
      name: currentAlgorithm,
      type: 'box'
    });
  }


  var BoardingConflictData = [];
  for (var i = 0; i < algorithms.length; i++) {
    var currentAlgorithm = algorithms[i];
    var baordingConflicts = [];
    for (var j = 0; j < resultsToGraph.length; j++) {
      var currentResult = resultsToGraph[j];
      if (currentResult.name == currentAlgorithm) {
        baordingConflicts.push(currentResult.conflicts);
      }
    }
    BoardingConflictData.push({
      y: baordingConflicts,
      name: currentAlgorithm,
      type: 'box'
    });
  }



    // const ConflictValues = Array.from(resultsToGraph, x => x.conflicts);
    // var ConflictTrace = {
    //   x: ProcessNames,
    //   y: ConflictValues,
    //   type: 'bar'
    // };
    // var ConflictData = [ConflictTrace];
    // var ConflictLayout = {
    //   xaxis: {
    //     title: {
    //       text: 'Process Type'
    //     },
    //   },
    //   yaxis: {
    //     title: {
    //       text: '# of Conflicts'
    //     }
    //   }
    // };

    Plotly.newPlot("chart1", BoardingTimeData, {displaylogo: false});
    Plotly.newPlot("chart2", BoardingConflictData, {displaylogo: false});
}
