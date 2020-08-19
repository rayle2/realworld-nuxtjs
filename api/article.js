import { request } from '@/plugins/request'

// 获取公共文章列表
export const getArticles = params => {
  return request({
    url: '/api/articles',
    method: 'GET',
    params,
  })
}

// 获取个人文章列表
export const getYourFeedArticles = params => {
  return request({
    url: '/api/articles/feed',
    method: 'GET',
    params,
  })
}

// 添加点赞
export const addFavorite = slug => {
  return request({
    url: `/api/articles/${slug}/favorite`,
    method: 'POST',
  })
}


// 取消点赞
export const deleteFavorite = slug => {
  return request({
    url: `/api/articles/${slug}/favorite`,
    method: 'DELETE',
  })
}

// 获取文章详情
export const getArticle = slug => {
  return request({
    url: `/api/articles/${slug}`,
    method: 'GET',
  })
}

// 获取评论
export const getComments = slug => {
  return request({
    url: `/api/articles/${slug}/comments`,
    method: 'GET',
  })
}

// 关注用户
export const addFollow = username => {
  return request({
    url: `/api/profiles/${username}/follow`,
    method: 'POST',
  })
}


// 取消关注
export const deleteFollow = username => {
  return request({
    method: 'DELETE',
    url: `/api/profiles/${username}/follow`,
  })
}

// 提交一篇新文章
export const createArticle = data => {
  return request({
    method: 'POST',
    url: '/api/articles',
    data
  })
}
