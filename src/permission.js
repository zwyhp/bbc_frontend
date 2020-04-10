import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie

NProgress.configure({ showSpinner: false }) // NProgress Configuration

router.beforeEach(async(to, from, next) => {
  if (getToken) {
    if (to.path === '/login') {
      next()
    } else {
      if (store.getters.role === -1 || store.getters.role === undefined) { // 判断当前用户是否已拉取完user_info信息
        store.dispatch('GetUserInfo')
      }
      if (store.getters.role === 2) {
        next()
        return
      }
      if (store.getters.role === 0) {
        if (to.path === '/particular' || to.path === '/tourist') {
          next()
        }
        return
      }
      if (store.getters.role === 1) {
        if (to.path === '/owner') {
          next()
          return
        } else {
          next('/owner')
          return
        }
      }
      if (store.getters.role === -2) {
        if (to.path === '/particular' || to.path === '/tourist') {
          next()
        }
        return
      }
      next('/login')
    }
  } else {
    next('/login')
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
