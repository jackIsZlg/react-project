import classNames from 'classnames'
import base from '../../../common/baseModule'
import SetFolderPop from '../../../components/SetFolderPop/SetFolderPop'

import {Folderlist} from '../../../components/FolderItem/Folder'
import Pagination from '../../../components/Pagination/Pagination'
import {Loading} from '../../../components/WaterFall/WaterFallBase'

base.headerChange('white')
base.channel(9)

class FolderIndex extends React.Component {
  constructor() {
    super()
    this.state = {
      tagsList: [], // 标签数据集
      requestUrl: '/folder/public/recom/list', // 请求地址
      headIndex: 'recm', // 当前选中的内容
      tagIndex: '全部', // 当前选中的标签

      resultList: [], // folder数组
      pagination: {
        current: 0,
        totalPage: 0
      }, // 分页器分页
      paging: {
        start: 0,
        pageSize: 20
      }, // 接口分页
      selCon: {}, // 查询条件对象

      status: 0 // 精选集状态
    }
  }

  componentWillMount() {
    this.getTagsData()
    this.getFolderData()
  }
  // 原来的方法
  openCreateFolder() {
    let c = (
      <SetFolderPop
        mode="new"
        callBack={this.newSuccess.bind(this)}
      />
    )
    ReactDOM.render(c, document.getElementById('set-folder-pop-wrapper'))
  }

  // 获取标签数据
  getTagsData() {
    base.ajaxList.basic({
      type: 'GET',
      url: `${base.baseUrl}/folder/public/get-tags`,
      data: {}
    }, (data) => {
      this.setState({
        tagsList: [...data.result]
      })
    })
  }
  // 返回精选集头部
  renderHead() {
    const { tagsList, tagIndex } = this.state
    // const result = []
    // for (let i = 0; i < tagsList.length; i++) {
    //   let obj = (
    //     <li
    //       key={tagsList[i]}
    //       className={
    //         classNames('tag-con', {
    //           active: false
    //         })}
    //       onClick={() => {}}
    //     >
    //       {tagsList[i]}
    //     </li>
    //   )
    //   result.push(obj)
    // }
    // return result

    let i = 0
    return tagsList.map((item) => {
      if (i > 15) {
        return null
      }
      i += 1
      return (
        <li
          key={item}
          className={
            classNames('tag-con', {
              'active': tagIndex === item && true
            })}
          onClick={() => { this.handleWhenClickTags(item) }}
        >
          {item}
        </li>
      )
    })
  }
  // 点击头部
  handleWhenClickHead(type) {
    let requestUrlNew = ''
    const selObj = {}
    if (type === 'recm') { // 为你推荐
      requestUrlNew = '/folder/public/recom/list'
      // selObj.needOrder = 3 // 根据推荐倒序
    } else if (type === 'rank') { // 最受欢迎
      requestUrlNew = '/folder/public/rank/list'
    } else if (type === 'recn') { // 最近更新
      requestUrlNew = '/folder/public/recom/list'
      selObj.needOrder = 1 // 根据更新时间倒序
    }
    this.setState({
      requestUrl: requestUrlNew,
      headIndex: type,
      tagIndex: '全部',
      selCon: selObj,
      paging: {
        start: 0,
        pageSize: 20
      },
      pagination: {
        current: 0,
        totalPage: 0
      }
    }, () => {
      this.getFolderData()
    })
  }
  // 点击标签
  handleWhenClickTags(item) {
    this.setState({
      tagIndex: item,
      paging: {
        start: 0,
        pageSize: 20
      },
      pagination: {
        current: 0,
        totalPage: 0
      }
    }, () => {
      this.getFolderData()
    })
  }


  // 获取推荐精选集数据
  getFolderData() {
    let self = this
    self.setState({
      status: 0
    })
    let {requestUrl, paging, pagination, status, tagIndex, selCon} = this.state

    const params = {
      ...paging,
      ...selCon,
    }
    if (tagIndex !== '全部') {
      params.tag = tagIndex
    }

    base.ajaxList.basic({
      type: 'GET',
      url: base.baseUrl + requestUrl,
      data: params
    }, (data) => {
      let {resultList, resultCount} = data.result

      resultList = self.dealFolderList(resultList)
      pagination.totalPage = Math.ceil(resultCount / paging.pageSize)
      status = 1
      self.setState({
        resultList,
        pagination,
        status
      })
    })
  }

