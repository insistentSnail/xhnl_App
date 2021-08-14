<template>
	<view class="articleView">
		<view class="list">
			<view class="des">
				标题
			</view>
			<input type="text" autocomplete="off" placeholder="请填写文章标题(不超过14个字)" v-model="newsInfo.title"  class="uni-input fl" />
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
		<view class="list" style="height:auto;min-height:80rpx;">
			<view class="des">
				描述
			</view>
			<textarea class="textarea" maxlength="200" placeholder="请输入描述" @blur="bindTextAreaBlur" :value="newsInfo.description" auto-height />
		</view>
		<view class="list type">
			<view class="des">
				文章分类
			</view>
			<picker class="picker" @change="bindPickerChange" :value="index" :range="array">
				<view class="uni-input">{{array[index]}}</view>
			</picker>
			<image class="yjt" src="../../../static/home/yjt.png" mode=""></image>
		</view>
		<!-- 图片上传 -->
		<view class="imgUpload">
			<view class="tip">
				请上传封面
			</view>
			<view class="img">
				<image :src="src" mode="" v-if="src" style="margin-right: 10px;"></image>
				<image src="../../../static/home/uploadImg.png" mode="" @click="uploadImg"></image>
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
	import common from '@/api/common.js'
	import {createNews,getTabs,indexType} from '@/api/index/index.js'
	import {myNews,editNews} from '@/api/my/my.js'
	export default {
		data() {
			return {
				array: [],
				arr:[],//带有id的数组
				index: 0,
				text:"",
				src:"",//展示的图片地址
				submitSrc:"",//传给后台的图片地址
				id:"",
				newsInfo:{}
			}
		},
		onLoad(e) {
			// if(JSON.stringify(e)!='{}'){
			// 	this.text=e.text;
			// }
			this.id = e.id;
			uni.removeStorageSync('editNewText');
			// 注意链式调用
			// getTabs().then(res=>{
			// 	var tab = res.data.data.map(ele=>ele.title);
			// 	this.array=tab;
			// 	this.arr = res.data.data;
			// 	this.array.unshift("请选择");
			// 	this.arr.unshift({id:"",title:"请选择"});
			// 	console.log(this.arr);
			// 	return myNews({
			// 		id:this.id
			// 	})
			// })
			indexType({
				token:this.$store.getters.accessToken,
			}).then(res=>{
				var tab = res.data.data.map(ele=>ele.title);
				this.array=tab;
				this.arr = res.data.data;
				this.array.unshift("请选择");
				this.arr.unshift({id:"",title:"请选择"});
				return myNews({
					id:this.id
				})
			})
			.then(res=>{
				this.newsInfo = res.data.data;
				this.text = this.newsInfo.content;
				this.src = this.newsInfo.image;
				this.index = this.arr.findIndex((ele)=>
				  ele.id == this.newsInfo.category_id
				)
			})
		},
		onShow() {
			this.text=uni.getStorageSync('editNewText');
		},
		methods: {
			bindPickerChange: function(e) {
				console.log('picker发送选择改变，携带值为', e.target.value)
				this.index = e.target.value
			},
			bindTextAreaBlur: function (e) {
				console.log(e.detail.value);
				this.newsInfo.description=e.detail.value;
			},
			// 进入富文本编辑器页面
			toEditor(){
				uni.navigateTo({
					url:'./editor/editor?text=' + this.text
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
								console.log(JSON.parse(uploadFileRes.data).data.saveName);//json字符串需要转一下
								self.src=common.host+JSON.parse(uploadFileRes.data).data.saveName;
								self.submitSrc=JSON.parse(uploadFileRes.data).data.saveName;
							}
						});
				    }
				});
			},
			// 发布
			submit(){
				var submitSrc = this.src.replace('http://app.yinyo.net','');
				
				if(this.newsInfo.title==''){
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
				if(this.newsInfo.description==''){
					uni.showToast({
						title:"请输入描述",
						icon:"none"
					})
					 return false;
				}
				if(submitSrc==''){
					uni.showToast({
						title:"请上传封面",
						icon:"none"
					})
					 return false;
				}
				if(this.index==0){
					uni.showToast({
						title:"请选择文章类别",
						icon:"none"
					})
					 return false;
				}
				var obj={
					id:this.id,
					token:this.$store.getters.accessToken,
					category_id:this.arr[this.index].id,
					title:this.newsInfo.title,
					content:this.text,
					description:this.newsInfo.description,
					image:submitSrc	
				}
				editNews(obj).then(res=>{
					console.log(res);
					uni.showToast({
						icon:"none",
						title:res.data.msg
					})
					// 不加延时看不到提示信息 
					setTimeout(()=>{
						uni.navigateTo({
							url:'/pages/my/publish/publish'
						})
					},1000)
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.articleView{
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

