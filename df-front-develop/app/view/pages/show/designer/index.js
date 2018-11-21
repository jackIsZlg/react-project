import className from 'classnames'
import base from '../../../common/baseModule'
import WaterFall from '../../../components/WaterFall/WaterFall'
import {Icon} from '../../../components/base/baseComponents'
import {FolderOperate} from '../../../components/FolderOperate/FolderOperate'
import MoveCopyPop from '../../../components/MoveCopyPop/MoveCopyPop'
import DownloadPop from '../../../components/DownloadPop/DownloadPop'

const runwayNavTag = ['最近更新', '浏览最多']

base.channel(4)
base.headerChange('white')

base.eventCount.add('4034', {
  '秀场ID': base.queryString('showId')
})


class RunwayDetail extends React.Component {
  constructor() {
    super()
    this.state = {
      wfSelect: 0,
      newRunwayInfo: [],
      questParams: {
        showId: base.queryString('showId'),
        orderType: 0
      },
      hisIdList: '',
      hotRunwayList: [],
      hotRunwayCount: 0,
      isEdit: false,
      imgList: [],
      selectNum: 0,
      clickAllClick: false,
      selectList: [],
      unSelectList: []
    }
  }

  componentDidMount() {
    this.getRunwayInfo()
    this.getHotRunway()
  }

  getRunwayInfo() {
    let self = this
    base.ajaxList.basic({
      type: 'GET',
      url: `${base.baseUrl}/show/detail?showId=${base.queryString('showId')}`
    }, (data) => {
      self.setState({
        newRunwayInfo: self.dealRunwayData(data.result)
      })
    })
  }

  getHotRunway() {
    let self = this
    let {hisIdList, hotRunwayList, hotRunwayCount} = self.state

    if (hotRunwayCount * 1 === 4) {
      hisIdList = ''
    }

    hotRunwayCount++
    base.ajaxList.basic({
      type: 'GET',
      url: `${base.baseUrl}/show/hot-list?hisIdList=${hisIdList}&hotSize=6`,
    }, (d) => {
      console.log(d.result)
      hotRunwayList = d.result.resultList
      self.setState({
        hotRunwayCount,
        hisIdList,
        hotRunwayList
      })
    })
  }

  getDataSuccess(state) {
    let {wfSelect, selectList, clickAllClick} = this.state
    this.setState({
      imgList: state.waterFallData,
      selectList: !!wfSelect && clickAllClick ? state.waterFallData : selectList
    })
  }

  changeRunwayType(type) {
    let {questParams} = this.state
    questParams.orderType = type
    this.setState({
      questParams
    }, () => {
      this.endEdit()
    })
    !type ? base.eventCount.add('4037') : base.eventCount.add('4038')
  }

  openDownLoad() {
    const {selectList, selectNum, clickAllClick, newRunwayInfo} = this.state

    let {idlist, unIdlist} = this.idArray('id')
    let result = []
    let content = {
      source_page: 'runway_detail',
      show_id: newRunwayInfo.id
    }

    if (idlist.length === 0) {
      return
    }
    // 组装下载链接
    for (let i = 0, len = selectList.length; i < len; i += 100) {
      result.push({
        params: {
          unSelectedIdList: clickAllClick ? unIdlist.slice(i, unIdlist.length).join(',') : '',
          fileName: newRunwayInfo.seasonTitle,
          showId: (selectNum === newRunwayInfo.postCount || clickAllClick) ? newRunwayInfo.id : '',
          idList: (selectNum === newRunwayInfo.postCount || clickAllClick) ? '' : idlist.slice(i, i + 100).join(',')
        },
        num: (len - i) > 100 ? 100 : len - i,
        status: false
      })
    }
    console.log('params', selectNum === newRunwayInfo.postCount || clickAllClick)
    // console.log('result', result);
    ReactDOM.render(<DownloadPop folderName={newRunwayInfo.seasonTitle}
      endEdit={this.endEdit.bind(this)}
      data={result}
      requestInterface={selectNum === newRunwayInfo.postCount || clickAllClick}
      pointContent={content}
    />, document.getElementById('download-pop-wrapper'))
    base.eventCount.add('4041')
  }

  // 开始编辑
  startEdit() {
    this.setState({
      wfSelect: 1,
      isEdit: true
    })
    base.eventCount.add('4039')
  }

  endEdit() {
    this.setState({
      wfSelect: 0,
      isEdit: false,
      selectNum: 0,
      selectList: [],
      clickAllClick: false,
    })
  }

