import 'common/styles/index.less'
import 'babel-polyfill'

import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Router, useRouterHistory } from 'react-router'
import { createHistory } from 'history'
import Promise from 'bluebird'
import { message } from 'antd'
import { syncHistoryWithStore } from 'react-router-redux'

import route from './route'
import createStore from './store/create'
import { baseURI } from 'common/config'

Promise.config({
  warnings: false,
  longStackTraces: true
})

window.Promise = Promise
require('babel-runtime/core-js/promise').default = Promise

// 全局处理未捕获的异常
window.addEventListener('unhandledrejection', function (e) {
  if (e.detail) {
    const { reason } = e.detail
    if (reason && reason.name === 'HttpError') {
      message.error(reason.message)
      e.preventDefault()
    }
  }
})

const browserHistory = useRouterHistory(createHistory)({
  basename: baseURI
})

const store = createStore(window.__INITIAL_STATE__)
const history = syncHistoryWithStore(browserHistory, store, {
  selectLocationState (state) {
    return state.get('routing').toJS()
  }
})

ReactDOM.render(
  <Provider store={store}>
    <Router children={route} history={history} />
  </Provider>,
  document.getElementById('root')
)
