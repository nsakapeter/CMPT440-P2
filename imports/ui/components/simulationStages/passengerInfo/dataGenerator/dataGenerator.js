
if(Meteor.isClient){


}


Template.dataGenerator.helpers({
	ages(){
		return Template.instance().ages.get();
	}
});

Template.dataGenerator.events({

});

Template.dataGenerator.onCreated(function() {

	var self = this;
	this.ages = new ReactiveVar([23, 45, 27, 98, 28, 29, 18, 22, 74, 23, 34,])





});

Template.dataGenerator.onRendered(function() {


});
