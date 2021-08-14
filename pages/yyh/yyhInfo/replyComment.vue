<template>
	<view class="remarkList">
		<!-- 二级回复 -->
		<view class="remarkContent" style="margin-top: 5px;" v-for="(ele,index) in commentChildren"
		 :key="index">
			<view class="top">
				<view class="t-left">
					<view class="smallAvatar">
						<image :src="'http://app.yinyo.net'+ele.avatar" mode=""></image>
					</view>
					<view class="remarkPeople">
						<view class="remarkName">
							{{ele.nickname}}
						</view>
						<view class="remarkTime">
							{{ele.create_time}}
						</view>
					</view>
				</view>
				<view class="reply">
					<view class="likeNum" @click="clickLike(ele)">
						<image class="like" src="../../../static/yyh/like.png" mode=""></image>
						{{ele.like}}
					</view>
					<view class="" @click="inputVisible(ele.id)">
						回复
					</view>
				</view>
			</view>
			<view class="remarkContent">
				回复{{ele.bname}} : {{ele.content}}
			</view>
			<!-- 评论组件递归 -->
			<replyComment v-if="ele.son" :commentChildren="ele.son" @childLike="clickLike"
			@childRemark="inputVisible"></replyComment>
		</view>
	</view>
</template>

<script>
	export default {
		name:"replyComment",
		props:{
			commentChildren:{
				type:Array,
				default:()=>[]
			}
		},
		data() {
			return {
			
			}
		},
		methods:{
			// 点赞
			clickLike(ele){
				this.$emit("childLike",ele);
			},
			inputVisible(id){
				this.$emit("childRemark",id);
			}
		}
	}	
</script>

<style lang="scss" scoped>
	.remarkList{
		// height: 220rpx;
		// padding: 20rpx 30rpx;
		border-bottom: none;
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
			padding-left:0rpx;
			font-size:28rpx;
			font-family:Microsoft YaHei;
			font-weight:400;
			color:rgba(87,87,87,1);
			line-height:42rpx;
		}
	}
</style>
