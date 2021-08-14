<template>
	<view class="yyhInfoView">
		<view class="info">
			<view class="title">
				{{obj.title}}
			</view>
			<view class="name">
				<view class="avatar">
					<image :src="obj.avatar?'http://app.yinyo.net'+obj.avatar:'/static/home/nikeName.png'" mode=""></image>
				</view>
				<view class="name-r">
					<view class="userName">
						{{obj.nickname}}
					</view>
					<view class="time">
						{{obj.update_time}}
					</view>
				</view>
			</view>
			<view class="article" v-html="obj.content">

			</view>
		</view>
		<view class="btn">
			<view class="collect" @click="collect">
				<image :src="isCollect?'../../../static/yyh/heart.png':'../../../static/yyh/heart-white.png'" mode=""></image>
				<view class="text">
					{{isCollect?'取消收藏':'收藏'}}
				</view>
			</view>
			<view class="reply" @click="inputVisible(0)">
				<image src="../../../static/yyh/remark.png" mode=""></image>
				<view class="text">
					回复
				</view>
			</view>
		</view>
		<view class="remarkView" style="padding-bottom:80rpx">
			<view class="remarkTitle">
				<view class="line">
					
				</view>
				<view class="remarkText">
					评论
				</view>
			</view>
			<view class="remarkList" v-for="(item,index) in obj.discuss" :key="index">
				<view class="top">
					<view class="t-left">
						<view class="smallAvatar">
							<image :src="item.avatar?'http://app.yinyo.net'+item.avatar:'/static/home/nikeName.png'" mode=""></image>
						</view>
						<view class="remarkPeople">
							<view class="remarkName">
								{{item.nickname}}
							</view>
							<view class="remarkTime">
								{{item.create_time}}
							</view>
						</view>
					</view>
					<view class="reply">
						<view class="likeNum" @click="clickLike(item)">
							<image class="like" src="../../../static/yyh/like.png" mode=""></image>
							{{item.like}}
						</view>
						<view class="" @click="inputVisible(item.id)">
							回复
						</view>
					</view>
				</view>
				<view class="remarkContent">
					回复{{item.bname}} : {{item.content}}
				</view>
					<!-- 评论组件递归 -->
				<replyComment :commentChildren="item.son" @childLike="clickLike" 
				@childRemark="inputVisible"></replyComment>
			
			</view>
		</view>
		
		<view class="remarkInput" v-if="inputShow">
			<!-- 在输入框加上class=“uni-input” 和cursor-spacing=“0”解决输入框被软键盘遮挡问题 -->
			<input type="text" autocomplete="off" cursor-spacing="0" v-model="data"  class="uni-input fl" />
			<view class="remarkText" @click="reply">
				发表
			</view>
		</view>
	</view>
</template>

<script>
	import replyComment from './replyComment.vue'
	import {getYyhInfo,giveLike,collectYyh,cancelCollectYyh,remarkYyh} from '@/api/yyh/yyh.js'
	export default {
		components:{
			replyComment
		},
		data() {
			return {
				banner:{},
				remarkList:[
			
				],
				obj:{},
				inputShow:false,
				isCollect:false,
				// 回复id
				id:"",
				data:""
			}
		},
		onLoad(event) {
			this.banner = JSON.parse(decodeURIComponent(event.detailDate));
			getYyhInfo({id:this.banner.id,token:this.$store.getters.accessToken}).then(res=>{
				console.log(res.data.data,6)
				this.obj=res.data.data;
				this.isCollect=this.obj.coll;
				console.log("是否收藏",this.obj.coll);
			})
			//详情标题
			// uni.setNavigationBarTitle({
			// 	title: this.banner.title
			// });
		},
		methods: {
			// 回复
			inputVisible(id){
				this.id = id;
				if(this.inputShow==false){
					this.inputShow=true;
				}else{
					this.inputShow=false;
				}
			},
			reply(){
				remarkYyh({
					token:this.$store.getters.accessToken,
					content:this.data,
					parent_id:this.id,
					tid:this.obj.id
				}).then(res=>{
					this.inputShow=false;
					this.data = "";
					uni.showToast({
						icon:"none",
						title:res.data.msg
					})
					getYyhInfo({id:this.banner.id,token:this.$store.getters.accessToken}).then(res=>{
						this.obj=res.data.data;
						this.isCollect=this.obj.coll;
					})
				})
			},
			// 点赞
			clickLike(item){
				giveLike({
					id:item.id,
					token:this.$store.getters.accessToken
				}).then(res=>{
					uni.showToast({
						icon:"none",
						title:res.data.msg
					})
					getYyhInfo({id:this.banner.id,token:this.$store.getters.accessToken}).then(res=>{
						this.obj=res.data.data;
						this.isCollect=this.obj.coll;
					})
				})
			},
			// 收藏帖子
			collect(){
				if(this.isCollect){
					cancelCollectYyh({
						tid:this.banner.id,
						token:this.$store.getters.accessToken
					}).then(res=>{
						console.log(res,"取消收藏");
						this.isCollect=false;
						uni.showToast({
							icon:"none",
							title:res.data.msg
						})
					})
				}else{
					collectYyh({
						tid:this.banner.id,
						token:this.$store.getters.accessToken
					}).then(res=>{
						console.log(res,"收藏");
						this.isCollect=true;
						uni.showToast({
							icon:"none",
							title:res.data.msg
						})
					})
				}
			}
		}
	}
