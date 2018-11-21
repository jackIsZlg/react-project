import React, { Component } from 'react'
import { Radio, Input, InputNumber, Select, Button, Cascader, DatePicker, LocaleProvider, Icon } from 'antd'
import moment from 'moment'
import request from '../../base/request'

import zh_CN from 'antd/lib/locale-provider/zh_CN'
import './index.less'

const Option = Select.Option
const RadioGroup = Radio.Group
const RadioButton = Radio.Button
const RangePicker = DatePicker.RangePicker
/**
 * 1、监控店铺
 * 2、上新日报
 * 3、爆款排行
 * 4、店铺排行
 * 5、我的收藏
 * 6、对比清单
 */
class Filters extends Component {
  constructor(props) {
    super(props)
    this.state = {
      canRightChange: false,
      canLeftChange: true,
      limiteDate: '',
      currentDate: moment(new Date()).add(-1, 'days'),
      startDate: moment(new Date()).add(-1, 'days'), // 开始时间
      endDate: moment(new Date()).add(-1, 'days'), // 开始时间
      categoryName: '', // 商品品类
      shopFilterStatus: 1, // 店铺筛选 1、全部 2、我监控的店铺
      filterStatus: 1, // 收藏商品 1、全部 2、我监控店铺的商品
      shopStyle: '', // 店铺风格
      averagePrice: '', // 店铺均价
      shopType: '', // 店铺类型
      business: localStorage.userPlatformData ? JSON.parse(localStorage.userPlatformData).business : '女装', // 行业
      rankStatus: '', // 排序
      firstCategoryName: '', // 第一品类
      secondCategoryName: '', // 第二品类
      minPrice: '', // 最低价
      maxPrice: '', // 最高价
      itemStyle: '', // 商品风格
      itemColor: '', //  商品颜色
      businessTag: {},
      shopStyles: {},
      shopTypes: {},
      category: {},
      newCategory: '',
      watchStatus: 1,
      compareType: props.compareType,
      dateRangeStatus: 1, // 1昨日 2-过去7日
      shopValues: { 1: '高', 2: '中高', 3: '中', 4: '中低', 5: '低' },
      shopName: '',
      shopLikeName: '',
      pageNo: 1,
      pageSize: 20,
      defaultBusiness: localStorage.business || '女装'
    }
    this.lastTime = ''
    this.timer = null
    this.oldTime = ''
    this.newTime = new Date().valueOf()
  }
  componentDidMount() {
    // 由于经常使用存储在sessionStorage中去
    const { businessTag, shopTypes, shopStyles, category } = sessionStorage
    // 获取行业列表
    businessTag
      ? this.setState({ businessTag: JSON.parse(businessTag) })
      : request.basic('shop/tag/business-tags').then((data) => { sessionStorage.businessTag = JSON.stringify(data); this.setState({ businessTag: data }) })
    // 获取店铺类型
    shopTypes
      ? this.setState({ shopTypes: JSON.parse(shopTypes) })
      : request.basic('shop/tag/shop-types').then((data) => { sessionStorage.shopTypes = JSON.stringify(data); this.setState({ shopTypes: data }) })
    // 获取店铺风格
    shopStyles
      ? this.setState({ shopStyles: JSON.parse(shopStyles) })
      : request.basic('shop/tag/shop-styles').then((data) => { sessionStorage.shopStyles = JSON.stringify(data); this.setState({ shopStyles: data }) })
    // 获取品类
    category
      ? this.setState({ category: JSON.parse(category) }, () => this.dealCategory(this.state.category))
      : request.basic('item/all-category-name').then(data => { this.dealCategory(data); sessionStorage.category = JSON.stringify(data); this.setState({ category: data }) })

    //  首次进入加载数据
    this.search()
  }

  // 处理品类数据
  dealCategory(data) {
    let category = [{
      label: '全部',
      value: '全部'
    }]
    for (let key in data) {
      let newDataItem = {}
      newDataItem.label = key
      newDataItem.value = key
      if (data[key] && data[key].length) {
        newDataItem.children = []
        data[key].forEach(element => {
          let childrenItem = {}
          childrenItem.label = element
          childrenItem.value = element
          newDataItem.children.push(childrenItem)
        })
      }
      category.push(newDataItem)
    }
    this.setState({ newCategory: category })
  }

