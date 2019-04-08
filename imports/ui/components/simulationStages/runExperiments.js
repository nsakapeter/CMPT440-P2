
if(Meteor.isClient){


}


Template.runExperiments.helpers({

});

Template.runExperiments.events({
  'click .generateGraphs'(event, instance) {
    // event.preventDefault();
    // event.stopPropagation();

  }
});

Template.runExperiments.onCreated(function() {
});

Template.runExperiments.onRendered(function() {
  $(document).ready(function(){
     $('input[type="file"]').change(function(e){
         var fileName = e.target.files[0].name;
         runExperiments(e.target.files[0]);
     });
 });

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
          for (var i = 0; i < json.experimentialData.noOfTrails; i++) {
            console.log(i);
            var passengers = generatePassengers();
            var trialResult = {};
            for (var j = 0; j < json.experimentialData.algorithms.length; j++) {
              var currentAlgorithm = json.experimentialData.algorithms[j];
              var sortPassengers = sortPassengers(passengers, currentAlgorithm);
              var simulationResult = simulate(sortPassengers);
              trialResult[currentAlgorithm] = simulationResult;
            }
            resultsToGraph.push(trialResult);
          }
          graph(resultsToGraph);
          alert('json global var has been set to parsed json of this file here it is unevaled = \n' + JSON.stringify(json));
        } catch (ex) {
          alert('ex when trying to parse json = ' + ex);
        }
      }
    })(file);
  reader.readAsText(file);
}
}

function generatePassengers(minAges, maxAges, minLuggaegeWeight, maxLuggaegeWeight, noOfPassengers, ageDistributionType, LuggageWeightDistributionType){

}


function sortPassengers(){

}


function simulate(passengers){

}


function graph(resultsToGraph){
    const BoardingTimeValues = Array.from(appScopeVariable.results.get(), x => x.boardingTime);
    console.log(BoardingTimeValues);
    const ProcessNames = Array.from(appScopeVariable.results.get(), x => x.name);
    var BoardingTimeTrace = {
      x: ProcessNames,
      y: BoardingTimeValues,
      type: 'bar'
    };
    var BoardingTimeData = [BoardingTimeTrace];
    var BoardingTimeLayout = {
      xaxis: {
        title: {
          text: 'Process Type'
        },
      },
      yaxis: {
        title: {
          text: 'Boarding Time'
        }
      }
    };


    const ConflictValues = Array.from(appScopeVariable.results.get(), x => x.conflicts);
    var ConflictTrace = {
      x: ProcessNames,
      y: ConflictValues,
      type: 'bar'
    };
    var ConflictData = [ConflictTrace];
    var ConflictLayout = {
      xaxis: {
        title: {
          text: 'Process Type'
        },
      },
      yaxis: {
        title: {
          text: '# of Conflicts'
        }
      }
    };

    Plotly.newPlot("chart1", BoardingTimeData, BoardingTimeLayout, {displaylogo: false});
    Plotly.newPlot("chart2", ConflictData, ConflictLayout, {displaylogo: false});
}
