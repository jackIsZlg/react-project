import base from '../../common/baseModule'
import {BtnFollow } from '../base/baseComponents'

class BrandFilter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showCount: 0,
      imgCount: 0,
      name: '',
      followId: Number(props.followId),
      queryType: 1,
      orderType: 0,
    }
    this.showId = base.queryString('showId')
    this.designerId = base.getUrlStringId()
  }

  componentWillMount() {
    this.getBrandShow()
  }

  // 获取品牌秀场信息
  getBrandShow() {
    base.ajaxList.basic({
      type: 'get',
      url: `${base.baseUrl}/show/designer-data?designerId=${Number(this.designerId)}`
    }, (data) => {
      if (data.success) {
        const {showCount, imgCount} = data.result
        this.setState({showCount, imgCount})
      }
    })
  }
    
  // 获取该品牌所有秀场图片
  getBrandShowImgs() {
    base.ajaxList.basic({
      type: 'get',
      url: `${base.baseUrl}/show/img/list-data?bloggerId=${Number(this.designerId)}`
    }, (data) => {
      console.log(data)
    })
  }
 
  getData() {
    const { queryType, orderType } = this.state
    this.props.filterChange({queryType, orderType, bloggerId: this.designerId})
  }

  handleFollow() {
    const {followId} = this.state
    if (followId === 0) {
      base.ajaxList.followOwner(this.designerId, (d) => {
        base.eventCount.add(4024, {
          '品牌ID': base.getUrlStringId()
        })
        this.setState({followId: d.result})
        df_alert({
          mainText: '成功订阅品牌',
          subText: $('.brand-name').text()
        })
      })
      return
    }
    base.ajaxList.unFollowOwner(followId, () => {
      this.setState({ followId: 0 })
      base.eventCount.add(4025, {
        '品牌ID': base.getUrlStringId()
      })
    })
  }

  // 改变筛选条件
  changeFilter(queryType) {
    if (queryType) {
      base.eventCount.add(4022, {
        '品牌ID': base.getUrlStringId()
      })
    } else {
      base.eventCount.add(4023, {
        '品牌ID': base.getUrlStringId()
      })
    }
    $('.arrow-up').css({left: queryType ? '15px' : '116px'})
    this.setState({ queryType }, () => this.getData())
  }
  orderSort(orderType) {
    let eventCode = ''
    switch (orderType) {
      case 0:
        eventCode = this.state.queryType === 1 ? '4026' : '4030'; break
      default:
        eventCode = this.state.queryType === 1 ? '4027' : '4031'; break
    }
    base.eventCount.add(eventCode)
    this.setState({orderType}, () => this.getData())
  }
  renderHeader() {
    return (
      <div className='brand-header container'>
        <div className='brand-name'>{this.state.name}</div>
        <BtnFollow followId={this.state.followId} handleFan={() => this.handleFollow()} />
      </div>
    )
  }
  render() {
    let { showCount, imgCount, queryType, orderType} = this.state
    return (
      <div className='show-brand-wrap'>
        {this.renderHeader()}
        <div className='height-line'></div>
        <div className='brand-filter container'>
          <div className={queryType ? 'filter-item-selected' : 'filter-item'} onClick={this.changeFilter.bind(this, 1)} >秀场 {showCount}
            <div className='arrow-up'></div>
          </div>
          <div
            className={!queryType ? 'filter-item-selected' : 'filter-item'}
            onClick={this.changeFilter.bind(this, '')}
          >秀场图 {imgCount}
          </div>
        </div>
        <div className="order-sort container">
          <div className='line'></div>
          <div className="order-sort-wrapper">
            <div
              className={!orderType ? 'filter-item-selected' : 'filter-item'}
              onClick={this.orderSort.bind(this, 0)}
            >最新上线
            </div>
            <div
              className={orderType === 1 ? 'filter-item-selected' : 'filter-item'}
              onClick={this.orderSort.bind(this, 1)}
            >浏览最多
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default BrandFilter