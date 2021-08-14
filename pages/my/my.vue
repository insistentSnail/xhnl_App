<template>
	<view class="myView">
		<view class="top">
			<view class="avatar">
				<image :src="$store.getters.userInfo.avatar?$store.getters.userInfo.avatar:'../../static/home/nikeName.png'" mode=""></image>
			</view>
			<view class="name">
				{{$store.getters.userInfo.nickname}}
			</view>
		</view>
		<view class="content">
			<view class="list" @click="toMessage">
				<view class="list-l">
					<view class="icon">
						<image class="msgIcon" src="../../static/home/message.png" mode=""></image>
					</view>
					<view class="text">
						完善信息
					</view>
				</view>
				<image class="yjt" src="../../static/home/yjt.png" mode=""></image>
			</view>
			<view class="list" @click="toMyCollect">
				<view class="list-l">
					<view class="icon">
						<image class="msgIcon" src="../../static/home/collect.png" mode=""></image>
					</view>
					<view class="text">
						我的收藏
					</view>
				</view>
				<image class="yjt" src="../../static/home/yjt.png" mode=""></image>
			</view>
			<view class="list" @click="toPublish">
				<view class="list-l">
					<view class="icon">
						<image class="msgIcon" src="../../static/home/publish.png" mode=""></image>
					</view>
					<view class="text">
						我的发布
					</view>
				</view>
				<image class="yjt" src="../../static/home/yjt.png" mode=""></image>
			</view>
			<view class="list" @click="toMySell">
				<view class="list-l">
					<view class="icon">
						<image class="sellIcon" src="../../static/home/like.png" mode=""></image>
					</view>
					<view class="text">
						我的销售
					</view>
				</view>
				<image class="yjt" src="../../static/home/yjt.png" mode=""></image>
			</view>
			
			<view class="list" @click="toMyLike">
				<view class="list-l">
					<view class="icon">
						<image class="sellIcon" src="../../static/home/sell.png" mode=""></image>
					</view>
					<view class="text">
						喜欢商品
					</view>
				</view>
				<image class="yjt" src="../../static/home/yjt.png" mode=""></image>
			</view>
			
			<view class="list" @click="toChangePsw">
				<view class="list-l">
					<view class="icon">
						<image class="pswIcon" src="../../static/home/psw.png" mode=""></image>
					</view>
					<view class="text">
						修改密码
					</view>
				</view>
				<image class="yjt" src="../../static/home/yjt.png" mode=""></image>
			</view>
			<view class="btn">
				<button class="btnLogin" @click="logout">退 出 登 录</button>
			</view>
		</view>
	</view>
</template>

<script>
	import {getUserInfo} from '@/api/my/my.js'
	export default {
		data() {
			return {
				
			}
		},
		onLoad() {
			// getUserInfo({
			// 	token:this.$store.getters.accessToken,
			// }).then(res=>{
			// 	this.$store.commit('SET_USER_INFO',res.data.data);
			// })
		},
		methods: {
			// 退出登录
			logout(){
				this.$store.dispatch("LogOut");
				uni.showToast({
					title:"退出登录成功",
					icon:"success"
				})
				// 不加延时看不到提示信息
				setTimeout(()=>{
					uni.reLaunch({
						url:'/pages/login/login'
					})
				},1000)
			},
			// 跳转到完善信息页
			toMessage(){
				uni.navigateTo({
					url: '/pages/my/message/message'
				});
			},
			// 跳转到我的发布页
			toPublish(){
				uni.navigateTo({
					url: '/pages/my/publish/publish'
				});
			},
			// 跳转到修改密码页
			toChangePsw(){
				uni.navigateTo({
					url: '/pages/my/changePsw/changePsw'
				})
			},
			// 跳转到我的收藏页
			toMyCollect(){
				uni.navigateTo({
					url: '/pages/my/myCollect/myCollect'
				})
			},
			// 跳转到我的销售页
			toMySell(){
				uni.navigateTo({
					url: '/pages/my/mySell/mySell'
				})
			},
			// 跳转到我感兴趣的商品页
			toMyLike(){
				uni.navigateTo({
					url: '/pages/my/myLike/myLike'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.myView{
		height: 100%;
		width: 100%;
		background-color: #F3F3F3;
		.top{
			height: 160rpx;
			background-color: #fff;
			padding: 0 35rpx;
			display: flex;
			align-items: center;
			.avatar{
				width:100rpx;
				height:100rpx;
				border: 1px solid #ccc;
				border-radius: 50%;
				overflow: hidden;
				image{
					width:100rpx;
					height:100rpx;
				}
			}
			.name{
				font-size:42rpx;
				font-family:Source Han Sans CN;
				font-weight:600;
				color:rgba(51,51,51,1);
				line-height:66rpx;
				margin-left: 24rpx;
			}
		}
		.content{
			margin-top: 20rpx;
			background-color: #FFFFFF;
			.list{
				height: 80rpx;
				padding: 0 35rpx;
				border-bottom: 1px solid #e9e9e9;
				display: flex;
				align-items: center;
				justify-content: space-between;
				.list-l{
					height: 80rpx;
					display: flex;
					align-items: center;
					.text{
						font-size:30rpx;
						font-family:Adobe Heiti Std;
						font-weight:normal;
						color:rgba(68,68,68,1);
						margin-left: 27rpx;
					}
				}
				.icon{
					width: 40rpx;
				}
				.msgIcon{
					width: 37rpx;
					height: 29rpx;
				}
				.pswIcon{
					width: 31rpx;
					height: 39rpx;
				}
				.sellIcon{
					width: 36rpx;
					height: 32rpx;
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
