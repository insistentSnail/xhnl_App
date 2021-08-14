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
				<view v-if="avtiveIndex==0" class="list" v-for="(item,index) in newsList" :key="index" @click="toNewsInfo(item)">
					
					<view class="checkMask" v-if="item.status==0">
						待审核
					</view>
					
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
					<view class="right">
						<view class="edit" @click.stop="editNews(item.id)">
							<image src="../../../static/home/edit.png" mode=""></image>
						</view>
						<view class="remove" @click.stop="deleteNews(item.id)">
							<image src="../../../static/home/remove.png" mode=""></image>
						</view>
					</view>
				</view>
				
				<view class="flex" v-for="(item,index) in yyhList" :key="'tow'+index" v-if="avtiveIndex==1" @click="toInfo(item)">
					<view class="yyhList">
						<view class="title">
							{{item.title}}
						</view>
						<view class="yyhImg">
							<image :src="ele" mode="" v-for="(ele,idx) in item.images" :key="idx"></image>
						</view>
						<view class="yyhBottom">
							<view class="first same">
								{{item.nickname}}
							</view>
							<view class="time same">
								{{item.create_time}}
							</view>
							<view class="comment same">
								<view class="pageView">
									<image src="../../../static/yyh/pageView.png" mode=""></image>
									<view class="num">
										{{item.num}}
									</view>
								</view>
								<view class="remark">
									<image src="../../../static/yyh/comment.png" mode=""></image>
									<view class="num">
										{{item.rnum}}
									</view>
								</view>
							</view>
						</view>
						
					
					</view>
					<view class="right">
						<view class="edit" @click.stop="editInfo(item.id)">
							<image src="../../../static/home/edit.png" mode=""></image>
						</view>
						<view class="remove" @click.stop="deleteInfo(item.id)">
							<image src="../../../static/home/remove.png" mode=""></image>
						</view>
					</view>
				</view>
			</view>
<!-- 			<mescroll-empty v-if="newsList.length==0"></mescroll-empty> -->
		</mescroll-body>
	</view>
</template>

