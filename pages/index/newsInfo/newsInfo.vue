<template>
	<view class="newsInfoView">
		<view class="head">
			<view class="header-wrap">
				<image class="back" src="../../../static/home/back.png" @click="goBack"></image>
				<view class="text">
					星火农林
				</view>
				<image class="heart" :src="obj.coll?'../../../static/home/heart.png':'../../../static/home/heart-white.png'" @click="collect"></image>
			</view>
		</view>
		<view class="title">
			{{obj.title}}
		</view>
		<view class="time">
			发布时间：{{obj.update_at}}
		</view>
		<view class="content" v-html="obj.content">
		
		</view>
		<view class="before" v-if="obj.prev" @click="toNewsInfo(obj.prev.id)">
			上一篇：{{obj.prev.title}}
		</view>
		<view class="after" v-if="obj.next" @click="toNewsInfo(obj.next.id)">
			下一篇：{{obj.next.title}}
		</view>
	</view>
</template>

<script>
	import {getNewsInfo,collectNews,cancelCollectNews} from '@/api/index/index'
	export default {
		data() {
			return {
				banner:{},
				obj:{}
			}
		},	
		// 点击自带导航栏button触发的方法
		// onNavigationBarButtonTap(e) {
		//     console.log(e)
		// },
		onLoad(e) {
			this.banner = JSON.parse(decodeURIComponent(e.detailDate));
			this.toNewsInfo(this.banner.id);
		},
		methods: {
			toNewsInfo(id){
				getNewsInfo({
					id,
					token:this.$store.getters.accessToken
				}).then(res=>{
					this.obj = res.data.data;
				})
			},
			// 返回上一页
			goBack(){
				uni.navigateBack({
					
				})
				// navigateTo, redirectTo 只能打开非 tabBar 页面。
				// uni.navigateTo({
				// 	url:"../index"
				// })
			},
			// 收藏
			collect(){
				if(this.obj.coll){
					cancelCollectNews({article_id:this.banner.id,token:this.$store.getters.accessToken}).then(res=>{
						uni.showToast({
							title:res.data.msg,
							icon:"none"
						})
						if(res.data.code==200){
							this.obj.coll = false;
						}		
					})
				}else{
					collectNews({article_id:this.banner.id,token:this.$store.getters.accessToken}).then(res=>{
						uni.showToast({
							title:res.data.msg,
							icon:"none"
						})
						if(res.data.code==200){
							this.obj.coll = true;
						}	
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.newsInfoView{
		.head{
			width: 100%;
			position: fixed;
			top: 0;
			z-index: 999;
			background:#00CA74;
			.header-wrap{
				height: 88rpx;
				line-height: 88rpx;
				padding: 0 30rpx;
				padding-top: 40rpx;//给手机头部留位置
				font-size: 28rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				.heart{
					width: 47rpx;
					height: 39rpx;
				}
				.back{
					width: 48rpx;
					height: 48rpx;
				}
				.text{
					color: #FFFFFF;
					font-size: 32rpx;
					font-weight: 700;
				}
			}
		}
		.title{
			padding: 0 30rpx;
			margin-top: 128rpx;
			font-size:32rpx;
			font-family:Microsoft YaHei;
			font-weight:600;
			color:rgba(68,68,68,1);
			line-height:80rpx;
			text-align: center;
		}
		.time{
			padding: 0 30rpx;
			font-size:22rpx;
			font-family:Microsoft YaHei;
			font-weight:400;
			color:rgba(153,153,153,1);
			line-height:30rpx;
			text-align: center;
		}
		.content{
			padding: 0 30rpx;
			margin-top: 20rpx;
			font-size:24rpx;
			font-family:Microsoft YaHei;
			font-weight:400;
			color:rgba(85,85,85,1);
			line-height:46rpx;
			border-bottom: 1px dotted #ccc;
			padding-bottom: 60rpx;
			/deep/ img{
				max-width: 100%!important;
				max-height: 400rpx!important;
			}
			/deep/ .video-js{
				width: 100%!important;
			}
		}
		.before{
			padding: 0 30rpx;
			height:60rpx;
			font-size:26rpx;
			font-family:Microsoft YaHei;
			font-weight:400;
			color:rgba(119,119,119,1);
			line-height:60rpx;
			overflow: hidden;
			text-overflow:ellipsis;
			white-space: nowrap;
		}
		.after{
			padding: 0 30rpx;
			height:60rpx;
			font-size:26rpx;
			font-family:Microsoft YaHei;
			font-weight:400;
			color:rgba(119,119,119,1);
			line-height:60rpx;
			overflow: hidden;
			text-overflow:ellipsis;
			white-space: nowrap;
		}
	}
</style>
