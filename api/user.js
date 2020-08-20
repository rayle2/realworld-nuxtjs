import { request } from '@/plugins/request'

export const login = data => {
  return request({
    url: '/api/users/login',
    method: 'POST',
    data,
  })
}

export const register = data => {
  return request({
    url: '/api/users',
    method: 'POST',
    data,
  })
}

// 获取用户资料
export const getProfile = username => {
  return request({
    url: `/api/profiles/${username}`,
    method: 'GET',
  })
}

// 获取用户信息
export const getCurrentUser = () => {
  return request({
    url: '/api/user',
    method: 'GET',
  })
}

// 更新用户信息
// export const updateUser = data => {
//   return request({
//     url: '/api/user',
//     method: 'PUT',
//     data,
//   })
// }

export const updateUser = data => {
  return request({
    method: 'PUT',
    url: '/api/user',
    data,
  })
}
