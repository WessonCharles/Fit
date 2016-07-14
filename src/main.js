import Vue from 'vue'
import App from './App.vue'
import Home from './views/Home.vue'

import VueRouter from 'vue-router'

import './libs/font-awesome/css/font-awesome.min.css'
import './libs/bootstrap/dist/css/bootstrap.min.css'
import './styles/main.css'

Vue.use(VueRouter)

var router = new VueRouter({		
	history:true,		
	saveScrollPosition:true		
})

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

router.redirect({ '*': '/layout' })

router.start(App,'#app')
// /* eslint-disable no-new */
// new Vue({
//   el: 'body',
//   components: { App }
// })
