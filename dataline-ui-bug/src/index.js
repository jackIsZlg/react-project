import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import registerServiceWorker from './registerServiceWorker'
import request from './base/request'
import {fakeAuth} from './base/auth'

// 登录校验，再渲染
request.isLogin().then((d) => {
  const isAutoLogin = localStorage.getItem('token') || sessionStorage.getItem('token')
  d && isAutoLogin && fakeAuth.authenticate()
  ReactDOM.render(<App />, document.getElementById('app'))
})

registerServiceWorker()
