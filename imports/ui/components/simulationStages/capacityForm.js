
if(Meteor.isClient){


}


Template.capacityForm.helpers({



});

Template.capacityForm.events({
  'keyup .planeCapacity'(event, instance) {
    // event.preventDefault();
    // event.stopPropagation();
    appScopeVariable.planeCapacity.set($(event.currentTarget).val());
  },
  'keyup .noOfPassengers'(event, instance) {
    // event.preventDefault();
    // event.stopPropagation();
    appScopeVariable.noOfPassengers.set($(event.currentTarget).val());
  }
});

Template.capacityForm.onCreated(function() {

});

Template.capacityForm.onRendered(function() {



});
