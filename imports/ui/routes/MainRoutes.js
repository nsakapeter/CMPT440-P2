import { FlowRouter } from 'meteor/ostrio:flow-router-extra'

FlowRouter.route('/', {
  title: 'Plane Boarding Simulation',
  action() {
    this.render('mainLayout', 'Home')
  },
  waitOn() {
    return import('../components/Home/HomeComponent.js')
  },
})
