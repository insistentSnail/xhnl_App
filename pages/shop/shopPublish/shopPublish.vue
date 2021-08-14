<template>
	<view class="articleView">
		<view class="list">
			<view class="des">
				商品名称
			</view>
			<input type="text" autocomplete="off" placeholder="商品名称" v-model="title"  class="uni-input fl" />
		</view>
		<view class="list" @click="toEditor">
			<view class="des">
				编辑正文
			</view>
			<view class="editor" v-if="text">
			<!-- 	{{text}} -->
			</view>
			<view class="editor" v-else>
				请输入正文内容
			</view>
			<image class="yjt" src="../../../static/home/yjt.png" mode=""></image>
		</view>
		<view class="list">
			<view class="des">
				商品类别
			</view>
			<picker class="picker" @change="bindPickerChange" :value="index" :range="array">
				<view class="uni-input">{{array[index]}}</view>
			</picker>
			<image class="yjt" src="../../../static/home/yjt.png" mode=""></image>
		</view>
		<view class="list type">
			<view class="des">
				价格
			</view>
			<input type="number" autocomplete="off" placeholder="请输入价格" v-model="price"  class="uni-input fl" />
		</view>
		<view class="list">
			<view class="des">
				联系电话
			</view>
			<input type="number" disabled autocomplete="off" placeholder="请输入联系电话" v-model="phone"  class="uni-input fl" />
		</view>
		<view class="list">
			<pick-regions @getRegion="handleGetRegion">
			   <view class="des">
					点击请选择省市
			   </view>
			</pick-regions>
			<view style="color:grey;font-size: 15px;">{{regionName}}</view>
		</view>
		<view class="detail">
			<view class="des">
				详细地址
			</view>
			<view class="detailContent">
				<textarea class="textarea" placeholder="请输入详细地址" @blur="bindTextAreaBlur" :value="info" auto-height />
			</view>
		</view>
		<!-- 图片上传 -->
		<view class="imgUpload">
			<view class="tip">
				请上传封面 (最多上传一张图片)
			</view>
			<view class="img">
				<image :src="src" mode="" v-if="src" style="margin-right: 10px;"></image>
				<image src="../../../static/home/uploadImg.png" mode="" @click="uploadImg"></image>
			</view>
			<view class="hint">
				(尺寸：640*396)
			</view>
		</view>
		<!-- 轮播图上传 -->
		<view class="imgUpload">
			<view class="tip">
				请上传商品轮播图 (最多上传五张图片)
			</view>
			<view class="img">
				<image v-for="(item,index) in src2" :key="index"
				 :src="item" mode="" v-if="src2.length" style="margin-right: 10px;"></image>
				<image src="../../../static/home/uploadImg.png" mode="" @click="uploadImg2"></image>
			</view>
			<view class="hint">
				(尺寸：640*396)
			</view>
		</view>
		<view class="btn">
			<button class="btnLogin" @click="submit">发 布</button>
		</view>
	</view>
</template>

