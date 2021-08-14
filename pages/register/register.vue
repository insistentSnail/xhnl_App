<template>
	<view class="registerView">
		<image class="loginLogo" src="../../static/login/login.png" mode=""></image>
		<view class="content">
			<view class="com">
				<view class="leftIcon">
					<image class="userIcon" src="../../static/login/my.png" mode=""></image>
				</view>
				<input type="text" autocomplete="off" placeholder="请输入用户名称" v-model="user"  class="uni-input fl" />
			</view>
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
				<input type="password" autocomplete="off" placeholder="请输入密码" v-model="psw"  class="uni-input fl" />
			</view>
			<view class="com">
				<view class="leftIcon">
					<image class="pswIcon" src="../../static/login/psw.png" mode=""></image>
				</view>	
				<input type="password" autocomplete="off" placeholder="请再次输入密码" v-model="psw2"  class="uni-input fl" />
			</view>
			<view class="com">
				<view class="leftIcon">
					<image class="typeIcon" src="../../static/login/type.png" mode=""></image>
				</view>	
				<picker class="picker" @change="bindPickerChange" :value="index" :range="array">
					<view class="uni-input">{{array[index]}}</view>
				</picker>
				<image class="yjt" src="../../static/login/yjt.png" mode=""></image>
			</view>
			<!-- 协议 -->
			<view class="agreement">
				<image :src="isAgree?'../../static/login/agree.png':'../../static/login/disagree.png'" mode="" @click="agree"></image>
				<text>我同意</text> 
				<text style="color: #007700;" @click="toService">《亦有在线用户服务条款》</text>
				<text style="color: #007700;" @click="toPrivacy">《隐私政策》</text>
			</view>
			
			<view class="btn">
				<button class="btnLogin" @click="register">注 册</button>
			</view>
			<view class="message" @click="message">
				收不到短信
			</view>
		</view>
		
		<!-- 自定义弹窗 -->
		<view class="mask" v-show="modelVisible">
			<view class="selfModel">
				<view class="title">
					收不到短信可能由以下几种情况造成
				</view>
				<view class="">
					1.手机号输入有误
				</view>
				<view class="">
					2.操作频繁，请稍后重试
				</view>
				<view class="">
					3.当日短信已达10条上限
				</view>
	<!-- 			<view class="">
					4.都不是，问客服 
					<text style="color: #4CD964;margin-left:5px;text-decoration:underline;" 
					@click="telphone">0791-88197248</text>
				</view> -->
				<view class="btn" @click="close">
					知道了
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	import {sendYzm,forgetPsw} from '@/api/my/my.js'
	import {registerTo} from '@/api/user.js'
	export default {
		data() {
			return {
				user:"",
				phone:"",
				psw:"",
				psw2:"",
				array: ['用户', '种植户', '加工厂','供应商','学术专家'],
				index: 0,
				yzm:"",
				modelVisible:false,
				isAgree:false
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
			bindPickerChange: function(e) {
				console.log('picker发送选择改变，携带值为', e.target.value)
				this.index = e.target.value
			},
			register(){
				if(this.user==''){
					uni.showToast({
						title:"请输入用户名称",
						icon:"none"
					})
					 return false;
				}
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
				if(!this.isAgree){
					uni.showToast({
						title:"请同意亦有服务条款",
						icon:"none"
					})
					 return false;
				}
				var obj={
					nickname:this.user,
					password:this.psw,
					phone:this.phone,
					user_type:this.index,
					code:this.yzm
				}
				registerTo(obj).then(res=>{
					uni.showToast({
						title:res.data.msg,
						icon:"none"
					})
					if(res.data.code==200){
						setTimeout(()=>{
							uni.redirectTo({
								url: '/pages/login/login'
							});
						},1500)	
					}
				})
			
			},
			// 收不到短信
			message(){
				this.modelVisible = true;
			},
			close(){
				this.modelVisible = false;
			},
			// 拨打电话
			telphone(){
				uni.makePhoneCall({
				    phoneNumber: '079188197248' //仅为示例
				});
			},
			// 我同意
			agree(){
				this.isAgree=!this.isAgree;
			},
			// 跳转服务条款
			toService(){
				uni.navigateTo({
					url: './service/service'
				});
			},
			// 跳转隐私政策
			toPrivacy(){
				uni.navigateTo({
					url: './privacy/privacy'
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.registerView{
		position: relative;
		// 协议
		.agreement{
			display: flex;
			font-size: 12px;
			margin-top: 30rpx;
			color: #808080;
			image{
				width: 32rpx;
				height: 32rpx;
				margin-right: 10rpx;
			}
		}
		// 弹窗外遮罩
		.mask{
			position: fixed;
			background-color: rgba(100,100,100,0.3);
			width: 100%;
			height: 100%;
			top: 0;
		}
		// 自定义弹窗
		.selfModel{
			width: 600rpx;
			height: auto;
			padding: 30rpx;
			position: fixed;
			left: 50%;
			top: 50%;
			transform: translate(-50%,-50%);
			background-color: rgba(255,255,255,1);
			border-radius: 20rpx;
			z-index: 99999;
			font-size: 14px;
			color: #666;
			.title{
				text-align: center;
				font-weight: 600;
				line-height: 50rpx;
				margin-bottom: 20rpx;
				color: #000;
			}
			.btn{
				width:140rpx;
				height:50rpx;
				text-align: center;
				background:rgba(0,202,116,1);
				border-radius:25px;
				font-size:20rpx;
				font-family:Adobe Heiti Std;
				font-weight:normal;
				color:rgba(255,255,255,1);
				line-height:50rpx;
				margin-left: calc(50% - 70rpx);
				margin-top: 20rpx;
			}
		}
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
				margin-top:70rpx;
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
			.message{
				margin-top: 16rpx;
				text-align: center;
				font-size: 14px;
				color: #666;
			}
		}	
	}	
</style>
