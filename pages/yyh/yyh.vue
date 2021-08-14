<template>
	<view class="yyhView">
		<view class="publish" @click="toForumPublish" v-if="$store.getters.accessToken">
			<image src="../../static/home/articleEdit.png" mode=""></image>
		</view>
		<view class="header-wrap">
		    <view class="index-header">
				<view class="avatar" @click="avatar">
					<image src="../../static/home/logo.png" mode=""></image>
				</view>
				<view class="input-wrap">
					<view class="icon">
						
					</view>
					<input type="text" 
					   placeholder="搜索你的内容"
						v-model="value"
						@input="onKeyInput"
					/>
				</view>
				<view class="my" @click="my">
					我的
				</view>
		    </view>
		</view>
		<!-- tab切换栏 -->
		<view class="tab">
			<v-tabs
				v-if="list.length"
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
		<!-- 滚动区域 -->
		<mescroll-body ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback" :down="downOption" :up="upOption">
			<view class="content">
				<view class="yyhList" v-for="(item,index) in yyhList" :key="index" @click="toInfo(item)">
					<view class="title">
						{{item.title}}
					</view>
					<view class="yyhImg">
						<image :src="ele" mode="" v-for="(ele,index) in item.images" :key="index"></image>
					</view>
					<view class="yyhBottom">
						<view class="first same">
							{{item.nickname}}
						</view>
						<view class="time same">
							{{item.update_time}}
						</view>
						<view class="comment same">
							<view class="pageView">
								<image src="../../static/yyh/pageView.png" mode=""></image>
								<view class="num">
									{{item.num}}
								</view>
							</view>
							<view class="remark">
								<image src="../../static/yyh/comment.png" mode=""></image>
								<view class="num">
									{{item.rnum}}
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		<!-- 	<mescroll-empty v-if="yyhList.length==0"></mescroll-empty> -->
		</mescroll-body>
	</view>
</template>

<script>
	import vTabs from '@/components/v-tabs/v-tabs.vue'
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	import MescrollEmpty from '@/components/mescroll-uni/components/mescroll-empty.vue';
	import {getYyhTabs,yyhList} from '@/api/yyh/yyh.js'
	export default {
		mixins: [MescrollMixin],
		components: {
			vTabs,
			MescrollEmpty
		},
		data() {
			return {
				value:"",
				activeTab: 0,
				list:[],
				arr:[],
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
				yyhList:[],
				avtiveIndex:""//当前tab的下标
			}
		},
		onLoad() {
			console.log(333)
			getYyhTabs().then(res=>{
				console.log(res)
				var tab = res.data.data.map(ele=>ele.title);
				tab.unshift("最新");
				this.list=tab;
				this.arr = res.data.data;
				this.arr.unshift({title:"最新",id:""});
			})
		},
		methods: {
			my(){
				// 已登录跳转我的页面
				if(this.$store.getters.accessToken){
					uni.navigateTo({
						url: '/pages/my/my'
					});
				}else{
					// 未登录跳转登录页
					uni.navigateTo({
						url: '/pages/login/login'
					});
				}
			},
			avatar(){
				console.log("avatar");
			},
			onKeyInput(event) {
				this.value = event.target.value;
				// 搜索调用下拉刷新
				this.mescroll.resetUpScroll();
			},
			// tab切换
			active(data){
				console.log(data.dataset.index);
				this.avtiveIndex=data.dataset.index;
				// 切换tab栏调用下拉刷新
				this.mescroll.resetUpScroll();
			},
			// 跳转到亦有汇详情页
			toInfo(item){
				console.log(item);
				uni.navigateTo({
					url: 'yyhInfo/yyhInfo?detailDate=' + encodeURIComponent(JSON.stringify(item))
				});
			},
			// 跳转到论坛发布页
			toForumPublish(){
				uni.navigateTo({
					url: 'forumPublish/forumPublish'
				});
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
				yyhList({
					page:page.num,
					fid:this.arr.length>0?this.arr[this.avtiveIndex].id:"",
					title:this.value
				}).then(res=>{
					if(page.num == 1){
						this.yyhList = []; //如果是第一页需手动置空列表
					}
						this.yyhList = this.yyhList.concat(res.data.data); //追加新数据
						this.mescroll.endBySize(res.data.data.length, res.data.count)
				})
			}	
		}
	}
</script>

<style lang="scss" scoped>
	.yyhView{
		.publish{
			width: 70rpx;
			height: 70rpx;
			position: fixed;
			border-radius: 50%;
			bottom: 150rpx;
			z-index: 999;
			left: 20rpx;
			background-color: #00CA74;
			display: flex;
			justify-content: center;
			align-items:center;
			overflow: hidden;
			image{
				width: 50rpx;
				height: 50rpx;
			}
		}
		.header-wrap {
			width: 100%;
			position: fixed;
			top: 0;
			z-index: 999;
			background:#00CA74;
			height: 148rpx;
			.index-header {
				height: 88rpx;
				line-height: 88rpx;
				padding: 0 30rpx;
				padding-top: 60rpx;//给手机头部留位置
				font-size: 28rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				.avatar{
					width: 76rpx;
					height: 62rpx;
					// border: 1px solid #fff;
					// border-radius: 50%;
					// overflow: hidden;
					image{
						width: 76rpx;
						height: 62rpx;
					}
				}
				.input-wrap{
					width:500rpx;
					height: 60rpx;
					background:rgba(255,255,255,1);
					border-radius:30rpx;
					display: flex;
					align-items: center;
					.icon{
						background: url(../../static/home/search.png) no-repeat;
						width: 32rpx;
						height: 32rpx;
						background-size: 100% 100%;
						margin:10rpx 20rpx;
					}
				}
				.my{
					font-size:30rpx;
					font-family:PingFang SC;
					font-weight:500;
					color:rgba(255,255,255,1);
					line-height:52rpx;
				}
			}			
		}
		.tab{
			height: 90rpx;
			border-bottom:1px solid #E8E8E8;
			position: fixed;
			width: 102%;
			z-index: 999;
			// margin-top: 128rpx;
			top:148rpx;
			background-color: #FFFFFF;
		}
		.content{
			margin-top: 240rpx;
			padding: 0 30rpx;
			.yyhList{
				border-bottom: 1px solid #E8E8E8;
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
						width: 222rpx;
						height: 150rpx;
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
