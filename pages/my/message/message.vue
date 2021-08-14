<template>
	<view class="messageView">
		<view class="list">
			<view class="des">
				头像
			</view>
			<image @click="uploadImg"
			 class="avatar" :src="userInfo.avatar?'http://app.yinyo.net'+userInfo.avatar:'/static/home/nikeName.png'" mode=""></image>
		</view>
		<view class="list com">
			<view class="des">
				昵称
			</view>
			<input type="text" autocomplete="off" placeholder="请输入昵称" v-model="userInfo.nickname"  class="uni-input fl" />
		</view>
		<view class="list com">
			<view class="des">
				性别
			</view>
			<picker class="picker" @change="bindPickerChange" :value="userInfo.gender" :range="array">
				<view class="uni-input">{{array[userInfo.gender]}}</view>
			</picker>
			<image class="yjt" src="../../../static/home/yjt.png" mode=""></image>
		</view>
		<view class="list com">
			<view class="des">
				联系方式
			</view>
			<input type="number" disabled autocomplete="off" placeholder="请输入电话号码" v-model="userInfo.phone"  class="uni-input fl" />
		</view>
		<view class="list com">
			<view class="des">
				微信号
			</view>
			<input type="text" autocomplete="off" placeholder="请输入微信号码" v-model="userInfo.weixin"  class="uni-input fl" />
		</view>
		<view class="list com">
			<view class="des">
				生日
			</view>
			<picker class="datePicker" mode="date" :value="userInfo.birth" @change="bindDateChange">
                <view class="uni-input">{{userInfo.birth}}</view>
            </picker>
		</view>
		<view class="list com" style="height:auto;min-height:80rpx;">
			<view class="des">
				自我介绍
			</view>
			<textarea class="textarea" maxlength="200" 
			placeholder="请输入简介" @blur="bindTextAreaBlur" :value="userInfo.description" auto-height />
		</view>
		<view class="btn">
			<button class="btnLogin" @click="submit">确 认</button>
		</view>
	</view>
</template>

<script>
	import common from '@/api/common.js'
	import {showUserInfo,completeUserInfo,getUserInfo} from '@/api/my/my.js'
	export default {
		data() {
			return {
				array: ['女', '男'],
				userInfo:{}
			}
		},
		onLoad() {
			showUserInfo({
				token:this.$store.getters.accessToken,
			}).then(res=>{
				this.userInfo=res.data.data;
			})
		},
		methods: {
			bindDateChange: function(e) {
			    this.userInfo.birth = e.target.value;
				console.log(this.userInfo.birth);
			},
			bindPickerChange: function(e) {
				console.log('picker发送选择改变，携带值为', e.target.value)
				this.userInfo.gender = e.target.value
			},
			 bindTextAreaBlur: function (e) {
				console.log(e.detail.value);
				this.userInfo.description=e.detail.value;
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
								self.userInfo.avatar=JSON.parse(uploadFileRes.data).data.saveName;
							}
						});
				    }
				});
			},
			submit(){
				completeUserInfo({
					...this.userInfo,
					token:this.$store.getters.accessToken
				}).then(res=>{
					uni.showToast({
						icon:"none",
						title:res.data.msg
					})
					// 登录成功后获取用户信息
					getUserInfo({
						token:this.$store.getters.accessToken,
					}).then(res=>{
						this.$store.commit('SET_USER_INFO',res.data.data);
					})
					// 不加延时看不到提示信息 
					setTimeout(()=>{
						uni.navigateTo({
							url:'/pages/my/my'
						})
					},1000)
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.messageView{
		.list{
			height: 150rpx;
			padding:0 30rpx;
			border-bottom:1px solid #F3F3F3;
			display: flex;
			align-items: center;
			justify-content: space-between;
			.des{
				font-size:30rpx;
				font-family:Adobe Heiti Std;
				font-weight:600;
				color:rgba(0,0,0,1);
				line-height:16rpx;
			}
			.avatar{
				width: 122rpx;
				height: 122rpx;
			}
			&.com{
				height:80rpx;
				.fl{
					width: 80%;
					text-align: right;
					font-size: 30rpx;
					color: grey;
				}
				.yjt{
					width: 28rpx;
					height: 28rpx;
					margin-right: 10rpx;
				}
				.picker{
					width: 80%;
					text-align: right;
					color: grey;
					font-size: 30rpx;
				}
				.datePicker{
					width: 80%;
					height: 40rpx;
					color: grey;
					text-align: right;
					font-size: 30rpx;
				}
				.textarea{
					width: 80%;
					color: grey;
					text-align: right;
					font-size: 30rpx;
				}
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
