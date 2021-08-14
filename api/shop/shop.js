import request from '../request.js'
/**
 * 首页
 */
// 获取tab栏
export const 
getShopTabs = params => request({ url: '/api/shop/getCommodity', methods: 'POST' , data: params });
// 获取tab栏下的数据
export const 
shopList = params => request({ url: '/api/shop/getIndex', methods: 'POST' , data: params });
// 获取商品详情
export const 
getNewsInfo = params => request({ url: '/api/shop/shopInfo', methods: 'POST' , data: params });
// 收藏帖子
export const 
shopCollect = params => request({ url: '/api/shop/collection', methods: 'POST' , data: params });
// 取消收藏
export const 
shopCancelCollect = params => request({ url: '/api/shop/removeCollection', methods: 'POST' , data: params });
// 我想要
export const 
myWant = params => request({ url: '/api/shop/want', methods: 'POST' , data: params });
// 我不想要
export const 
myNotWant = params => request({ url: '/api/shop/notwant', methods: 'POST' , data: params });
// 添加商品
export const 
addGoods = params => request({ url: '/api/shop/add_goods', methods: 'POST' , data: params });
// 商品编辑获取电话号码
export const 
getShopTel = params => request({ url: '/api/user/get_user_info', methods: 'POST' , data: params });
// 商品分类
export const 
shopType = params => request({ url: '/api/shop/user_category', methods: 'POST' , data: params });