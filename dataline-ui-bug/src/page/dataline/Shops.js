import React, { Component } from 'react';
import {
  Table,
  Modal,
  message,
  LocaleProvider,
  DatePicker,
} from 'antd'
import zh_CN from 'antd/lib/locale-provider/zh_CN'
import moment from 'moment'
import link from '../../base/link'
import request from '../../base/request'
import base from '../../base/baseMoudle'
import Filters from '../../component/filters/index'
import defaultImg from '../../image/defaul-item.png'
import m from '../../base/message'
import '../../style/dataline/DateExpress.less'
import '../../style/dataline/reacommend.less';

const sortConst = { sale: { ascend: 1, descend: 3 }, salesVolume: { ascend: 2, descend: 4 } }
const { RangePicker } = DatePicker;
class StoreData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      params: {},
      data: [],//表格数据源存放的地方
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
    console.log(data.resultList)
    this.setState({ data: data.resultList, loading: false, totalCount: data.resultCount })
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
    this.setState({ params }, () => {
      this.getShopList()
    })
  }

  onOk(value) {
    let self = this;
    self.setState({
      startDate: moment(value[0]).format('YYYY-MM-DD'),
      endDate: moment(value[1]).format('YYYY-MM-DD'),
      pageNo: 1
    }, () => { self.getShopList() })
  }
  changeDiff(type, index, itemId) {
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
  search(params) {
    console.log('params', params)
    this.setState({ params }, () => this.getShopList())
  }

  //估计不可选择预期
  disabledDate(current) {
    return (current.valueOf() < new Date("2017-04-14").getTime() || current.valueOf() > moment(Date.now() - 3600 * 1000 * 24))
  }
  // 导出
  exportShops() {
    this.setState({ visible: true })
  }
  onChangeExport(value, dateString) {
    this.setState({ startDate: dateString[0], endDate: dateString[1] })
  }
  onOkExport(value) {
    console.log('onOk: ', value);
  }
  handleOk() {
    const { startDate, endDate } = this.state
    this.setState({ startDate: '', endDate: '', visible: false }, () => {
      window.location.href = `/api/file/shop-list-stat?startDate=${startDate}&endDate=${endDate}`
    })
  }
  handleCancel() {
    this.setState({ startDate: '', endDate: '', visible: false })
  }
  render() {
    const { data, visible, params, confirmLoading, loading, totalCount, startDate, endDate } = this.state
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
        title: '估算销售额(万元)',
        align: 'center',
        dataIndex: 'sale',
        key: 'sale',
        render: (text, record, index) => <div>￥{((text / 1000000).toFixed(2) * 1).toLocaleString()}</div>
      },
      {
        title: '销量',
        align: 'center',
        dataIndex: 'salesVolume',
        key: 'salesVolume',
        // sorter: true,
        render: (text, record, index) => <span>{text}</span>
      },
      {
        title: '上新商品数',
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
          record.topItemList.length && record.topItemList.map((item, index) => {
            return <img
              onClick={link.toGoodDetail.bind(null, item.itemId)}
              alt={item.title} src={item.picUrl}
              style={{ cursor: 'pointer', width: '65px', height: '65px', backgroundColor: '#d8d8d8', marginRight: '5px' }}
            />
          })
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
              <a onClick={this.changeDiff.bind(this, record.contrastFlag, index, record.shopId)} style={{ marginBottom: '18px', color: record.contrastFlag ? '#999' : '' }} >{record.contrastFlag ? '取消对比' : '加入对比'}</a>
              {record.follow ? <a style={{ color: '#999' }} onClick={this.cancelFollow.bind(this, record.shopId)}>取消监控</a> : <a onClick={this.addShopFollow.bind(this, index)}>监控店铺</a>}
            </div>
          )
        }
      },
    ];
    return (
      <div className='content'>
        <Filters title="店铺排行" type={4} search={this.search.bind(this)} />
        <LocaleProvider locale={zh_CN}>
          <Modal title="导出店铺"
            className="modal-wrap"
            okButtonProps={{ disabled: !startDate || !endDate }}
            visible={visible}
            onOk={this.handleOk.bind(this)}
            confirmLoading={confirmLoading}
            onCancel={this.handleCancel.bind(this)}
            destroyOnClose={true}
          >
            <RangePicker
              disabledDate={this.disabledDate}
              format="YYYY-MM-DD"
              placeholder={['开始时间', '结束时间']}
              onChange={this.onChangeExport.bind(this)}
              onOk={this.onOkExport.bind(this)}
            />
          </Modal>
        </LocaleProvider>
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
      </div>
    );
  }
}

export default StoreData