import request from '@/utils/request'

export function getMessage(queryInfo) {
  return request({
    url: '/owner/message',
    method: 'get',
    params: queryInfo
  })
}

export function getMessageid(id) {
  return request({
    url: '/owner/getmessage/' + id,
    method: 'get'
  })
}

export function checkMessage(id) {
  return request({
    url: '/owner/checkMessage/' + id,
    method: 'put'
  })
}

export function stickMessage(id) {
  return request({
    url: '/owner/stickMessage/' + id,
    method: 'put'
  })
}

export function deleteMessage(id) {
  return request({
    url: '/owner/deleteMessage/' + id,
    method: 'delete'
  })
}

