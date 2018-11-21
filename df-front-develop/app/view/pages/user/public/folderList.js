import base from '../../../common/baseModule'
import {CenterHeader, CenterNav, CenterContent} from '../../../components/UserCenter/UserCenter'
import Pagination from '../../../components/Pagination/Pagination'
import {ToTop} from '../../../components/WaterFall/WaterFallBase'

// header初始化
base.channel(3)
base.headerChange('white')

let folderPage = 0, // 分页
  collectPage = 0,
  editIndex = -1, // 编辑项索引
  userId = base.getUrlStringId()
// userId = 38274;

base.eventCount.add(1052, {
  '用户ID': base.LS().id
})

function userType(item) {
  if (item.shared === 3) {
    return `/folder/work/${item.id}`
  }

  if (item.shared === 4) {
    return `/folder/public/${item.id}`
  }

  return `/users/favorite-content/${item.id}`
}

function preDealData(data) {
  let temp = []
  data.forEach((item) => {
    if (item.name === '默认精选集' && !item.folderCount) {
      return
    }

    let _data = {
      'id': item.id,
      'url': userType(item),
      'name': item.name,
      'shared': item.shared,
      'num': item.folderCount || 0,
      'isPrivate': item.isPrivate || 0,
      'mediaUrls': item.mediaUrls
    }
    let count = 0

    while (count < 3) {
      let url = item.mediaUrls[count] || ''
      _data[`cover_${count}`] = {
        'backgroundImage': url && `url(${base.ossImg(url, 190)})`
      }
      count++
    }
    temp.push(_data)
  })
  return temp
}

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      folderData: [],
      collectedData: [],
      selfInfo: {},
      getDataFinish: false,
      selected: 1,
      displayData: [],
      current: 1,
      totalPage: 0,
      count: {}
    }
    this.folderData = []
  }

  // 第一次渲染前调用
  componentWillMount() {
    this.getFolderList()
    this.getFolderCollectList()
    this.getSelfInfo()
    base.renderToTopButton(false)
  }

  // 获取精选集列表
  getFolderList() {
    let self = this
    base.ajaxList.basic({
      type: 'GET',
      url: `${base.baseUrl}/folder/public/list`,
      data: {
        creator: userId,
        start: 30 * (folderPage++),
        pageSize: 30
      }
    }, (data) => {
      let {folderData, count} = self.state
      let newFolderData = preDealData(data.result.resultList)

      if (data.result.resultList.length === 0) {
        self.setState({
          folderData,
          getDataFinish: true
        })
        return
      }

      count.create = data.result.resultCount

      folderData = [...folderData, ...newFolderData]
      self.setState({
        count,
        folderData,
        displayData: folderData
      })

      self.getFolderList()
    })
  }

  // 获取收藏的精选集列表
  getFolderCollectList() {
    let self = this
    base.ajaxList.basic({
      type: 'GET',
      url: `${base.baseUrl}/folder/collect/list`,
      data: {
        collector: userId,
        start: 30 * (collectPage++),
        pageSize: 30
      }
    }, (data) => {
      if (data.result.resultList.length === 0) {
        return
      }

      let {collectedData, count} = self.state
      let newFolderData = preDealData(data.result.resultList)

      count.collect = data.result.resultCount

      self.setState({
        count,
        collectedData: [...collectedData, ...newFolderData]
      })

      self.getFolderCollectList()
    })
  }

  // 获取共享精选集用户信息
  getSelfInfo() {
    let self = this
    base.ajaxList.basic({
      type: 'GET',
      url: `${base.baseUrl}/users/info/${userId}`
    }, (data) => {
      data.success && self.setState({
        selfInfo: data.result
      })
    })
  }

  changeSelected(select = 1) {
    let self = this, 
      {displayData, folderData, cooperationData, collectedData} = self.state
    console.log(select, collectedData, cooperationData, folderData)
    switch (select) {
      case 2:
        displayData = collectedData
        break
      case 3:
        displayData = cooperationData
        break
      case 1:
      default:
        displayData = folderData
        break
    }
    self.setState({
      displayData,
      selected: select
    })
  }

  changePageNo(index) {
    console.log(index)
  }

  render() {
    let {selfInfo, getDataFinish, collectedData, selected, displayData, count} = this.state
    let pointContent = {
      source_page: 'other_user_albums'
    }
    return (
      <div>
        <CenterHeader {...selfInfo}
          openType={true}
        />
        <div className="folder-content" style={{background: '#e5e5e5', paddingTop: '12px'}}>
          <CenterNav waterFallNull={true} {...selfInfo} openType={true} channel={1} uid={userId}/>
          <CenterContent selected={selected}
            folderData={displayData}
            count={count}
            collectedData={collectedData}
            getDataFinish={getDataFinish}
            openType='true'
            changeSelected={this.changeSelected.bind(this)}
            pointContent={pointContent}
          />
        </div>
      </div>
    )
  }
}

ReactDOM.render(<App/>, document.getElementById('folder-content'))