  // 单选
  handleSelect(action, id) {
    let self = this
    let {selectNum, unSelectList, imgList, selectList} = this.state
    selectList = []
    unSelectList = []
    imgList.map((item) => {
      if (item.id * 1 === id * 1) {
        item.select = action === 'add'
      }
      item.select ? selectList.push(item) : unSelectList.push(item)
      return item
    })
    selectNum = action === 'add' ? ++selectNum : --selectNum
    self.setState({
      selectList,
      selectNum,
      unSelectList
    })
  }

  dealRunwayData(data) {
    data.runwayTime = data.runwayTime.split(' ')[0]
    return data
  }

  idArray(id) {
    let {imgList} = this.state
    let idlist = []
    let unIdlist = []
    imgList.forEach((item) => {
      item.select ? idlist.push(item[id]) : unIdlist.push(item[id])
    })
    return {
      idlist,
      unIdlist,
    }
  }

  // 打开批量移动、辅助弹窗
  openMoveCopyPop(type) {
    let {selectList, selectNum, clickAllClick, newRunwayInfo} = this.state
    let content = {
      source_page: 'runway_detail',
      show_id: newRunwayInfo.id
    }
    ReactDOM.render(<MoveCopyPop title={type}
      num={selectNum}
      clickAllSelect={clickAllClick}
      idList={this.idArray('id')[`${clickAllClick ? 'unIdlist' : 'idlist'}`]}
      showId={base.queryString('showId')}
      mediaUrl={selectList[0].mediaUrl}
      postType={clickAllClick ? 3 : 1}
      hidden={false}
      finishFun={this.endEdit.bind(this)}
      pointContent={content}
    />, document.getElementById('move-copy-pop-wrapper'))
    base.eventCount.add('4040')
  }

  openRunwayPage(bloggerId, showId) {
    base.eventCount.add('4035', {
      '品牌ID': bloggerId
    })
    this.enterRunway(showId)
    window.open(`/show/designer/${bloggerId}?showId=${showId}`)
  }

  // 点击全选按钮
  selectedAll() {
    let {imgList, newRunwayInfo} = this.state
    let action = this.selectedBtn.getAttribute('data-action')
    let selectFlag = action === 'all'

    imgList.forEach(item => item.select = selectFlag)

    // console.log('imgList', imgList);
    this.setState({
      selectList: selectFlag ? imgList : [],
      unSelectList: [],
      clickAllClick: selectFlag,
      selectNum: selectFlag ? newRunwayInfo.postCount : 0
    })
  }

  openNewShowPage(bloggerId) {
    base.eventCount.add('4036', {
      '品牌ID': bloggerId,
      '秀场ID': base.queryString('showId')
    })
    window.open(`/show/brand/${bloggerId}?showId=${base.queryString('showId')}`, '_target')
  }

  downloadAtlas(seasonTitle) {
    let link = `${base.baseUrl}/show/download?fileName=${seasonTitle}&showId=${base.queryString('showId')}`
    window.open(link)
  }

  enterRunway(id) {
    let content = {
      source_page: 'runway_detail',
      source_type: 'recommended',
      show_id: id
    }
    base.ajaxList.addPoint(2310001, content)
  }

