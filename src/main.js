import Vue from 'vue'
// import App from './App.vue'
import Hello from './components/Hello.vue'

import VueRouter from 'vue-router'

Vue.use(VueRouter)


var App = Vue.extend({})

var router = new VueRouter({
	history:true,
	saveScrollPosition:true
})

router.map({
	'/hello':{
		components:Hello
	},
	'/layout':{
		component:Layout 
	}
})

router.redirect({ '*': '/hello' })

router.start(App,'#app')
// /* eslint-disable no-new */
// new Vue({
//   el: 'body',
//   components: { App }
// })
