import React, { Component } from 'react';
import {
  Row,
  Table,
  Tooltip,
  Modal,
  message,
  LocaleProvider
} from 'antd'
import classNames from "classnames"
import moment from 'moment'
import '../../style/dataline/DateExpress.less'
import link from '../../base/link'
import request from '../../base/request'
import base from '../../base/baseMoudle'
import zh_CN from 'antd/lib/locale-provider/zh_CN'
import Filters from '../../component/filters/index'
import defaultImg from '../../image/defaul-item.png'
import m from '../../base/message'
// 爆款图片容器
const HotImg = (props) => {
  const { src, hot } = props;
  return (
    <div className={classNames('hot-image', { 'hot': hot })} style={{ width: 120, height: 120, overflow: 'hidden' }}>
      <img alt="爆款图片" src={src + '_120x120.jpg'} style={{ width: 120, height: 120, objectFit: 'cover' }} />
    </div>
  )
};
const tableHeaderMessage = {
  newItemCount: '店铺上新款数是指在当前所选日期中，该店铺上新的宝贝总数。数量下方的百分比，是相对于前一天数据的浮动占比。',
  newItemSalesVolume: '店铺上新首日销量是上新时间至当天24小时为止，所有上新商品的销量总和。数量下方的百分比，是相对于前一天数据的浮动占比。',
  newItemSale: '店铺上新首日估算销售额是上新时间至当天24小时为止，上新时间至当天24小时为止，所有上新商品的销售总额。数量下方的百分比，是相对于前一天数据的浮动占比。'
}
const sortConst = { newProductsSaleAmount: { ascend: 1, descend: 3 }, newProductsSale: { ascend: 2, descend: 4 } }
class DataExpress extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shopInfo: {
        shopSource: [],//店铺数据
        shopTotal: 0,
        shopCurrent: 1,//分页页数高亮
        shopIndex: 0
      },
      productInfo: {
        productSource: [],// 对应店铺下的商品数据
        productTotal: 0,
        productCurrent: 1,
        productId: ''
      },
      hasFollow: 1,
      shopIdList: '',
      shopFilterStatus: 2,
      isPast: false,//当前销量跟上新首日销量切换依据的状态
      choiceDate: moment(Date.now() - 3600 * 1000 * 24).format('YYYY-MM-DD'),
      isModelShow: 0,// model层展开状态 0.都不展开 1.展开上新商品 2.展开爆款商品
      dataLoading: 0,// 加载状态 0.加载状态消失 1.店铺加载状态 2.上新商品加载状态 3.爆款商品加载状态
      rankStatus: 4,
      params: {}
    }
  }

  componentWillMount() {
    document.title = "上新日报";
    document.getElementById('title').innerText = '上新日报'
  }

  componentDidMount() {
    request.getFollowShops().then((res) => {
      console.log('res', res)
      this.setState({ hasFollow: res, shopFilterStatus: res === 0 ? 1 : 2 }, () => this.getPageData())
    })
  }

  // 查询数据
  search(params) {
    const shopInfo = this.state.shopInfo
    shopInfo.shopCurrent = 1
    this.setState({ params, shopInfo }, () => this.getPageData())
  }
  // 处理店铺数据
  dealShopData(data) {
    let hotData = '',
      shopdata = data && data.map((item, index) => {
        item.dailyShopInfo.newProductsSaleAmount = (item.dailyShopInfo.newProductsSaleAmount * 1 / 100).toFixed(2);
        item.dailyShopInfo.agency = item.shopInfo.agency;
        item.dailyShopInfo.shopName = item.shopInfo.shopName;
        item.dailyShopInfo.shopUrl = item.shopInfo.shopUrl;
        item.dailyShopInfo.followFlag = item.followFlag;
        item.dailyShopInfo.followFlag = item.followFlag;
        item.dailyShopInfo.logoUrl = item.shopInfo.logoUrl;
        item.dailyShopInfo.contrastFlag = item.contrastFlag;
        item.dailyShopInfo.wangwangId = item.shopInfo.wangwangId;
        hotData += (!!index && ',') + item.dailyShopInfo.shopId;
        return item.dailyShopInfo
      });
    this.setState({ shopIdList: hotData });
    return shopdata
  }

  // 获取一天以后的时间
  getOneDayLater(time, day) {
    return moment(new Date(new Date(time).getTime() + (24 * 3600 * 1000) * day)).format('YYYY-MM-DD')
  }

  // 获取店铺信息
  getPageData(dateString = '') {
    let self = this,
      { shopInfo, dataLoading, choiceDate, params, isPast } = self.state,
      chooseDate = dateString || choiceDate,
      date1 = new Date(chooseDate).getTime(),
      date2 = new Date().getTime(),
      date3 = date2 - date1,
      days = Math.floor(date3 / (24 * 3600 * 1000));
    dataLoading = 1;
    choiceDate = params.startDate;
    isPast = days > 0;
    self.setState({
      dataLoading, choiceDate, isPast
    }, () => {
      params.pageNo = shopInfo.shopCurrent
      request.getShopList(base.objToSearch(params))
        .then((data) => {
          shopInfo.shopSource = self.dealShopData(data.resultList);
          shopInfo.shopTotal = data.resultCount;
          dataLoading = 0;
          self.setState({
            shopInfo, dataLoading
          })
          // console.log('shopInfo', shopInfo)
        }, data => {
          shopInfo.shopSource = [];
          shopInfo.shopTotal = 0;
          dataLoading = 0;
          self.setState({ shopInfo, dataLoading });
          console.log(data.errorDesc)
        })
    })
  }

  // 添加监控
  addShopFollow = (index) => {
    const self = this,
      { shopInfo } = self.state,
      { shopSource } = shopInfo,
      { shopName } = shopSource[index];
    request.addShopFollow(shopName, '', {
      method: 'POST'
    }).then(() => {
      request.getFollowShops().then((res) => { this.setState({ hasFollow: res }) })
      message.success(shopName + '监控成功');
      shopSource[index].followFlag = 1;
      self.setState({ shopInfo })
    }, d => {
      message.warning('监控失败');
      console.log(d.errorDesc)
    })
  };

  // 是否展示上新商品或爆款商品
  handleModelShow(status, id = -1) {
    let self = this,
      { productInfo, isModelShow } = self.state;
    switch (status) {
      case 1: // 显示上新商品
        isModelShow = 1;
        productInfo.productId = id;
        productInfo.productCurrent = 1;
        self.setState({ isModelShow, productInfo }, () => {
          self.getProductInfo();
        });
        break;
      case 0: // 不显示任何商品
      default:
        isModelShow = 0;
        self.setState({ isModelShow });
        break
    }
  }

  changeShopDiff(type, index, itemId) {
    request.changeShopDiff(type, itemId).then(res => {
      if ((!type && res.result) || (type && res)) {
        const shopInfo = this.state.shopInfo
        shopInfo.shopSource[index].contrastFlag = !shopInfo.shopSource[index].contrastFlag
        this.setState({ shopInfo })
      }
      else {
        message.warning(res.msg);
      }
      m.pub('compare')
    })
  }

  // 处理上新商品列表数据
  dealProductInfo(data) {
    return data.map(item => {
      item.curCprice = (item.curCprice * 1 / 100).toFixed(2);
      return item
    })
  }

  // 获取上新商品信息
  getProductInfo() {
    let self = this, { choiceDate, productInfo, dataLoading, params } = self.state;
    self.setState({
      dataLoading: 2
    }, () => {
      let requestdata = {
        shopId: productInfo.productId,
        date: choiceDate,
        pageNo: productInfo.productCurrent,
        pageSize: params.pageSize
      };
      request.getNewProductList(base.objToSearch(requestdata))
        .then(data => {
          dataLoading = 0;
          productInfo.productSource = self.dealProductInfo(data.resultList);
          productInfo.productTotal = data.resultCount;
          self.setState({ productInfo, dataLoading })
        }, data => {
          console.log(data.errorDesc)
        });
    })
  }


  // 改变店铺页数
  onTablePageChange(page) {
    let { shopInfo, params } = this.state;
    shopInfo.shopCurrent = page;
    shopInfo.shopIndex = (page - 1) * params.pageSize;
    this.setState({
      shopInfo
    }, () => {
      this.getPageData();
    });
  }


  onProductPageChange(page) {
    let { productInfo } = this.state;
    productInfo.productCurrent = page;
    this.setState({
      productInfo
    }, () => {
      this.getProductInfo()
    });
  }


  handleTableChange = async (pagination, filters, sorter) => {
    if (sorter.field && sorter.order) {
      this.state.rankStatus = sortConst[sorter.field][sorter.order]
      this.getPageData();
    }
  }
  cancelShopFollow(shopId) {
    request.basic('shop/follow_cancel?shopId=' + shopId)
      .then(() => {
        message.success('取消监控成功');
        request.getFollowShops().then((res) => { this.setState({ hasFollow: res }) })
        this.getPageData()
      }, data => {
        message.warning('取消监控失败');
        console.log(data.errorDesc);
      })
  }
  render() {
    const { shopInfo, productInfo, isPast, isModelShow, params, dataLoading } = this.state,
      { shopSource, shopCurrent, shopTotal, shopIndex } = shopInfo,
      { productSource, productTotal, productCurrent } = productInfo,
      eventContent = JSON.parse(JSON.stringify(this.state.params)),
      // 展开Table配置
      insideColumns = [
        {
          title: '图片', dataIndex: 'picUrl', key: 'picUrl', width: '8%',
          render: (text, record, index) => <HotImg src={record.picUrl} hot={record.hotScore} />
        },
        {
          title: '名称', dataIndex: 'title', key: 'title', width: '11%',
          render: (text, record, index) => {
            eventContent.item_id = record.itemId
            return (<div
              data-code="2100001"
              data-content={JSON.stringify(eventContent)} >
              <a data-code="2100003" data-content={JSON.stringify(eventContent)} href={request.taobaoUrlHost + record.itemId} target='view_window' style={{ fontSize: "14px" }}>
                <Tooltip placement="top" title="宝贝详情">
                  <span className='icon-item' style={{ margin: '0 5px' }} />
                </Tooltip>
              </a>
              <a target="view_window" onClick={link.toGoodDetail.bind(null, record.itemId)}>{record.title}</a>
              {!!record.snapshot && <a
                style={{ display: "block", marginTop: 5 }} href={record.snapshot}
                target="view_window">[页面快照]</a>}
            </div>)
          }
        },
        { title: '品类', dataIndex: 'categoryName', key: 'categoryName', width: '10%' },
        { title: '当日收藏', dataIndex: 'firstDayCollect', key: 'firstDayCollect', width: '8%', },
        {
          title: '上新时间', dataIndex: 'saleTime', key: 'saleTime', width: '11%',
          render: (text, record, index) => <span style={{
            wordBreak: "break-all",
            wordWrap: "break-word",
            display: "inline-block"
          }}>{text}</span>
        },
        {
          title: '价格', dataIndex: 'curCprice', key: 'curCprice', width: '6%',
          render: text => {
            if (Object.prototype.toString.call(text) === "[object Object]") {
              return <div>
                <div>当前:{text.curPrice}</div>
                <div>上新:{text.shelfPrice}</div>
                <div>最高:{text.max}</div>
                <div>最低:{text.min}</div>
              </div>
            } else if (text === "暂无数据") {
              return <div>{text}</div>
            } else {
              return <div>{text}</div>
            }
          }
        },
        {
          title: isPast ? '上新首日销量' : '当前销量', dataIndex: 'firstDaySale', key: 'firstDaySale', width: '12%',
          sorter: (a, b) => b.firstDaySale - a.firstDaySale
        },
      ],
      // 外层Table配置
      outColumns = [
        {
          title: '排名', dataIndex: 'index', key: 'index', width: '4%', align: 'center',
          render: (text, record, index) => <div>{index + shopIndex + 1}</div>,
        },
        {
          title: '店铺', dataIndex: 'shopName', key: 'shopName', width: '10%',
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
          title: '收藏量', dataIndex: 'newItemCollect', key: 'newItemCollect',width: '4%', align: 'center',
          render: (text, record, index) => text
        },
        {
          title: <div>上新款数<Tooltip overlayClassName="new-tooltip" autoAdjustOverflow={true} title={tableHeaderMessage.newItemCount}><i className="iconfont wenhao">&#xe61a;</i></Tooltip></div>, dataIndex: 'newItemCount', key: 'newItemCount', width: '6%', align: 'center',
          render: (text, record, index) => {
            return (<div>
              <div>{record.newItemCount}</div>
              <div style={{ marginTop: '10px', fontSize: '12px', color: record.newItemCountRatio > 0 ? '#f35451' : record.newItemCountRatio < 0 ? '#9acc66' : '#ccc' }}>
                {record.newItemCountRatio > 0 ? '+' : ''}{(record.newItemCountRatio === null || record.newItemCountRatio * 1 === 0) ? "--" : (record.newItemCountRatio * 100).toFixed(2) + '%'}
              </div>
            </div>)
          }
        },
        {
          title: <div>{isPast ? '上新首日销量' : '当前销量'}<Tooltip overlayClassName="new-tooltip" autoAdjustOverflow={true} title={tableHeaderMessage.newItemSalesVolume}><i className="iconfont wenhao">&#xe61a;</i></Tooltip></div>, dataIndex: 'newItemSalesVolume', key: 'newItemSalesVolume', width: '8%', align: 'center',
          render: (text, record, index) => {
            return (<div>
              <div>{record.newItemSalesVolume}</div>
              <div style={{ marginTop: '10px', fontSize: '12px', color: record.newItemSalesVolumeRatio > 0 ? '#f35451' : record.newItemSalesVolumeRatio < 0 ? '#9acc66' : '#ccc' }}>
                {record.newItemSalesVolumeRatio > 0 ? '+' : ''}{(record.newItemSalesVolumeRatio === null || record.newItemSalesVolumeRatio * 1 === 0) ? "--" : (record.newItemSalesVolumeRatio * 100).toFixed(2) + '%'}
              </div>
            </div>)
          }
        },
        {
          title: <div>{isPast ? '上新首日估算销售额' : '当前估算销售额'}<Tooltip overlayClassName="new-tooltip" autoAdjustOverflow={true} title={tableHeaderMessage.newItemSale}><i className="iconfont wenhao">&#xe61a;</i></Tooltip></div>, dataIndex: 'newItemSale', key: 'newItemSale', width: '8%', align: 'center',
          render: (text, record, index) => {
            return (<div>
              <div>{record.newItemSale / 100}</div>
              <div style={{ marginTop: '10px', fontSize: '12px', color: record.newItemSaleRatio > 0 ? '#f35451' : record.newItemSaleRatio < 0 ? '#9acc66' : '#ccc' }}>
                {record.newItemSaleRatio > 0 ? '+' : ''}{(record.newItemSaleRatio === null || record.newItemSaleRatio * 1 === 0) ? "--" : (record.newItemSaleRatio * 100).toFixed(2) + '%'}
              </div>
            </div>)
          }
        },
        {
          title: '操作', key: 'action', width: '10%', align: 'center',
          render: (text, record, index) => {
            return (
              <div>
                <div>
                  <a onClick={this.handleModelShow.bind(this, 1, record.shopId)} style={{ display: 'inline-block', marginRight: '50px', marginBottom: '18px' }}>上新详情</a>
                  {
                    record.followFlag
                      ? <a style={{ color: '#999' }} onClick={this.cancelShopFollow.bind(this, record.shopId)}>取消监控</a>
                      : <a onClick={this.addShopFollow.bind(this, index)}>监控店铺</a>
                  }
                </div>
                <div>
                  <a onClick={link.toShopDetail.bind(null, record.shopId)} style={{ display: 'inline-block', marginRight: '50px' }}>店铺数据</a>
                  <a onClick={this.changeShopDiff.bind(this, record.contrastFlag, index, record.shopId)} style={{ marginBottom: '18px', color: record.contrastFlag ? '#999' : '' }} >{record.contrastFlag ? '取消对比' : '加入对比'}</a>
                </div>
              </div>
            )
          }
        }
      ];
    console.log('shopSource', shopSource)
    return (
      <div className="content">
        <Filters title="上新日报" type={2} search={this.search.bind(this)} />
        <Row>
          <LocaleProvider locale={zh_CN}>
            <Table
              loading={dataLoading === 1}
              pagination={{
                defaultPageSize: params.pageSize || 20,
                showQuickJumper: true,
                total: shopTotal,
                onChange: this.onTablePageChange.bind(this),
                current: shopCurrent,
                defaultExpandAllRows: true,
                hideOnSinglePage: true
              }}
              align="align"
              columns={outColumns}
              className="components-table-demo-nested"
              dataSource={shopSource}
              scroll={{ x: true }}
              onChange={this.handleTableChange}
              rowKey={record => record.shopId}
              bordered
              locale={{ emptyText: (this.state.hasFollow === 0 && this.state.shopFilterStatus === 2) ? '您还没有监控店铺' : '暂无上新' }} />
          </LocaleProvider>
        </Row>
        <Modal title="上新商品"
          visible={isModelShow === 1}
          width="80%"
          footer={null}
          onCancel={this.handleModelShow.bind(this, 0)}>
          <LocaleProvider locale={zh_CN}>
            <Table loading={dataLoading === 2}
              columns={insideColumns}
              dataSource={productSource}
              pagination={{
                showQuickJumper: true,
                defaultPageSize: params.pageSize,
                total: productTotal,
                onChange: this.onProductPageChange.bind(this),
                current: productCurrent,
                defaultExpandAllRows: true,
                hideOnSinglePage: true
              }}
              rowKey={dataSource => dataSource.itemId}
              id="insideTable"
              bordered
              locale={{ emptyText: '暂无上新商品' }} />
          </LocaleProvider>
        </Modal>
      </div>
    );
  }
}

export default DataExpress