import axios from 'axios'

export const request = axios.create({
  // baseURL: 'https://conduit.productionready.io',
  baseURL: 'http://realworld.api.fed.lagounews.com',
})

// 请求拦截器
// 通过context取到store
export default ({ store }) => {
  request.interceptors.request.use(function (config) {
    const { user } = store.state
    if (user && user.token) {
      config.headers.Authorization = `Token ${user.token}`
    }
    return config
  }, function (error) {
    // 如果请求失败(此时请求还没发出)，就会进入这里
    return Promise.reject(error)
  })

  // 相应拦截器
}
