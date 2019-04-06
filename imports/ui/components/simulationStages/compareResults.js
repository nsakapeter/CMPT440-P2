
if(Meteor.isClient){


}


Template.compareResults.helpers({
  results(){
    return appScopeVariable.results.get();
  }
});

Template.compareResults.events({
  'click .generateGraphs'(event, instance) {
    // event.preventDefault();
    // event.stopPropagation();

  }
});

Template.compareResults.onCreated(function() {
});

Template.compareResults.onRendered(function() {
  var self = this;

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

  self.autorun(function(){
    Plotly.newPlot("chart1", BoardingTimeData, BoardingTimeLayout, {displaylogo: false});
    Plotly.newPlot("chart2", ConflictData, ConflictLayout, {displaylogo: false});
  }.bind(self));

});