  // 时间段不可选择预期
  disabledDate(current) {
    const { limiteDate } = this.state
    if (limiteDate) {
      return (current.valueOf() < new Date('2017-04-14').getTime() ||
        current.valueOf() > moment(Date.now() - 3600 * 1000 * 24) ||
        current.valueOf() > moment(limiteDate).subtract(-3, 'months').format('x') ||
        current.valueOf() < moment(limiteDate).subtract(3, 'months').format('x')
      )
    }
    return (current.valueOf() < new Date('2017-04-14').getTime() ||
      current.valueOf() > moment(Date.now() - 3600 * 1000 * 24)
    )
  }
  // 选择时间范围
  changeRangePick(data) {
    this.setState({ limiteDate: data[0] })
  }
  // 选择时间范围
  onChange(value, dateString) {
    let dateRangeStatus = ''
    if ((dateString[0]) === moment(new Date()).add(-1, 'days').format('YYYY-MM-DD')) {
      dateRangeStatus = 1
    }
    if (dateString[0] === moment(new Date()).add(-8, 'days').format('YYYY-MM-DD') &&
      dateString[1] === moment(new Date()).add(-1, 'days').format('YYYY-MM-DD')) {
      dateRangeStatus = 2
    }
    this.setState({ dateRangeStatus, startDate: moment(dateString[0]), endDate: moment(dateString[1]) }, () => this.search())
  }

