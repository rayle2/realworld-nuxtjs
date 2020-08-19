const cookieparser = process.server ? require('cookieparser') : undefined


// 服务端渲染期间运行的都是同一个实例
// 防止数据冲突，务必把state定义成一个函数，返回数据对象
export const state = () => {
  return {
    // 当前登录用户的登录状态
    user: null,
  }
}

export const mutations = {
  setUser (state, user) {
    state.user = user
  },
}

export const actions = {
  // nuxt中特殊action
  // 在服务端期间自动调用
  // 用来初始化容器数据，传递数据给客户端使用
  nuxtServerInit ({ commit }, { req }) {
    let user = null
    if (req.headers.cookie) {
      const parsed = cookieparser.parse(req.headers.cookie)
      try {
        user = JSON.parse(parsed.user)
      } catch (err) {
        // No valid cookie found
      }
    }
    commit('setUser', user)
  },
}
