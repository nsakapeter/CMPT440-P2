
if(Meteor.isClient){


}


Template.capacityForm.helpers({
  hasError(){
    return Template.instance().planeCapacityhasError.get() || Template.instance().passengerCapacityhasError.get();
  }
});

Template.capacityForm.events({
  'keyup .planeCapacity'(event, instance) {
    // event.preventDefault();
    // event.stopPropagation();
    if(parseInt($(event.currentTarget).val()) % 6 == 0 && parseInt($(event.currentTarget).val()) >= 6){
      var styles = {
        border : "none",
      };
      $(event.currentTarget).css(styles);
      appScopeVariable.planeCapacity.set($(event.currentTarget).val());
      instance.planeCapacityhasError.set(false);
    }
    else {
      var styles = {
        border : "3px solid red",
      };
      $(event.currentTarget).css(styles);
      instance.planeCapacityhasError.set(true);
    }
  },
  'keyup .noOfPassengers'(event, instance) {
    // event.preventDefault();
    // event.stopPropagation();
    if(parseInt($(event.currentTarget).val()) <= appScopeVariable.planeCapacity.get() && parseInt($(event.currentTarget).val()) > 1){
      var styles = {
        border : "none",
      };
      $(event.currentTarget).css(styles);
      appScopeVariable.noOfPassengers.set($(event.currentTarget).val());
      instance.passengerCapacityhasError.set(false);
    }
    else {
      var styles = {
        border : "3px solid red",
      };
      $(event.currentTarget).css(styles);
      instance.passengerCapacityhasError.set(true);

    }
  }
});

Template.capacityForm.onCreated(function() {
  this.planeCapacityhasError = new ReactiveVar(true);
  this.passengerCapacityhasError = new ReactiveVar(true);
});

Template.capacityForm.onRendered(function() {



});
