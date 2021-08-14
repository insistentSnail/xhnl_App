import request from '../request.js'
/**
 * 首页
 */
// 获取tab栏
export const 
getTabs = params => request({ url: '/api/index/getCategorys', methods: 'POST' , data: params });
// 获取tab栏下的数据
export const 
tabList = params => request({ url: '/api/index/index', methods: 'POST' , data: params });
// 获取新闻详情
export const 
getNewsInfo = params => request({ url: '/api/index/article', methods: 'POST' , data: params });
//新建新闻
export const 
createNews = params => request({ url: '/api/index/addnew', methods: 'POST' , data: params });
// 收藏新闻
export const 
collectNews = params => request({ url: '/api/index/collection', methods: 'POST' , data: params });
// 取消收藏
export const 
cancelCollectNews = params => request({ url: '/api/index/removeCollection', methods: 'POST' , data: params });

// 是否版本更新
export const 
update = params => request({ url: '/api/index/check_update', methods: 'POST' , data: params });
// 新闻文章分类
export const 
indexType = params => request({ url: '/api/index/user_category', methods: 'POST' , data: params });
