import axios from 'axios'

axios.defaults.withCredentials = true
axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest'
axios.defaults.headers.post['Content-Type'] = 'application/json'

// 创建 Axios 实例，设置基础配置
const axiosInstance = axios.create({
  baseURL: 'https://canyyang.xyz:7001', // 替换为你的 API 基础 URL
  timeout: 10000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // 或从 cookies 获取
    if (token) {
      config.headers['Authorization'] =token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器，统一处理响应数据
axiosInstance.interceptors.response.use(
  (response) => {
    if (response.data.code === 401) {
      window.location.href = '/login'
      console.log('response', response)
    }
    return response.data; // 返回响应数据
  },
  (error) => {
    // 统一处理错误
    console.error('请求错误：', error);
    return Promise.reject(error);
  }
);

export default axiosInstance;