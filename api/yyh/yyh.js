import request from '../request.js'
/**
 * 亦有汇
 */
// 获取tab栏
export const 
getYyhTabs = params => request({ url: '/api/topic/getForum', methods: 'POST' , data: params });
// 获取tab栏下的数据
export const 
yyhList = params => request({ url: '/api/topic/index', methods: 'POST' , data: params });
// 获取帖子详情
export const 
getYyhInfo = params => request({ url: '/api/topic/topicInfo', methods: 'POST' , data: params });
//添加帖子
export const 
createYyh = params => request({ url: '/api/topic/add_goods', methods: 'POST' , data: params });
// 收藏帖子
export const 
collectYyh = params => request({ url: '/api/topic/collection', methods: 'POST' , data: params });
// 取消收藏帖子
export const 
cancelCollectYyh = params => request({ url: '/api/topic/removeCollection', methods: 'POST' , data: params });
// 点赞
export const 
giveLike = params => request({ url: '/api/topic/getlike', methods: 'POST' , data: params });
// 回复
export const 
remarkYyh = params => request({ url: '/api/topic/getDiscuss', methods: 'POST' , data: params });