import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: 'http://127.0.0.1:8080/', // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    axios.defaults.withCredentials = true
    // do something before request is sent
    config.headers['admin_token'] = getToken()
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data

    // if the custom code is not 20000, it is judged as an error.
    if (res.errno !== 200) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      if (res.errno === 501) {
        MessageBox.alert('权限不足，请重新登录', '错误', {
          confirmButtonText: '确定',
          type: 'error'
        }).then(() => {
          store.dispatch('FedLogOut').then(() => {
            location.reload()
          })
        })
        return Promise.reject('error')
      } else if (res.errno === -1) {
        MessageBox.alert('系统内部错误，请联系管理员维护', '错误', {
          confirmButtonText: '确定',
          type: 'error'
        })
        return Promise.reject('error')
      } else if (res.errno === 503) {
        MessageBox.alert(res.errmsg, '警告', {
          confirmButtonText: '确定',
          type: 'error'
        })
        return Promise.reject('error')
      } else if (res.errno === 300) {
        MessageBox.alert('请求业务失败，清重新尝试', '警告', {
          confirmButtonText: '确定',
          type: 'error'
        })
        return Promise.reject('error')
      } else if (res.errno === 401) {
        MessageBox.alert(res.errmsg, '警告', {
          confirmButtonText: '确定',
          type: 'error'
        })
        return Promise.reject('error')
      }

      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
