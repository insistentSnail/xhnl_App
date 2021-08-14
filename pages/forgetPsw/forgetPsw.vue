<template>
	<view class="forgetPsw">
		<image class="loginLogo" src="../../static/login/login.png" mode=""></image>
		<view class="content">
			<view class="com">
				<view class="leftIcon">
					<image class="phoneIcon" src="../../static/login/phone.png" mode=""></image>
				</view>
				<input type="text" autocomplete="off" placeholder="请输入手机号码" v-model="phone"  class="uni-input fl" />
			</view>
			<view class="com">
				<view class="leftIcon">
					<image class="yzmIcon" src="../../static/login/yzm.png" mode=""></image>
				</view>
				<input type="text" autocomplete="off" placeholder="请输入验证码" v-model="yzm"  class="uni-input flYzm" />
				<view class="line" @click="getYzm" v-if="$store.state.countdown==60">
					|<text>获取验证码</text>
				</view>
				<view class="line" v-else>
					|<text>{{$store.state.countdown}}秒后重新发送</text>
				</view>
			</view>
			<view class="com">
				<view class="leftIcon">
					<image class="pswIcon" src="../../static/login/psw.png" mode=""></image>
				</view>
				<input type="password" autocomplete="off" placeholder="请输入新密码" v-model="psw"  class="uni-input fl" />
			</view>
			<view class="com">
				<view class="leftIcon">
					<image class="pswIcon" src="../../static/login/psw.png" mode=""></image>
				</view>	
				<input type="password" autocomplete="off" placeholder="请再次输入密码" v-model="psw2"  class="uni-input fl" />
			</view>
			<view class="btn">
				<button class="btnLogin" @click="submit">提 交</button>
			</view>
		</view>	
	</view>
</template>

<script>
	import {sendYzm,forgetPsw} from '@/api/my/my.js'
	export default {
		data() {
			return {
				phone:"",
				yzm:"",
				psw:"",
				psw2:""
				// countdown:60
			}
		},
		methods: {
			// 获取验证码
			getYzm(){
				if(this.phone==''){
					uni.showToast({
						title:"请输入手机号码",
						icon:"none"
					})
					 return false;
				}
				if(!(/^1[3456789]\d{9}$/.test(this.phone))){
					uni.showToast({
						title:"请输入正确的号码格式",
						icon:"none"
					})
					return false;
				}
				sendYzm({
					phone:this.phone
				}).then(res=>{
					uni.showToast({
						title:res.data.msg,
						icon:"none"
					})
					// this.djs();写在store里面防止用户退出倒计时被清除
					if(res.data.code==200){
						this.$store.commit("djs");
					}		
				})
			},
			// 验证码倒计时
			// djs(){
			// 	if(this.countdown==0){
			// 		this.countdown=60
			// 	}else{
			// 		this.countdown--
			// 		setTimeout(()=>{
			// 			this.djs();
			// 		},1000)
			// 	}
			// },
			submit(){
				if(this.phone==''){
					uni.showToast({
						title:"请输入手机号码",
						icon:"none"
					})
					 return false;
				}
				if(!(/^1[3456789]\d{9}$/.test(this.phone))){
					uni.showToast({
						title:"请输入正确的号码格式",
						icon:"none"
					})
					return false;
				} 
				if(this.yzm==''){
					uni.showToast({
						title:"请输入验证码",
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
				if(this.psw2==''){
					uni.showToast({
						title:"请再次输入密码",
						icon:"none"
					})
					 return false;
				}
				if(this.psw!=this.psw2){
					uni.showToast({
						title:"两次输入密码不一致",
						icon:"none"
					})
					 return false;
				}
				forgetPsw({
					phone:this.phone,
					code:this.yzm,
					password:this.psw
				}).then(res=>{
					uni.showToast({
						title:res.data.msg,
						icon:"none"
					})
					if(res.data.code==200){
						setTimeout(()=>{
							uni.navigateTo({
								url: '/pages/login/login'
							});
						},1500)
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.forgetPsw{
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
				.yzmIcon{
					width: 28rpx;
					height: 31rpx;
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
				.flYzm{
					margin-left: 28rpx;
					width: 40%;
				}
				.line{
					color: #9b9b9b;
					margin-left: 20rpx;
					font-size: 16px;
					width: 50%;
					text-align: center;
					text{
						margin-left: 20rpx;
						border: 1px solid #999;
						padding: 5rpx;
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
