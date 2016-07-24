import Vue from 'vue'
import App from './App.vue'
import Home from './views/Home.vue'
import Layout from './views/Layout.vue'
import LayoutDetail from './views/LayoutDetail.vue'

import VueRouter from 'vue-router'

import './libs/font-awesome/css/font-awesome.min.css'
import './libs/bootstrap/dist/css/bootstrap.min.css'
import './styles/main.css'

Vue.use(VueRouter)

var router = new VueRouter({		
	history:true,		
	// saveScrollPosition:true		
})

router.map({
	'/':{
		name:'index',
		components:Home
	},
	// '/login':{
	// 	components:Hello
	// },
	'/layout':{
		name:'layout',
		component:Layout
		// subRoutes:{
			
		// }
	},
	'/layout/create':{
		name:'create',
		component:LayoutDetail
	},
	'/layout/detail':{
		name:'detail',
		component:LayoutDetail
	}
})

router.redirect({ '*': 'index' })


router.start(App,'#app')