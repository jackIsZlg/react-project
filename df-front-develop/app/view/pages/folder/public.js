import base from '../../common/baseModule'
import WaterFall from '../../components/WaterFall/WaterFall'
import DownloadPop from '../../components/DownloadPop/DownloadPop'
import MoveCopyPop from '../../components/MoveCopyPop/MoveCopyPop'
import SetFolderPop from '../../components/SetFolderPop/SetFolderPop'
import ShareFolder from '../../components/ShareFolder/ShareFolder'
import FolderHeader from '../../components/FolderHeader/FolderHeader'
import { Icon } from '../../components/base/baseComponents'
import { FolderRecommended } from '../../components/FolderItem/Folder'
import BottomLogin from '../../components/BottomLoginPanel'

base.channel(3)
base.headerChange('white')
document.oncontextmenu = () => { return false }

let folderInfo = {}
let pointContent = {
  
}
folderInfo.id = base.getUrlStringId()
// folderInfo.id = 18077;

let _dataUrl = `/blog/folder/${folderInfo.id}`

class FolderApp extends React.Component {
  constructor() {
    super()
    this.state = {
      newFolderInfo: {},
      wfSelect: 0, // 瀑布流开启选择状态
      isPost: false, // 接口状态，并阻止多操作
      imgList: [],
      clickAllClick: false,
      selectNum: 0,
      selectList: [],
      unSelectList: [],
      status: '',
      hotFolderParam: {
        hisIdList: '',
        hotSize: '5'
      },
      hotFolderList: [],
      hotFolderCount: 0,
      showLogin: false
    }
  }

  componentDidMount() {
    this.getFolderInfo()
    this.getHotFolder()
    this.beforeScrollTop = document.body.scrollTop
    $.ajax({
      type: 'GET',
      url: `${base.baseUrl}/users/login-state`,
      success: (d) => {
        if (!d.success) {
          window.addEventListener('scroll', () => {
            let dh = document.documentElement.scrollHeight - document.documentElement.clientHeight
            console.log(dh, document.body.scrollTop)
            if (dh <= (20 + document.body.scrollTop)) {
              this.setState({ showLogin: true })
            } else {
              this.setState({ showLogin: false })
            }
          }, false)
        }
      }
    })
  }

  getHotFolder() {
    let { hotFolderParam, hotFolderList, hotFolderCount } = this.state

    if (hotFolderCount * 1 === 4) {
      hotFolderCount = 0
      hotFolderParam.hisIdList = ''
    }

    hotFolderCount++
    base.ajaxList.basic({
      type: 'GET',
      url: `${base.baseUrl}/folder/public/hot-list`,
      data: hotFolderParam
    }, (d) => {
      hotFolderList = this.dealFolderList(d.result)
      this.setState({
        hotFolderCount,
        hotFolderParam,
        hotFolderList
      })
    })
  }

  // 获取精选集详情
  getFolderInfo() {
    let self = this
    let { newFolderInfo } = self.state
    base.ajaxList.getFolderInfo(folderInfo.id, (d) => {
      let { id, name, comment, tagArray, collect, shared, isPrivate, postCount, viewCount, owned, otherFolders, creator, createdAt, mediaUrls } = d.result
      document.title = name + document.querySelector('title').innerText

      newFolderInfo.id = id
      newFolderInfo.name = name
      newFolderInfo.intro = comment || ''
      newFolderInfo.collect = collect
      newFolderInfo.tagList = tagArray ? tagArray.split('#') : []//
      newFolderInfo.shared = shared || 1// 是否为共享
      newFolderInfo.isPrivate = isPrivate || 0 // 是否为私人
      newFolderInfo.createdAt = createdAt || 0 // 是否为私人
      newFolderInfo.num = postCount || 0// 图片数量
      newFolderInfo.viewCount = viewCount || 0 // 浏览量
      newFolderInfo.owned = owned || 0 // 0：他人的 1：自己的
      newFolderInfo.otherFolders = otherFolders || 0 // 0：他人的 1：自己的
      newFolderInfo.userId = creator.id// 用户ID
      newFolderInfo.creatorName = creator.creatorName// 用户昵称
      newFolderInfo.avatar = creator.avatar// 用户头像
      newFolderInfo.isEdit = false// 是否编辑
      newFolderInfo.mediaUrls = mediaUrls
      self.setState({ newFolderInfo })
    })
  }

