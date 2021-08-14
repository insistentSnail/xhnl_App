import Vue from 'vue'
import App from './App'
import store from './store'
//把vuex定义成全局组件
Vue.prototype.$store = store
// 下拉和上拉刷新组件
import MescrollBody from "@/components/mescroll-uni/mescroll-body.vue"
import MescrollUni from "@/components/mescroll-uni/mescroll-uni.vue"
Vue.component('mescroll-body', MescrollBody)
Vue.component('mescroll-uni', MescrollUni)

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App,
	 store
})
app.$mount()
