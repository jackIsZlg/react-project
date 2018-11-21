/**
 * Created by gewangjie on 2018/3/6
 */
import React, {Component} from 'react'
import {Row, Col, Tooltip, Radio, DatePicker} from 'antd'
import '../../style/dataline/Inventory.less'
import ReactEcharts from 'echarts-for-react'
import moment from 'moment'
import request from '../../base/request'

const {RangePicker} = DatePicker

class Inventory extends Component {
  constructor (props) {
    super(props)
    this.state = {
      itemData: {},
      mode: 'LastWeek',
      ChartData: [],
      ChartDataone: [],
      previewVisible: false,
      previewImage: '',
      isEdit: false,
      isOpenDate: false,
      imgList: [],
      taobaoId: '',
      configdata: {},
      isUpload: false,
      dateArray: [],
      daySaleArray: [],
      CumulativeSalesArray: [],
      CumulativeSales: 0
    }
  }

  componentWillMount () {
    document.title = '宝贝详情'
    document.getElementById('title').innerText = '宝贝详情'
    let url = window.location.search // 获取url中"?"符后的字串
    if (url.indexOf('?') === -1) { // 判断是否有参数
      return
    }
    let str = url.substr(1), // 从第一个字符开始 因为第0个是?号 获取所有除问号的所有符串
      strs = str.split('=') // 用等号进行分隔 （因为知道只有一个参数 所以直接用等号进分隔 如果有多个参数 要用&号分隔 再用等号进行分隔）
    this.setState({
      taobaoId: strs[1]
    })
  }

    // 点击时间选择框ok之后回调
  componentDidMount () {
    this.getSalesInfo()
  }

  getSalesInfo (dayRange = '7', startDate = '', endDate = '') {
    let initTaobaoData = {
        dateArray: [],
        daySaleArray: [],
        CumulativeSalesArray: [],
        isOpenDate: false,
        CumulativeSales: 0
      },
      self = this,
      {taobaoId} = self.state

    request.getSalesCount(taobaoId, dayRange, startDate, endDate)
            .then(data => {
              const {itemBase, itemDaily} = data

              if (JSON.stringify(itemBase) === '{}' && !itemDaily.length) {
                self.setState(initTaobaoData)
                return
              }

              if (!itemDaily.length) {
                initTaobaoData.itemData = itemBase
                self.setState(initTaobaoData)
                return
              }

              if (JSON.stringify(itemBase) === '{}') {
                !!itemDaily.length && itemDaily.reverse().forEach(item => {
                  initTaobaoData.dateArray.push(item.insertDate.substring(5, 10))
                  initTaobaoData.daySaleArray.push(item.daySale)
                  initTaobaoData.CumulativeSalesArray.push(item.totleSale)
                })
                initTaobaoData.CumulativeSales = itemDaily[itemDaily.length - 1].totleSale
                self.setState(initTaobaoData)
                return
              }

              initTaobaoData.itemData = itemBase
              !!itemDaily.length && itemDaily.reverse().forEach(item => {
                initTaobaoData.dateArray.push(item.insertDate.substring(5, 10))
                initTaobaoData.daySaleArray.push(item.daySale)
                initTaobaoData.CumulativeSalesArray.push(item.totleSale)
              })
              initTaobaoData.CumulativeSales = itemDaily[itemDaily.length - 1].totleSale

              self.setState(initTaobaoData)
            }, data => {
              self.setState(initTaobaoData)
              console.log(data.errorDesc)
            })
  }

    // 根据不同的mode和天数获取销售信息
  handleModeChange (modeType, day) {
    let self = this
    self.setState({
      mode: modeType
    }, () => {
      self.getSalesInfo(day)
    })
  }

    // handleModeChangeCustom() {
    //     this.setState({
    //         mode: "custom",
    //         isOpenDate: true
    //     })
    // }

    // 点击时间选择框ok之后回调
  onOk (value) {
    let lastWeekDate = moment(value[0]).format('YYYY-MM-DD'),
      nowDate = moment(value[1]).add(1, 'days').format('YYYY-MM-DD')

    this.getSalesInfo('', lastWeekDate, nowDate)
  }

    // 不可选择预期
  disabledDate (current) {
    return current.valueOf() < new Date('2017-04-14').getTime()
  }

  compareDate (start, end) {
    start = start.getTime()
    end = end.getTime()
    var time = 0
    if (start > end) {
      time = start - end
    } else {
      time = end - start
    }
    return Math.floor(time / 86400000)
  }

