<template>
    <view class="head">
		<view class="publish" @click="toArticle" v-if="$store.getters.accessToken">
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
		<mescroll-body ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback" :down="downOption" :up="upOption">
			<view class="content">
				<view class="list" v-for="(item,index) in newsList" :key="index" @click="toNewsInfo(item)">
					<view class="left">
						<view class="title">
							{{item.title}}					
						</view>
						<view class="info">
							{{item.description}}
						</view>
					</view>
					<view class="right">
						<image :src="item.image" mode=""></image>
					</view>
				</view>
			</view>
		<!-- 	<mescroll-empty v-if="newsList.length==0"></mescroll-empty> -->
		</mescroll-body>
    </view>
</template>

<script>
	import vTabs from '@/components/v-tabs/v-tabs.vue'
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	import MescrollEmpty from '@/components/mescroll-uni/components/mescroll-empty.vue';
	import {getTabs,tabList,update} from '@/api/index/index.js'
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
				list:[],//tab栏数据
				arr:[],//tab栏数据加上id的数组对象
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
				},
				avtiveIndex:"",//当前tab的下标
				urls:""
			}
		},
		onLoad() {
			console.log(111)
			console.log(this.$store.state.accessToken,11,this.$store.getters.accessToken)
			getTabs().then(res=>{		
				var tab = res.data.data.map(ele=>ele.title);
				tab.unshift("最新");
				this.list=tab;
				this.arr = res.data.data
				this.arr.unshift({title:"最新",id:""});
			})
			
			// #ifdef APP-PLUS 	
			plus.runtime.getProperty(plus.runtime.appid, function(widgetInfo) { 
			update().then(res=>{
				this.urls = res.data.data.urls;	
				var selfVersion=widgetInfo.version.split('.').join('');
				var newVersion=res.data.data.version.split('.').join('');
				console.log(selfVersion,newVersion);
				if(Number(newVersion)>Number(selfVersion)){	
					uni.showModal({
					    title: '提示',
					    content: '存在更新版本, 是否确认更新',
					    success: (res)=>{
					        if (res.confirm) {
					            console.log('用户点击确定');
							uni.downloadFile({
								    url: 'http://app.yinyo.net'+ this.urls, //仅为示例，并非真实的资源
								    success: (res) => {
								        if (res.statusCode === 200) {									
											plus.runtime.install(res.tempFilePath, {  
													force: false  
												}, function() {
													console.log("增量更新成功,将重启app");
													uni.showToast({
														title:"增量更新成功,将重启app",
														icon:"none",
														duration:1000
													})
													setTimeout(()=>{
														plus.runtime.restart(); 
													},1100)		
												}, function(e) {
													console.error('增量更新安装失败：' + JSON.stringify(e)); 
													 uni.showToast({
													 	title:'增量更新安装失败：' + JSON.stringify(e),
													 	icon:"none"
													 })
												});  
											  
								        }
								    }
								});
								// downloadTask.onProgressUpdate((res)=>{
								//  console.log('下载进度' + res.progress);
								//  console.log('已经下载的数据长度' + res.totalBytesWritten);
								//  console.log('预期需要下载的数据总长度' + res.totalBytesExpectedToWrite);
								// })
					        } else if (res.cancel) {
					            console.log('用户点击取消');
					        }
					    }
					});
				}
			})
			})
			// #endif
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
			active(data){
				this.avtiveIndex=data.dataset.index;
				// 切换tab栏调用下拉刷新
				this.mescroll.resetUpScroll();
			},
			/*下拉刷新的回调, 有三种处理方式:*/
			downCallback(){
				// setTimeout(()=>{
				// 	this.mescroll.endSuccess()
				// },500)
				// 第1种: 请求具体接口
				// uni.request({
				// 	url: 'xxxx',
				// 	success: () => {
				// 		// 请求成功,隐藏加载状态
				// 		this.mescroll.endSuccess()
				// 	},
				// 	fail: () => {
				// 		// 请求失败,隐藏加载状态
				// 		this.mescroll.endErr()
				// 	}
				// })
				// 第2种: 下拉刷新和上拉加载调同样的接口, 那么不用第1种方式, 直接mescroll.resetUpScroll()即可
				this.mescroll.resetUpScroll(); // 重置列表为第一页 (自动执行 page.num=1, 再触发upCallback方法 )
			},
			/*上拉加载的回调*/
			upCallback(page) {
				console.log(page,55)
				// setTimeout(()=>{
				// 	this.mescroll.endByPage(10, 2)
				// },500)
				tabList({
					page:page.num,
					category_id:this.arr.length>0?this.arr[this.avtiveIndex].id:"",
					title:this.value
				}).then(res=>{
					if(page.num == 1){
						this.newsList = []; //如果是第一页需手动置空列表
					}
						this.newsList = this.newsList.concat(res.data.data); //追加新数据
						this.mescroll.endBySize(res.data.data.length, res.data.count)
				})
				// let pageNum = page.num; // 页码, 默认从1开始
				// let pageSize = page.size; // 页长, 默认每页10条
				// uni.request({
				// 	url: 'xxxx?pageNum='+pageNum+'&pageSize='+pageSize,
				// 	success: (data) => {
				// 		// 接口返回的当前页数据列表 (数组)
				// 		let curPageData = data.xxx; 
				// 		// 接口返回的当前页数据长度 (如列表有26个数据,当前页返回8个,则curPageLen=8)
				// 		let curPageLen = curPageData.length; 
				// 		// 接口返回的总页数 (如列表有26个数据,每页10条,共3页; 则totalPage=3)
				// 		let totalPage = data.xxx; 
				// 		// 接口返回的总数据量(如列表有26个数据,每页10条,共3页; 则totalSize=26)
				// 		let totalSize = data.xxx; 
				// 		// 接口返回的是否有下一页 (true/false)
				// 		let hasNext = data.xxx; 
						
				// 		//设置列表数据
				// 		if(page.num == 1) this.dataList = []; //如果是第一页需手动置空列表
				// 		this.dataList = this.dataList.concat(curPageData); //追加新数据
						
				// 		// 请求成功,隐藏加载状态
				// 		//方法一(推荐): 后台接口有返回列表的总页数 totalPage
				// 		this.mescroll.endByPage(curPageLen, totalPage); 
						
				// 		//方法二(推荐): 后台接口有返回列表的总数据量 totalSize
				// 		//this.mescroll.endBySize(curPageLen, totalSize); 
						
				// 		//方法三(推荐): 您有其他方式知道是否有下一页 hasNext
				// 		//this.mescroll.endSuccess(curPageLen, hasNext); 
				// 	},
				// 	fail: () => {
				// 		//  请求失败,隐藏加载状态
				// 		this.mescroll.endErr()
				// 	}
				// })
			},
			// 跳转新闻编辑页
			toArticle(){
				uni.navigateTo({
					url: '/pages/index/article/article'
				});
			},
			// 跳转到新闻详情页
			toNewsInfo(item){
				uni.navigateTo({
					url: '/pages/index/newsInfo/newsInfo?detailDate=' + encodeURIComponent(JSON.stringify(item))
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.head{
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
			width: 100%;
			z-index: 999;
			// margin-top: 128rpx;
			top:148rpx;
			background-color: #FFFFFF;
			/deep/.v-tabs .v-tabs__item{
				width:20%;
				justify-content: center;
			}
		}
		.content{
			margin-top: 240rpx;
			padding: 0 30rpx;
			.list{
				height: 160rpx;
				padding:10rpx 0;
				border-bottom: 1px solid #E8E8E8;
				display: flex;
				align-items: center;
				justify-content: space-between;
				.left{
					width: 490rpx;
					.title{
						width:491rpx;
						height:52rpx;
						font-size:30rpx;
						font-family:PingFang SC;
						font-weight:600;
						color:rgba(51,51,51,1);
						line-height:52rpx;
					}
					.info{
						width:491rpx;
						height:72rpx;
						font-size:26rpx;
						font-family:PingFang SC;
						font-weight:500;
						color:rgba(153,153,153,1);
						line-height:36rpx;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
						overflow: hidden;//盒子溢出隐藏
					}
				}
				.right{
					width:170rpx;
					image{
						width:170rpx;
						height: 116rpx;
					}
				}
			}
		}
	}
</style>
