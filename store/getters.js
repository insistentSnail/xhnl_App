export default {
	accessToken: state => state.accessToken || uni.getStorageSync('access_token'),
	userInfo: state => state.userInfo || JSON.parse(uni.getStorageSync('user_info'))
}