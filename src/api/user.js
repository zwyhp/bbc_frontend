import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'get'
  })
}

export function register(data) {
  return request({
    url: '/register',
    method: 'post',
    data
  })
}

export function getlist(queryInfo) {
  return request({
    url: '/admin/users',
    method: 'get',
    params: queryInfo
  })
}

export function updateBlack(id) {
  return request({
    url: '/admin/updateBlack/' + id,
    method: 'put'
  })
}