  // 处理精选集数据
  dealFolderList(folderList) {
    let newFolderList = []
    folderList.forEach((item) => {
      let newFolderListItem = {}
      newFolderListItem.cover = base.ossImg(item.mediaUrls[0])
      for (let i = 0; i < 4; i++) {
        if (item.mediaUrls[i]) {
          let w = 0
          if (i === 0) {
            w = 288
          } else {
            w = 94
          }
          newFolderListItem[`cover_${i}`] = {
            backgroundImage: `url(${base.ossImg(item.mediaUrls[i], w)})`
          }
        } else {
          newFolderListItem[`cover_${i}`] = ''
        }
      }
      newFolderListItem.id = item.id
      newFolderListItem.num = item.folderCount
      newFolderListItem.folderName = item.name
      newFolderListItem.createrName = item.createrName
      newFolderListItem.colleced = item.colleced
      newFolderListItem.viewCount = item.viewCount
      newFolderListItem.url = `/folder/public/${item.id}`

      newFolderList.push(newFolderListItem)
    })
    return newFolderList
  }

  // 改变分页页数
  changePageNo(pageNo) {
    let self = this
    let {pagination, paging, status} = self.state
    pagination.current = pageNo
    paging.start = pageNo * paging.pageSize
    status = 0
    self.setState({pagination, paging, status}, () => {
      self.getFolderData()
    })
    base.eventCount.add(1051, {
      '用户ID': base.LS().id
    })
  }

  // 改变精选集收藏状态
  getCollected(id) {
    if (!base.LS().userId) {
      base.login(() => {
        base.loadFunctionColumn() 
      })
      base.eventCount.add('1064')
      return
    }
    let self = this
    let {resultList} = self.state
    let content = {
      source_page: 'album_index',
      source_type: 'hot_recommended',
      album_id: id
    }
    base.ajaxList.folderCollected(id, () => {
      let url = ''
      let name = ''
      resultList.map((item) => {
        if (item.id === id) {
          item.colleced = 1
          url = item.cover
          name = item.folderName || item.folderName
        }
        return item
      })
      self.setState({resultList}, () => {
        base.ajaxList.addPoint(2200002, content)
        df_alert({
          tipImg: url,
          mainText: '收藏成功',
          subText: name
        })
      })
    })
  }

  // 原来的方法
  newSuccess() {
    window.open(`${base.baseUrl}/users/favorite-view`)
  }

  // 取消收藏
  handleEditNotCollected(id) {
    let self = this
    let {resultList} = self.state
    base.ajaxList.folderCollectedCencel(id, () => {
      resultList.map((item) => {
        if (item.id === id) {
          item.colleced = 0
        }
        return item
      })
      self.setState({resultList})
    })
  }

  // 返回精选集内容
  renderContent() {
    let {resultList, pagination, status} = this.state
    let {current, totalPage} = pagination
    switch (status) {
      case 0:
        return <Loading/>
      case 1:
        if (!resultList.length) {
          return (
            <div style={{textAlign: 'center', padding: '40px', fontSize: '20px'}}>
              无数据
            </div>
          )
        }
        return (
          <div className='folder-gather container'>
            <div className='result-list'>
              {resultList && resultList.map(item => (
                <Folderlist
                  key={item.id}
                  {...item}
                  handleEdit={this.getCollected.bind(this)}
                  handleEditNotCollected={this.handleEditNotCollected.bind(this)}
                />
              ))}
            </div>
            <Pagination pageNo={current}
              totalPage={totalPage}
              reset={this.changePageNo.bind(this)}
            />
          </div>
        )
      default:
        break
    }

    return null
  }


  render() {
    const { requestUrl, headIndex, tagIndex } = this.state

    return (
      <div>
        <div id="second-level">
          {/* <TwoLevelNavigation_folder channel={7}/> */}
          <div className='folder-header-lab-lists'>
            <div className="container">
              {/* <div className='folder-add-btn' onClick={this.openCreateFolder.bind(this)}>新建精选集</div> */}
              <ul className="runway-nav-left">
                <li
                  className={classNames('runway-nav-left-item', {
                    active: headIndex === 'recm' && true
                  })}
                  onClick={() => { this.handleWhenClickHead('recm') }}
                >
                  为你推荐
                </li>
                <li
                  className={classNames('runway-nav-left-item', {
                    active: headIndex === 'rank' && true
                  })}
                  onClick={() => { this.handleWhenClickHead('rank') }}
                >
                  最受欢迎
                </li>
                <li
                  className={classNames('runway-nav-left-item', {
                    active: headIndex === 'recn' && true
                  })}
                  onClick={() => { this.handleWhenClickHead('recn') }}
                >
                  最近更新
                </li>
              </ul>
              <ul className="tags-list">
                <li className={classNames('tag-con', {
                  active: tagIndex === '全部' && true
                })}
                  onClick={() => this.handleWhenClickTags('全部')}
                >
                  全部
                </li>
                {this.renderHead()}
              </ul>
            </div>
          </div>
        </div>

        <div id="folder-content">
          {/* <FolderPage requestUrl={requestUrl}/> */}
          { this.renderContent() }
        </div>
      </div>
    )
  }
}

ReactDOM.render(<FolderIndex/>, document.querySelector('#content'))