import Vue from 'vue'
import Vuex from 'vuex'
import { login } from '../api/user.js'
import getters from './getters.js'
Vue.use(Vuex)
const store = new Vuex.Store({
    state: {
		accessToken: '',
		userInfo: null,
		countdown:60
	},
    actions: {
		Login({ commit, state }, params) {
			return login(params)
				.then(res => {
					commit('SET_ACCESS_TOKEN', res.data.data.token) // TODO: 修改
					// commit('SET_USER_INFO', res.userInfo) // TODO: 修改
					return res
				})
		},
		LogOut({ commit }) {
			commit('CLEAR_LOGIN_IFNO')
		},
	},
    mutations: {
		// 验证码倒计时 写在store里面是为了防止用户退出app后倒计时被清除了
		djs(state){
			if(state.countdown==0){
				state.countdown=60
			}else{
				state.countdown--
				setTimeout(()=>{
					this.commit("djs");
				},1000)
			}
		},
		SET_ACCESS_TOKEN(state, accessToken) {
			state.accessToken = accessToken
			uni.setStorageSync('access_token', accessToken)
		},
		SET_USER_INFO(state, userInfo){
			state.userInfo = userInfo
			uni.setStorageSync('user_info', JSON.stringify(userInfo))
		},
		CLEAR_LOGIN_IFNO(state){
			state.accessToken = ''
			state.userInfo = null
			uni.removeStorageSync('access_token')
			uni.removeStorageSync('user_info')
		}
	},
	getters
})
export default store