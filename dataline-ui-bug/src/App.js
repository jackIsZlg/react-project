import React, {Component} from 'react'
import {createStore} from 'redux'
import {Provider} from 'react-redux'
import reducer from '../src/redux/reducer'
import addPoint from './base/event'
import request from './base/request'

import './App.less'

// React Router
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'

// page
import Index from './page/Index'
import RegistProcess from './page/login/RegistProcess'
import Login from './page/login/Login'
import PayPage from './page/PayPage'

// DataLine page
import DataLine from './component/dataline/DataLineLayout'
import moment from 'moment/moment'

import 'moment/locale/zh-cn'
moment.locale('zh-cn')

const store = createStore(reducer)

// Route List 挂载在 /page
class App extends Component {
  componentDidMount () {
    const pageUrl = {
      '/page/dataline/recommend': 'hot_item_recommend', // 爆款推荐
      '/page/dataline/dataexpress': 'new_item_report', // 上新日报
      '/page/dataline/Inventory': 'item_detail', // 商品详情
      '/page/dataline/storedata': 'shop_list', // 店铺列表
      '/page/dataline/shopDetail': 'shop_detail' // 店铺详情
    }

        // 监听路由变化
    const sessionHistory = [sessionStorage.getItem('oldUrl') || localStorage.getItem('oldUrl') || '/page/dataline/dataexpress']
    const MutationObserver = window.MutationObserver || window.WebKitMutationObserver
    const observer = new MutationObserver(function (mutations, observer) {
      localStorage.setItem('oldUrl', window.location.pathname)
      sessionStorage.setItem('oldUrl', window.location.pathname)
      sessionHistory.push(window.location.pathname)
            // 路由堆栈只保存两个
      if (sessionHistory.length > 2) sessionHistory.shift()
      addPoint(sessionHistory[0], 'page', sessionHistory[1])
    })
    observer.observe(document.getElementById('title'), { characterData: true, childList: true, attributes: true })

        // 全局监听事件
    window.addEventListener('click', function (event) {
      const getParentNode = function (target) {
        const parentNode = target.parentNode
        if (!parentNode) return ''
        const tagName = parentNode.tagName.toLocaleUpperCase()
                // 寻至底层则表示改次点击没有触发埋点事件
        if (tagName === 'HTML' || tagName === 'HTML') return ''
        if (parentNode.dataset.code) {
          return parentNode
        }
        getParentNode(parentNode)
      }
      const target = event.target
      let trackDom = ''
            // 如果没有data-tid 继续向上寻找触发事件的tid
      trackDom = target.dataset.code ? target : getParentNode(target)
      if (!trackDom) return
      const trackData = JSON.parse(JSON.stringify(trackDom.dataset))
      trackData.code = Number(trackData.code)
      trackData.content = JSON.parse(trackData.content)
      trackData.content.source_page = pageUrl[window.location.pathname]
      fetch(`${request.baseUrl}user/track-log`, {
        method: 'POST',
        body: JSON.stringify(trackData),
        headers: {'Accept': 'application/json', 'Content-Type': 'application/json'}
      }).then(() => console.log('成功')).catch(() => console.log('失败'))
    }, false)
  }
  render () {
    return (
      <Provider store={store}>
        <Router basename='/page'>
          <Switch>
            <Route path='/' exact component={Index} />
            <Route path='/index/:type' component={Login} />
            <Route path='/process/:step' component={RegistProcess} />
            <Route path='/dataline' component={DataLine} />
            <Route path='/pay' component={PayPage} />
          </Switch>
        </Router>
      </Provider>
    )
  }
}

export default App
