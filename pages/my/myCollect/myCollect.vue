<template>
	<view class="publishView">
		<view class="tab">
			<v-tabs
				 :tabs="list"
				  height="45px"
				  v-model="activeTab"
				  color="#333"
				  activeColor="#00CA74"
				  fontSize="14px"
				  activeFontSize="16px"
				  lineColor="#00CA74"
				  lineHeight="4px"
				  @act="active"
			/>
		</view>
		<mescroll-body ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback" :down="downOption" :up="upOption">
			<view class="content">
				<view class="list" v-for="(item,index) in newsList" :key="index">
					<view class="left">
						<image class="img" :src="item.image" mode=""></image>
					</view>
					<view class="center">
						<view class="title">
							{{item.title}}					
						</view>
						<view class="info">
							{{item.description}}
						</view>
					</view>
					<view class="right" @click="collect(item)">
						<image src="../../../static/home/heart.png" mode=""></image>
					</view>
				</view>
			</view>
	<!-- 		<mescroll-empty v-if="newsList.length==0"></mescroll-empty> -->
		</mescroll-body>
	</view>
</template>

<script>
	import {collectNews,cancelCollectNews} from '@/api/index/index'
	import {collectYyh,cancelCollectYyh} from '@/api/yyh/yyh'
	import {shopCollect,shopCancelCollect} from '@/api/shop/shop'
	import {myCollect} from '@/api/my/my.js'
	import vTabs from '@/components/v-tabs/v-tabs.vue'
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	import MescrollEmpty from '@/components/mescroll-uni/components/mescroll-empty.vue';
	export default {
		mixins: [MescrollMixin],
		components: {
			vTabs,
			MescrollEmpty
		},
		data() {
			return {
				activeTab: 0,
				list:["新闻","论坛","商品"],
				newsList:[],
				// 下拉刷新的配置(可选, 90%的情况无需配置)
				downOption: { 
					
				},
					// 上拉加载的配置(可选, 90%的情况无需配置)
				upOption: {
					page: {
						size:10 // 每页数据的数量,默认10
					},
					noMoreSize: 10, // 配置列表的总数量要大于等于5条才显示'-- END --'的提示
					empty: {
						tip: '暂无相关数据'
					},
					textNoMore:'别拽了，到底啦'
				}
			}
		},
		methods: {
			active(data){
				this.avtiveIndex=data.dataset.index;
				// 切换tab栏调用下拉刷新
				this.mescroll.resetUpScroll();
			},
			/*下拉刷新的回调, 有三种处理方式:*/
			downCallback(){
				this.mescroll.resetUpScroll(); // 重置列表为第一页 (自动执行 page.num=1, 再触发upCallback方法 )
			},
			/*上拉加载的回调*/
			upCallback(page) {
				console.log(page,55)
				// setTimeout(()=>{
				// 	this.mescroll.endByPage(10, 2)
				// },500)
				myCollect({
					page:page.num,
					type_id:this.avtiveIndex,
					token:this.$store.getters.accessToken
				}).then(res=>{
					if(page.num == 1){
						this.newsList = []; //如果是第一页需手动置空列表
					}
						this.newsList = this.newsList.concat(res.data.data); //追加新数据
						this.mescroll.endBySize(res.data.data.length, res.data.count)
				})
			},
			// 收藏
			collect(item){
				if(this.avtiveIndex==0){
					cancelCollectNews({
							article_id:item.id,
							token:this.$store.getters.accessToken,
						}).then(res=>{
						uni.showToast({
							title:res.data.msg,
							icon:"none"
						})
						if(res.data.code==200){
							this.mescroll.resetUpScroll();
						}		
					})	
				}
				if(this.avtiveIndex==1){
					cancelCollectYyh({
						tid:item.id,
						token:this.$store.getters.accessToken
					}).then(res=>{
						uni.showToast({
							icon:"none",
							title:res.data.msg
						})
						this.mescroll.resetUpScroll();
					})
				}
				if(this.avtiveIndex==2){
					shopCancelCollect({
						sid:item.id,
						token:this.$store.getters.accessToken
					}).then(res=>{
						uni.showToast({
							icon:"none",
							title:res.data.msg
						})
						this.mescroll.resetUpScroll();
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.publishView{
		.tab{
			height: 90rpx;
			border-bottom:1px solid #E8E8E8;
			position: fixed;
			width: 100%;
			z-index: 999;
			// margin-top: 128rpx;
			// top:88rpx;
			background-color: #FFFFFF;
			/deep/.v-tabs .v-tabs__item{
				width:33%;
				justify-content: center;
			}
		}
		.content{
			margin-top: 90rpx;
			padding: 0 30rpx;
			.list{
				height: 160rpx;
				padding:10rpx 0;
				border-bottom: 1px solid #E8E8E8;
				display: flex;
				align-items: center;
				justify-content: space-between;
				.left{
					width: 170rpx;
					.img{
						width: 170rpx;
						height: 116rpx;
					}
				}
				.center{
					width: 400rpx;
					height:80%;
					.title{
						width:360rpx;
						height:30rpx;
						font-size:30rpx;
						font-family:PingFang SC;
						font-weight:600;
						color:rgba(51,51,51,1);
						line-height:30rpx;
						overflow: hidden;
						text-overflow:ellipsis;
						white-space: nowrap;
					}
					.info{
						margin-top: 20rpx;
						width:390rpx;
						height:72rpx;
						font-size:26rpx;
						font-family:Adobe Heiti Std;
						font-weight:normal;
						color:rgba(153,153,153,1);
						line-height:36rpx;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
						overflow: hidden;
					}
				}
				.right{
					width:70rpx;
					height: 100%;
					display: flex;
					align-items: center;
					justify-content: center;
					image{
						width: 47rpx;
						height: 39rpx;
					}
				}
			}
		}		
	}
</style>