<script>
	import pickRegions from '@/components/pick-regions/pick-regions.vue'
	import common from '@/api/common.js'
	import {getShopTabs,shopList,addGoods,getShopTel,shopType} from '@/api/shop/shop.js'
	export default {
		components: {
			pickRegions
		},
		data() {
			return {
				title:"",
				array: [],//展示的下拉值
				arr:[],//传给后台的下拉值
				index: 0,
				text:"",
				price:"",
				phone:"",
				info:"",
				src:"",//展示的图片地址
				submitSrc:"",//传给后台的图片地址
				src2:[],//展示的图片地址
				submitSrc2:[],//传给后台的图片地址
				// 三级联动城市选择
				region:[]
			}
		},
		 computed:{
			regionName(){
				// 转为字符串
				return this.region.map(item=>item.name).join(' ')
			}
		},
		onLoad(e) {
			uni.removeStorageSync('shopText');
			// getShopTabs().then(res=>{
			// 	var tab = res.data.data.map(ele=>ele.name);
			// 	this.array=tab;
			// 	this.arr = res.data.data;
			// 	this.array.unshift("请选择");
			// 	this.arr.unshift({id:"",title:"请选择"});
			// })
			shopType({
				token:this.$store.getters.accessToken
			}).then(res=>{
				var tab = res.data.data.map(ele=>ele.name);
				this.array=tab;
				this.arr = res.data.data;
				this.array.unshift("请选择");
				this.arr.unshift({id:"",title:"请选择"});
			})
			getShopTel({
				token:this.$store.getters.accessToken,
			}).then(res=>{
				this.phone = res.data.data.phone;
			})
		},
		onShow() {
			this.text=uni.getStorageSync('shopText');
		},
		methods: {
			// 三级联动城市选择
			   // 获取选择的地区
			handleGetRegion(region){
				this.region = region
			},
			bindPickerChange: function(e) {
				console.log('picker发送选择改变，携带值为', e.target.value)
				this.index = e.target.value
			},
			bindTextAreaBlur: function (e) {
				console.log(e.detail.value);
				this.info=e.detail.value;
			},
			// 进入富文本编辑器页面
			toEditor(){
				uni.navigateTo({
					url:'./editor/editor?text='+this.text
				})
			},
			// 上传图片
			uploadImg(){
				self = this;
				uni.chooseImage({
				    count: 1, //默认9
				    sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				    sourceType: ['album'], //从相册选择
				    success: function (res) {
				        console.log(JSON.stringify(res.tempFilePaths));
						uni.uploadFile({
							url: common.host+'/api/upload/uploadImage1', //仅为示例，非真实的接口地址
							filePath: res.tempFilePaths[0],
							name: 'file',
							formData: {
								'user': 'test'
							},
							success: (uploadFileRes) => {
								console.log(uploadFileRes.data);
								self.src=common.host+JSON.parse(uploadFileRes.data).data.saveName;
								self.submitSrc=JSON.parse(uploadFileRes.data).data.saveName;
							}
						});
				    }
				});
			},
			// 上传轮播图
			uploadImg2(){
				self = this;
				uni.chooseImage({
				    count: 1, //默认9
				    sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				    sourceType: ['album'], //从相册选择
				    success: function (res) {
				        console.log(JSON.stringify(res.tempFilePaths));
						uni.uploadFile({
							url: common.host+'/api/upload/uploadImage1', //仅为示例，非真实的接口地址
							filePath: res.tempFilePaths[0],
							name: 'file',
							formData: {
								'user': 'test'
							},
							success: (uploadFileRes) => {
								console.log(uploadFileRes.data);
								// 注意,push以后返回值是length
								if(self.src2.length>4){
									self.src2.shift();
									self.src2.push(common.host+JSON.parse(uploadFileRes.data).data.saveName);
									self.submitSrc2.shift();
									self.submitSrc2.push(JSON.parse(uploadFileRes.data).data.saveName);
								}else{
									self.src2.push(common.host+JSON.parse(uploadFileRes.data).data.saveName);
									self.submitSrc2.push(JSON.parse(uploadFileRes.data).data.saveName);
								}
							}
						});
				    }
				});
			},
			// 发布
			submit(){
				if(this.title==''){
					uni.showToast({
						title:"请输入标题",
						icon:"none"
					})
					 return false;
				}
				if(this.text==''){
					uni.showToast({
						title:"请输入正文",
						icon:"none"
					})
					 return false;
				}
				if(this.price==''){
					uni.showToast({
						title:"请输入价格",
						icon:"none"
					})
					 return false;
				}
				if(this.phone==''){
					uni.showToast({
						title:"请输入联系电话",
						icon:"none"
					})
					 return false;
				}
				if(!(/^1[3456789]\d{9}$/.test(this.phone))){ 
					uni.showToast({
						title:"请输入正确的号码格式",
						icon:"none"
					})
					return false;
				} 
				if(this.regionName==''){
					uni.showToast({
						title:"请选择省市",
						icon:"none"
					})
					 return false;
				}
				if(this.info==''){
					uni.showToast({
						title:"请输入详细地址",
						icon:"none"
					})
					 return false;
				}
				if(this.submitSrc==''){
					uni.showToast({
						title:"请上传封面",
						icon:"none"
					})
					 return false;
				}
				if(this.submitSrc2.length==0){
					uni.showToast({
						title:"请上传商品轮播图",
						icon:"none"
					})
					 return false;
				}
				if(this.index==0){
					uni.showToast({
						title:"请选择商品类别",
						icon:"none"
					})
					 return false;
				}
				addGoods({
					token:this.$store.getters.accessToken,
					title:this.title,
					info:this.text,
					cid:this.arr[this.index].id,
					price:this.price,
					phone:this.phone,
					address:this.info,
					province:this.regionName,
					images:this.submitSrc2,
					image:this.submitSrc	
				}).then(res=>{
					uni.showToast({
						icon:"none",
						title:res.data.msg
					})
					// 不加延时看不到提示信息 
					setTimeout(()=>{
						uni.switchTab({
							url:'/pages/shop/shop'
						})
					},1000)
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.articleView{
		padding-bottom:40rpx;
		.detail{
			padding:0 30rpx;
			padding-bottom: 10rpx;
			border-bottom:16rpx solid #F3F3F3;
			.detailContent{
				width:690rpx;
				height:350rpx;
				border: 1px solid #f3f3f3;
				.textarea{
					width: 100%;
					font-size:28rpx;
					font-family:Adobe Heiti Std;
					font-weight:normal;
					color:rgba(153,153,153,1);
					text-indent: 20rpx;
				}
			}
			.des{
				font-size:30rpx;
				font-family:Adobe Heiti Std;
				font-weight:600;
				color:rgba(0,0,0,1);
				line-height:80rpx;
			}
		}
		.list{
			height: 80rpx;
			padding:0 30rpx;
			border-bottom:1px solid #F3F3F3;
			display: flex;
			align-items: center;
			justify-content: space-between;
			&.type{
				border-width: 16rpx;
			}
			.des{
				font-size:30rpx;
				font-family:Adobe Heiti Std;
				font-weight:600;
				color:rgba(0,0,0,1);
				line-height:16rpx;
			}
			.fl{
				width: 80%;
				text-align: right;
				font-size: 30rpx;
			}
			.yjt{
				width: 28rpx;
				height: 28rpx;
				margin-right: 10rpx;
			}
			.editor{
				width: 70%;
				text-align: right;
				color: grey;
				font-size: 30rpx;
				overflow: hidden;
				text-overflow:ellipsis;
				white-space: nowrap;
			}
			.picker{
				width: 70%;
				text-align: right;
				color: grey;
				font-size: 30rpx;
			}
			.textarea{
				width: 80%;
				color: grey;
				text-align: right;
				font-size: 30rpx;
			}
		}
		.imgUpload{
			padding:30rpx;
			.tip{
				font-size:28rpx;
				font-family:Source Han Sans CN;
				font-weight:600;
				color:rgba(0,0,0,1);
			}
			.img{
				height: 120rpx;
				display: flex;
				align-items: center;
				image{
					width: 100rpx;
					height: 100rpx;
				}
			}
			.hint{
				font-size:28rpx;
				font-family:Adobe Heiti Std;
				font-weight:normal;
				color:rgba(153,153,153,1);
			}
		}
		.btn{
			margin-top:90rpx;
			// margin-bottom: 40rpx;
			.btnLogin{
				width:620rpx;
				height:90rpx;
				background:rgba(0,202,116,1);
				border-radius:45px;
				font-size:30rpx;
				font-family:Adobe Heiti Std;
				font-weight:normal;
				color:rgba(255,255,255,1);
				line-height:90rpx;
			}
		}
	}
</style>

