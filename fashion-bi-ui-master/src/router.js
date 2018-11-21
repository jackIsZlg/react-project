import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

let router = new Router({
  mode: 'history',
  linkActiveClass: 'active',
  routes: [
    // #region 登录相关
    {
      path: '/login',
      component: () => import('./views/Account/Index.vue'),
      children: [
        {
          path: '',
          component: () => import('./views/Account/Signin.vue')
        },
        {
          path: '/join',
          component: () => import('./views/Account/Signup.vue')
        },
        {
          path: '/password_reset',
          component: () => import('./views/Account/ForgotPassword.vue')
        }
      ]
    },

    // #endregion

    // #region 内容
    {
      path: '/',
      component: () => import('./views/Index'),
      redirect: '/trend',
      children: [
        {
          path: '/discovery',
          component: () => import('./views/Discovery/Index')
        },
        {
          path: '/dashboards',
          component: () => import('./views/Dashboards/Index.vue')
        },
        // #region 趋势模块
        {
          path: '/trend',
          component: () => import('./views/Trend/Index.vue')
        },

        {
          path: '/trend/common',
          redirect: '/trend/search',
          component: () => import('./views/Trend/common.vue'),
          children: [
            {
              path: '/trend/search',
              component: () => import('./views/Trend/Search.vue')
            },
            {
              path: '/trend/detail',
              component: () => import('./views/Trend/Detail.vue')
            }
          ]
        },
        {
          path: '/trend/recommend',
          component: () => import('./views/Trend/Recommend.vue')
        },
        // #endregion

        {
          path: '/market',
          component: () => import('./views/Market/Index.vue')
        }, {
          path: '/tool',
          component: () => import('./views/Tool/Index.vue')
        }
      ]
    }
    // #endregion
  ]
})
router.beforeEach((to, from, next) => {
  if (to.path === '/login' || localStorage.token || sessionStorage.token) {
    next()
  } else {
    next(`/login?to=${decodeURIComponent(to.path)}`)
  }
})
export default router
