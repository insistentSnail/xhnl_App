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
			<view class="content" v-if="avtiveIndex==0">
				<view class="list" v-for="(item,index) in upList" :key="index" @click="toShopInfo(item)">
					
					<view class="checkMask" v-if="item.examine==1">
						待审核
					</view>
					
					<view class="innerList">				
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
				<!-- 		<view class="right">
							<view class="edit" @click.stop="toShopEdit(item.id)">
								<image src="../../../static/home/edit.png" mode=""></image>
							</view>
							<view class="remove" @click.stop="removeGoods(item.id)">
								下架
							</view>
						</view> -->				
					</view>
					
					<view class="innerBottom">
						<view class="interest" @click.stop="peopleLike(item.id)">
							<image src="../../../static/my/likePeople.png" mode=""></image>
							<view class="likePeople">
								感兴趣的人
							</view>	
						</view>
						<view class="operation">
							<view class="edit" @click.stop="toShopEdit(item.id)">
								<image src="../../../static/home/edit.png" mode=""></image>
								<view class="">
									编辑
								</view> 
							</view>
							<view class="down" @click.stop="removeGoods(item.id)">
								下架
							</view>
						</view>
					</view>
					
				</view>
			</view>
			
			<view class="content" v-if="avtiveIndex==1">
				<view class="list" v-for="(item,index) in outList" :key="index" @click="toShopInfo(item)">
					
					<view class="innerList">	
						
					
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
						<!-- <view class="right">
							<view class="edit" @click.stop="upGoods(item.id)">
								上架
							</view>
							<view class="remove" @click.stop="deleteGoods(item.id)">
								<image src="../../../static/home/remove.png" mode=""></image>
							</view>
						</view>	 -->		
					</view>	
						
					<view class="innerBottom">
						<view class="interest">
							<!-- <image src="../../../static/my/likePeople.png" mode=""></image>
							<view class="likePeople">
								感兴趣的人
							</view>	 -->
						</view>
						<view class="operation">
							<view class="edit" @click.stop="deleteGoods(item.id)">
								<image src="../../../static/home/remove.png" mode=""></image>
								<view class="">
									删除
								</view> 
							</view>
							<view class="down" style="background-color: #00CA74;" @click.stop="upGoods(item.id)">
								上架
							</view>
						</view>
					</view>
						
				</view>		
			</view>
			<!-- <mescroll-empty v-if="newsList.length==0"></mescroll-empty> -->
		</mescroll-body>
		
		<!-- 自定义弹窗 -->
		<view class="mask" v-show="modelVisible">
			<view class="selfModel">
				<view class="title">
					感兴趣的人员名单
				</view>
				<view class="list" v-for="(item,index) in interestList" :key="index">
					<view class="user">
						<image :src="item.avatar?'http://app.yinyo.net'+item.avatar:'../../../static/home/nikeName.png'" mode=""></image>
						<view class="">
							用户名: {{item.nickname}}
						</view> 
					</view>
					<view class="telPhone">
						<view class="phone">
							电话号码: <text style="color:#E93B3D;margin-left:10rpx;" @click="telPhone(item.phone)">{{item.phone}}</text>
						</view> 
					</view>
				</view>

				<view class="btn" @click="close">
					知道了
				</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	import {putGoods,soldOutGoods,onGoods,offGoods,removeGood,interestPeople} from '@/api/my/my.js'
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
				list:["已上架","已下架"],
				upList:[],
				outList:[],
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
				modelVisible:false,
				interestList:[]
			}
		},
		methods: {
			// 跳转商品详情页
			toShopInfo(item){
				uni.navigateTo({
					url: '/pages/shop/shopInfo/shopInfo?detailDate=' + encodeURIComponent(JSON.stringify(item))
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
					putGoods({
						page:page.num,
						token:this.$store.getters.accessToken
					}).then(res=>{
						console.log(res,"上架")
						if(page.num == 1){
							this.upList = []; //如果是第一页需手动置空列表
						}
							this.upList = this.upList.concat(res.data.data); //追加新数据
							this.mescroll.endBySize(res.data.data.length, res.data.count)
					})
				}else{
					soldOutGoods({
						page:page.num,
						token:this.$store.getters.accessToken
					}).then(res=>{
						console.log(res,"下架")
						if(page.num == 1){
							this.outList = []; //如果是第一页需手动置空列表
						}
							this.outList = this.outList.concat(res.data.data); //追加新数据
							this.mescroll.endBySize(res.data.data.length, res.data.count)
					})
				}
			
			},
			// 下架商品
			removeGoods(id){
				offGoods({
					id:id
				}).then(res=>{
					uni.showToast({
						icon:"none",
						title:"下架成功"
					})
					this.mescroll.resetUpScroll();
				})
			},
			// 上架商品
			upGoods(id){
				onGoods({
					id:id
				}).then(res=>{
					uni.showToast({
						icon:"none",
						title:"上架成功"
					})
					this.mescroll.resetUpScroll();
				})
			},
			// 删除商品
			deleteGoods(id){
				removeGood({
					id
				}).then(res=>{
					uni.showToast({
						icon:"none",
						title:res.data.msg
					})
					this.mescroll.resetUpScroll();
				})
			},
			// 跳转商品编辑页
			toShopEdit(id){
				uni.navigateTo({
					url: '/pages/my/editShop/editShop?id=' + id
				});
			},
			// 感兴趣的人
			peopleLike(id){
				this.modelVisible = true;
				interestPeople({
					id
				}).then(res=>{
					this.interestList = res.data.data;
				})
			},
			close(){
				this.modelVisible = false;
			},
			// 拨打电话
			telphone(item){
				uni.makePhoneCall({
				    phoneNumber: item //仅为示例
				});
			},
		}
	}