  render() {
    let {questParams, wfSelect, newRunwayInfo, hotRunwayList, isEdit, selectNum, clickAllClick} = this.state
    let {bloggerId, designerName, city, otherShows, postCount, seasonTitle, runwayTime, viewCount} = newRunwayInfo
    let _dataUrl = `/show/img/list-data?${base.objToSearch(questParams)}`
    let pointContent = {
      source_page: 'runway_detail',
      source_type: 'search_result',
      pic_type: 2,
      tag: runwayNavTag[questParams.orderType]
    }
    return (
      <div>
        <div className="runway-header">
          <div className="container">
            <div className="runway-header-info">
              <div className="runway-left">
                <div className="runway-title">{seasonTitle}</div>
                <ul className="runway-detail">
                  <li className="runway-detail-item">
                   品牌：<span onClick={this.openNewShowPage.bind(this, bloggerId)}>{designerName}</span>
                  </li>
                  <li className="runway-detail-item">
                   地区：{city}
                  </li>
                  <li className="runway-detail-item">
                   时间：{runwayTime}
                  </li>
                </ul>
              </div>
              <div className="runway-right">
                <ul className="runway-count">
                  <li className="runway-count-item">
                    浏览数 <span>{base.numberFormat(viewCount)}</span>
                  </li>
                  <li className="runway-count-item">
                    图片数 <span>{base.numberFormat(postCount)}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="runway-content">
          <div className="container">
            <div className="runway-nav">
              <ul className="runway-nav-left">
                {
                  runwayNavTag.map((item, index) => {
                    return (
                      <li className={className('runway-nav-left-item', {
                        'active': questParams.orderType === index
                      })} 
                        onClick={this.changeRunwayType.bind(this, index)}
                      >
                        {item}
                      </li>
                    )
                  })
                }
                {/* <li className={className('runway-nav-left-item', {
                  'active': questParams.orderType === 0
                })} 
                  onClick={this.changeRunwayType.bind(this, 0)}
                >
                  最近更新
                </li>
                <li className={className('runway-nav-left-item', {
                  'active': questParams.orderType === 1
                })}
                  onClick={this.changeRunwayType.bind(this, 1)}
                >
                  浏览最多
                </li> */}
              </ul>
              <div className="runway-operation">
                <FolderOperate
                  runway={true}
                  isEdit={isEdit}
                  selectNum={selectNum}
                  openDownLoad={this.openDownLoad.bind(this)}
                  downloadAtlas={this.downloadAtlas.bind(this, seasonTitle)}
                  openMoveCopyPop={this.openMoveCopyPop.bind(this)}
                  changeEdit={this.startEdit.bind(this)}
                  endEdit={this.endEdit.bind(this)}
                />
              </div>
            </div>
            {
              !!wfSelect &&
              <div className="show-edit-num container">
                已经选择时尚<span id="edit-num">{base.numberFormat(selectNum)}</span>枚
                <span ref={el => this.selectedBtn = el}
                  id="select-all"
                  data-action={selectNum !== newRunwayInfo.postCount ? 'all' : 'notAll'}
                  onClick={this.selectedAll.bind(this)}
                >
                  {selectNum !== newRunwayInfo.postCount ? '全选' : '取消全选'}
                </span>
              </div>
            }
            <div className="runway-water-info">
              <div className="folder-item-content">
                <div id="water-fall-panel">
                  <WaterFall key="waterWall"
                    wfType={!!wfSelect ? 'runwaySelect' : 'runwayDetail'}
                    isCancelFolder={true}
                    getDataSuccess={this.getDataSuccess.bind(this)}
                    handleSelect={this.handleSelect.bind(this)}
                    clickAllSelect={selectNum === newRunwayInfo.postCount || clickAllClick}
                    dataUrl={_dataUrl}
                    pointContent={pointContent}
                    recommendContent={pointContent}
                  />
                </div>
              </div>
              <div className="folder-right">
                <div className="other-folder">
                  <div className='other-folder-content'>
                    <div className="folder-header"
                      onClick={this.openNewShowPage.bind(this, bloggerId)}
                      title={`${designerName}的最新秀场`}
                    >
                      <span>{designerName}的最新秀场</span>
                      <Icon type='next'/>
                    </div>
                    {
                      otherShows && otherShows.map((item, index) => {
                        let key = `show${index}`
                        return (
                          <a key={key}
                            className='other-folder-item'
                            href={`/show/designer/${item.bloggerId}?showId=${item.id}`}
                            onClick={this.enterRunway.bind(this, item.id)}
                          >
                            <div className="folder-name" title={item.seasonTitle}>{item.seasonTitle}</div>
                            <div className="folder-city" title={item.city}>{item.city}</div>
                            <div className="file-item-num">
                              {item.postCount}张
                            </div>
                          </a>
                        )
                      })
                    }
                  </div>
                  <div className="hot-folder">
                    <div className="hot-folder-header">
                     热门秀场
                      {/* <button onClick={this.getHotRunway.bind(this)}>换一批</button> */}
                    </div>
                    <div className="hot-folder-content">
                      <ul className="hot-runway-list">
                        {
                          hotRunwayList && hotRunwayList.map(item => (
                            <li key={`runway-${item.id}`} className="hot-runway-item" onClick={this.openRunwayPage.bind(this, item.bloggerId, item.id)}>
                              <img src={base.ossImg(item.mediaUrl, 120)} alt=""/>
                              <div className="hot-runway-name">
                                {item.season}
                              </div>
                            </li>
                          ))
                        }
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

ReactDOM.render(<RunwayDetail/>, document.querySelector('#runway-detail'))
