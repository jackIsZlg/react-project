import React, { Component } from 'react';
import {
  Table,
  Pagination,
  Rate,
  Modal,
  message,
  LocaleProvider,
  Tooltip
} from 'antd'
import zh_CN from 'antd/lib/locale-provider/zh_CN'
import moment from 'moment'
import link from '../../base/link'
import request from '../../base/request'
import base from '../../base/baseMoudle'
import Filters from '../../component/filters/index'
import defaultImg from '../../image/defaul-item.png'
import '../../style/dataline/reacommend.less';
import '../../style/dataline/DateExpress.less';
import noResult from '../../image/no_result.png'
import m from '../../base/message'
const sortConst = { sale: { ascend: 1, descend: 3 }, salesVolume: { ascend: 2, descend: 4 } }
const tableHeaderMessage = {
  newItemCount: '店铺上新款数是指在当前所选日期中，该店铺上新的宝贝总数。',
  newItemSalesVolume: '店铺上新首日销量是上新时间至当天24小时为止，所有上新商品的销量总和。',
  newItemSale: '店铺上新首日估算销售额是上新时间至当天24小时为止，上新时间至当天24小时为止，所有上新商品的销售总额。'
}

class StoreData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      params: { watchStatus: 1 },
      data: [],// 表格数据源存放的地方
      itemData: [], // 商品列表数据源
      totalCount: 0,//数据总数，后台返回数据有多少条
      loading: true,
      visible: false,
      startDate: '',
      endDate: '',
      confirmLoading: false,
    }
  }

  componentDidMount() {
    document.title = "店铺列表";
    document.getElementById('title').innerText = '店铺列表'
    this.getMainScope()
  }

  getMainScope() {
    request.basic('shop/all-main-industry-name')
      .then(mainIndustry => {
        this.setState({ mainIndustry })
      }, data => {
        console.log(data.errorDesc)
      })
  }
  // 获取店铺信息
  async getShopList() {
    this.setState({ loading: true })
    const data = await request.getShops(base.objToSearch(this.state.params))
    this.setState({ data: data.resultList, loading: false, totalCount: data.resultCount })
  }
  // 获取爆款信息
  async getRecomemndList() {
    this.setState({ loading: true })
    const result = await request.getRecommends(base.objToSearch(this.state.params))
    const itemData = result.resultList
    this.setState({ itemData, loading: false, totalCount: result.resultCount })

  }

  changeDiff(type, index, itemId) {
    request.changeItemDiff(type, itemId).then(res => {
      if ((!type && res.result) || (type && res)) {
        const itemData = this.state.itemData
        itemData[index].contrastFlag = !itemData[index].contrastFlag
        this.setState({ itemData })
      }
      else {
        message.warning(res.msg);
      }
    })
  }
  changeShopDiff(type, index, itemId) {
    request.changeShopDiff(type, itemId).then(res => {
      if ((!type && res.result) || (type && res)) {
        const data = this.state.data
        data[index].contrastFlag = !data[index].contrastFlag
        this.setState({ data })
      }
      else {
        message.warning(res.msg);
      }
      m.pub('compare')
    })
  }

  changeCollect(type, index, itemId) {
    request.changeItemCollect(type, itemId).then(res => {
      if (res) {
        const itemData = this.state.itemData
        itemData[index].collectFlag = !itemData[index].collectFlag
        this.setState({ itemData })
      }
      else {
        message.warning(res.msg);
      }
    })
  }
  handleTableChange = async (pagination, filters, sorter) => {
    if (sorter.field && sorter.order) {
      this.state.params.rank = sortConst[sorter.field][sorter.order]
      this.search(this.state.params)
    }
  }
  // 监控店铺
  addShopFollow(index) {
    let self = this,
      { data } = self.state,
      item = data[index],
      { shopName } = item;
    request.addShopFollow(shopName, '', {
      method: 'POST'
    }).then(() => {
      message.success(shopName + '监控成功');
      item.follow = true;
      self.setState({ data })
    }, (d) => {
      message.warning('监控失败');
      console.log(d.errorDesc);
    })
  }
  cancelFollow(id, index) {
    Modal.confirm({
      title: '确认提示',
      content: '确认取消监控',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          await request.cancelFollow(id)
          this.getShopList()
        } catch (error) {
          console.log(error)
          message.error('服务器请求失败');
        }
      }
    });
  }
  //分页所调用函数
  onTablePageChange(page) {
    let { params } = this.state
    params.pageNo = page
    this.setState({ params }, () => { this.getShopList() })
  }
  onChangepage(pageNo) {
    const params = this.state.params
    params.pageNo = pageNo
    this.setState({ params }, () => this.search(params))
  }
  onOk(value) {
    let self = this;
    self.setState({
      startDate: moment(value[0]).format('YYYY-MM-DD'),
      endDate: moment(value[1]).format('YYYY-MM-DD'),
      pageNo: 1
    }, () => { self.getShopList() })
  }

  search(params) {
    console.log('params', params)
    this.setState({ params },
      params.watchStatus === 1 ? () => this.getShopList() : () => this.getRecomemndList()
    )
  }

  render() {
    const { data, params, loading, totalCount } = this.state
    const eventContent = JSON.parse(JSON.stringify(params))
    const columns = [
      {
        title: '店铺',
        dataIndex: 'shopName',
        key: 'shopName',
        width: '25%',
        render: (text, record, index) => {
          eventContent.shop_id = record.shopId
          return (
            <a data-code="2200003" data-content={JSON.stringify(eventContent)} href={`/dataline/shopDetail?shopId=${record.shopId}`} target='view_window' style={{ display: 'flex', marginRight: '10px' }}>
              <img alt='log' src={record.logoUrl || defaultImg} style={{
                width: ' 90px', height: '90px', border: 'solid 1px #f6f6f6', marginRight: '10px'
              }} />
              <div className="shop-info">
                <span>{text}</span>
                <span style={{ color: "#333" }}><i className="iconfont" style={{ marginRight: "10px", fontSize: "14px", color: "#1890ff" }}>&#xe619;</i>{record.wangwangId}</span>
              </div>
            </a>
          )
        }
      },
      {
        title: '店铺风格',
        align: 'center',
        dataIndex: 'style',
        key: 'style',
        render: (text, record, index) => <div>{record.shopStyle && record.shopStyle.split(",").map((item, index) => {
          if (index >= 3) {
            return null
          }
          return <div className="shop-style-label">{item}</div>
        })}</div>
      },
      {
        title: '类型',
        align: 'center',
        dataIndex: 'type',
        key: 'type',
        render: (text, record, index) => <div>{record.shopType}</div>
      },
      {
        title: <div>上新首日估算销售额<Tooltip overlayClassName="new-tooltip" autoAdjustOverflow={true} title={tableHeaderMessage.newItemSale}><i className="iconfont wenhao">&#xe61a;</i></Tooltip></div>,
        align: 'center',
        dataIndex: 'sale',
        key: 'sale',
        render: (text, record, index) => <div>￥{((text / 1000000).toFixed(2) * 1).toLocaleString()}</div>
      },
      {
        title: <div>上新首日销量<Tooltip overlayClassName="new-tooltip" autoAdjustOverflow={true} title={tableHeaderMessage.newItemSalesVolume}><i className="iconfont wenhao">&#xe61a;</i></Tooltip></div>,
        align: 'center',
        dataIndex: 'salesVolume',
        key: 'salesVolume',
        render: (text, record, index) => <span>{text}</span>
      },
      {
        title: <div>上新款数<Tooltip overlayClassName="new-tooltip" autoAdjustOverflow={true} title={tableHeaderMessage.newItemCount}><i className="iconfont wenhao">&#xe61a;</i></Tooltip></div>,
        align: 'center',
        dataIndex: 'newItemCount',
        key: 'newItemCount',
        render: (text, record, index) => <span>{text}</span>
      },
      {
        title: '均价',
        align: 'center',
        dataIndex: 'averagePrice',
        key: 'averagePrice',
        render: (text, record, index) => <span>{record.averagePrice}</span>
      },
      // {
      //   title: '收藏量',
      //   dataIndex: 'collect',
      //   key: 'collect',
      //   width: '7%'
      // },
      {
        title: '昨日销量TOP',
        align: 'center',
        dataIndex: 'top',
        key: 'top',
        render: (text, record, index) => <div>{
          record.topItemList.length > 0 ? record.topItemList.map((item, index) => {
            return <img
              onClick={link.toGoodDetail.bind(null, item.itemId)}
              alt={item.title} src={item.picUrl}
              style={{ cursor: 'pointer', width: '65px', height: '65px', backgroundColor: '#d8d8d8', marginRight: '5px' }}
            />
          }) : '暂无商品'
        }
        </div>
      },
      {
        title: '操作',
        align: 'center',
        dataIndex: 'follow',
        key: 'follow',
        render: (text, record, index) => {
          return (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <a onClick={this.changeShopDiff.bind(this, record.contrastFlag, index, record.shopId)} style={{ marginBottom: '18px', color: record.contrastFlag ? '#999' : '' }} >{record.contrastFlag ? '取消对比' : '加入对比'}</a>
              {record.follow ? <a style={{ color: '#999' }} onClick={this.cancelFollow.bind(this, record.shopId)}>取消监控</a> : <a onClick={this.addShopFollow.bind(this, index)}>监控店铺</a>}
            </div>
          )
        }
      },
    ];
    return (
      <div className='content'>
        <Filters title="监控店铺" type={1} search={this.search.bind(this)} history={this.props.history} />
        {
          this.state.params.watchStatus === 1
            ?
            <div>
              <LocaleProvider locale={zh_CN}>
                <Table loading={loading}
                  pagination={{
                    defaultPageSize: this.state.params.pageSize || 20,
                    showQuickJumper: true,
                    total: totalCount,
                    onChange: this.onTablePageChange.bind(this),
                    current: this.state.params.pageNo,
                    defaultExpandAllRows: true,
                    hideOnSinglePage: true
                  }}
                  onChange={this.handleTableChange}
                  columns={columns}
                  dataSource={data}
                  bordered
                  scroll={{ x: true }}
                  rowKey={record => record.shopId}
                  id='store-table'
                  locale={{ emptyText: '暂无店铺' }} />
              </LocaleProvider>
            </div>
            : <div>
              <div ref={node => this.contentNode = node} className="imgs-wrap">
                {
                  !this.state.loading && this.state.itemData.length ?
                    this.state.itemData.map((item, index) => {
                      eventContent.item_id = item.itemId
                      return (
                        <div className="img-single" key={index} style={{ width: '300px' }}>
                          <div style={{ position: 'relative' }}>
                            <div onClick={this.changeDiff.bind(this, item.contrastFlag, index, item.itemId)} className="marke-diff">{item.contrastFlag ? '取消对比' : '对比'}</div>
                            <div onClick={this.changeCollect.bind(this, item.collectFlag, index, item.itemId)} className="marke-collect">{item.collectFlag ? '取消收藏' : '收藏'}</div>
                            <div
                              data-code="2100001"
                              data-content={JSON.stringify(eventContent)}
                              onClick={link.toGoodDetail.bind(null, item.itemId)}
                              className="img-single-item" style={{ background: `url(${item.picUrl || this.state.nullImg}) top/contain no-repeat`, height: '300px', width: '300px' }}>
                            </div>
                          </div>
                          <div data-code="2100001" data-content={JSON.stringify(eventContent)} onClick={link.toGoodDetail.bind(null, item.itemId)} >
                            <div className='item-info'>
                              <span>爆款值:<Rate disabled defaultValue={item.hotLevel} /></span>
                              <span>30天销量:{item.salesVolume30 ? parseInt(item.salesVolume30, 10) : 0}</span>
                            </div>
                            <div className='item-name'>
                              <a target="view_window" onClick={link.toGoodDetail.bind(null, item.itemId)}>{item.itemName || '暂无'}</a>
                            </div>
                            <div className='item-price'>
                              <span>¥{item.price / 100}</span>
                              <span>{item.saleTime}上架</span>
                            </div>
                            {/* <div data-code="2100001" data-content={JSON.stringify(eventContent)}  onClick={link.toGoodDetail.bind(null, item.itemId)}  className='item-name'>爆款度<Rate disabled defaultValue={item.hotLevel} /></div> */}
                          </div>
                        </div>
                      )
                    })
                    :
                    this.state.loading
                      ? null
                      : this.state.params.shopFilterStatus === 2
                        ? <div className="no-result"><img alt='' src={noResult} />已监控的店铺暂无爆款商品</div>
                        : <div>暂无数据</div>
                }
              </div>
              {(!this.state.loading && this.state.totalCount > this.state.params.pageSize) ?
                <Pagination
                  hideOnSinglePage
                  defaultCurrent={1}
                  pageSize={this.state.params.pageSize}
                  current={this.state.params.pageNo}
                  onChange={this.onChangepage.bind(this)}
                  total={this.state.totalCount} /> : null
              }
            </div>
        }
      </div>
    );
  }
}

export default StoreData