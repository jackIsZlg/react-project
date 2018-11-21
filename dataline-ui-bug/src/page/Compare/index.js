import moment from 'moment';
import React, { Component } from 'react';
import {
  Icon,
  Input,
  Modal,
  message,
  Select,
  Spin,
  DatePicker,
  Rate
} from 'antd';
import Filters from '../../component/filters/index'
import './index.less'
import request from '../../base/request';
import link from '../../base/link'
import m from '../../base/message'
const showType = {
  goods: 'goods',
  shop: 'shop'
}
const constArray = [{}, {}, {}, {}, {}]
class Compare extends Component {
  state = {
    type: this.props.match.params.type,
    goodsData: constArray,
    shopData: constArray,
    startDate: '',
    endDate: '',
    modal: {
      index: 0,
      fetching: false,
      show: false,
      data: [],
      value: {}
    },
    shopModal: {
      show: false,
      index: 0,
      error: '',
      warn: '',
      value: ''
    }
  }

  /** AJAX **/
  async componentDidMount() {
    //this.getGoods()
  }
  /******事件 */
  search(params) {
    this.setState({
      ...params,
      type: params.compareType
    }, () => {
      if (params.compareType === showType.shop) {
        this.getShop()
      } else {
        this.getGoods()
      }
    })
  }

