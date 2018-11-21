/**
 * Created by gewangjie on 2017/5/25.
 */
import classNames from 'classnames'
import base from '../../common/baseModule'
import {Icon} from '../../components/base/baseComponents'
import LoadImage from '../../components/base/LoadImage'
import {TipWarning} from '../base/baseComponents'

$('#app').append('<div id="move-copy-pop-wrapper"></div>')

class LeftPane extends React.Component {
  render() {
    let _style = {'backgroundImage': `url(${base.ossImg(this.props.mediaUrl, 300)})`}

    return (
      <div className="left pane">
        <div className="first-block"/>
        <div className="second-block"/>
        <div className="folder-bg" style={_style}>
          <div className="folder-bg-mask"></div>
          <div className="folder-num">
            <span>{base.numberFormat(this.props.num)}</span>
            枚时尚
          </div>
        </div>
      </div>
    )
  }
}

class RightPane extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      readOnly: false,
      newFolderName: '',
      isNewFolder: false,
      warningType: 0
    }
  }

  // 第一次渲染后调用
  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.hidden) {
      this.setState({
        readOnly: false,
        newFolderName: '',
        isNewFolder: false,
        warningType: 0
      })
      this.refs.folderList.scrollTop = 0
    }
    this.updateHeight()
  }

  // 更新高度
  updateHeight() {
    let right_h = this.refs.rightPane.offsetHeight
    let title_h = this.refs.title.offsetHeight
    this.refs.folderList.style.height = `${right_h - title_h - 10}px`
  }

  // 新增精选集按钮
  newFolderBtn() {
    this.setState({
      isNewFolder: true
    }, function () {
      $(this.refs.newFolder).focus()
    })
  }

  // 加入精选集
  addFolderAjax(name, id) {
    let self = this
    let {options, mainText} = self.getAjaxOption('add', name, id)

    self.props.lockClosePop(true)

    base.ajaxList.basicLogin(options, () => {
      self.props.lockClosePop()
      self.props.handleClose(self.props.finishFun)
      df_alert({
        tipImg: base.ossImg(self.props.mediaUrl, 288),
        mainText,
        subText: name
      })
    }, () => {
      self.props.lockClosePop()
    })
  }

  // 新建并加入精选集
  newFolderAjax(name, id) {
    let self = this
    let el = self.refs[`btn-${id}`]
    let ani = base.animationBtn(el)
    ani.loading()

    let {options, mainText} = self.getAjaxOption('new', name, id)

    self.props.lockClosePop(true)
    base.ajaxList.basicLogin(options, (d) => {
      ani.success(() => {
        self.props.lockClosePop()
        self.props.handleClose(self.props.finishFun)
        df_alert({
          tipImg: base.ossImg(self.props.mediaUrl, 288),
          mainText,
          subText: name
        })
      })
      self.setState({
        readOnly: true
      })
    }, (d) => {
      ani.cancel()
      self.props.lockClosePop()
      self.setState({
        readOnly: true
      })
    })
  }

  newFolder() {
    let newFolderName = this.state.newFolderName.removeNBSP().trim()
    let flag = true
    if (newFolderName.length > 15) {
      this.setState({
        warningType: 2
      }, this.hideWarning)
      return
    }
    if (this.state.readOnly) {
      return
    }

    if (newFolderName) { // 控制不处理
      this.props.selfFolderList.forEach((d) => {
        d.name === newFolderName && (flag = false)
      })
      if (flag) {
        this.setState({
          readOnly: true
        }, this.newFolderAjax(newFolderName, 'new'))
      } else {
        this.setState({
          warningType: 1
        }, this.hideWarning)
      }
    }
  }

  /**
   * 选择接口参数
   * @params title:move/copy
   * @params type:new/add
   * @params name:目标精选集名称
   * @params id:目标精选集id
   */
  getAjaxOption(type, name, id) {
    const {folderId, clickAllSelect, title, idList, postType, showId} = this.props
    let options = {
        type: 'POST',
      },
      mainText = this.renderTitle()

    if (type === 'upload') {
      return mainText
    }

    console.log('mainText', mainText, type, name, id)
    console.log('title', `${title}-${type}-${clickAllSelect}`)
    switch (`${title}-${type}-${clickAllSelect}`) {
      case 'move-new-true':
        options.url = `${base.baseUrl}/v1/favorite/create-move`
        options.data = {
          // unselectedFavoriteIdList: idList.join(',') || '',
          unselectedFavoriteIdList: idList.join(',') || '',
          fromFolderId: folderId,
          targetFolderName: name
        }
        break
      case 'move-new-false':
        options.url = `${base.baseUrl}/favorite/create-move`
        options.data = {
          favoriteIdList: idList.join(','),
          folderName: name
        }
        break
      case 'move-add-true':
        options.url = `${base.baseUrl}/v1/favorite/move`
        options.data = {
          // unselectedFavoriteIdList: idList.join(',') || '',
          unselectedFavoriteIdList: idList.join(',') || '',
          fromFolderId: folderId,
          targetFolderId: id
        }
        break
      case 'move-add-false':
        options.url = `${base.baseUrl}/favorite/move`
        options.data = {
          favoriteIdList: idList.join(','),
          folderId: id
        }
        break
      case 'copy-new-true':
        options.url = `${base.baseUrl}/v1/favorite/create-copy`
        options.data = {
          // unselectedBlogIdList: idList.join(',') || '',
          unselectedBlogIdList: idList.join(',') || '',
          fromFolderId: folderId,
          targetFolderName: name
        }
        break
      case 'copy-new-false':
        options.url = `${base.baseUrl}/favorite/create-copy`
        options.data = {
          blogIdList: idList.join(','),
          folderName: name
        }
        break
      case 'copy-add-true':
        options.url = `${base.baseUrl}/v1/favorite/copy`
        options.data = {
          // unselectedBlogIdList: idList.join(',') || '',
          unselectedBlogIdList: idList.join(',') || '',
          fromFolderId: folderId,
          targetFolderId: id
        }
        break
      case 'copy-add-false':
        options.url = `${base.baseUrl}/favorite/copy`
        options.data = {
          blogIdList: idList.join(','),
          folderId: id
        }
        break
      case 'collect-new-true':
        options.url = `${base.baseUrl}/favorite/create/batch-add`
        options.data = {
          postType,                                     
          unSelectedIdList: idList.join(','),           
          sourceId: postType === 3 ? showId : folderId,
          postIdList: '',
          name
        }
        break
      case 'collect-new-false':
        options.url = `${base.baseUrl}/favorite/create/batch-add`
        options.data = {
          postType,     
          postIdList: idList.join(','),
          unSelectedIdList: '',
          name
        }
        break
      case 'collect-add-true':
        options.url = `${base.baseUrl}/favorite/batch-add`
        options.data = {
          postType,
          unSelectedIdList: idList.join(','),
          postIdList: '',
          sourceId: postType === 3 ? showId : folderId,
          folderId: id
        }
        break
      case 'collect-add-false':
        options.url = `${base.baseUrl}/favorite/batch-add`
        options.data = {
          postType,
          postIdList: idList.join(','),
          unSelectedIdList: '',
          folderId: id
        }
        break
      default:
        break
    }

    this.getIdList(options.data)

    return {
      options,
      mainText
    }
  }

  getIdList(options) {
    let newData = []
    if (!options.postIdList) {
      return
    }

    if (!options.sourceId) {
      this.addPoint(options.postIdList)
      return
    }
    let url = options.postType === 3 ? '/show/get-show-post?showId=' : '/folder/get-all-folder-post?folderId='
    base.ajaxList.basic({
      type: 'GET',
      url: `${base.baseUrl}${url}${options.sourceId}`
    }, (data) => {
      if (options.unSelectedIdList) {
        let unSelected = options.unSelectedIdList.split(',')
        newData = data.result.filter((element) => {
          let compareResult = unSelected.some(v => v * 1 === element) 
          if (!compareResult) {
            return element
          }
        })
      } else {
        newData = data.result
      }
      data.success && this.addPoint(newData.join(','))
    })
  }

  addPoint(idArray) {
    let {pointContent} = this.props
    let content = {
      pic_id: idArray,
      pic_qty: idArray.split(',').length
    }
    for (let key in pointContent) {
      content[key] = pointContent[key]
    }
    base.ajaxList.addPoint(2100002, content)
  }

  renderTitle() {
    switch (this.props.title) {
      case 'move':
        return '移动到精选集'
      case 'copy':
        return '复制到精选集'
      case 'collect':
      default:
        return '精选到精选集'
    }
  }

  // 编辑Event
  handleEdit(e) {
    let val = e.target.value
    this.setState({
      newFolderName: val
    })
  }

  handleKeyDown(e) {
    e.keyCode === 13 && this.newFolder()
  }

  // 定时器
  hideWarning() {
    let self = this
    setTimeout(() => {
      self.setState({
        warningType: 0,
      })
    }, 3000)
  }

  // 上传图片选择精选集
  uploadSelectFolder(name, folderId) {
    let self = this
    let {urls} = self.props
    let params = {
      folderId,
      urls
    }
    // let el = self.refs[`btn-${folderId}`]
    // let ani = base.animationBtn(el)

    let mainText = self.getAjaxOption('upload', name, folderId)

    // ani.loading()
    base.ajaxList.basic({
      type: 'POST',
      url: `${base.baseUrl}/user/upload/save-uploaded-picture`,
      data: params
    }, () => {
      // ani.success(() => {
      self.props.lockClosePop()
      self.props.handleClose(self.props.finishFun)
      df_alert({
        tipImg: base.ossImg(self.props.mediaUrl, 288),
        mainText,
        subText: name
      })
      // })
    })
  }

  /* ==================================== */
  render() {
    let {select, title} = this.props
    return (<div className="right pane" ref="rightPane">
      <div className="title-container" ref="title">
        <div className="createTitle">{title === 'collect' && '精选'}{title === 'move' && '移动'}{title === 'copy' && '复制'}到精选集</div>
        {
          !select &&
          <div className="create-board">
            <div className={classNames('create-board-btn', {'hidden': this.state.isNewFolder})}
              onClick={this.newFolderBtn.bind(this)}
            >
              <button className="btn-effect"><Icon type="add-folder"/></button>
              新建精选集
            </div>
            <div className={classNames('create-board-edit', {'hidden': !this.state.isNewFolder})}>
              <input className="board-name"
                value={this.state.newFolderName}
                type="text"
                ref="newFolder"
                readOnly={this.state.readOnly}
                onKeyDown={this.handleKeyDown.bind(this)}
                onChange={this.handleEdit.bind(this)}
                placeholder="输入精选集名称(最多15个字符)"
              />
              <button
                ref='btn-new'
                className={classNames('add-board-button', 'btn-animation', {
                  'btn-effect': this.state.newFolderName,
                  'null': !this.state.newFolderName
                })}
                onClick={this.newFolder.bind(this)}
              >创建并加入
              </button>
              <TipWarning type={this.state.warningType}/>
            </div>
          </div>
        }
      </div>
      <div className="boards-wrapper" ref="folderList">
        <div className="sections">
          <ul className="section all-boards">
            {this.props.selfFolderList.map((item, index) => {
              let _style = item.mediaUrls[0] ? {
                backgroundImage: `url(${base.ossImg(item.mediaUrls[0], 100)})`
              } : {}
              return (<li key={`folder-self-${index}`}
                className={classNames({'disabled': item.hasFolder})}
                onClick={() => {
                            item.hasFolder || select ? this.uploadSelectFolder(item.name, item.id) : this.addFolderAjax(item.name, item.id)
                          }}
              >
                <div className="cover-img" style={_style}>
                  {item.shared !== 1 && <Icon type="folder-work"/>}
                </div>
                <span className="name">{item.name.trim()}</span>
                <button ref={`btn-${item.id}`} className={classNames('add-board-button btn-animation float-r', {'disabled': item.hasFolder})}>
                  {item.hasFolder ? <Icon type="in-folder"/> : '选入'}
                </button>
                      </li>
              )
            })}
          </ul>
        </div>
      </div>
    </div>)
  }
}