</script>

<style lang="scss" scoped>
	.publishView{
		// background-color: #e0e0e0;
		// 弹窗外遮罩
		.mask{
			position: fixed;
			background-color: rgba(100,100,100,0.3);
			width: 100%;
			height: 100%;
			top: 0;
			z-index: 9999;
		}
		// 自定义弹窗
		.selfModel{
			width: 600rpx;
			overflow-y: auto;
			max-height:400px;
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
			.list{
				border: 1px solid #999;
				padding: 10rpx;
				margin-bottom:20rpx;
				.user{
					display: flex;
					align-items: center;
					line-height: 70rpx;
					image{
						width: 50rpx;
						height: 50rpx;
						margin-right: 20rpx;
					}
				}
				.telPhone{
					line-height: 70rpx;
					padding-left: 70rpx;
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
			// top:88rpx;
			background-color: #FFFFFF;
			/deep/.v-tabs .v-tabs__item{
				width:50%;
				justify-content: center;
			}
		}
		.content{
			padding: 0 30rpx;
			margin-top: 110rpx;
			.list{
				background-color: #fff;
				height: 210rpx;
				padding:10rpx;	
				margin-bottom: 20rpx;
				position: relative;
				border: 1px solid #e0e0e0;
				.checkMask{
					position: absolute;
					width: 100%;
					height: 100%;
					background-color: rgba(200,200,200,.3);
					z-index: 999;
					top: 0;
					left: 0;
					font-size: 40px;
					color: #fff;
					text-align: center;
					line-height: 210rpx;
				}
				
				.innerList{
					border-bottom: 1px solid #E8E8E8;
					height: 150rpx;
					width: 100%;
					display: flex;
					align-items: center;
					justify-content: space-between;
				}	
				.innerBottom{
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-top: 10rpx;
					.interest{
						display: flex;
						align-items: center;
						image{
							width: 23rpx;
							height: 19rpx;
						}
						.likePeople{
							font-size: 12px;
							color: #333333;
							margin-left: 10rpx;
						}
					}
					.operation{
						display: flex;
						align-items: center;
						.edit{
							width: 100rpx;
							display: flex;
							height: 50rpx;
							align-items: center;
							justify-content: space-around;
							background-color: #E0E0E0;
							// height: 40rpx;
							font-size: 13px;
							color: #fff;
							image{
								width: 26rpx;
								height: 26rpx;
							}
						}
						.down{
							width: 100rpx;
							height: 50rpx;
							background-color: #FF4900;
							font-size: 12px;
							color: #fff;
							display: flex;
							align-items: center;
							justify-content: center;
						}
					}
				}
				
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
						color: #fff;
						font-size: 14px;
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
						color: #fff;
						font-size: 14px;
						image{
							width: 64rpx;
							height: 64rpx;
						}
					}
				}
			}
		}		
	}
</style>
