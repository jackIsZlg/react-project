import React, { Component } from 'react';
import {
  Pagination,
  Rate,
  message,
} from 'antd'
import '../../style/dataline/reacommend.less';
import request from '../../base/request'
import link from '../../base/link'
import Filters from '../../component/filters/index'
import base from '../../base/baseMoudle'
import m from '../../base/message'
class recommendData extends Component {
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
      m.pub('compare')
    })
  }

  changeCollect(type, index, itemId) {
    request.changeItemCollect(type, itemId).then(res => {
      if (res) {
        const data = this.state.data
        data[index].collectFlag =  !data[index].collectFlag
        this.setState({data})
      }
      else {
        message.warning(res.msg);
      }
    })
  }
  // 获取爆款信息
  async getRecomemndList() {
    this.setState({ loading: true })
    const result = await request.getRecommends(base.objToSearch(this.state.params))
    const data = result.resultList
    this.setState({ data, loading: false, totalCount: result.resultCount })
  }
  search(params) {
    this.setState({params},()=>this.getRecomemndList())
  }
  onChangepage(pageNo) {
    const params = this.state.params
    params.pageNo = pageNo
    this.setState({params},()=> this.search(params))
  }
  renderMsg = () => {
    return (
      <div>
        <div>爆款度说明：</div>
        <div>1.爆款度用星级来表示，星级越高，爆款度越高</div>
        <div>2.爆款度不是单纯的销量排行，而是根据该商品当天的销售表现，结合类目、店铺、价格等维度进行综合判定</div>
      </div>
    )
  }
  render() {
    const { params } = this.state
    const eventContent = JSON.parse(JSON.stringify(params))
    return (
      <div className='content'>
        <Filters title="爆款排行" type={3} search={this.search.bind(this)} />
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
                      <div onClick={this.changeCollect.bind(this, item.collectFlag, index, item.itemId)}  className="marke-collect">{item.collectFlag ? '取消收藏' : '收藏'}</div>
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
                        <a target="view_window" onClick={link.toGoodDetail.bind(null, item.itemId)}>{item.itemName || '暂无'}</a>
                      </div>
                      <div  className='item-price'>
                        <span>¥{item.price / 100}</span>
                        <span>{item.saleTime}上架</span>
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
            total={this.state.totalCount} /> : null
        }
      </div>
    );
  }
}

export default recommendData