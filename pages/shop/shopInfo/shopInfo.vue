<template>
	<view class="shopInfoView">
		<view class="banner">		
			<swiper class="swiper-banner" :indicator-dots="true" @change="change">
				<swiper-item v-for="(item,index) in obj.images" :key="index">
					<view class="swiper-item">
						<image class="img" :src="item"></image>
					</view>
				</swiper-item>
			</swiper>
		</view>
		<view class="shopBox">
			<view class="shopName">
				{{obj.title}}
			</view>
			<view class="price">
				￥{{obj.price}}
			</view>
		</view>
		<view class="tip">
			<view class="tip-l">
				<view class="avatar">
					<image :src="obj.avatar?'http://app.yinyo.net'+obj.avatar:'../../../static/home/nikeName.png'" mode=""></image>
				</view>
				<view class="nikeName">
					{{obj.nickname}}
				</view>
			</view>
			<view class="">
				{{obj.want}}人感兴趣
				{{obj.num}}人浏览
			</view>
		</view>
		<view class="info" v-html="obj.info">
			
		</view>
		
	<!-- 	<view class="myInformation" v-if="obj.like">
			<view class="">
				姓名:刘鑫
			</view>
			<view class="">
				联系电话:15779163056
			</view>
			<view class="">
				详细地址:北京市 市辖区 东城区通州
			</view>	
		</view> -->
		
		<!-- 自定义弹窗 -->
		<view class="mask" v-show="visible">
			<view class="selfModel">
			<!-- 	<view class="title">
					收不到短信可能由以下几种情况造成
				</view> -->
				<view class="comText">
					姓名: {{obj.nickname}}
				</view>
				<view class="comText">
					联系电话:
					<text style="color:#E93B3D;margin-left:5px;text-decoration:underline;"
					@click="telphone(obj.phone)">{{obj.phone}}</text>		
				</view>
				<!-- selectable="true" 可复制文本 -->
				<view class="comText">
					微信号: 
					<text selectable="true" style="color: #4CD964;margin-left:5px;text-decoration:underline;"
					>{{obj.weixin}}</text>	
				</view>
				<view class="comText">
					详细地址: {{obj.province}} {{obj.address}}
				</view>
				<view class="tipMsg">
					提示:您的信息已发送给商家，如您想取消，请点击不感兴趣按钮！
				</view>
				<view class="btn" @click="close">
					知道了
				</view>
			</view>
		</view>
		
		<view class="bottom">
			<view class="collect" @click="collect">
				<image :src="obj.coll?'../../../static/shop/collectActive.png':'../../../static/shop/collect.png'" mode=""></image>
				<view class="collectText">
					收藏
				</view>
			</view>
			<view class="want" style="background-color: #4CD964;" v-if="obj.like" @click="visible=true">
				查看
			</view>
			<view class="want" @click="want">
				{{obj.like?'不感兴趣':'我想要'}}
			</view>
		</view>
	</view>
</template>

<script>
	import {shopCollect,shopCancelCollect,myWant,getNewsInfo,myNotWant} from '@/api/shop/shop.js'
	export default {
		data() {
			return {
				banner:{},
				obj:{},
				visible:false
			}
		},
		onLoad(event) {
			this.visible = false;
			console.log(event);
			this.banner = JSON.parse(decodeURIComponent(event.detailDate));
			getNewsInfo({
				id:this.banner.id,
				token:this.$store.getters.accessToken
			}).then(res=>{
				this.obj=res.data.data;
				// this.obj.images=this.obj.images.split(",");
			})
		},
		methods: {
			// 拨打电话
			telphone(item){
				uni.makePhoneCall({
				    phoneNumber: item //仅为示例
				});
			},
			change(e){
				console.log(e.detail)
			},
			// 收藏or取消收藏
			collect(){
				if(!this.obj.coll){
					shopCollect({
						sid:this.obj.id,
						token:this.$store.getters.accessToken
					}).then(res=>{
						console.log(res,"收藏成功");
						this.obj.coll = true;
						uni.showToast({
							icon:"none",
							title:res.data.msg
						})
					})
				}else{
					shopCancelCollect({
						sid:this.obj.id,
						token:this.$store.getters.accessToken
					}).then(res=>{
						console.log(res,"取消收藏成功");
						this.obj.coll = false;
						uni.showToast({
							icon:"none",
							title:res.data.msg
						})
					})
				}
			},
			close(){
				this.visible = false;
			},
			// 我想要
			want(){
				if(!this.obj.like){
					myWant({
						id:this.obj.id,
						token:this.$store.getters.accessToken
					}).then(res=>{
						console.log(res,"我想要");
						this.obj.like = true;
						this.visible = true;
						// getNewsInfo({
						// 	id:this.banner.id
						// }).then(res=>{
						// 	this.obj=res.data.data;
						// 	// this.obj.images=this.obj.images.split(",");
						// })
						// uni.showToast({
						// 	icon:"none",
						// 	title:res.data.msg
						// })
					})
				}else{
					myNotWant({
						id:this.obj.id,
						token:this.$store.getters.accessToken
					}).then(res=>{
						console.log(res,"我不想要");
						this.obj.like = false;
						// getNewsInfo({
						// 	id:this.banner.id
						// }).then(res=>{
						// 	this.obj=res.data.data;
						// 	// this.obj.images=this.obj.images.split(",");
						// })
						// uni.showToast({
						// 	icon:"none",
						// 	title:res.data.msg
						// })
					})
				}	
			}
		}
	}