  // 获取已选图片信息
  getSelectArray(param) {
    const { imgList } = this.state
    let _array = []

    imgList.forEach((item) => {
      // 图片状态与是否点击全选按钮异或
      if (item.select) {
        _array.push(item[param])
      }
    })

    return _array
  }

  // 瀑布流获取数据成功
  getDataSuccess(state) {
    let { wfSelect, selectList, clickAllClick } = this.state
    this.setState({
      imgList: state.waterFallData,
      selectList: !!wfSelect && clickAllClick ? state.waterFallData : selectList
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
    let { hotFolderList } = self.state
    base.ajaxList.folderCollected(id, () => {
      let url = ''
      let name = ''
      let content = {
        source_page: 'album_detail',
        source_type: 'main_album',
        album_id: id
      }
      hotFolderList.map((item) => {
        if (item.id === id) {
          item.colleced = 1
          url = item.cover
          name = item.folderName || item.createrName
        }
        return item
      })
      self.setState({ hotFolderList }, () => {
        base.ajaxList.addPoint(2200002, content)
        df_alert({
          tipImg: url,
          mainText: '收藏成功',
          subText: name
        })
      })
    })
  }

  // 收藏精选集
  getCollection() {
    this.getCollected(folderInfo.id)
  }

  setCollectData() {
    let { newFolderInfo } = this.state
    newFolderInfo.collect = !newFolderInfo.collect
    this.setState({
      newFolderInfo
    })
  }

  handleEditNotCollected(id) {
    let self = this
    let { hotFolderList } = self.state
    base.ajaxList.folderCollectedCencel(id, () => {
      hotFolderList.map((item) => {
        if (item.id === id) {
          item.colleced = 0
        }
        return item
      })
      self.setState({ hotFolderList })
    })
  }

  // 点击全选按钮
  selectedAll() {
    let { imgList, newFolderInfo } = this.state
    let action = this.selectedBtn.getAttribute('data-action')
    let selectFlag = action === 'all'

    imgList.forEach(item => item.select = selectFlag)

    // console.log('imgList', imgList);
    this.setState({
      selectList: selectFlag ? imgList : [],
      unSelectList: [],
      clickAllClick: selectFlag,
      selectNum: selectFlag ? newFolderInfo.num : 0
    })
  }

  // 单选
  handleSelect(action, id) {
    let self = this
    let { selectNum, unSelectList, imgList, selectList } = this.state
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

  // 开始编辑
  startEdit() {
    let { newFolderInfo } = this.state
    newFolderInfo.isEdit = true
    this.setState({
      wfSelect: 1,
      newFolderInfo
    })
  }

  endEdit() {
    let { newFolderInfo } = this.state
    newFolderInfo.isEdit = false
    this.setState({
      wfSelect: 0,
      selectNum: 0,
      selectList: [],
      newFolderInfo,
      clickAllClick: false
    })
  }

  // 更新精选集数量
  subFolderNum(type, subNum) {
    let { newFolderInfo } = this.state
    if (type === 'copy') {
      return
    }
    if (type === 'cancel' || type === 'move' || type === 'collect') {
      newFolderInfo.num -= subNum * 1
    } else if (type === 'upload') {
      newFolderInfo.num += subNum * 1
    }
    this.setState({
      newFolderInfo,
      selectNum: newFolderInfo.num
    })
  }

  // 批量取消精选
  cancelFav() {
    const { isPost, selectNum } = this.state
    if (isPost) {
      return
    }
    if (selectNum === 0) {
      return
    }
    let self = this
    window.df_confirm({
      header: '取消精选',
      content: '确定要取消精选这些时尚图片？',
      success: () => {
        let _array = self.getSelectArray('favoriteId')
        self.state.isPost = true

        base.ajaxList.basic({
          type: 'POST',
          url: `${base.baseUrl}/favorite/batch-cancel`,
          data: {
            favoriteIdList: _array.join(',')
          }
        }, () => {
          df_alert({
            mainText: '成功取消精选'
          })
          self.renderWaterFall()
          self.state.isPost = false
        }, () => {
          self.state.isPost = false
        })
      }
    })
  }

  // 打开精选集设置
  openSetFolder() {
    let { newFolderInfo } = this.state
    ReactDOM.render(
      <SetFolderPop mode="edit"
        id={folderInfo.id}
        folderInfo={newFolderInfo}
        callBack={this.successSet.bind(this)}
      />,
      document.getElementById('set-folder-pop-wrapper')
    )
  }

  // 打开精选集共享
  openShareFolder() {
    let { newFolderInfo } = this.state
    ReactDOM.render(<ShareFolder folderId={folderInfo.id}
      userType={1}
      userId={newFolderInfo.userId}
      userName={newFolderInfo.creatorName}
      userAvatar={newFolderInfo.avatar}
    />, document.getElementById('share-folder-pop-wrapper'))
  }

  // 分离选中项与未选中项
  partSelectArray() {
    let self = this
    let { imgList } = this.state
    let selectArray = []
    let notSelectArray = []

    imgList.forEach((img) => {
      img.select ? selectArray.push(img) : notSelectArray.push(img)
    })

    self.setState({
      selectList: selectArray
    }, () => {
      self.openDownLoad()
    })
  }

  idArray(id) {
    let { imgList } = this.state
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

  // 打开下载板块
  openDownLoad() {
    const { isPost, selectNum, clickAllClick, selectList, newFolderInfo } = this.state
    let content = {
      source_page: 'album_detail',
      album_id: newFolderInfo.id
    }

    if (isPost) {
      return
    }

    let { idlist, unIdlist } = this.idArray('id')
    let result = []

    if (idlist.length === 0) {
      return
    }

    base.eventCount.add(1027, {
      '下载数量': selectNum,
      '精选集Id': folderInfo.id
    })

    // 组装下载链接
    for (let i = 0, len = selectList.length; i < len; i += 100) {
      result.push({
        params: {
          unSelectedIdList: clickAllClick ? unIdlist.slice(i, unIdlist.length).join(',') : '',
          fileName: newFolderInfo.name,
          folderId: (selectNum === newFolderInfo.num || clickAllClick) ? newFolderInfo.id : '',
          idList: (selectNum === newFolderInfo.num || clickAllClick) ? '' : idlist.slice(i, i + 100).join(',')
        },
        num: (len - i) > 100 ? 100 : len - i,
        status: false
      })
    }

    ReactDOM.render(<DownloadPop folderName={newFolderInfo.name}
      endEdit={this.endEdit.bind(this)}
      data={result}
      pointContent={content}
    />, document.getElementById('download-pop-wrapper'))
  }

  // 修改精选集成功
  successSet(data) {
    let { newFolderInfo } = this.state
    df_alert({
      mainText: '设置精选集成功'
    })
    newFolderInfo.name = data.name
    newFolderInfo.intro = data.intro
    newFolderInfo.tagList = data.tagList
    newFolderInfo.isPrivate = data.isPrivate
    this.setState({ newFolderInfo })
  }

  // 打开批量移动、辅助弹窗
  openMoveCopyPop(type) {
    let { selectList, selectNum, clickAllClick, newFolderInfo } = this.state
    let content = {
      source_page: 'album_detail',
      album_id: newFolderInfo.id
    }
    ReactDOM.render(<MoveCopyPop title={type}
      num={selectNum}
      clickAllSelect={clickAllClick}
      folderId={folderInfo.id}
      idList={this.idArray(type === 'move' ? 'favoriteId' : 'id')[`${clickAllClick ? 'unIdlist' : 'idlist'}`]}
      mediaUrl={selectList[0].mediaUrl}
      postType={clickAllClick ? 2 : 1}
      hidden={false}
      finishFun={this.endEdit.bind(this)}
      pointContent={content}
    />, document.getElementById('move-copy-pop-wrapper'))
  }

  // 处理精选集数据
  dealFolderList(folderList) {
    let newFolderList = []
    let { hotFolderParam } = this.state
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
      newFolderListItem.createrName = item.createrName
      newFolderListItem.colleced = item.colleced
      newFolderListItem.url = `/folder/public/${item.id}`

      hotFolderParam.hisIdList += `${item.id},`
      newFolderList.push(newFolderListItem)
    })
    return newFolderList
  }

  seeFolder() {
    let { newFolderInfo } = this.state
    let content = {
      source_page: 'album_detail',
      source_type: 'same_user',
      album_id: newFolderInfo.id
    }
    base.ajaxList.addPoint(2200001, content)
  }

  renderWaterFall() {
    this.subFolderNum()
    this.endEdit()
  }

  render() {
    let { wfSelect, selectNum, clickAllClick, status, newFolderInfo, hotFolderList } = this.state
    let pointContent = {
      source_page: 'album_detail',
      source_type: 'recommended'
    }
    let recommendContent = {
      source_page: 'album_detail',
      recommend_type: 'picture'
    }
    let shareFolderContent = {
      source_page: 'album_detail',
      album_id: newFolderInfo.id
    }
    let seeFolderContent = {
      source_page: 'album_detail',
      source_type: 'hot_recommended',
      album_id: newFolderInfo.id
    }
    const loginUrl = `/login?forwardStr=${base.toBase64(window.location.pathname + window.location.search)}`
    const registerUrl = `${loginUrl}&step=3`
    return (
      <div className="folder-page">
        <BottomLogin show={this.state.showLogin} loginUrl={loginUrl} registerUrl={registerUrl} />
        {/* 精选集信息 */}
        <div id="folder-header-wrapper" style={{ borderBottom: '5px solid rgba(0, 0, 0, 0.06)' }}>
          <FolderHeader folderInfo={newFolderInfo}
            id={folderInfo.id}
            selectNum={selectNum}
            openSetFolder={this.openSetFolder.bind(this)}
            openShareFolder={!!selectNum && this.openShareFolder.bind(this)}
            openDownLoad={!!selectNum && this.openDownLoad.bind(this)}
            openMoveCopyPop={!!selectNum && this.openMoveCopyPop.bind(this)}
            cancelFav={!!selectNum && this.cancelFav.bind(this)}
            changeEdit={this.startEdit.bind(this)}
            endEdit={this.endEdit.bind(this)}

            setCollectData={this.setCollectData.bind(this)}
            seeFolderContent={seeFolderContent}
            shareFolderContent={shareFolderContent}
          />
        </div>

        {/* /!*精选集图片-WF*!/ */}
        <div id="water-layout" className='container'>
          <div className="folder-item-content" style={{ marginTop: '65px' }}>

            {
              !!wfSelect &&
              <div className="show-edit-num" style={{ marginTop: '0', marginBottom: '-20px', zIndex: '5' }}>
                已经选择时尚<span id="edit-num">{base.numberFormat(selectNum)}</span>枚
                <span ref={el => this.selectedBtn = el}
                  id="select-all"
                  data-action={selectNum !== newFolderInfo.num ? 'all' : 'notAll'}
                  onClick={this.selectedAll.bind(this)}
                >
                  {selectNum !== newFolderInfo.num ? '全选' : '取消全选'}
                </span>
              </div>
            }

            <div id="water-fall-panel">
              <WaterFall key="waterWall"
                wfType={!!wfSelect ? 'folderSelect' : 'folder'}
                beforeLoadPage={(page) => {
                  if (page >= 1 && !base.LS().userId) {
                    return false
                  }
                  return true
                }}
                folderId={folderInfo.id}
                subFolderNum={this.subFolderNum.bind(this)}
                getDataSuccess={this.getDataSuccess.bind(this)}
                handleSelect={this.handleSelect.bind(this)}
                clickAllSelect={selectNum === newFolderInfo.num || clickAllClick}
                renderWaterFall={this.renderWaterFall.bind(this)}
                isCleanUp={status}
                dataUrl={_dataUrl}
                pointContent={pointContent}
                recommendContent={recommendContent}
              />
            </div>
          </div>
          <div className="folder-right">
            <div className="other-folder">
              <div className='other-folder-content'>
                <a className="folder-header"
                  href={`/users/folder/detail/${newFolderInfo.userId}`}
                >
                  <span>{newFolderInfo.creatorName}的其它精选集</span>
                  <Icon type='next' />
                </a>
                {
                  newFolderInfo.otherFolders && newFolderInfo.otherFolders.map((item, index) => {
                    let key = `folder${index}`
                    return (
                      <a key={key}
                        className='other-folder-item'
                        href={`${base.baseUrl}/folder/public/${item.id}`}
                        onClick={this.seeFolder.bind(this)}
                      >
                        <div className="folder-name">{item.name}</div>
                        <div className="file-item-num">
                          <Icon type='folder-num' />
                          {base.numberFormat(item.folderCount)} 枚
                        </div>
                      </a>
                    )
                  })
                }
              </div>
              <div className="hot-folder">
                <div className="hot-folder-header">
                  热门精选集
                  <button onClick={this.getHotFolder.bind(this)}>换一批</button>
                </div>
                <div className="hot-folder-content">
                  {
                    hotFolderList && hotFolderList.map((item, index) => {
                      let key = `recommended-${index}`
                      return (
                        <FolderRecommended
                          key={key}
                          {...item}
                          recommended={true}
                          handleEdit={this.getCollected.bind(this)}
                          handleEditNotCollected={this.handleEditNotCollected.bind(this)}
                          seeFolderContent={seeFolderContent}
                        />
                      )
                    })
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

ReactDOM.render(<FolderApp />, document.getElementById('folder-page-wrapper'))