  // 修改品类
  onChangeCategory(value) {
    this.setState({ firstCategoryName: value[0] === '全部' ? '' : value[0], secondCategoryName: value[1] || '', shopLikeName: '' }, () => this.search())
  }
  // 选择行业
  changeBusiness(business) {
    this.setState({ business: business || '' }, () => this.search())
  }
  // 店铺筛选
  onShopFilterStatusChange(e) {
    this.setState({ shopFilterStatus: e.target.value, shopName: '', shopLikeName: '' }, () => this.search())
  }
  // 监控类型 1、店铺 2、爆款商品
  onWatchStatusChange(e) {
    this.setState({ watchStatus: e.target.value }, () => this.search())
  }
  // 监控类型 1、商品 2、店铺
  onCompareChange(e) {
    this.setState({ compareType: e.target.value }, () => this.search())
  }
  // 收藏类型筛选
  onFilterStatusChange(e) {
    this.setState({ filterStatus: e.target.value }, () => this.search())
  }
  // 1、昨日-2、过去7日
  ondateRangeStatusChange(e) {
    if (e.target.value === 1) {
      this.setState({
        startDate: moment(new Date()).add(-1, 'days'),
        endDate: moment(new Date()).add(-1, 'days')
      })
    } else if (e.target.value === 2) {
      this.setState({
        startDate: moment(new Date()).add(-8, 'days'),
        endDate: moment(new Date()).add(-1, 'days')
      })
    }
    this.setState({ dateRangeStatus: e.target.value }, () => this.search())
  }
  // 数据关键词
  changeKeyWord(e) {
    let delay = 500
    this.timer = null
    this.newTime = new Date().valueOf()
    this.setState({ shopName: e.target.value, shopLikeName: e.target.value }, () => {
      if (this.newTime - this.oldTime < delay) return
      this.oldTime = this.newTime
      this.timer = setTimeout(() => this.search(), delay)
    })
  }
  // 点击搜索店铺时除了时间，其他都恢复初始数据
  getInputFocus() {
    const { type } = this.props
    switch (type) {
      case 2:
        this.setState({
          // business: '女装',
          shopFilterStatus: 1,
          shopType: '',
          averagePrice: '',
          shopStyle: '',
          rankStatus: ''
          // startDate: this.state.currentDate,
          // endDate: moment(moment(this.state.currentDate)).add(1, 'days'),
          // canRightChange: false
        })
        break
      case 3:
        this.setState({
          // business: '女装',
          firstCategoryName: '',
          secondCategoryName: '',
          itemStyle: '',
          rankStatus: '',
          minPrice: '',
          maxPrice: ''
        })
        break
      case 4:
        this.setState({
          // business: '女装',
          // dateRangeStatus: 1,
          shopType: '',
          averagePrice: '',
          shopStyle: '',
          rankStatus: ''
        })
        break
      default:
        break
    }
  }
  // 上新日报 -- 时间点不可选择预期
  disabledStartDate(current) {
    return (current.valueOf() < new Date('2017-04-14').getTime() || current.valueOf() > moment(Date.now() - 3600 * 1000 * 24))
  }
  // 上新日报 -- 加减日期
  addDate(num) {
    const { canLeftChange, canRightChange, startDate } = this.state
    if ((num === -1 && !canLeftChange) || (num === 1 && !canRightChange)) return
    this.setState({ startDate: moment(moment(startDate)).add(num, 'days'), endDate: moment(moment(startDate)).add(num, 'days'), shopName: '', shopLikeName: '' }, () => this.checkDate())
  }
  // 上新日报 -- 选择时间点
  changeStartDate(dateString) {
    this.setState({ startDate: dateString, endDate: dateString }, () => this.checkDate())
  }
  // 上新日报 -- 判断能否左右切换时间
  checkDate() {
    const { startDate } = this.state
    this.setState({
      canLeftChange: startDate > new Date('2017-04-14').getTime(),
      canRightChange: startDate < moment(Date.now() - 3600 * 1000 * 24 * 2)
    }, () => this.search())
  }
  // 选择日期
  changeDate(value) {
    this.setState({ startDate: value }, () => this.search())
  }
  // 选择店铺
  selectShop(valueType, value) {
    this.setState({ [valueType]: value, shopName: '', shopLikeName: '' }, () => this.search())
  }
  // 排序
  selectSort(rankStatus) {
    this.setState({ rankStatus }, () => this.search())
  }
  // 修改价格
  changePrice(valueType, value) {
    this.setState({ [valueType]: value }, () => this.search())
  }
  search() {
    const { type } = this.props
    const {
      startDate, endDate, pageNo, pageSize, shopFilterStatus, business, shopType, averagePrice,
      shopStyle, shopName, rankStatus, firstCategoryName, secondCategoryName, minPrice, maxPrice,
      itemStyle, itemColor, shopLikeName, dateRangeStatus, filterStatus, watchStatus, compareType
    } = this.state
    // 传递查询数据
    let params = {}
    switch (type) {
      case 1:
        params = { watchStatus, shopFilterStatus: 2, shopType,dateRangeStatus, averagePrice, shopStyle, shopName }; break
      case 2:
        params = { shopFilterStatus, shopType, averagePrice, shopStyle, shopName }; break
      case 3:
        params = { firstCategoryName, secondCategoryName, shopFilterStatus, dateRangeStatus, minPrice, maxPrice, itemStyle, itemColor, shopLikeName }; break
      case 4:
        params = { shopLikeName, shopType, averagePrice, shopStyle, dateRangeStatus }; break
      case 5:
        params = { filterStatus }; break
      case 6:
        params = { compareType }
        break
      default:
    }
    params.business = business
    params.rankStatus = rankStatus
    params.startDate = moment(startDate).format('YYYY-MM-DD')
    params.endDate = moment(endDate).format('YYYY-MM-DD')
    params.pageNo = pageNo
    params.pageSize = pageSize
    this.props.search(params)
    clearTimeout(this.timer)
  }

  // 渲染第二行筛选条件
  renderSecondLineFilter(type) {
    switch (type) {
      case 1: return this.renderShopWatchType()
      case 2: return this.renderDataexpressType()
      case 3: return this.renderRecommendType()
      case 4: return this.renderShopListType()
      case 5: return this.renderCollectionType()
      case 6: return this.renderCompareType()
      default:
    }
  }

