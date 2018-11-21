import React, { Component } from 'react';
import { Pagination, Rate, message } from 'antd'
import '../../style/dataline/reacommend.less';
import request from '../../base/request'
import link from '../../base/link'
import Filters from '../../component/filters'
import base from '../../base/baseMoudle'

class CollectionData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imgWidth: 300,
      category: [],
      current: '',
      data: [],//表格数据源存放的地方
      totalCount: 0,//数据总数，后台返回数据有多少条
      loading: true,
      params:{},
      nullImg: 'https://zhiyi-web.oss-cn-hangzhou.aliyuncs.com/static-web/e5e5e5.jpg'
    }
  }

  componentDidMount() {
    document.title = "爆款推荐";
    document.getElementById('title').innerText = '爆款推荐'
  }
  changeDiff(type, index, itemId) {
    request.changeItemDiff(type, itemId).then(res => {
      if ((!type && res.result) || (type && res)) {
        const data = this.state.data
        data[index].contrastFlag =  !data[index].contrastFlag
        this.setState({data})
      }
      else {
        message.warning(res.msg);
      }
    })
  }

  changeCollect(type, index, itemId) {
    request.changeItemCollect(type, itemId).then(res => {
      if (res) {
        this.getCollectList()
      }
      else {
        message.warning(res.msg);
      }
    })
  }
  // 获取爆款信息
  async getCollectList() {
    this.setState({ loading: true })
    const result = await request.getCollectItemList(base.objToSearch(this.state.params))
    const data = result.resultList
    this.setState({ data, loading: false, totalCount: result.resultCount })
  }
  search(params) {
    this.setState({params},()=>this.getCollectList())
  }
  onChangepage(pageNo) {
    const params = this.state.params
    params.pageNo = pageNo
    this.setState({params},()=> this.search(params))
  }
  render() {
    const { params } = this.state
    const eventContent = JSON.parse(JSON.stringify(params))
    return (
      <div className='content'>
        <Filters title="我的收藏" type={5} search={this.search.bind(this)} />
        {
          this.state.loading
            ? <div className="loading-wrapper">
              <div className="loader">
                <div className="inner one" />
                <div className="inner two" />
                <div className="inner three" />
              </div>
            </div>
            : null
        }
        <div ref={node => this.contentNode = node} className="imgs-wrap">
          {
            !this.state.loading && this.state.data.length ?
              this.state.data.map((item, index) => {
                eventContent.item_id = item.itemId
                return (
                  <div className="img-single" key={index} style={{ width: '300px' }}>
                    <div style={{position:'relative'}}>
                      <div onClick={this.changeDiff.bind(this, item.contrastFlag, index, item.itemId)} className="marke-diff">{item.contrastFlag ? '取消对比' : '对比'}</div>
                      <div onClick={this.changeCollect.bind(this, true, index, item.itemId)}  className="marke-collect">取消收藏</div>
                      <div
                        data-code="2100001"
                        data-content={JSON.stringify(eventContent)}
                        onClick={link.toGoodDetail.bind(null, item.itemId)}
                        className="img-single-item" style={{ background: `url(${item.picUrl || this.state.nullImg}) top/contain no-repeat`, height: '300px', width: '300px' }}>
                      </div>
                    </div>
                    <div data-code="2100001" data-content={JSON.stringify(eventContent)}  onClick={link.toGoodDetail.bind(null, item.itemId)} >
                      <div className='item-info'>
                        <span>爆款值:<Rate disabled defaultValue={item.hotLevel} /></span>
                        <span>30天销量:{item.salesVolume30 ? parseInt(item.salesVolume30, 10) : 0}</span>
                      </div>
                      <div className='item-name'>
                        <a target="view_window" onClick={link.toGoodDetail.bind(null, item.itemId)}>{item.title || '暂无'}</a>
                      </div>
                      <div  className='item-price'>
                        <span>¥{item.price / 100}</span>
                        <span>{item.saleDay}上架</span>
                      </div>
                    </div>
                  </div>
                )
              })
              :
              this.state.loading
                ? null
                : this.state.params.shopFilterStatus === 2
                  ? <div>您还没有监控店铺或暂无店铺数据</div>
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
            total={this.state.totalCount} /> : null}
      </div>
    );
  }
}

export default CollectionData