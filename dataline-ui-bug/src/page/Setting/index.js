/**
 * Created by gewangjie on 2018/3/6
 */
import React, { Component } from 'react'
import {
  // Avatar,
  Button,
  // Popover,
  Row,
  Col,
  message,
  Input
} from 'antd'
import request from '../../base/request'
import ShopSetting from '../login/ShopSetting/index'
import BuyMenu from '../login/BuyMenu/index'
import './index.less'
import '../login/style/RegistProcess.less'

class Setting extends Component {
  state = {
    account: {
      userId: 0,
      business: '',
      shopStyle: '',
      shopId: 0,
      shopName: '',
      logoUrl: '',
      shopUrl: '',
      contactName: '',
      contactEmail: '',
      contactPhone: '',
      wangwangId: '',
      loginPhone: '',
      expiredTime: ''
    },
    changeAccount: {
      contactEmail: false,
      contactPhone: false,
      contactName: false
    },
    showShopSetting: false,
    showPay: false
  }
  //#region [api] http api fetch
  async getAccount() {
    const account = await request.get('/api/account/info')
    this.setState({ account })
  }
  async setContact(field, val) {
    // console.log(1111111, field, val)
    // if (field === 'contactName' && val.length >12) {
    //   message.error('联系人姓名最多可输入12个字')
    //   return
    // }
    // if (field === 'contactEmail' && /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(val)) {
    //   message.error('联系人姓名最多可输入12个字')
    //   return
    // }
    const fields = {
      contactEmail: 'email',
      contactPhone: 'phone',
      contactName: 'name'
    }
    await request.get('/api/account/alter-contact-info', {
      params: {
        [fields[field]]: val
      }
    })
  }
  //#endregion
  componentWillMount() {
    this.getAccount()
  }
  //#region [events] ui event  
  onChangeShopInfoClick() { }
  togglePay(show) {
    this.setState({
      showPay: show
    })
  }
  openShopSetting() {
    this.setState({
      showShopSetting: true
    })
  }
  closeShopSetting() {
    this.getAccount()
    this.setState({
      showShopSetting: false
    })
  }


  async saveChange(field) {
    try {
      let val = await this.refs[field].input.value
      await this.setContact(field, val)
      this.state.account[field] = val
      this.setState({
        account: this.state.account
      })
      this.toggleFieldStatus(field, false)
    } catch (error) {
      message.error(error.message)
    }
  }

  toggleFieldStatus(name, status) {
    this.setState((state) => {
      state.changeAccount[name] = status
      return {
        changeAccount: state.changeAccount
      }
    })
  }
  //#endregion

  // #region [render] 渲染 
  /**
   * 渲染店铺信息
   */
  renderShopInfo() {
    const { shopName, business, wangwangId, shopStyle, logoUrl, shopUrl } = this.state.account
    const shopStyleArray = shopStyle.split(',')
    let shopSetting
    if (this.state.showShopSetting) {
      shopSetting = <div className='setting-modal'>
        <ShopSetting className='content' shopInfo={{ shop: shopName, type: business, style: shopStyleArray }} url="/api/account/alter-shop-info" next={this.closeShopSetting.bind(this)} />
      </div>
    }
    return <div className="setting-shop-info">
      {shopSetting}
      <Row type="flex" justify="space-between">
        <Col style={{ width: 110 }}>
          <img src={logoUrl}
            className="logo"
            alt={shopName} />
        </Col>
        <Col style={{ flex: 1 }}>
          <Row style={{ marginTop: '5px' }}>
            <a href={shopUrl} target="shop" style={{ fontSize: 18 }}>{shopName || '暂无'}</a>
          </Row>
          <Row style={{ marginTop: '22px' }}>
            <span className="shop-label">
              <i className="iconfont">&#xe619;</i>
              {/* <img src='../../image/wangwang.png' alt='' width={18} /> */}
              {wangwangId}
            </span>
            <span className="shop-label">
              <label>行业：</label>
              {business}
            </span>
            <span className="shop-label">
              <label>风格：</label>
              {shopStyleArray.map(item => <span style={{ marginRight: '5px' }}>{item}</span>)}
            </span>
          </Row>
        </Col>
        <Col style={{ width: 100, textAlign: 'right', color: '#1890ff', lineHeight: '80px' }}>
          <Button onClick={this.openShopSetting.bind(this)} type="primary" ghost>去修改</Button>
        </Col>
      </Row>
      <Row>
        <h3 className="shop-address">店铺地址：</h3><a href={shopUrl} target="shop">{shopUrl}</a>
      </Row>
    </div>
  }
  /**
   * 渲染账号设置
   */
  renderAccount() {
    const { loginPhone, expiredTime } = this.state.account
    let buy = this.state.showPay ? <div className='setting-modal'>
      <BuyMenu className="content" {...this.props} next={this.togglePay.bind(this, false)} />
    </div> : ''
    return <div className="form">
      {buy}
      <Row type="flex">
        <Col className="form-label">
          登录手机号
        </Col>
        <Col className="form-content">
          {loginPhone}
        </Col>
      </Row>
      <Row type="flex">
        <Col className="form-label">
          账号密码
        </Col>
        <Col className="form-content">********</Col>
      </Row>
      <Row type="flex">
        <Col className="form-label">
          会员权限
        </Col>
        <Col className="form-content" >
          <Row type="flex">
            <Col style={{ textAlign: "right", flex: 1, marginRight: 44 }}>
              <span className="expired-time">将于{expiredTime}到期</span>
            </Col>
            <Col><a className="btn-link" > </a></Col>
          </Row>
        </Col>
      </Row>

    </div>
  }
  renderChangeContent(name) {
    const account = this.state.account
    const change = this.state.changeAccount
    return <Col className="form-content">
      {change[name] ?
        <Row type="flex">
          <Col style={{ flex: 1 }}><Input style={{ width: '320px' }} defaultValue={account[name]} width="317" ref={name} /></Col>
          <Col >
            <a className="btn-link" onClick={this.saveChange.bind(this, name)}>保存</a>
            <a className="btn-link" onClick={this.toggleFieldStatus.bind(this, name, false)}>取消</a>
          </Col>
        </Row> : <Row type="flex">
          <Col className="form-input-text" style={{ flex: 1 }}>{account[name]}</Col>
          <Col>
            <a className="btn-link" onClick={this.toggleFieldStatus.bind(this, name, true)}>
              {account[name] ? '去修改' : '去添加'}
            </a>
          </Col>
        </Row>
      }
    </Col>
  }
  /**
   * 渲染联系人
   */
  renderContacts() {
    return <div className="form">
      <Row type="flex">
        <Col className="form-label">
          联系人姓名
        </Col>
        {this.renderChangeContent('contactName')}
      </Row>
      <Row type="flex">
        <Col className="form-label">
          联系邮箱
        </Col>
        {this.renderChangeContent('contactEmail')}
      </Row>
      <Row type="flex">
        <Col className="form-label">
          联系手机号
        </Col>
        {this.renderChangeContent('contactPhone')}
      </Row>
    </div>
  }
  render() {
    return <div className="setting">
      <h2>账号设置</h2>
      <div className="setting-content">
        <h3>店铺信息</h3>
        {this.renderShopInfo()}
        <h3>账号信息</h3>
        {this.renderAccount()}
        <h3 style={{ marginTop: '60px' }}>联系信息</h3><span className="txt-info">添加联系信息后，趣淘笔主页将优先展示联系信息</span>
        {this.renderContacts()}
      </div>
    </div>
  }
  //#endregion 
}

export default Setting
