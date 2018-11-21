import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import request from '../../../base/request'
import classNames from 'classnames'
import { message, Button } from 'antd'
import './index.less'

class PaySuccess extends Component {
  state = {
    hidden: false
  }
  async changeStatus(type) {
    this.setState({
      hidden: true
    })
    if (type === 'yes') {
      const hasPay = await request.basic('user/service/test')
        if (!hasPay) {
          this.changeStatus.bind(this, 'no')
        } else {
            const info = await request.basic('account/info')
            if (!info.haveSettings) {
              this.props.history.push('/process/2')
            } else {
              const shopListCount = localStorage.userPlatformData ? JSON.parse(localStorage.userPlatformData).shopListCount : ''
              this.props.history.push(shopListCount ? '/dataline/shopwatch' : '/dataline/dataexpress')
            }
        }
    }
  }

  render() {
    let { hidden } = this.state
    let { payType } = this.props
    return (
      <div id='pay-container' className={classNames({ 'hidden': hidden })}>
        <div className='pay-content max-4 confirm'>
          <header>
            支付结果<br />
            <span>请确认你的支付结果</span>
          </header>
          <div className='pay-package'>
            <div className='pay-result-header'>
              <span>{payType.price}</span> RMB / {payType.timeStage} <em>{payType.description}</em>
            </div>
            <div className='confirm-pay'>
              是否支付成功？
                </div>
            <Button onClick={this.changeStatus.bind(this, 'yes')}>是</Button>
            <Button onClick={this.changeStatus.bind(this, 'no')}>否</Button>
          </div>
        </div>
      </div>
    )
  }
}

class BuyMenu extends Component {
  constructor() {
    super()
    this.state = {
      data: [], // 所有购买类型
      payType: {}, // 购买商品类型
      onTrial: false // 是否可试用
    }
  }

  async componentDidMount() {

    this.testProbation()
  }
  // 检测是否具备试用的条件
  testProbation() {
    let self = this
    request.basic('user/trial/service/qualification')
      .then(data => {
        data && this.getPackageList()
        self.setState({
          onTrial: data
        })
      }).catch(err => {
        message.error(err)
      })
  }
  // 获取商品list
  getPackageList() {
    let url = '',
      self = this
    const serviceId = localStorage.serviceId
    switch (serviceId * 1) {
      case 100:
        url = 'trade/dataline-combo'
        break
      case 102:
        url = 'trade/selection-combo'
        break
      default:
    }
    request.basic(url)
      .then(data => {
        data = self.dealData(data)
        self.setState({ data })
      }, data => {
        message.warning(data.errorDesc)
      })
  }

  // 根据处理商品信息里的展示的时长
  getTimeStage(length) {
    switch (Math.round(length / 30)) {
      case 1:
        return '月'
      case 3:
        return '季'
      case 6:
        return '半年'
      case 12:
        return '年'
      default:
        return '月'
    }
  }

  // 处理商品信息
  dealData(data) {
    if (!data.length) {
      return
    }
    data.map(item => {
      item.price = item.price / 100
      item.timeStage = this.getTimeStage(item.serviceLength)
      return item
    })
    return data
  }

  buyConsult() {
    let { showContact } = this.props
    showContact && showContact()
  }
  buyNow(obj) {
    let self = this
    let id = 0
    let callBack
    request.basic(`trade/create-order?goodsId=${obj.id}&count=1`, {
      method: 'POST'
    }).then(data => {
      id = data.longOrderId
    }, data => {
      console.log(data.errorDesc)
    })
    callBack = setInterval(() => {
      if (id) {
        self.setState({
          payType: obj
        }, () => {
          let successWrapper = document.querySelector('#pay')
          if (!successWrapper) {
            successWrapper = document.createElement('div')
            successWrapper.id = 'pay'
            document.body.appendChild(successWrapper)
          }
          ReactDOM.render(<PaySuccess {...this.props} payType={obj} success={this.props.next} />, successWrapper)
          clearInterval(callBack)
          // window.location.href = '/page/pay?orderId=' + id
          window.open('/page/pay?orderId=' + id, '_target')
        })
      }
    }, 400)
  }
  render() {
    let { data } = this.state
    let isShowContactText = !!this.props.showContact
    let showContactText = ''
    if (isShowContactText) {
      showContactText = <div className='buy-consult'><span onClick={this.props.showContact}>购买咨询</span></div>
    }
    return data.map(item => (
      <div onClick={(e) => e.stopPropagation()} className={"buy-wrapper " + this.props.className}>
        <div className='buy-header'>简单好用，让店铺营收自然提升</div>
        <div className='buy-size'>仅需<span>{`¥${item.price}`}</span>/年</div>
        <div className='buy-size-desc'>{item.description}</div>
        <div className='buy-btn' onClick={this.buyNow.bind(this, item)}>立即购买</div>
        {showContactText}
      </div>
    ))
  }
}

export default BuyMenu
