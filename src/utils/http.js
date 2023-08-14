import axios from 'axios'
import { ref} from 'vue'
import { ElMessage,ElLoading } from 'element-plus'
import 'element-plus/theme-chalk/el-message.css'
import router from '@/router'
import { useUserStore } from '@/stores/user'

// 创建axios实例
const http = axios.create({
    baseURL: 'https://localhost:7064/api/',
    timeout: 5000

})
const LoadingObj=ref(null)
// axios请求拦截器
http.interceptors.request.use(config => {
    //LoadingObj.vlaue={""},
    LoadingObj.value = ElLoading.service({
        lock: true,
        text: '加载中……',
        background: 'rgba(0, 0, 0, 0.7)',
    })
    

    //1 从pinia中拿到数据
    const userStore = useUserStore()
    //按后端要求拼接数据
    //console.log(userStore.userInfo)
    const token=userStore.userInfo.token
    if(token){
        config.headers.Authorization=`Bearer ${token}`
    }
    return config
}, e => Promise.reject(e))

// axios响应式拦截器
http.interceptors.response.use(res => {
    LoadingObj.value.close()
    //没有添加加载中的
    // const head=res.headers
    // console.log(head);
    return res
}, e => {
    LoadingObj.value.close()
    const userStore = useUserStore()
    //const router = useRouter()
    ElMessage({ type: 'warning', message: e.response.data })
    // token失效处理
    // 1、清空用户数据
    // 2、路由跳转
    if(e.response.status===401 || e.response.status===403){
        userStore.clearUserInfo()
        router.push('/Login')
    }
    return Promise.reject(e)
})


export default http