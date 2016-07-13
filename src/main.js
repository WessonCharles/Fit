import Vue from 'vue'
import App from './App.vue'
import Home from './views/Home.vue'

import VueRouter from 'vue-router'

Vue.use(VueRouter)

const router = new VueRouter()

router.map({
	'/':{
		components:Home
	},
	// '/login':{
	// 	components:Hello
	// },
	// '/layout':{
	// 	component:Layout 
	// }
})

router.redirect({ '*': '/' })

router.start(App,'#app')
// /* eslint-disable no-new */
// new Vue({
//   el: 'body',
//   components: { App }
// })
