import lazyLoad from './lazyload'

export default {
  path: '/',
  component: require('../home').default,
  indexRoute: {
    // 首页
    onEnter: (nextState, replace) => {
      replace('filter/add')
    }
  },
  childRoutes: [
    // 用户筛选
    {
      path: '/filter',
      getComponent: lazyLoad('filter'),
      indexRoute: {
        // 用户筛选首页
        onEnter: (nextState, replace) => {
          replace('filter/list')
        }
      },
      childRoutes: [
        {
          path: '/filter/add',
          getComponent: lazyLoad('filter/add')
        },
        {
          path: '/filter/list',
          getComponent: lazyLoad('filter/list')
        },
        {
          path: '/filter/edit',
          getComponent: lazyLoad('filter/edit')
        },
        {
          path: '/filter/detail',
          getComponent: lazyLoad('filter/detail')
        }
      ]
    },
    // 营销活动
    {
      path: '/marketing',
      getComponent: lazyLoad('marketing'),
      indexRoute: {
        onEnter: (nextState, replace) => {
          replace('marketing/list')
        }
      },
      childRoutes: [
        {
          path: '/marketing/add',
          getComponent: lazyLoad('marketing/add')
        },
        {
          path: '/marketing/list',
          getComponent: lazyLoad('marketing/list')
        },
        {
          path: '/marketing/edit',
          getComponent: lazyLoad('marketing/edit')
        },
        {
          path: '/marketing/detail',
          getComponent: lazyLoad('marketing/detail')
        }
      ]
    },
    // 后台管理
    {
      path: '/backend',
      getComponent: lazyLoad('backend'),
      indexRoute: {
        onEnter: (nextState, replace) => {
          replace('backend/general')
        }
      },
      childRoutes: [
        {
          // 通用
          path: '/backend/general',
          getComponent: lazyLoad('backend/general')
        },
        {
          // 用户筛选管理
          path: '/backend/filter',
          getComponent: lazyLoad('backend/filter'),
          indexRoute: {
            onEnter: (nextState, replace) => {
              replace('backend/filter/quota')
            }
          },
          childRoutes: [
            {
              path: '/backend/filter/quota',
              getComponent: lazyLoad('backend/filter/quota'),
              childRoutes: [
                {
                  path: '/backend/filter/quota/add',
                  getComponent: lazyLoad('backend/filter/quota/add')
                }
              ]
            },
            {
              path: '/backend/filter/compare',
              getComponent: lazyLoad('backend/filter/compare'),
              childRoutes: [
                {
                  path: '/backend/filter/compare/add',
                  getComponent: lazyLoad('backend/filter/compare/add')
                }
              ]
            },
            {
              path: '/backend/filter/system',
              getComponent: lazyLoad('backend/filter/system')
            }
          ]
        },
        {
          // 营销活动管理
          path: '/backend/marketing',
          getComponent: lazyLoad('backend/marketing'),
          indexRoute: {
            onEnter: (nextState, replace) => {
              replace('backend/marketing/info')
            }
          },
          childRoutes: [
            {
              path: '/backend/marketing/info',
              getComponent: lazyLoad('backend/marketing/info')
            },
            {
              path: '/backend/marketing/cost',
              getComponent: lazyLoad('backend/marketing/cost')
            }
          ]
        }
      ]
    }
  ]
}