</script>
<style lang="scss" scoped>
	.yyhInfoView{
		// 回复输入框
		.remarkInput{
			width:calc(100% - 60rpx);
			height: 80rpx;
			position: fixed;
			bottom: 0;
			display: flex;
			align-items: center;
			padding: 0 30rpx;
			justify-content: space-between;
			background-color: #FFFFFF;
			z-index: 99999;
			border-bottom:1px solid #CCCCCC;
			border-top:1px solid #CCCCCC;
			.fl{
				width: 550rpx;
			}
			.remarkText{
				color: #999;
				font-size: 18px;
			}
		}
		.info{
			padding: 0 30rpx;
			.title{
				font-size:34rpx;
				font-family:Microsoft YaHei;
				font-weight:bold;
				color:rgba(51,51,51,1);
				line-height:40rpx;
				margin: 20rpx auto;
			}
			.name{
				height: 95rpx;
				margin-bottom: 30rpx;
				display: flex;
				.avatar{
					width: 95rpx;
					height: 95rpx;
					overflow: hidden;
					border-radius: 50%;
					image{
						width: 95rpx;
						height: 95rpx;
					}
				}
				.name-r{
					margin-left: 10rpx;
					.userName{
						font-size:28rpx;
						font-family:Microsoft YaHei;
						font-weight:600;
						color:rgba(51,51,51,1);
						line-height:48rpx;
					}
					.time{
						font-size:24rpx;
						font-family:Microsoft YaHei;
						font-weight:400;
						color:rgba(176,176,176,1);
						line-height:48rpx;
					}
				}
			}
			.article{
				font-size:32rpx;
				font-family:Microsoft YaHei;
				font-weight:400;
				color:rgba(127,127,127,1);
				line-height:54rpx;
				// v-html里面的需要样式穿透
				/deep/ a{
					width: 100%!important;
					height: 400rpx!important;
				}
				/deep/ img{
					width: 100%!important;
					height: 400rpx!important;
				}
			}
		}
		.btn{
			height: 140rpx;
			background-color: #F7F7F7;
			padding: 0 30rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.collect{
				width: 320rpx;
				height: 80rpx;
				background:rgba(103,182,239,1);
				border-radius:10rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				image{
					width: 31rpx;
					height: 29rpx;
					margin-right: 14rpx;
				}
				.text{
					font-size:26rpx;
					font-family:Microsoft YaHei;
					font-weight:400;
					color:rgba(255,255,255,1);
				}
			}
			.reply{
				width: 320rpx;
				height: 80rpx;
				background:rgba(0,202,116,1);
				border-radius:10rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				image{
					width: 34rpx;
					height: 30rpx;
					margin-right: 14rpx;
				}
				.text{
					font-size:26rpx;
					font-family:Microsoft YaHei;
					font-weight:400;
					color:rgba(255,255,255,1);
				}
			}
		}
		.remarkView{
			margin-bottom: 20rpx;
			.remarkTitle{
				padding: 0 30rpx;
				height: 80rpx;
				border-bottom: 2px solid #F7F7F7;
				display: flex;
				align-items: center;
				.line{
					width:6rpx;
					height:33rpx;
					background:rgba(0,202,116,1);
					border-radius:3rpx;
				}
				.remarkText{
					font-size:30rpx;
					font-family:Microsoft YaHei;
					font-weight:600;
					color:rgba(51,51,51,1);
					margin-left:10rpx;
				}
			}
			.remarkList{
				// height: 220rpx;
				padding: 20rpx 30rpx;
				// border-bottom: 1px solid #F7F7F7;
				.top{
					display: flex;
					height: 72rpx;
					justify-content: space-between;
					.t-left{
						display: flex;
					}
					.smallAvatar{
						width: 72rpx;
						height: 72rpx;
						border-radius: 50%;
						overflow: hidden;
						image{
							width: 72rpx;
							height: 72rpx;
						}
					}
					.reply{
						font-size:26rpx;
						font-family:Microsoft YaHei;
						font-weight:400;
						color:rgba(93,93,93,1);
						display: flex;
						align-items: center;
						.likeNum{
							.like{
								width: 32rpx;
								height: 32rpx;
							}
							margin-right: 16rpx;
							display: flex;
							align-items: center;
						}

					}
				}
				.remarkPeople{
					margin-left: 16rpx;
					.remarkName{
						font-size:26rpx;
						font-family:Microsoft YaHei;
						font-weight:600;
						color:rgba(93,93,93,1);
						line-height:36rpx;
					}
					.remarkTime{
						font-size:22rpx;
						font-family:Microsoft YaHei;
						font-weight:400;
						color:rgba(176,176,176,1);
						line-height:36rpx;
					}
				}
				.remarkContent{
					padding-left:88rpx;
					font-size:28rpx;
					font-family:Microsoft YaHei;
					font-weight:400;
					color:rgba(87,87,87,1);
					line-height:42rpx;
				}
			}
		}
	}
</style>