  async getShop() {
    const res = await request.get('/api/account/compare-shop-list', {
      params: {
        startDate: this.state.startDate,
        endDate: this.state.endDate
      }
    })
    let shopData = res.concat(constArray)
    shopData.length = 5
    this.setState({ shopData })
  }
  async getGoods() {
    const res = await request.get('/api/account/compare-item-list', {
      params: {
        startDate: this.state.startDate,
        endDate: this.state.endDate
      }
    })
    let goodsData = res.concat(constArray)
    goodsData.length = 5
    this.setState({ goodsData })
  }
  handleCancel = async () => {
    this.setState({
      modal: {
        ...this.state.modal,
        show: false
      },
      shopModal: {
        ...this.state.shopModal,
        show: false
      }
    })
  }
  async onShopItemDateChange(index, data, dataString) {
    const res = await request.get('/api/account/compare-shop-list', {
      params: {
        startDate: dataString,
        endDate: dataString,
        shopId: this.state.shopData[index].shopId
      }
    })
    this.setState((state) => {
      state.shopData[index] = res[0]
      return {
        shopData: state.shopData
      }
    })
  }
  async onGoodsItemDateChange(index, data, dataString) {
    const res = await request.get('/api/account/compare-item-list', {
      params: {
        itemId: this.state.goodsData[index].itemId,
        startDate: dataString,
        endDate: dataString
      }
    })
    this.setState((state) => {
      state.goodsData[index] = res[0]
      return {
        goodsData: state.goodsData
      }
    })
  }
  onShopModalChange(e) {
    let val = e.target.value.trim()
    this.setState((state) => {
      console.log(state)
      let shopModal = state.shopModal
      shopModal.value = val
      return {
        shopModal
      }
    })
  }
  async onAddShop() {
    try {
      if (this.state.shopData.some(m => m.shopName === this.state.shopModal.value)) {
        this.setState({
          shopModal: {
            ...this.state.shopModal,
            warn: true,
            error: false
          }
        })
        return
      }
      const res = await request.post('/api/account/compare-shop-name-add?shopName=' + this.state.shopModal.value)

      this.setState((state) => {
        state.shopData[state.shopModal.index] = res
        state.shopModal.show = false
        state.shopModal.value = ''
        return {
          shopData: state.shopData,
          shopModal: state.shopModal
        }
      })
      m.pub('compare')
    } catch (error) {
      this.setState({
        shopModal: {
          ...this.state.shopModal,
          warn: false,
          error: error.message
        }
      })
    }
  }
  async onRemoveShop(index) {
    request.changeShopDiff(true, this.state.shopData[index].shopId).then(() => {
      this.state.shopData[index] = {}
      this.setState({
        shopData: this.state.shopData
      })
      m.pub('compare')
    })
  }
  async onRemoveGoods(index) {
    request.changeItemDiff(true, this.state.goodsData[index].itemId).then(() => {
      this.state.goodsData[index] = {}
      this.setState({
        goodsData: this.state.goodsData
      })
      m.pub('compare')
    })
  }
  async onClearGoods() {
    this.setState({
      goodsData: [...constArray]
    })
    await request.get('/api/account/compare-item-all-cancel')
    m.pub('compare')
  }
  async onClearShop() {
    this.setState({
      shopData: [...constArray]
    })
    await request.get('/api/account/compare-shop-all-cancel')
    m.pub('compare')
  }
  async onAddGoods(index) {
    try {
      const res = await request.get('/api/account/compare-item-id-add', {
        params: {
          itemId: this.state.modal.value.key
        }
      })
      this.state.goodsData[this.state.modal.index] = res
      this.setState({
        goodsData: this.state.goodsData,
        modal: {
          ...this.state.modal,
          show: false
        }
      })
      m.pub('compare')
    } catch (error) {
      console.error(error)
      message.error(error.message)
    }
  }
  onSelectGoods = (val) => {
    console.log('onSelectGoods', val)
    this.setState({
      modal: {
        ...this.state.modal,
        value: val
      }
    })
  }
  fetchUser = async (value) => {
    const modal = this.state.modal
    modal.fetching = true
    this.setState({
      modal: modal
    })
    if (this.time) {
      clearTimeout(this.time)
    }
    this.time = setTimeout(async () => {
      const res = await request.basic(`/item/query?queryName=${value}`)
      modal.fetching = false
      modal.data = res
      this.setState({
        modal: modal
      })
    }, 500)
  }
  showGoodsModal(index) {
    this.setState({
      modal: {
        value: {},
        data: [],
        index,
        show: true
      }
    })
  }
  showShopModal(index) {
    this.setState({
      shopModal: {
        value: '',
        index,
        warn: false,
        error: false,
        show: true
      }
    })
  }
  disabledDate(current) {
    // Can not select days before today and today
    return current > moment().add(-1, 'days').endOf('day');
  }
  /**********渲染 ***********/
  renderBox() {
    // return <td>
    //         {m.picUrl}
    //   <a onClick={this.toShopDetail.bind(this, m.shopId)}>{m.shopName}</a>
    // </td>
  }
  renderNone(text = '添加对比店铺', show) {
    return <td className="nocontent">
      <button onClick={show} className="add-btn">
        <Icon type="plus" theme="outlined" /> {text}
      </button>
    </td>
  }
  renderField(val, defaultValue = '暂无') {
    if (val === undefined) {
      return val
    }
    return val ? val : defaultValue
  }
  renderMoneyField(val) {
    if (isNaN(val)) {
      return null
    }
    return (val || 0).toFixed(2)
  }
  /**
   * 渲染店铺对比
   */
  renderShop() {
    const { shopData, shopModal } = this.state
    let warn = <span className="alert"><Icon type="exclamation-circle" theme="filled" style={{ color: '#faad14' }} />&nbsp;该店铺已加入对比清单中</span>
    let error = <span className="alert"> <Icon type="close-circle" theme="filled" style={{ color: 'red' }} />&nbsp;抱歉，未找到该店铺</span>

    return <div className="compare">
      <Modal
        title="添加对比店铺"
        visible={shopModal.show}
        width={540}
        onOk={this.onAddShop.bind(this)}
        onCancel={this.handleCancel}
        className="compare-modal"
      >
        <p style={{ padding: '20px 0' }}>
          <label>店铺名称</label>
          <span className="input">
            <Input style={{ width: 318, marginLeft: 20 }}
              value={shopModal.value}
              onChange={this.onShopModalChange.bind(this)} placeholder="请输入店铺标题进行添加" />
            {shopModal.error && error}
            {shopModal.warn && warn}
          </span>
        </p>
      </Modal>
      <table className="table table-compare">
        <tr className="header">
          <td>
            <div className="logo center">
              已加入{shopData.filter(m => m.shopId).length}家店铺
              <div>
                <button className="clear-btn" onClick={this.onClearShop.bind(this)}>
                  <Icon type="close" theme="outlined" /> 清空重选
                </button>
              </div>
            </div>
          </td>
          {shopData.map((m, i) =>
            m.shopId ?
              <td>
                <div className="logo">
                  <a className="close" onClick={this.onRemoveShop.bind(this, i)}><Icon type="close" theme="outlined" /></a>
                  <a className="logo-img" onClick={link.toShopDetail.bind(this, m.shopId)}><img src={m.logoUrl} alt="" width="100%" />
                    <div className="title"><div className="title-in short">{m.shopName}</div></div></a>
                  <DatePicker
                    className="date-input"
                    disabledDate={this.disabledDate}
                    defaultValue={moment(m.selectedDay)}
                    allowClear={false}
                    onChange={this.onShopItemDateChange.bind(this, i)} />
                </div>
              </td> :
              this.renderNone('添加对比店铺', this.showShopModal.bind(this, i))
          )}
        </tr>
      </table>
      <h3>上新趋势</h3>
      <table className="table table-compare">
        <tr>
          <td className="new-trend">上新宝贝数</td>{shopData.map(m => <td>{this.renderField(m.newItemCount)}</td>)}
        </tr>
        <tr>
          <td className="new-trend">上新销量</td>{shopData.map(m => <td>{this.renderField(m.newItemSalesVolume)}</td>)}
        </tr>
        <tr>
          <td className="new-trend">上新预估销额（万元）</td>{shopData.map(m => <td>{this.renderMoneyField(m.newItemSale / 100 / 10000)}</td>)}
        </tr>
      </table>
      <h3>销售趋势</h3>
      <table className="table table-compare">
        <tr>
          <td className="new-trend">在售宝贝数</td>{shopData.map(m => <td>{this.renderField(m.totalItemCount)}</td>)}
        </tr>
        <tr>
          <td className="new-trend">销量</td>{shopData.map(m => <td>{this.renderField(m.totalSalesVolume)}</td>)}
        </tr>
        <tr>
          <td className="new-trend">销售额（万元）</td>{shopData.map(m => <td>{this.renderMoneyField(m.totalSale / 100 / 10000)}</td>)}
        </tr>
        <tr>
          <td className="new-trend">销量TOP3</td>{shopData.map(m => <td>
            {m.topItemList && m.topItemList.map(k => <a onClick={link.toGoodDetail.bind(this, k.itemId)}>
              <img alt={k.name} width="60" className="shop-top3" src={k.picUrl} />
            </a>)}
          </td>)}
        </tr>
      </table>
      <h3>基本信息</h3>
      <table className="table table-compare">
        <tr>
          <td className="new-trend">行业</td>{shopData.map(m => <td>{this.renderField(m.business)}</td>)}
        </tr>
        <tr>
          <td className="new-trend">类型</td>{shopData.map(m => <td>{this.renderField(m.shopType)}</td>)}
        </tr>
        <tr>
          <td className="new-trend">店铺均价</td>{shopData.map(m => <td>{this.renderField(m.averagePrice)}</td>)}
        </tr>
        <tr>
          <td className="new-trend">店铺粉丝</td>{shopData.map(m => <td>{this.renderField(m.shopFans)}</td>)}
        </tr>
        <tr>
          <td className="new-trend">所在地</td>{shopData.map(m => <td>{this.renderField(m.location)}</td>)}
        </tr>
      </table>
    </div>
  }
  /**
   * 渲染商品对比
   */
  renderGoods() {
    const { goodsData, modal } = this.state
    console.log('modal.value', modal.value)
    return <div>
      <Modal
        className="compare-modal"
        title="添加对比商品"
        visible={modal.show}
        width={540}
        onOk={this.onAddGoods.bind(this)}
        onCancel={this.handleCancel}
      >
        <p>
          <label>商品名称</label>
          <Select
            showSearch={true}
            labelInValue
            placeholder="输入商品标题进行添加"
            notFoundContent={modal.fetching ? <Spin size="small" /> : null}
            filterOption={false}
            showArrow={false}
            style={{ width: 318, marginLeft: 20 }}
            onSearch={this.fetchUser}
            onChange={this.onSelectGoods}
            value={modal.value.key ? modal.value : undefined}
          >
            {modal.data.map(d => <Select.Option
              value={d.itemId}
              key={d.itemId}>
              <div className="options">
                <img alt="" src={d.picUrl} width={22} height={22} style={{ margin: 3 }} />
                <span className="title">
                  {d.title}
                </span>
                <span className="price">{(d.cPrice / 100 || 0).toFixed(2)}</span>
              </div>
            </Select.Option>)}
          </Select>
        </p>
      </Modal>
      <table className="table table-compare">
        <tr className="header">
          <td>
            <div className="logo center">
              <div>已加入{goodsData.filter(m => m.itemId).length}件商品</div>
              <div>
                <button className="clear-btn" onClick={this.onClearGoods.bind(this)}>
                  <Icon type="close" theme="outlined" /> 清空重选
              </button>
              </div>
            </div>
          </td>
          {goodsData.map((m, i) =>
            m.itemId ?
              <td>
                <div className="logo">
                  <a className="close" onClick={this.onRemoveGoods.bind(this, i)}><Icon type="close" theme="outlined" /></a>
                  <a className="logo-img" onClick={link.toGoodDetail.bind(this, m.itemId)}>
                    <img src={m.picUrl} alt="" width="100%" />
                    <div className="title"><div className="title-in">{m.title}</div></div>
                  </a>
                  {/* <DatePicker
                    disabledDate={this.disabledDate}
                    allowClear={false}
                    value={moment(m.selectedDay)}
                    onChange={this.onGoodsItemDateChange.bind(this, i)} /> */}
                </div>
              </td> :
              this.renderNone('添加对比商品', this.showGoodsModal.bind(this, i))
          )}
        </tr>
      </table>
      <h3>基本信息</h3>
      <table className="table table-compare">
        <tr>
          <td>品类</td>{goodsData.map(m => <td>{this.renderField(m.category)}</td>)}
        </tr>
        <tr>
          <td>风格</td>{goodsData.map(m => <td>{this.renderField(m.style)}</td>)}
        </tr>
        <tr>
          <td>颜色</td>{goodsData.map(m => <td>{this.renderField(m.color)}</td>)}
        </tr>
        <tr>
          <td>价格</td>{goodsData.map(m => <td>{this.renderMoneyField(m.price / 100)}</td>)}
        </tr>
        <tr>
          <td>店铺</td>{goodsData.map(m =>
            <td>
              <a onClick={link.toShopDetail.bind(this, m.shopId)}>{m.shopName}</a>
            </td>)}
        </tr>
      </table>
      <h3>上新趋势</h3>
      <table className="table table-compare">
        <tr>
          <td>上新时间</td>{goodsData.map(m => <td>{m.saleTime}</td>)}
        </tr>
        <tr>
          <td>上新当日销量</td>{goodsData.map(m => <td>{this.renderField(m.firstDaySalesVolume)}</td>)}
        </tr>
        <tr>
          <td>上新当日销量额</td>{goodsData.map(m => <td>{this.renderField(m.firstDaySale)}</td>)}
        </tr>
      </table>
      <h3>销售趋势</h3>
      <table className="table table-compare">
        <tr>
          <td>累计销量</td>{goodsData.map(m => <td>{this.renderField(m.totalSalesVolume)}</td>)}
        </tr>
        <tr>
          <td>累计销售额（万元）</td>{goodsData.map(m => <td>{this.renderMoneyField(m.totalSale / 100 / 10000)}</td>)}
        </tr>
        <tr>
          <td>累计收藏量</td>{goodsData.map(m => <td>{this.renderField(m.collect)}</td>)}
        </tr>
        <tr>
          <td>爆款值</td>{goodsData.map(m => <td>{m.hotLevel !== undefined ? <Rate disabled value={m.hotLevel} defaultValue={m.hotLevel} /> : null}</td>)}
        </tr>
        <tr>
          <td>最热颜色</td>{goodsData.map(m => <td>{this.renderField(m.hotColor)}</td>)}
        </tr>
      </table>
    </div>
  }
  render() {
    const content = this.state.type === showType.goods ? this.renderGoods() : this.renderShop()
    return <div className="compare">
      <Filters title="对比清单" type={6} compareType={this.state.type} search={this.search.bind(this)} history={this.props.history} />
      <div className="block"></div>
      {content}
    </div>
  }
}

export default Compare