</script>

<style lang="scss" scoped>
	.shopInfoView{
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
			.comText{
				color: #000;
				line-height: 50rpx;
			}
			.tipMsg{
				font-size: 12px;
				margin-top: 10rpx;
			}
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
		
		.banner{
			width: 100%;
			height: 470rpx;
			.swiper-banner{
				width: 100%;
				height: 470rpx;
				.swiper-item {
					width: 750rpx;
					height: 100%;	
					.img {
						width: 100%;
						height: 100%;
					}
				}
			}
		}
		.shopBox{
			padding: 0 30rpx;
			height: 80rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			.shopName{
				font-size:32rpx;
				font-family:Microsoft YaHei;
				font-weight:600;
				color:rgba(68,68,68,1);
			}
			.price{
				font-size:40rpx;
				font-family:Microsoft YaHei;
				font-weight:600;
				color:rgba(68,68,68,1);
				color: #f00;
			}
		}
		.tip{
			padding: 0 30rpx;
			font-size:24rpx;
			font-family:Microsoft YaHei;
			font-weight:400;
			color:#999;
			display: flex;
			justify-content: space-between;
			align-items: flex-end;
			.tip-l{
				display: flex;
				align-items: center;
				.nikeName{
					margin-left: 20rpx;
					font-size: 14px;
					font-weight: bold;
					color: #444;
				}
			}
			.avatar{
				width: 80rpx;
				height: 80rpx;
				border-radius: 50%;
				overflow: hidden;
				image{
					width: 80rpx;
					height: 80rpx;
				}
			}
		}
		.info{
			padding: 0 30rpx;
			font-size:28rpx;
			font-family:Microsoft YaHei;
			font-weight:400;
			color:#444;
			margin-top: 20rpx;
			/deep/ img{
				max-width: 100%!important;
				max-height: 400rpx!important;
			}
		}
		.myInformation{
			padding: 0 30rpx;
			font-size:28rpx;
			font-family:Microsoft YaHei;
			font-weight:600;
			color:#444;
			margin-top: 20rpx;
			line-height: 40rpx;
		}
		.bottom{
			width: 100%;
			height: 100rpx;
			position: fixed;
			border-top:1px solid #E8E8E8;
			bottom: 0;
			z-index: 9999;
			display: flex;
			align-items: center;
			justify-content: space-around;
			.collect{
				display: flex;
				align-items: center;
				image{
					width: 41rpx;
					height: 40rpx;
				}
				.collectText{
					font-size:28rpx;
					font-family:Microsoft YaHei;
					font-weight:400;
					color:rgba(102,102,102,1);
					line-height:28rpx;
					margin-left:20rpx;
				}
			}
			.want{
				width:227rpx;
				height:67rpx;
				background:rgba(255,61,61,1);
				border-radius:34rpx;
				font-size:28rpx;
				color: #FFFFFF;
				font-family:Microsoft YaHei;
				font-weight:400;
				color:rgba(255,255,255,1);
				line-height:67rpx;
				text-align: center;
			}
		}
	}
</style>