<script>
	import {myNews,myInvitation,myNewsPublish,myInvitationPublish,removeNews,removeInvitation} from '@/api/my/my.js'
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
				avtiveIndex:0,
				list:["新闻","论坛"],
				newsList:[],
				yyhList:[],
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
			// 跳转到新闻详情页
			toNewsInfo(item){
				uni.navigateTo({
					url: '/pages/index/newsInfo/newsInfo?detailDate=' + encodeURIComponent(JSON.stringify(item))
				});
			},
			// 跳转到亦有汇详情页
			toInfo(item){
				console.log(item);
				uni.navigateTo({
					url: '/pages/yyh/yyhInfo/yyhInfo?detailDate=' + encodeURIComponent(JSON.stringify(item))
				});
			},
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
				if(this.avtiveIndex==0){
					myNewsPublish({
						page:page.num,
						token:this.$store.getters.accessToken
					}).then(res=>{
						if(page.num == 1){
							this.newsList = []; //如果是第一页需手动置空列表
						}
							this.newsList = this.newsList.concat(res.data.data); //追加新数据
							this.mescroll.endBySize(res.data.data.length, res.data.count)
					})
				}else{
					myInvitationPublish({
						page:page.num,
						token:this.$store.getters.accessToken
					}).then(res=>{
						if(page.num == 1){
							this.yyhList = []; //如果是第一页需手动置空列表
						}
							this.yyhList = this.yyhList.concat(res.data.data); //追加新数据
							this.mescroll.endBySize(res.data.data.length, res.data.count)
					})
				}
			
			},
			// 跳转新闻编辑页
			editNews(id){
				uni.navigateTo({
					url: '/pages/my/editNews/editNews?id=' + id
				});
			},
			// 跳转论坛编辑页
			editInfo(id){
				uni.navigateTo({
					url: '/pages/my/editInfo/editInfo?id=' + id
				});
			},
			// 删除新闻
			deleteNews(id){
				removeNews({
					id
				}).then(res=>{
					uni.showToast({
						icon:"none",
						title:res.data.msg
					})
					this.mescroll.resetUpScroll();
				})
			},
			// 删除论坛
			deleteInfo(id){
				removeInvitation({
					id
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
				width:50%;
				justify-content: center;
			}
		}
		.content{
			margin-top: 100rpx;
			padding: 0 30rpx;
			.list{
				height: 160rpx;
				padding:10rpx 0;
				border: 1px solid #E8E8E8;
				margin-bottom: 20rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				position: relative;
				padding: 10rpx;
				.checkMask{
					position: absolute;
					width: 100%;
					height: 100%;
					background-color: rgba(200,200,200,.3);
					z-index: 9999999;
					top: 0;
					left: 0;
					font-size: 40px;
					color: #fff;
					text-align: center;
					line-height: 210rpx;
				}
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
					.edit{
						width: 100%;
						height: 50%;
						background-color: #00CA74;
						display: flex;
						align-items: center;
						justify-content: center;
						image{
							width: 64rpx;
							height: 64rpx;
						}
					}
					.remove{
						width: 100%;
						height: 50%;
						background-color: #FF4900;
						display: flex;
						align-items: center;
						justify-content: center;
						image{
							width: 64rpx;
							height: 64rpx;
						}
					}
				}
			}
			
			.flex{
				display: flex;
				align-items: center;
				justify-content: space-between;
				border-bottom: 1px solid #E8E8E8;
				.right{
					width:70rpx;
					height: 100%;
					.edit{
						margin-bottom: 20rpx;
						width: 100%;
						height: 50%;
						background-color: #00CA74;
						display: flex;
						align-items: center;
						justify-content: center;
						image{
							width: 64rpx;
							height: 64rpx;
						}
					}
					.remove{
						width: 100%;
						height: 50%;
						background-color: #FF4900;
						display: flex;
						align-items: center;
						justify-content: center;
						image{
							width: 64rpx;
							height: 64rpx;
						}
					}
				}
			}
			.yyhList{
				width: 80%;
				.title{
					height:52rpx;
					font-size:32rpx;
					font-family:PingFang SC;
					font-weight:600;
					color:rgba(51,51,51,1);
					line-height:52rpx;
					overflow: hidden;
					text-overflow:ellipsis;
					white-space: nowrap;
				}
				.yyhImg{
					display: flex;
					justify-content: space-between;
					align-items: center;
					height: 170rpx;
					image{
						width: 180rpx;
						height: 140rpx;
					}
				}
				.yyhBottom{
					display: flex;
					justify-content: space-between;
					align-items: center;
					height: 50rpx;
					line-height:50rpx;
					.same{
						width: 222rpx;
						text-align: center;
					}
					.first{				
						font-size:22rpx;
						font-family:PingFang SC;
						font-weight:500;
						color:rgba(153,153,153,1);
						overflow: hidden;
						text-overflow:ellipsis;
						white-space: nowrap;
					}
					.time{
						font-size:22rpx;
						font-family:PingFang SC;
						font-weight:500;
						color:rgba(153,153,153,1);
						overflow: hidden;
						text-overflow:ellipsis;
						white-space: nowrap;
					}
					.comment{
						font-size:22rpx;
						font-family:PingFang SC;
						font-weight:500;
						color:rgba(153,153,153,1);
						display: flex;
						.pageView{
							width: 50%;
							display: flex;
							justify-content: center;
							align-items: center;	
							image{
								width: 29rpx;
								height: 21rpx;
								min-width: 29rpx;
								min-height: 21rpx;
								margin-right: 6rpx;
							}
							.num{
								overflow: hidden;
								text-overflow:ellipsis;
								white-space: nowrap;
							}
						}
						.remark{
							width: 50%;
							display: flex;
							justify-content: center;
							align-items: center;
							image{
								width: 21rpx;
								height: 20rpx;
								min-width: 21rpx;
								min-height: 20rpx;
								margin-right: 6rpx;
							}
							.num{
								overflow: hidden;
								text-overflow:ellipsis;
								white-space: nowrap;
							}
						}
					}
				}
			}
		}		
	}
</style>
