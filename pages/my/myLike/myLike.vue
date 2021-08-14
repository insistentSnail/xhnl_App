<template>
	<view class="myLike">
		<mescroll-body ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback" :down="downOption" :up="upOption">
			<view class="content">
				<view class="list" v-for="(item,index) in likeList" :key="index" @click="toShopInfo(item)">
					
					<view class="left">
						<image class="img" :src="'http://app.yinyo.net'+item.image" mode=""></image>
					</view>
					<view class="center">
						<view class="c-left">
							<view class="shopName">
								{{item.title}}
							</view>
							<view class="shopTime">
								{{item.update_time}}
							</view>
						</view>
						<view class="c-right">
							￥{{item.price}}
						</view>
					</view>
						
				</view>
			</view>
		</mescroll-body>
	</view>
</template>

<script>
	import {interestShop} from '@/api/my/my.js'
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	export default {
		mixins: [MescrollMixin],
		data() {
			return {
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
				},
				likeList:[]
			}
		},
		onLoad() {
			// interestShop({
			// 	token:this.$store.getters.accessToken,
			// }).then(res=>{
			// 	this.likeList = res.data.data;
			// })
		},
		methods: {
			// 跳转商品详情页
			toShopInfo(item){
				uni.navigateTo({
					url: '/pages/shop/shopInfo/shopInfo?detailDate=' + encodeURIComponent(JSON.stringify(item))
				});
			},
			/*下拉刷新的回调, 有三种处理方式:*/
			downCallback(){
				this.mescroll.resetUpScroll(); // 重置列表为第一页 (自动执行 page.num=1, 再触发upCallback方法 )
			},
			/*上拉加载的回调*/
			upCallback(page) {
				interestShop({
					token:this.$store.getters.accessToken,
					page:page.num
				}).then(res=>{
					if(page.num == 1){
						this.likeList = []; //如果是第一页需手动置空列表
					}
						this.likeList = this.likeList.concat(res.data.data); //追加新数据
						this.mescroll.endBySize(res.data.data.length, res.data.count)
				})
	
			},
		}
	}
</script>

<style lang="scss" scoped>
	.myLike{
		.content{
			padding: 0 30rpx;
			.list{
				background-color: #fff;
				height: 150rpx;
				position: relative;
				border-bottom: 1px solid #e0e0e0;
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
					width: calc(100% - 180rpx);
					height:80%;
					display: flex;
					justify-content: space-between;
					.c-left{
						width: 60%;
						.shopName{
							font-size:30rpx;
							font-family:Adobe Heiti Std;
							font-weight:600;
							color:rgba(51,51,51,1);
							line-height:64rpx;
							overflow: hidden;
							text-overflow:ellipsis;
							white-space: nowrap;
						}
						.shopTime{
							font-size:26rpx;
							font-family:Adobe Heiti Std;
							font-weight:normal;
							color:rgba(153,153,153,1);
							line-height:64rpx;	
							overflow: hidden;
							text-overflow:ellipsis;
							white-space: nowrap;
						}
					}
					.c-right{
						width: 40%;
						line-height: 128rpx;
						font-size:40rpx;
						font-family:Adobe Heiti Std;
						font-weight:normal;
						text-align: right;
						color:rgba(255,73,0,1);
						overflow: hidden;
						text-overflow:ellipsis;
						white-space: nowrap;
					}
				}
			}
		}
	}
</style>
