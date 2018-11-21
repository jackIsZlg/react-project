import React, { Component } from 'react'
import { Header, Footer } from '../../component/common/CommonComponent'
import BuyMenu from './BuyMenu/index'
import ShopSetting from './ShopSetting/index'
import Recommend from './Recommend'
import request from '../../base/request'
import './style/RegistProcess.less'
const _step = {
  pay: 1,
  setShop: 2,
  recommend: 3,
  none: 0
}
class RegistProcess extends Component {
  constructor(props) {
    super(props)
    console.log(props)
    this.state = {
      step: props.match.params.step * 1,
      serviceId: 0,
      headerShowPhone: false
    }
  }
  async componentDidMount() {
    if (this.state.step === _step.pay) {
      const hasPay = await request.basic('user/service/test')
      if (hasPay) {
        this.props.history.replace('/process/' + _step.setShop)
      }
    }
  }
  componentWillReceiveProps(nextProps) {
    console.log(nextProps)
    this.setState({
      step: nextProps.match.params.step * 1
    })
  }
  paySuccess() {
    this.props.history.replace('/process/' + _step.setShop)
  }
  setShopSuccess() {
    this.props.history.replace('/process/' + _step.recommend)
  }
  gotoShopSetting() {
    this.props.history.replace('/process/' + _step.setShop)
  }
  getBuyConsult() {
    this.setState({
      headerShowPhone: true
    })
  }

  settingSuccess() {
    this.props.history.replace('/dataline/shopwatch')
  }
  logout() {
    Promise.all([
      request.basic('auth/sso-logout'),
      request.basic(request.ssoUrl + 'logout')
    ]).then(() => {
      window.location.href = '/page'
    })
  }
  renderPage() {
    let { step } = this.state
    switch (step) {
      case _step.pay:
        return <BuyMenu {...this.props}
          next={this.paySuccess.bind(this)}
          showContact={() => {
            this.setState({
              headerShowPhone: true
            })
          }} />
      case _step.setShop:
        return <ShopSetting {...this.props} next={this.setShopSuccess.bind(this)} />
      case _step.recommend:
        return <Recommend back={this.gotoShopSetting.bind(this)} settingSuccess={this.settingSuccess.bind(this)} />
      case 0:
      default:
        break
    }
  }
  render() {
    return (
      <div className='regist-container'>
        <Header showContact={this.state.headerShowPhone}
          rightSolt={<a onClick={this.logout.bind(this)}>退出</a>}
          loginStatus />
        <div className='whole-container process'>
          <div className='process-wrapper'>
            <div className='process-wrapper-panel'>
              {this.renderPage()}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }
}

export default RegistProcess