class MoveCopyPop extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isLogin: false, // 登录状态
      cancelClick: false, // 防止多次点击
      hidden: true,
      hasFilter: false, // 过滤状态
      selfFolderList: [], // 个人精选集列表
      page: 0,
      closeBody: false,
      lockClose: false
    }
  }

  // 第一次渲染前调用
  componentWillMount() {
    // 模块隐藏不触发
    if (!this.props.hidden) {
      this.state.isLogin ? this.init() : this.isLogin()
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.hidden === false) {
      this.setState({
        page: 0,
        hasFilter: false,
        lockClose: false
      }, () => {
        this.init()
      })
    } else {
      this.setState({
        hidden: true,
        lockClose: false
      })
    }
  }

  // 初始化or重置
  init() {
    if (this.state.cancelClick) {
      return
    }
    this.state.cancelClick = true

    // 清空精选集列表
    this.state.selfFolderList = []

    // 锁定浮层下层
    this.state.closeBody = window.isBodyScroll
    window.isBodyScroll && base.bodyScroll(false)

    this.getSelfFolder()
  }

  // 判断登陆
  isLogin() {
    let self = this
    if (self.state.cancelClick) {
      return
    }
    self.state.cancelClick = true
    base.request({
      'type': 'GET',
      'url': `${base.baseUrl}/users/login-state`
    }).done((d) => {
      if (d.success) {
        d.result * 1 !== 0 && self.setState({
          cancelClick: false
        }, self.init)
      }
    }).fail()
  }

  // 获取个人精选集信息
  getSelfFolder() {
    let self = this
    base.request({
      url: `${base.baseUrl}/favorite/list`,
      type: 'GET',
      data: {
        start: self.state.page * 30,
        pageSize: 30
      }
    }).done((d) => {
      if (d.success) {
        if (d.result.resultList.length > 0) {
          // 根据过滤状态，过滤掉当前精选集
          let _result = self.state.hasFilter ? d.result.resultList : self.filterFolder(d.result.resultList)

          self.setState({
            selfFolderList: self.state.selfFolderList.concat(_result),
            hidden: false,
            cancelClick: false,
            page: self.state.page + 1
          }, () => {
            self.getSelfFolder()
          })
        }

        // 新用户无个人标签
        (d.result.resultList.length === 0) && self.setState({
          hidden: false
        })
      }
    }).fail(() => {

    })
  }

  filterFolder(data) {
    let _array = []
    let len = data.length
    for (let i = 0; i < len; i++) {
      if (data[i].id !== this.props.folderId) {
        _array.push(data[i])
      } else {
        // 修改状态，跳出循环
        this.state.hasFilter = true
      }
    }
    return _array
  }

  // 关闭弹窗
  closePop(cb) {
    // 锁止，禁止关闭
    if (this.state.lockClose) {
      return
    }
    this.setState({
      hidden: true
    }, () => {
      this.state.closeBody && base.bodyScroll(true)
      typeof cb === 'function' && cb()
    })
  }

  lockClosePop(flag = false) {
    this.state.lockClose = flag
    this.props.endEdit && this.props.endEdit()
  }

  // 渲染
  render() {
    const {props} = this
    return (<div id="move-copy-pop-panel" className={classNames({'hidden': this.state.hidden})}>
      <div className="move-copy-pop-panel">
        <LeftPane mediaUrl={props.mediaUrl}
          num={props.num}
        />
        <RightPane mediaUrl={props.mediaUrl}
          lockClosePop={this.lockClosePop.bind(this)}
          hidden={props.hidden}
          title={props.title}
          selfFolderList={this.state.selfFolderList}
          urls={props.urls}
          postType={props.postType}
          select={props.selectFolder}
          folderId={props.folderId}
          showId={props.showId}
          idList={props.idList}
          clickAllSelect={props.clickAllSelect}
          handleClose={this.closePop.bind(this)}
          finishFun={props.finishFun}
          pointContent={this.props.pointContent}
        />
        <i className="iconfont cancel-pop"
          onClick={this.closePop.bind(this)}
        />
      </div>
    </div>)
  }
}

export default MoveCopyPop