<template>
	<view class="loginView">
		<image class="loginLogo" src="../../static/login/login.png" mode=""></image>
		<view class="content">
			<view class="com">
				<view class="leftIcon">
					<image class="userIcon" src="../../static/login/my.png" mode=""></image>
				</view>
				<input type="number" autocomplete="off" placeholder="请输入手机号码" v-model="user"  class="uni-input fl" />
			</view>
			<view class="com">
				<view class="leftIcon">
					<image class="pswIcon" src="../../static/login/psw.png" mode=""></image>
				</view>
				<input type="password" autocomplete="off" placeholder="请输入密码" v-model="psw"  class="uni-input fl" />
			</view>
			<view class="btn">
				<button class="btnLogin" @click="login">登 录</button>
			</view>
			<view class="tip">
				<text class="register" @click="toRegister">立即注册</text>
				<text class="forgetPsw" @click="forgetPsw">忘记密码</text>
			</view>
		</view>
	</view>
</template>

<script>
	import {getUserInfo} from '@/api/my/my.js'
	export default {
		data() {
			return {
				user:"",
				psw:""
			}
		},
		onLoad() {
			
		},
		methods: {
			login(){
				if(this.user==''){
					uni.showToast({
						title:"请输入手机号码",
						icon:"none"
					})
					 return false;
				}
				if(!(/^1[3456789]\d{9}$/.test(this.user))){
					uni.showToast({
						title:"请输入正确的号码格式",
						icon:"none"
					})
					return false;
				} 
				if(this.psw==''){
					uni.showToast({
						title:"请输入密码",
						icon:"none"
					})
					 return false;
				}
				var obj={
					phone:this.user,
					password:this.psw
				}
				this.$store.dispatch("Login",obj).then(res=>{
					console.log(res,1)
					if(res.data.code==200){
						// 登录成功后获取用户信息
						getUserInfo({
							token:this.$store.getters.accessToken,
						}).then(res=>{
							this.$store.commit('SET_USER_INFO',res.data.data);
						})
						
						uni.showToast({
							title:res.data.msg,
							icon:"success"
						})
						// 不加延时看不到提示信息
						setTimeout(()=>{
							uni.reLaunch({
								url:'/pages/index/index'
							})
						},1000)
						
					}else{
						uni.showToast({
							title:res.data.msg,
							icon:"none"
						})
					}
				})

			},
			toRegister(){
				uni.navigateTo({
					url: '/pages/register/register'
				});
			},
			forgetPsw(){
				uni.navigateTo({
					url: '/pages/forgetPsw/forgetPsw'
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.loginView{
		.loginLogo{
			width: 132rpx;
			height: 132rpx;
			margin: 170rpx auto;
			margin-left: calc(50% - 66rpx);
		}
		.content{
			width: 620rpx;
			margin: auto;
			.com{
				height: 80rpx;
				border-bottom: 1px solid #e9e9e9;
				display: flex;
				align-items: center;
				.leftIcon{
					width: 35rpx;
				}
				.userIcon{
					width: 28rpx;
					height: 30rpx;
				}
				.pswIcon{
					width: 25rpx;
					height: 32rpx;
				}
				.fl{
					margin-left: 28rpx;
					width: 100%;
				}
			}
			.btn{
				margin-top:90rpx;
				.btnLogin{
					width:620rpx;
					height:90rpx;
					background:rgba(0,202,116,1);
					border-radius:45px;
					font-size:30rpx;
					font-family:Adobe Heiti Std;
					font-weight:normal;
					color:rgba(255,255,255,1);
					line-height:90rpx;
				}
			}
			.tip{
				margin-top: 40rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				.register{
					font-size:26rpx;
					font-family:Adobe Heiti Std;
					font-weight:normal;
					color:rgba(102,102,102,1);
					line-height:30rpx;
				}
				.forgetPsw{
					font-size:26rpx;
					font-family:Adobe Heiti Std;
					font-weight:normal;
					color:rgba(249,34,35,1);
					line-height:30rpx;
				}
			}
		}
	}
</style>
