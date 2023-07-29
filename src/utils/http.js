import axios from 'axios'

// 创建axios实例
const http = axios.create({
   baseURL: 'https://localhost:7064/api/',
    timeout: 5000
    
})

// axios请求拦截器
http.interceptors.request.use(config => {
    return config
}, e => Promise.reject(e))

// axios响应式拦截器
http.interceptors.response.use(res => res.data, e => {
    console.log(e);
    return Promise.reject(e)
})


export default http