  // 渲染监控店铺第二行筛选条件
  renderShopWatchType() {
    const { startDate, endDate } = this.state
    return (
      <div className='filter-type-wrap'>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <RadioGroup className='radio-wrap last-radio-btn-wrap' defaultValue={this.state.watchStatus} onChange={this.onWatchStatusChange.bind(this)}>
            <RadioButton value={1}>竞店上新</RadioButton>
            <RadioButton value={2}>竞店爆款</RadioButton>
          </RadioGroup>
          <Button className="add-shop" type='primary' icon='plus' onClick={() => this.props.history.push('/dataline/storedata')}>新增竞店</Button>
          <RadioGroup className='shop-radio-wrap' value={this.state.dateRangeStatus} defaultValue={this.state.dateRangeStatus} onChange={this.ondateRangeStatusChange.bind(this)}>
            <RadioButton value={1}>昨日</RadioButton>
            <RadioButton value={2}>过去7天</RadioButton>
            {this.state.watchStatus === 1 ? <RadioButton value={3}>过去30天</RadioButton> : null}
          </RadioGroup>
          {this.state.watchStatus === 2 ? <LocaleProvider locale={zh_CN}>
            <RangePicker
              style={{ width: '250px' }}
              allowClear={false}
              disabledDate={this.disabledDate.bind(this)}
              onCalendarChange={this.changeRangePick.bind(this)}
              value={[startDate, endDate]}
              defaultValue={[moment().subtract(1, 'days'), moment().subtract(1, 'days')]}
              format='YYYY-MM-DD'
              placeholder={['开始时间', '结束时间']}
              onChange={this.onChange.bind(this)}
            />
          </LocaleProvider> : null}

        </div>
        {/* <div className='keyword-wrap'>
          <Input onChange={this.changeKeyWord.bind(this)} placeholder='搜店铺' prefix={<Icon type='search' theme='outlined' />} style={{ color: 'rgba(0,0,0,.25)' }} />
        </div> */}
      </div>
    )
  }
  // 渲染上新日报第二行筛选条件
  renderDataexpressType() {
    const { startDate, currentDate, canRightChange, canLeftChange, shopFilterStatus, shopName } = this.state
    return (
      <div className='filter-type-wrap'>
        <div style={{ display: 'flex' }}>
          <RadioGroup className='radio-wrap  last-radio-btn-wrap' defaultValue={1} value={shopFilterStatus} onChange={this.onShopFilterStatusChange.bind(this)}>
            <RadioButton value={1}>全部</RadioButton>
            <RadioButton value={2}>我监控的</RadioButton>
          </RadioGroup>
          <Icon type='left' theme='outlined' className={`change-arrow icon-left ${canLeftChange ? '' : 'disabled'}`} onClick={this.addDate.bind(this, -1)} />
          <LocaleProvider locale={zh_CN}>
            <DatePicker size={'large'}
              value={startDate}
              allowClear={false}
              defaultValue={currentDate}
              style={{ width: '150px' }}
              format='YYYY-MM-DD'
              onChange={this.changeStartDate.bind(this)}
              disabledDate={this.disabledStartDate.bind(this)}
            />
          </LocaleProvider>
          <Icon type='right' theme='outlined' className={`change-arrow icon-right ${canRightChange ? '' : 'disabled'}`} onClick={this.addDate.bind(this, 1)} />
        </div>
        <div className='keyword-wrap'>
          <Input value={shopName} onFocus={this.getInputFocus.bind(this)} onChange={this.changeKeyWord.bind(this)} placeholder='搜店铺' prefix={<Icon type='search' theme='outlined' />} style={{ color: 'rgba(0,0,0,.25)' }} />
        </div>
      </div>
    )
  }

