import axios from 'axios'

const request = axios.create({
  baseURL: 'https://conduit.productionready.io',
})

// 请求拦截器
// request.interceptors.request.use(function (config) {
//   config.headers.Authorization = `Token `
//   return config
// }, function (error) {
//   // 如果请求失败(此时请求还没发出)，就会进入这里
//   return Promise.reject(error)
// })

// 相应拦截器

export default request
