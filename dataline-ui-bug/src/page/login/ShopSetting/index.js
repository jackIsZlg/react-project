import React, { Component } from 'react'
import base from '../../../base/baseMoudle'
import request from '../../../base/request'

import { Form, Input, Select, Row, Col, Button, Tag, message } from 'antd'
import './index.less'
const FormItem = Form.Item
const Option = Select.Option
const { CheckableTag } = Tag
class ShopSetting extends Component {
  state = {
    confirmDirty: false,
    autoCompleteResult: [],
    typeList: [],
    styleTagist: [],
    prewShopInfo: {},
    shopInfo: {
      shop: '',
      type: localStorage.process2 ? JSON.parse(localStorage.process2).shopInfo.type : '女装',
      style: []
    }
  };
  componentWillMount() {
    this.getAlltype()
    this.getAllStyle()
  }
  componentDidMount() {
    if (this.props.shopInfo) {
      this.setState({
        shopInfo: this.props.shopInfo
      }, this.previewShop)

    } else if (localStorage.process2) {
      this.setState(JSON.parse(localStorage.process2))
    }
  }

  getAlltype() {
    request.basic('shop/tag/business-tags').then((d) => {
      this.setState({
        styleTagist: this.dealTags(d)
      })
    })
  }

  getAllStyle() {
    request.basic('shop/tag/shop-styles').then((d) => {
      this.setState({
        typeList: this.dealTags(d)
      })
    })
  }

  dealTags(data) {
    let newData = []
    for (let key in data) {
      let itemData = {}
      itemData['key'] = data[key]
      itemData['value'] = data[key]
      newData.push(itemData)
    }
    return newData
  }

  handleSubmit(e) {
    e.preventDefault()
    let { next } = this.props
    let { prewShopInfo, shopInfo } = this.state
    let { shop, type, style } = shopInfo
    let params = {
      shopBusiness: shopInfo.type,
      shopStyle: shopInfo.style.join(',')
    }
    if (prewShopInfo.shopId) {
      params.shopId = prewShopInfo.shopId * 1
    } else {
      params.shopName = shopInfo.shop
    }


    if (!shop.length) {
      message.warning('请添加您的店铺信息');
      return
    }
    if (!type && !style.length) {
      message.warning('请选择该感兴趣的店铺风格');
      return
    }
    let url = this.props.url || '/api/account/add-shop-info'

    request.get(url, { params })
      .then((data) => {
        localStorage.process2 = JSON.stringify(this.state)
        next ? next() : (window.location.href = '/page/process/3')
        localStorage.business = shopInfo.type
      }, data => {
        console.log(data.errorDesc)
      })
  }
  chageOption(value) {
    let { shopInfo } = this.state
    shopInfo.type = value
    this.setState({
      shopInfo
    })
  }
  handleChangeTags(tag, checked) {
    const { shopInfo } = this.state;
    const { style } = shopInfo
    const nextSelectedTags = checked
      ? [...style, tag]
      : style.filter(t => t !== tag);
    if (shopInfo.style.length >= 3 && checked) {
      message.warning('最多可选择3种风格');
      return
    }
    shopInfo.style = nextSelectedTags
    this.setState({ shopInfo });
  }
  setShopValue(e) {
    let { shopInfo } = this.state
    shopInfo.shop = e.target.value
    this.setState({ shopInfo })
  }
  previewShop() {
    let self = this
    let { shopInfo } = self.state
    // let regex = /^http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?$/i
    if (!shopInfo.shop) {
      message.warning('请先输入店铺信息');
      return
    }
    // if (!regex.test(shopInfo.shop)) {
    //   message.warning('请输入正确的店铺信息');
    //   return
    // }
    request.basic(`shop/shop-preview?shopName=${shopInfo.shop}`).then((d) => {
      self.setState({
        prewShopInfo: d
      })
    })
  }
  render() {
    const { shopInfo, typeList, styleTagist, prewShopInfo } = this.state
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 3 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 21 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 24,
          offset: 0,
        },
      },
    }
    return (
      <div onClick={(e) => e.stopPropagation()} className={"shop-wrapper " + this.props.className}>
        <div className="shop-header">
          <div className="title">店铺设置</div>
          <div className="sub-title">以便我们更好的服务你</div>
        </div>
        <div className="shop-content">
          <Form ref="myForm" onSubmit={this.handleSubmit.bind(this)}>
            <FormItem
              className="shop"
              {...formItemLayout}
              label="您的店铺"
            >
              <Row gutter={8}>
                <Col span={19}>
                  <Input className="shop-input"
                    value={this.state.shopInfo.shop}
                    onChange={this.setShopValue.bind(this)}
                    placeholder="请先输入店铺信息" />
                </Col>
                <Col className="shop-btn-wrapper" span={5}>
                  <Button className="shop-btn"
                    type="primary"
                    //  disabled={!shopInfo.shop} 
                    onClick={this.previewShop.bind(this)}
                  >预览店铺</Button>
                </Col>
              </Row>
            </FormItem>
            {
              JSON.stringify(prewShopInfo) !== '{}' &&
              <FormItem>
                <div className="shop-preview">
                  <div className="shop-preview-wrapper">
                    {
                      (prewShopInfo && prewShopInfo.shopName) ?
                        <div className="warehousing">
                          <img src={base.ossImg(prewShopInfo.logoUrl || '', 70)} alt="" />
                          <div className="shop-info">
                            <div className="shop-info-name">
                              <div className="shop-info-header">{prewShopInfo.shopName}</div>
                              {
                                prewShopInfo.wangwangId && <div className="shop-info-seller"><i className="iconfont">&#xe619;</i>{prewShopInfo.wangwangId}</div>
                              }
                            </div>
                            <div className="shop-info-msg">提示:<span>{prewShopInfo.hint}</span></div>
                          </div>
                        </div> :
                        <div className="message">
                          未找到到该店铺<br />
                          <div className="search-message">在淘宝正常营业的店铺，购买服务后24小时内即可获取店铺数据</div>
                        </div>
                    }
                  </div>
                </div>
              </FormItem>
            }
            <FormItem
              {...formItemLayout}
              label="行业类别"
            >
              <Select className="shop-type" defaultValue={shopInfo.type} onChange={this.chageOption.bind(this)}>
                {
                  styleTagist && styleTagist.map(item => <Option className="shop-type-item" value={item.value}>{item.value}</Option>)
                }
              </Select>
            </FormItem>
            {
              shopInfo.type === '女装' && <FormItem
              {...formItemLayout}
              label="店铺风格"
            >
              <div>
                {typeList && typeList.map(tag => (
                  <CheckableTag
                    className="shop-style"
                    key={tag.key}
                    checked={shopInfo.style.indexOf(tag.value) > -1}
                    onChange={checked => this.handleChangeTags(tag.value, checked)}
                  >
                    {tag.value}
                  </CheckableTag>
                ))}
              </div>
            </FormItem>
            }
            <FormItem {...tailFormItemLayout}>
              <Button className="shop-commit-btn" type="primary" htmlType="submit">完成设置</Button>
            </FormItem>
          </Form>
        </div>
      </div>
    )
  }
}
ShopSetting = Form.create({})(ShopSetting);

export default ShopSetting