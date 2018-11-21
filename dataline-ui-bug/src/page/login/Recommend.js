
import React, { Component } from 'react'
import classNames from 'classnames'
import request from '../../base/request'
import base from '../../base/baseMoudle'
import { Icon } from 'antd'
class RecommendItem extends Component {
  handleChange(shopId) {
    let { changeStatus } = this.props
    changeStatus && changeStatus(shopId)
  }
  render() {
    let { shopId, logoUrl, shopName, newItemCount30, salesVolume30, status } = this.props
    return (
      <li className='recommend-content-item'>
        <img src={base.ossImg(logoUrl || '', 70)} alt='' />
        <div className="recommend-wrapper-in">
          <div className='recommend-info'>
          {shopName}
          </div>
          <div className='recommend-info-msg'>
            <div className='recommend-info-header'>近30日上新{newItemCount30}</div>
            <div className='recommend-info-seller'>近30日销量{salesVolume30}</div>
          </div>
          <button className={classNames('recommend-btn', { 'active': status })} onClick={this.handleChange.bind(this, shopId)}>{status ? '监控' : '已监控'}</button>
        </div>
      </li>
    )
  }
}

class Recommend extends Component {
  constructor() {
    super()
    this.state = {
      shopList: []
    }
  }
  componentDidMount() {
    this.getshopList()
  }
  getshopList() {
    let shopId = JSON.parse(localStorage.process2).prewShopInfo.shopId
    let url = shopId ? `shop/recommend-shops?shopId=${shopId}` : 'shop/recommend-shops'
    request.basic(url).then((d) => {
      this.setState({ shopList: this.dealData(d) })
      if (localStorage.process3) {
        this.setState(JSON.parse(localStorage.process3))
      }
    })
  }
  dealData(data) {
    data && data.map(element => {
      element.status = false
      return data
    })
    if (data.length > 9) {
      data.length = 9
    }
    return data
  }
  changeStatus(shopId) {
    let { shopList } = this.state
    shopList.map(item => {
      if (item.shopId === shopId) {
        item.status = !item.status
      }
      return item
    })
    this.setState({ shopList })
  }
  nextPage() {
    let { shopList } = this.state
    let shopIdList = []
    // let router = this.props.location
    shopList.forEach(item => !item.status && shopIdList.push(item.shopId))

    request.basic('shop/batch-follow?shopList=' + shopIdList.join(','), {
      method: 'POST'
    }).then(() => {
      let shopListCount = localStorage.userPlatformData ? JSON.parse(localStorage.userPlatformData).shopListCount : ''
      // router.replace(shopListCount ? '/dataline/shopwatch' : '/dataline/dataexpress')
      window.location.href = shopListCount ? '/page/dataline/shopwatch' : '/page/dataline/dataexpress'
    }).catch(err => {
      console.error(err)
    })
  }
  render() {
    let { shopList } = this.state
    return (
      <div className='recommend-wrapper'>
        <a onClick={this.props.back} style={{ position: 'absolute', fontWeight: 'normal', left: 40, top: 0, color: '#1890ff' }}>
          <Icon type='left' theme='outlined' /> 返回
        </a>
        <div className='shop-header'>
          <div className='title'>推荐监控</div>
          <div className='sub-title'>根据你的行业和兴趣，推荐监控的30家竞品店铺</div>
        </div>
        <ul className='recommend-content'>
          {
            shopList && shopList.map(item => <RecommendItem {...item} changeStatus={this.changeStatus.bind(this)} />)
          }
        </ul>
        <div style={{ textAlign: 'center' }}>
          <button className='recommend-complete-btn' style={{ marginLeft: 20 }} onClick={this.nextPage.bind(this)}>下一步</button>
        </div>
      </div>
    )
  }
}
export default Recommend
