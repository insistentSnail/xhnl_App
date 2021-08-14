import store from '../store/index.js'
import common from '@/api/common.js'
export default function (params = {}) {
	return new Promise((resolve, reject) => {
		uni.request({
			url: common.host + params.url,
			data: params.data,
			header: {
				...params.header,
				accessToken: store.getters.accessToken
			},
			success: res => {
				if (res.code == 200) {
					resolve(res)
				}
				if (res.data.code == 401) { // 未登录
					store.dispatch('LogOut')	
					// TODO: 跳转登录
					uni.showModal({
						title: '未登录',
						content: '您未登录，需要登录后才能查看',
						success: (res) => {
							if (res.confirm) {
								uni.reLaunch({
									url:'/pages/login/login'
								})
							}
						}
					});
					resolve(res)
				}
				resolve(res)
			},
			fail: error => {
				reject(error)
			}
		})
	})
}