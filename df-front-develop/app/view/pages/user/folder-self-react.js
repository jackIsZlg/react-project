/**
 * Created by gewangjie on 2017/12/18
 */

import base from '../../common/baseModule'
import WaterFall from '../../components/WaterFall/WaterFall'
import DownloadPop from '../../components/DownloadPop/DownloadPop'
import MoveCopyPop from '../../components/MoveCopyPop/MoveCopyPop'
import SetFolderPop from '../../components/SetFolderPop/SetFolderPop'
import ShareFolder from '../../components/ShareFolder/ShareFolder' // 共享精选集
import FolderHeader from '../../components/FolderHeader/FolderHeader'
import {FolderOperate} from '../../components/FolderOperate/FolderOperate'

base.channel(3)
base.headerChange('white')


// 从本地存储获取当前登录用户信息
const {name: userName, userId, avatar: userAvatar} = base.LS()

let _dataUrl = `/blog/folder/${folderInfo.id}`

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      folderInfo,
      wfSelect: 0, // 瀑布流开启选择状态
      isAllSelect: 0, // 是否选择全选
      isPost: false, // 接口状态，并阻止多操作
      imgList: [],
      clickAllClick: false,
      selectNum: 0
    }
  }

  // 获取精选集详情
  getFolderInfo() {
    let self = this,
      folderInfo = this.state.folderInfo
    base.ajaxList.getFolderInfo(folderInfo.id, (d) => {
      folderInfo.name = d.result.name
      folderInfo.intro = d.result.comment || ''
      folderInfo.tagList = d.result.tagArray ? d.result.tagArray.split('#') : []
      folderInfo.shared = d.result.shared || 1
      folderInfo.isPrivate = d.result.isPrivate || 0
      self.setState({
        folderInfo
      })
    })
  }

  // 获取已选图片信息
  getSelectArray(param) {
    const {imgList, clickAllClick} = this.state
    let _array = []

    for (let i in imgList) {
      // 图片状态与是否点击全选按钮异或
      if (clickAllClick ^ imgList[i].select()) {
        _array.push(imgList[i][param])
      }
    }

    return _array
  }

  // 打开精选集设置
  openSetFolder() {
    ReactDOM.render(
      <SetFolderPop mode="edit"
        folderInfo={this.state.folderInfo}
        callBack={this.successSet.bind(this)}
      />,
      document.getElementById('set-folder-pop-wrapper')
    )
  }

  // 修改精选集成功
  successSet(data) {
    let folderInfo = this.state.folderInfo
    df_alert({
      mainText: '设置精选集成功'
    })
    folderInfo.name = data.name
    folderInfo.intro = data.intro
    folderInfo.tagList = data.tagList
    folderInfo.isPrivate = data.isPrivate
    this.setState({
      folderInfo
    })
  }

  // 打开精选集共享
  openShareFolder() {
    ReactDOM.render(<ShareFolder folderId={this.state.folderInfo.id}
      userType={1}
      userId={userId}
      userName={userName}
      userAvatar={userAvatar}
    />, document.getElementById('share-folder-pop-wrapper'))
  }

  // 打开批量移动、辅助弹窗
  openMoveCopyPop(type) {
    ReactDOM.render(<MoveCopyPop title={type}
      folderId={this.state.folderInfo.id}
      idList={idList}
      mediaUrl={mediaUrl}
      hidden={false}
      finishFun={cb}
    />, document.getElementById('move-copy-pop-wrapper'))
  }

  // 打开下载板块
  openDownLoad() {
    const {isPost, folderInfo, selectList} = this.state

    if (isPost) {
      return
    }

    let _array = idArray('id'),
      result = []

    if (_array.length === 0) {
      return
    }

    base.eventCount.add(1027, {
      '下载数量': selectList.length,
      '精选集Id': folderInfo.id
    })

    // 组装下载链接
    for (let i = 0, len = selectList.length; i < len; i += 100) {
      result.push({
        idList: _array.slice(i, i + 100).join(','),
        num: (len - i) > 100 ? 100 : len - i,
        status: false
      })
    }

    ReactDOM.render(<DownloadPop folderName={folderInfo.name}
      data={result}
    />, document.getElementById('download-pop-wrapper'))
  }

  // 批量取消精选
  cancelFav() {
    const {isPost, selectNum, selectList} = this.state
    if (isPost) {
      return
    }
    if (selectNum === 0) {
      return
    }
    let self = this
    df_confirm({
      header: '取消精选',
      content: '确定要取消精选这些时尚图片？',
      success: () => {
        let _array = self.getSelectArray('favoriteId'),
          ani = base.animationBtn(self)
        ani.loading()
        self.state.isPost = true

        base.ajaxList.basic({
          type: 'POST',
          url: `${base.baseUrl}/favorite/batch-cancel`,
          data: {
            favoriteIdList: _array.join(',')
          }
        }, () => {
          ani.success(() => {
            df_alert({
              mainText: '成功取消精选'
            })
            cleanUp('clean')
            subFolderNum(_array.length)
            self.state.isPost = false
          })
        }, () => {
          ani.cancel()
          self.state.isPost = false
        })
      }
    })
  }

  // 全选操作
  handelAllSelect() {

  }

  // 单选
  handleSelect(action, data) {
    let {selectNum} = this.state
    this.setState({
      selectNum: action === 'add' ? ++selectNum : --selectNum
    })
  }

  // 瀑布流获取数据成功
  getDataSuccess(state) {
    this.setState({
      imgList: state.waterFallData
    })
  }

  render() {
    const {folderInfo, wfSelect, selectNum} = this.state
    return (
      <div className="folder-page">
        {/* 精选集信息 */}
        <FolderHeader folderInfo={folderInfo}
          mode='self'
          openSetFolder={this.openSetFolder.bind(this)}
        />
        {/* 精选集操作 */}
        <FolderOperate selectNum={selectNum}
          openSetFolder={this.openSetFolder.bind(this)}
          openShareFolder={this.openShareFolder.bind(this)}
          openDownLoad={this.openDownLoad.bind(this)}
          openMoveCopyPop={this.openMoveCopyPop.bind(this)}
          cancelFav={this.cancelFav.bind(this)}
        />
        {/* 精选集图片-WF */}
        <div className="container folder-item-content">
          <div id="water-fall-panel">
            <WaterFall key="waterWall"
              wfType={wfSelect ? 'folderSelect' : 'folder'}
              isCancelFolder={true}
              folderId={folderInfo.id}
              noBottom={true}
              subFolderNum={subFolderNum}
              getDataSuccess={this.getDataSuccess.bind(this)}
              handleSelect={this.handleSelect.bind(this)}
              dataUrl={_dataUrl}
            />
          </div>
        </div>
      </div>
    )
  }
}

ReactDOM.render(<App/>, document.getElementById('folder-page-wrapper'))