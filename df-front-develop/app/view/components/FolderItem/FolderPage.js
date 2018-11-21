import base from '../../common/baseModule'

import {FolderRecommended} from './Folder'
import Pagination from '../Pagination/Pagination'
import {Loading} from '../WaterFall/WaterFallBase'

class FolderPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      requestUrl: props.requestUrl,
      resultList: [], // folder数组
      pagination: {
        current: 0,
        totalPage: 0
      }, // 分页器分页
      paging: {
        start: 0,
        pageSize: 20
      }, // 接口分页
      status: 0 // 精选集状态
    }
  }

  componentWillMount() {
    this.getFolderData()
  }

  // 获取推荐精选集数据
  getFolderData() {
    let self = this,
      {requestUrl, paging, pagination, status} = self.state
    base.ajaxList.basic({
      type: 'GET',
      url: base.baseUrl + requestUrl,
      data: paging
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
      for (let i = 0; i < 3; i++) {
        let w = 0
        if (i === 0) {
          w = 280
        } else {
          w = 192
        }
        newFolderListItem[`cover_${i}`] = {
          backgroundImage: `url(${base.ossImg(item.mediaUrls[i], w)})`
        }
      }
      newFolderListItem.id = item.id
      newFolderListItem.num = item.folderCount
      newFolderListItem.folderName = item.name
      newFolderListItem.colleced = item.colleced
      newFolderListItem.url = `/folder/public/${item.id}`

      newFolderList.push(newFolderListItem)
    })
    return newFolderList
  }

  // 改变分页页数
  changePageNo(pageNo) {
    let self = this,
      {pagination, paging, status} = self.state
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
    base.ajaxList.folderCollected(id, () => {
      let url = ''
      let name = ''
      resultList.map((item) => {
        if (item.id === id) {
          item.colleced = 1
          url = item.cover
          name = item.folderName || item.createrName
        }
        return item
      })
      self.setState({resultList}, () => {
        df_alert({
          tipImg: url,
          mainText: '收藏成功',
          subText: name
        })
      })
    })
  }

  handleEditNotCollected(id) {
    let self = this, 
      {resultList} = self.state
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

  render() {
    let {resultList, pagination, status} = this.state,
      {current, totalPage} = pagination

    switch (status) {
      case 0:
        return <Loading/>
      case 1:
        if (!resultList.length) {
          return (
            <div>

            </div>
          )
        }

        return (<div className='folder-gather container'>
          <div className='result-list'>
            {resultList && resultList.map(item => (<FolderRecommended key={item.id}
              {...item}
              handleEdit={this.getCollected.bind(this)}
              handleEditNotCollected={this.handleEditNotCollected.bind(this)}
            />))}
          </div>
          <Pagination pageNo={current}
            totalPage={totalPage}
            reset={this.changePageNo.bind(this)}
          />
                </div>)
      default:
        break
    }
  }
}

export default FolderPage