  // 渲染爆款排行第二行筛选条件
  renderRecommendType() {
    const { businessTag, firstCategoryName, secondCategoryName, newCategory, startDate, endDate, business, shopLikeName } = this.state
    return (
      <div className='filter-type-wrap'>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Select value={business || this.state.defaultBusiness || '请选择'} style={{ width: 115 }} onChange={this.changeBusiness.bind(this)}>
            {Object.values(businessTag).map((tag) => <Option value={tag}>{tag}</Option>)}
          </Select>
          <div className='category-div'>品类</div>
          <Cascader
            value={[firstCategoryName || '全部', secondCategoryName]}
            placeholder='请选择品类' options={newCategory}
            expandTrigger='hover' allowClear={false}
            onChange={this.onChangeCategory.bind(this)}
            changeOnSelect />
          <RadioGroup className='shop-radio-wrap' value={this.state.dateRangeStatus} defaultValue={this.state.dateRangeStatus} onChange={this.ondateRangeStatusChange.bind(this)}>
            <RadioButton value={1}>昨日</RadioButton>
            <RadioButton className="days-ago" value={2}>过去7天</RadioButton>
          </RadioGroup>
          <LocaleProvider locale={zh_CN}>
            <RangePicker
              style={{ width: '250px' }}
              allowClear={false}
              disabledDate={this.disabledDate.bind(this)}
              onCalendarChange={this.changeRangePick.bind(this)}
              defaultValue={[moment().subtract(1, 'days'), moment().subtract(1, 'days')]}
              format='YYYY-MM-DD'
              value={[startDate, endDate]}
              placeholder={['开始时间', '结束时间']}
              onChange={this.onChange.bind(this)}
            />
          </LocaleProvider>
        </div>
        <div className='keyword-wrap'>
          <Input value={shopLikeName} onFocus={this.getInputFocus.bind(this)} onChange={this.changeKeyWord.bind(this)} placeholder='搜店铺' prefix={<Icon type='search' theme='outlined' />} style={{ color: 'rgba(0,0,0,.25)' }} />
        </div>
      </div>
    )
  }

  // 渲染店铺列表第二行筛选条件
  renderShopListType() {
    const { businessTag, startDate, endDate, business, shopLikeName } = this.state
    return (
      <div className='filter-type-wrap'>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Select value={business || this.state.defaultBusiness} style={{ width: 115 }} onChange={this.changeBusiness.bind(this)}>
            {Object.values(businessTag).map((tag) => <Option value={tag}>{tag}</Option>)}
          </Select>
          <RadioGroup className='shop-radio-wrap' value={this.state.dateRangeStatus} defaultValue={this.state.dateRangeStatus} onChange={this.ondateRangeStatusChange.bind(this)}>
            <RadioButton value={1}>昨日</RadioButton>
            <RadioButton value={2}>过去7天</RadioButton>
            <RadioButton value={3}>过去30天</RadioButton>
          </RadioGroup>
          {/* <LocaleProvider locale={zh_CN}>
            <RangePicker
              style={{ width: '250px' }}
              allowClear={false}
              disabledDate={this.disabledDate.bind(this)}
              onCalendarChange={this.changeRangePick.bind(this)}
              defaultValue={[moment().subtract(1, 'days'), moment().subtract(1, 'days')]}
              format='YYYY-MM-DD'
              value={[startDate, endDate]}
              placeholder={['开始时间', '结束时间']}
              onChange={this.onChange.bind(this)}
            />
          </LocaleProvider> */}
        </div>
        <div className='keyword-wrap'>
          <Input value={shopLikeName} onFocus={this.getInputFocus.bind(this)} onChange={this.changeKeyWord.bind(this)} placeholder='搜店铺' prefix={<Icon type='search' theme='outlined' />} style={{ color: 'rgba(0,0,0,.25)' }} />
        </div>
      </div>
    )
  }

  // 渲染我的收藏第二行筛选条件
  renderCollectionType() {
    return (
      <div className='filter-type-wrap'>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <RadioGroup className='radio-wrap  last-radio-btn-wrap' defaultValue={this.state.filterStatus} onChange={this.onFilterStatusChange.bind(this)}>
            <RadioButton value={1}>全部</RadioButton>
            <RadioButton value={2}>监控店铺的商品</RadioButton>
          </RadioGroup>
        </div>
        <div className='keyword-wrap'>
          <Input onChange={this.changeKeyWord.bind(this)} placeholder='搜店铺' prefix={<Icon type='search' theme='outlined' />} style={{ color: 'rgba(0,0,0,.25)' }} />
        </div>
      </div>
    )
  }

