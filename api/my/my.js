import request from '../request.js'
/**
 * 首页
 */
// 用户信息
export const 
getUserInfo= params => request({ url: '/api/user/get_user_info', methods: 'POST' , data: params });
// 展示完善用户信息
export const 
showUserInfo = params => request({ url: '/api/user/get_perfect_info', methods: 'POST' , data: params });
// 完善用户信息
export const 
completeUserInfo = params => request({ url: '/api/user/perfectInfo', methods: 'POST' , data: params });
// 我的收藏
export const 
myCollect = params => request({ url: '/api/user/getCollection', methods: 'POST' , data: params });
// 我的新闻
export const 
myNews = params => request({ url: '/api/user/my_new_info', methods: 'POST' , data: params });
// 编辑新闻
export const 
editNews = params => request({ url: '/api/user/edit_my_new', methods: 'POST' , data: params });
// 我的帖子
export const 
myInvitation = params => request({ url: '/api/user/my_topic_info', methods: 'POST' , data: params });
// 编辑我的帖子
export const 
editMyInvitation = params => request({ url: '/api/user/edit_my_topic', methods: 'POST' , data: params });
// 我的新闻发布
export const 
myNewsPublish = params => request({ url: '/api/user/my_release', methods: 'POST' , data: params });
// 我的帖子发布
export const 
myInvitationPublish = params => request({ url: '/api/user/my_release_topic', methods: 'POST' , data: params });
// 上架商品列表
export const 
putGoods = params => request({ url: '/api/user/listed_goods', methods: 'POST' , data: params });
// 下架商品列表
export const 
soldOutGoods = params => request({ url: '/api/user/off_goods', methods: 'POST' , data: params });
// 上架商品
export const 
onGoods = params => request({ url: '/api/user/on_good', methods: 'POST' , data: params });
// 下架商品
export const 
offGoods = params => request({ url: '/api/user/off_good', methods: 'POST' , data: params });
// 删除新闻
export const 
removeNews = params => request({ url: '/api/user/remove_new', methods: 'POST' , data: params });
// 删除帖子
export const 
removeInvitation = params => request({ url: '/api/user/remove_topic', methods: 'POST' , data: params });
// 删除商品
export const 
removeGood = params => request({ url: '/api/user/remove_goods', methods: 'POST' , data: params });
// 商品信息
export const 
goodsInfo = params => request({ url: '/api/user/my_goods_info', methods: 'POST' , data: params });
// 编辑商品信息
export const 
editGoodsInfo = params => request({ url: '/api/user/edit_my_goods', methods: 'POST' , data: params });
// 修改密码
export const 
changePassword = params => request({ url: '/api/user/change_password', methods: 'POST' , data: params });
// 发送验证码
export const 
sendYzm = params => request({ url: '/api/login/message', methods: 'POST' , data: params });
// 忘记密码
export const 
forgetPsw = params => request({ url: '/api/login/forget', methods: 'POST' , data: params });
// 我感兴趣的商品
export const 
interestShop = params => request({ url: '/api/user/my_interested', methods: 'POST' , data: params });
// 感兴趣的人
export const 
interestPeople = params => request({ url: '/api/user/inter_people', methods: 'POST' , data: params });