/**
 * Created by gewangjie on 2017/11/20
 */
import base from '../../common/baseModule'
import {CenterHeader, CenterNav, CenterContent, preDealData} from '../../components/UserCenter/UserCenter'

// header初始化
base.channel(3)
base.headerChange('white')

let folderPage = 0, // 分页
  editIndex = -1 // 编辑项索引

let userInfo = base.LS()

class App extends React.Component {
  constructor(props) {
    super(props)
        this.state = {
      folderData: [],
      selfInfo: {},
      creatorId: 0
    }
  }

  // 第一次渲染前调用
  componentWillMount() {
    this.getCreatorId()
    }

  getCreatorId() {
    let pathname = window.location.pathname,
      pathArr = pathname.split('/'),
      creatorId = pathArr[pathArr.length - 1],
      that = this

        that.setState({
      creatorId
    }, () => {
      that.getFolderList()
            that.getSelfInfo()
        })
  }

  // 获取精选集列表
  getFolderList() {
    let self = this,
      {creatorId} = self.state
        base.ajaxList.basic({
      type: 'GET',
      url: `${base.baseUrl  }/folder/public/list`,
      data: {
        creator: creatorId,
        start: 30 * (folderPage++),
        pageSize: 30
      }
    }, (data) => {
      if (data.result.resultList.length === 0) {
        return
            }

      let {folderData} = self.state,
        newFolderData = preDealData(data.result.resultList)

            self.setState({
        folderData: [...folderData, ...newFolderData]
      })

            self.getFolderList()
        })
    }

  // 获取好友信息
  getSelfInfo() {
    let self = this,
      {creatorId} = self.state
        base.ajaxList.basic({
      type: 'GET',
      url: `${base.baseUrl  }/users/info/${creatorId}`
    }, (data) => {
      data.success && self.setState({
        selfInfo: data.result
      })
    })
  }

  // 编辑精选集成功
  editFolderSuccess(info) {
    let {folderData} = this.state,
      folderItem = folderData[editIndex]

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
    let {folderData} = this.state,
      newFolderData = preDealData([{
        'id': info.id,
        'name': info.name,
        'shared': 1,
        'mediaUrls': [],
        'isPrivate': info.isPrivate
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

        this.setState({
      folderData
    })
    }

  // 删除精选集成功
  delFolderSuccess() {
    let {folderData} = this.state,
      name = folderData[editIndex].name
        folderData.splice(editIndex, 1)
        df_alert({
      mainText: '成功删除精选集',
      subText: name
    })
        this.setState({
      folderData
    })
  }

  render() {
    const {followCount} = userInfo
        let {folderData, selfInfo} = this.state
        return (
          <div>
              <CenterHeader avatar={selfInfo.avatar}
name={selfInfo.name}
intro={selfInfo.intro}
city={selfInfo.city}
                  profession={selfInfo.profession}
openType={true}
                />
              <CenterNav followCount={followCount} folderCount={folderData.length} channel={1}/>
              <CenterContent folderData={folderData}
                  newSuccess={this.newFolderSuccess.bind(this)}
                  delSuccess={this.delFolderSuccess.bind(this)}
                  editSuccess={this.editFolderSuccess.bind(this)}
                  openType={true}
                />
            </div>
    )
  }
}

ReactDOM.render(<App/>, document.getElementById('folder-content'))