  // 渲染对比清单第二行筛选条件
  renderCompareType() {
    const { startDate, endDate, currentDate, canLeftChange, canRightChange } = this.state
    return (
      <div className='filter-type-wrap'>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <RadioGroup className='radio-wrap last-radio-btn-wrap' defaultValue={this.state.compareType} onChange={this.onCompareChange.bind(this)}>
            <RadioButton value='goods'>商品对比</RadioButton>
            <RadioButton value='shop'>店铺对比</RadioButton>
          </RadioGroup>
          <Icon type='left' theme='outlined' className={`change-arrow icon-left ${canLeftChange ? '' : 'disabled'}`} onClick={this.addDate.bind(this, -1)} />
          <LocaleProvider locale={zh_CN}>
            <DatePicker size={'large'}
              value={startDate}
              allowClear={false}
              defaultValue={currentDate}
              style={{ width: '150px' }}
              format='YYYY-MM-DD'
              onChange={this.changeStartDate.bind(this)}
              disabledDate={this.disabledStartDate.bind(this)}
            />
          </LocaleProvider>
          <Icon type='right' theme='outlined' className={`change-arrow icon-right ${canRightChange ? '' : 'disabled'}`} onClick={this.addDate.bind(this, 1)} />
          {/* <RadioGroup className="compare-list" value={this.state.dateRangeStatus} defaultValue={this.state.dateRangeStatus} onChange={this.ondateRangeStatusChange.bind(this)}>
            <RadioButton value={1}>今日</RadioButton>
            <RadioButton value={2}>过去7天</RadioButton>
          </RadioGroup>
          <LocaleProvider locale={zh_CN}>
            <RangePicker
              style={{ width: '250px' }}
              allowClear={false}
              disabledDate={this.disabledDate.bind(this)}
              onCalendarChange={this.changeRangePick.bind(this)}
              value={[startDate, endDate]}
              defaultValue={[moment().subtract(1, 'days'), moment().subtract(1, 'days')]}
              format='YYYY-MM-DD'
              placeholder={['开始时间', '结束时间']}
              onChange={this.onChange.bind(this)}
            />
          </LocaleProvider> */}
        </div>
      </div>
    )
  }
  // 渲染店铺筛选
  renderShop() {
    const {
      shopStyles, shopTypes, shopValues,
      shopType, averagePrice, shopStyle
    } = this.state
    if (this.state.business === '女装') {
      return (
        <div className='filter-shop-wrap'>
          <div className='shop-line'>
            <span className='filter-shop'>店铺类型</span>
            <span className={`shop-item ${shopType ? '' : 'shop-item-active'} select-all`} onClick={this.selectShop.bind(this, 'shopType', '')}>全部</span>
            <div className='shop-item-wrap'>
              {Object.values(shopTypes).map((tag) =>
                <span
                  onClick={this.selectShop.bind(this, 'shopType', tag)}
                  className={shopType === tag ? 'shop-item-active' : 'shop-item'}>{tag}</span>
              )}
            </div>
          </div>
          <div className='shop-line'>
            <span className='filter-shop'>店铺均价</span>
            <span className={`shop-item ${averagePrice ? '' : 'shop-item-active'} select-all`} onClick={this.selectShop.bind(this, 'averagePrice', '')}>全部</span>
            <div className='shop-item-wrap'>
              {Object.values(shopValues).map((tag) =>
                <span
                  onClick={this.selectShop.bind(this, 'averagePrice', tag)}
                  className={averagePrice === tag ? 'shop-item-active' : 'shop-item'}>{tag}</span>
              )}
            </div>
          </div>
          <div className='shop-line'>
            <span className='filter-shop'>店铺风格</span>
            <span className={`shop-item ${shopStyle ? '' : 'shop-item-active'} select-all`} onClick={this.selectShop.bind(this, 'shopStyle', '')}>全部</span>
            <div className='shop-item-wrap'>
              {Object.values(shopStyles).map((tag) =>
                <span
                  onClick={this.selectShop.bind(this, 'shopStyle', tag)}
                  className={shopStyle === tag ? 'shop-item-active' : 'shop-item'}>{tag}</span>
              )}
            </div>
          </div>
        </div>
      )
    } else {
      return <div style={{ marginBottom: 20 }} />
    }
  }
  // 渲染风格 （爆款推荐）
  renderStyle() {
    const { shopStyles, itemStyle } = this.state
    if (this.state.business === '女装') {
      return (
        <div className='filter-shop-wrap'>
          <div className='shop-line'>
            <span className='filter-shop'>风格</span>
            <span className={`shop-item ${itemStyle ? '' : 'shop-item-active'} select-all`} onClick={this.selectShop.bind(this, 'itemStyle', '')}>全部</span>
            <div className='shop-item-wrap'>
              {Object.values(shopStyles).map((tag) =>
                <span
                  onClick={this.selectShop.bind(this, 'itemStyle', tag)}
                  className={itemStyle === tag ? 'shop-item-active' : 'shop-item'}>{tag}</span>
              )}
            </div>
          </div>
          {/* <div className="shop-line">
              <span className='filter-shop'>颜色</span>
              <span className={`shop-item ${averagePrice?'':'shop-item-active'} select-all`}onClick={this.selectShop.bind(this, 'averagePrice', '')}>全部</span>
              <div className="shop-item-wrap">
                {Object.values(shopValues).map((tag) =>
                  <span
                    onClick={this.selectShop.bind(this,'averagePrice',tag)}
                    className={averagePrice === tag ? 'shop-item-active' : 'shop-item'}>{tag}</span>
                )}
              </div>
            </div> */}
        </div>
      )
    }
  }
  // 渲染排序
  renderSort() {
    const { rankStatus, minPrice, watchStatus } = this.state
    const { type } = this.props
    let sortType = ['销量最多', '销售额最多', '上新最多']
    switch (type) {
      case 1:
        sortType = watchStatus === 1
          ? ['销量最多', '销售额最多', '上新最多']
          : ['综合排序', '销量最多', '收藏最多', '价格从高到低', '价格从低到高']
        break
      case 2:
        sortType = ['销量最多', '销售额最多', '上新最多', '收藏最多']; break
      case 3:
        sortType = ['综合排序', '销量最多', '收藏最多', '价格从高到低', '价格从低到高']; break
      case 5:
        sortType = ['最新收藏', '销量最多', '收藏最多', '价格从高到低']; break
      default: break
    }
    return (
      <div className='filter-sort-wrap'>
        <span className='sort-title'>排序</span>
        {
          sortType.map((item, index) => <span className={rankStatus === index + 1 ? 'sort-item-active' : 'sort-item'} onClick={this.selectSort.bind(this, index + 1)}>{item}</span>)
        }
        {
          type === 3
            ? <span className='price-input-wrap'>
              <InputNumber placeholder='最低价' onChange={this.changePrice.bind(this, 'minPrice')} prefix={<span>¥</span>} />
              <span className='price-line'>-</span>
              <InputNumber min={minPrice} placeholder='最高价' onChange={this.changePrice.bind(this, 'maxPrice')} prefix={<span>¥</span>} />
            </span>
            : null
        }
      </div>
    )
  }
  render() {
    const { businessTag } = this.state
    const { title, type } = this.props
    return (
      <div className='filter-wrap'>
        <div className='filter-select-wrap'>
          <span className='filter-type'>{title}</span>
          <div>
            {
              type === 2
                ? <Select value={this.state.business || this.state.defaultBusiness} style={{ width: 115 }} onChange={this.changeBusiness.bind(this)}>
                  {Object.values(businessTag).map((tag) => <Option value={tag}>{tag}</Option>)}
                </Select>
                : null
            }
          </div>
        </div>
        {this.renderSecondLineFilter(type)}
        {
          type === 3
            ? this.renderStyle()
            : type === 1 || type === 5 || type === 6
              ? <div className='no-shop-filter' />
              : this.renderShop()
        }
        {type === 6 ? null : this.renderSort()}
      </div>
    )
  }
}

export default Filters
