import base from '../../../common/baseModule'
import { CenterHeader, CenterNav, CenterContent, preDealData } from '../../../components/UserCenter/UserCenter'

// header初始化
base.channel(3)
base.headerChange('white')

let folderPage = 0 // 分页
let cooperationPage = 0
let collectPage = 0

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      folderData: [],
      cooperationData: [],
      collectedData: [],
      displayData: [],
      selected: 1,
      count: {},
      userInfo: {}
    }
  }

  // 第一次渲染前调用
  componentWillMount() {
    this.changeDifferences()
    this.getFolderCreateList()
    this.getFolderCooperationList()
    this.getFolderCollectList()
    base.renderToTopButton(false)
  }

  // 获取创建的精选集列表
  getFolderCreateList() {
    let self = this
    base.ajaxList.basic({
      type: 'GET',
      url: `${base.baseUrl}/favorite/list/create`,
      data: {
        start: 30 * (folderPage++),
        pageSize: 30
      }
    }, (data) => {
      if (data.result.resultList.length === 0) {
        return
      }
      let { folderData, count } = self.state
      let newFolderData = preDealData(data.result.resultList)

      count.create = data.result.resultCount
      self.setState({
        count,
        folderData: [...folderData, ...newFolderData],
        displayData: [...folderData, ...newFolderData]
      })

      self.getFolderCreateList()
    })
  }

  // 获取协作的精选集列表
  getFolderCooperationList() {
    let self = this
    base.ajaxList.basic({
      type: 'GET',
      url: `${base.baseUrl}/favorite/list/join`,
      data: {
        start: 30 * (cooperationPage++),
        pageSize: 30
      }
    }, (data) => {
      if (data.result.resultList.length === 0) {
        return
      }
      let { cooperationData, count } = self.state
      let newFolderData = preDealData(data.result.resultList)
      count.join = data.result.resultCount
      self.setState({
        count,
        cooperationData: [...cooperationData, ...newFolderData]
      })

      self.getFolderCooperationList()
    })
  }

  // 获取收藏的精选集列表
  getFolderCollectList() {
    let { collectedData, count } = this.state
    base.ajaxList.basic({
      type: 'GET',
      url: `${base.baseUrl}/favorite/list/collect`,
      data: {
        start: 30 * (collectPage++),
        pageSize: 30
      }
    }, (data) => {
      if (data.result.resultList.length === 0) {
        return
      }

      let newFolderData = preDealData(data.result.resultList)
      count.collect = data.result.resultCount

      this.setState({
        count,
        collectedData: [...collectedData, ...newFolderData]
      })

      this.getFolderCollectList()
    })
  }

  changeDifferences() {
    // 获取用户信息
    base.changeDifferences((userInfo) => {
      this.setState({userInfo})
    })
  }

  // 编辑精选集成功
  editFolderSuccess(info, index) {
    let { folderData } = this.state
    let folderItem = folderData[index]

    folderItem.name = info.name
    folderItem.isPrivate = info.isPrivate

    let tipImg = folderItem.mediaUrls[0]
    tipImg = tipImg && base.ossImg(tipImg, 54)

    df_alert({
      tipImg,
      mainText: '成功编辑精选集',
      subText: info.name
    })
    this.setState({
      folderData
    })
  }

  // 新增精选集成功
  newFolderSuccess(info) {
    let { folderData, userInfo, count } = this.state
    let newFolderData = preDealData([{
      id: info.id,
      name: info.name,
      shared: 1,
      mediaUrls: [],
      isPrivate: info.isPrivate
    }])

    if (folderData.length === 0) {
      // 空精选集列表
      folderData = newFolderData
    } else if (folderData[0].name === '默认精选集') {
      // 含有'默认精选集'
      folderData.splice(1, 0, newFolderData[0])
    } else {
      // 不含'默认精选集'
      folderData.splice(0, 0, newFolderData[0])
    }
    df_alert({
      mainText: '成功创建精选集',
      subText: info.name
    })
    count.create++
    userInfo.folderCount++
    console.log(userInfo)
    this.setState({
      count,
      userInfo,
      displayData: folderData
    })
  }

  // 删除精选集成功
  delFolderSuccess(index) {
    let { folderData, userInfo, count } = this.state
    let name = folderData[index].name
    folderData.splice(index, 1)
    df_alert({
      mainText: '成功删除精选集',
      subText: name
    })
    count.create--
    userInfo.folderCount--
    this.setState({
      count,
      userInfo,
      displayData: folderData
    })
  }

  changeSelected(select = 1) {
    let self = this
    let { displayData, folderData, cooperationData, collectedData } = self.state
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

  render() {
    const {displayData, selected, cooperationData, count, userInfo} = this.state
    return (
      <div>
        <CenterHeader {...userInfo} />
        <div className="folder-content" style={{ background: '#e5e5e5', paddingTop: '12px' }}>
          <CenterNav waterFallNull={true} {...userInfo} channel={1} />
          <CenterContent selected={selected}
            folderData={displayData}
            count={count}
            cooperationData={cooperationData && !!cooperationData.length}
            // collectedData={collectedData}
            changeSelected={this.changeSelected.bind(this)}
            newSuccess={this.newFolderSuccess.bind(this)}
            delSuccess={this.delFolderSuccess.bind(this)}
            editSuccess={this.editFolderSuccess.bind(this)}
          />
        </div>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('folder-content'))