  render () {
    let {itemData, mode, dateArray, daySaleArray, CumulativeSalesArray, CumulativeSales, isOpenDate} = this.state,
      price = (itemData.curCprice / 100).toFixed(2)

        // console.log(itemData)
    const option = {
            // 触发类型
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
          textStyle: {
            color: '#fff'
          }
        }
      },
      grid: {
        borderWidth: 0,
        top: 110,
        bottom: 95,
        textStyle: {
          color: '#fff'
        }
      },
      legend: {
        x: '4%',
        top: '11%',
        textStyle: {
          color: '#90979c'
        },
        data: ['销售增量', '累计销量']
      },
      calculable: true,
      xAxis: [{
        type: 'category',
        splitNumber: 10,
        axisLine: {
          lineStyle: {
            color: '#90979c'
          }
        },
        splitLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        splitArea: {
          show: false
        },
        axisLabel: {
          interval: 0,
          rotate: -30
        },
        data: dateArray
      }],
      yAxis: [{
        type: 'value',
        splitLine: {
          show: false
        },
        axisLine: {
          lineStyle: {
            color: '#90979c'
          }
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          interval: 0

        },
        splitArea: {
          show: false
        }

      }],
      series: [{
        name: '销售增量',
        type: 'bar',
        barMaxWidth: 20,
        barGap: '10%',
        itemStyle: {
          normal: {
            color: 'rgba(255,144,128,1)',
            label: {
              show: false,
              textStyle: {
                color: '#fff'
              },
              position: 'insideTop',
              formatter: function (p) {
                return p.value > 0 ? (p.value) : ''
              }
            }
          }
        },
        data: daySaleArray
      }, {
        name: '累计销量',
        type: 'line',
        symbolSize: 8,
        symbol: 'circle',
        itemStyle: {
          normal: {
            color: 'rgba(252,230,48,1)',
            barBorderRadius: 0,
            label: {
              show: false,
              position: 'top',
              formatter: function (p) {
                                // console.log("ppppp", p);
                return p.value > 0 ? (p.value) : ''
              }
            }
          }
        },
        data: CumulativeSalesArray
      }]
    }

    const CumulativeSales1 = CumulativeSales || 0
    return (
      <div>
        <div className='msg-wrap'>
          {itemData.agency ? <span className='agency-tag' style={{height: '20px', lineHeight: '20px', display: 'inline-block', padding: '0 5px'}}>代购</span> : null}
          {itemData.agencyCountry
                        ? <span className='agency-country agency-style'
                          style={{ backgroundColor: `${itemData.agencyCountry === '欧美' ? '#ff7b8c' : itemData.agencyCountry === '韩国' ? '#83d587' : '#4dbcd5'}` }}>
                          {itemData.agencyCountry || '暂无'}
                        </span>
                        : null
                    }
          <a style={{ fontSize: '15px', color: '#333333', cursor: 'default' }} >{itemData.shopName}</a>
          <a data-code='2200003' data-content={JSON.stringify({shop_id: itemData.shopId})} href={itemData.shopUrl} target='view_window' style={{ fontSize: '14px', height: '18px'}}>
            <span className='icon-shop' style={{margin: '0 15px -1px 30px'}} />
            <span>进入店铺</span>
          </a>

        </div>
        <Row style={{ marginTop: 10 }}>
          <div style={{display: 'flex'}}>
            <div style={{marginRight: '10px'}}>
              <div style={{ width: 224, height: 224, overflow: 'hidden' }}>
                <img alt='img'
                  src={itemData.picUrl + '_300x300.jpg'}
                  style={{width: '100%', height: '100%', objectFit: 'cover'}} />
              </div>
            </div>
            <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
              <div className='msg-wrap'>
                <a style={{ fontSize: '18px', color: '#333333', cursor: 'default' }} >{itemData.title}</a>
                <Tooltip placement='top' title='宝贝详情'>
                  <a data-code='2100003' data-content={JSON.stringify({item_id: itemData.itemId})} href={request.taobaoUrlHost + itemData.itemId} target='view_window' style={{ fontSize: '14px'}}>
                    <span className='icon-item' style={{margin: '0 5px 0px 30px'}} />
                    <span>宝贝详情页</span>
                  </a>
                </Tooltip>
              </div>
              <div>当前价格:<span style={{color: '#33a0ff'}}>{price}</span></div>
              <div>上新时间:<span style={{color: '#33a0ff'}}>{itemData.saleTime}</span></div>
              <div>总收藏数:<span style={{color: '#33a0ff'}}>{itemData.collect}</span></div>
            </div>
          </div>
        </Row>
        <Row className='Commodity-parameter'>
          <ul className='arrows'>
            <li>销售数据</li>
          </ul>
          <Row>
            <Col span={4}>
              <div style={{color: '#333333', fontSize: 13}}>累计销量</div>
              <div style={{color: '#333333', fontSize: 24}}>{CumulativeSales1}</div>
            </Col>
            <Col span={20} style={{textAlign: 'right'}}>
              <div>
                <Radio.Group value={mode} style={{marginBottom: 8}}>
                  {/* <Radio.Button value="24hours" */}
                  {/* onClick={this.handleModeChange.bind(this, '24hours', '1')}>上新24H</Radio.Button> */}
                  <Radio.Button value='LastWeek'
                    onClick={this.handleModeChange.bind(this, 'LastWeek', '7')}>上新一周</Radio.Button>
                  {
                                        // this.compareDate(new Date(itemData.saleTime), new Date()) > 7 &&
                    <Radio.Button value='NearlyMonth' disabled={this.compareDate(new Date(itemData.saleTime), new Date()) <= 7}
                      onClick={this.handleModeChange.bind(this, 'NearlyMonth', '30')}>上新一个月</Radio.Button>
                                    }
                  {/* <Radio.Button value="custom" */}
                  {/* onClick={this.handleModeChangeCustom.bind(this)}>自定义</Radio.Button> */}
                </Radio.Group>
              </div>
              <RangePicker
                showTime
                format='YYYY-MM-DD'
                placeholder={['开始时间', '结束时间']}
                onOk={this.onOk.bind(this)}
                style={{visibility: 'hidden'}}
                size='small'
                allowClear={false}
                open={isOpenDate}
                disabledDate={this.disabledDate}
                defaultValue={[moment(moment().subtract(31, 'days').format('YYYY-MM-DD')), moment(moment().subtract(1, 'days').format('YYYY-MM-DD'))]}
                            />

            </Col>
          </Row>
          <Row style={{'border': '1px solid #e7e7e7'}}>
            <ReactEcharts ref='echartsInstance' option={option} />
          </Row>
        </Row>
      </div>
    )
  }
}

export default Inventory
