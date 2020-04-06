import request from '@/utils/request'

export function addCategory(data) {
  return request({
    url: '/admin/addcategory',
    method: 'post',
    data
  })
}

export function getCategory(queryInfo) {
  return request({
    url: '/admin/category',
    method: 'get',
    params: queryInfo
  })
}

export function updateCategory(data) {
  return request({
    url: '/admin/category',
    method: 'put',
    data
  })
}

export function deleteCategory(id) {
  return request({
    url: '/admin/category/' + id,
    method: 'delete'
  })
}

export function getcategory() {
  return request({
    url: '/tourist/getcategory',
    method: 'get'
  })
}

