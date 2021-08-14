import request from './request'
/**
 * 登录 注册 退出登录
 */
export const 
login = params => request({ url: '/api/login/login', methods: 'POST' , data: params });
export const 
registerTo = params => request({ url: '/api/login/register', methods: 'POST' , data: params });