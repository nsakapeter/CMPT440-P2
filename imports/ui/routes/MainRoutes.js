import { FlowRouter } from 'meteor/ostrio:flow-router-extra'

FlowRouter.route('/', {
  title: 'SIR Model Siimualtion',
  action() {
    this.render('mainLayout', 'Home')
  },
  waitOn() {
    return import('../components/Home/HomeComponent.js')
  },
})
