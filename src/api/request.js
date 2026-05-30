import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router'

const API_BASE =
  import.meta.env.MODE === 'development'
    ? '/api'
    : 'https://blog-api-cjw6.onrender.com/api'

const request = axios.create({
  baseURL: API_BASE,
  timeout: 10000
})

request.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

request.interceptors.response.use(
  response => response.data,
  error => {
    const status = error.response?.status
    const message = error.response?.data?.message || error.message || '请求失败'

    if (status === 401) {
      localStorage.removeItem('token')
      if (router.currentRoute.value.path.startsWith('/admin')) {
        router.push('/login')
      }
      ElMessage.error(message)
    } else {
      ElMessage.error(message)
    }

    return Promise.reject(error)
  }
)

export default request
