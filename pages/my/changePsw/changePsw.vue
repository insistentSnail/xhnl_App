<template>
	<view class="changePswView">
		<image class="loginLogo" src="../../../static/login/login.png" mode=""></image>
		<view class="content">
			<view class="com">
				<view class="leftIcon">
					<image class="pswIcon" src="../../../static/login/psw.png" mode=""></image>
				</view>
				<input type="password" autocomplete="off" placeholder="请输入原始密码" v-model="psw"  class="uni-input fl" />
			</view>
			<view class="com">
				<view class="leftIcon">
					<image class="pswIcon" src="../../../static/login/psw.png" mode=""></image>
				</view>	
				<input type="password" autocomplete="off" placeholder="请输入新密码" v-model="psw2"  class="uni-input fl" />
			</view>
			<view class="com">
				<view class="leftIcon">
					<image class="pswIcon" src="../../../static/login/psw.png" mode=""></image>
				</view>	
				<input type="password" autocomplete="off" placeholder="请再次输入密码" v-model="psw3"  class="uni-input fl" />
			</view>
			<view class="btn">
				<button class="btnLogin" @click="register">提 交</button>
			</view>
		</view>
	</view>
</template>

<script>
	import {changePassword} from '@/api/my/my.js'
	export default {
		data() {
			return {
				psw:"",
				psw2:"",
				psw3:""
			}
		},
		methods: {
			register(){
				if(this.psw==""||this.psw2==""||this.psw3==""){
					uni.showToast({
						icon: 'none',
						title: '密码不能为空！'
					});
				}else if(this.psw2!=this.psw3){
					uni.showToast({
						icon: 'none',
						title: '两次输入的密码不同！'
					});
				}
				changePassword({
					token:this.$store.getters.accessToken,
					old_password:this.psw,
					new_password:this.psw2
				}).then(res=>{
					uni.showToast({
						icon:"none",
						title:res.data.msg
					})
					if(res.data.code==200){
						setTimeout(()=>{
							uni.navigateTo({
								url:'/pages/login/login'
							})
						},1000)
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.changePswView{
		.loginLogo{
			width: 132rpx;
			height: 132rpx;
			margin: 114rpx auto;
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
				.typeIcon{
					width: 31rpx;
					height: 25rpx;
				}
				.phoneIcon{
					width: 26rpx;
					height: 35rpx;
				}
				.pswIcon{
					width: 25rpx;
					height: 32rpx;
				}
				.fl{
					margin-left: 28rpx;
					width: 100%;
				}
				.picker{
					margin-left: 28rpx;
					width: 100%;
					.uni-input{
						color: grey;
						font-size: 16px;
					}
				}
				.yjt{
					width: 28rpx;
					height: 28rpx;
					margin-right: 10rpx;
				}
			}
			.btn{
				margin-top:90rpx;
				.btnLogin{
					width:620rpx;
					height:90rpx;
					background:rgba(249,34,35,1);
					border-radius:45px;
					font-size:30rpx;
					font-family:Adobe Heiti Std;
					font-weight:normal;
					color:rgba(255,255,255,1);
					line-height:90rpx;
				}
			}
		}	
	}
</style>
