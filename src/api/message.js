import request from '@/utils/request'

export function getMessage(queryInfo) {
  return request({
    url: '/tourist/message',
    method: 'get',
    params: queryInfo
  })
}

export function messagetop(queryInfo) {
  return request({
    url: '/tourist/messagetop',
    method: 'get',
    params: queryInfo
  })
}

export function getcomment(queryInfo) {
  return request({
    url: '/tourist/comment',
    method: 'get',
    params: queryInfo
  })
}

export function addComment(data) {
  return request({
    url: '/tourist/comment',
    method: 'post',
    data
  })
}
export function addMessage(data) {
  return request({
    url: '/user/message',
    method: 'post',
    data
  })
}

export function getmessageid(id) {
  return request({
    url: '/tourist/message/' + id,
    method: 'get'
  })
}

