/**
 * Created by gewangjie on 2017/3/20.
 */
import classNames from 'classnames'
import base from '../../common/baseModule'
import LoadImage from '../../components/base/LoadImage'
import {TipWarning, TitleWarning, Icon} from '../base/baseComponents'
import {wfTypeData} from '../../common/module/eventModule'

$('#app').append('<div id="select-pop-wrapper"></div>')

class LeftPane extends React.Component {
  constructor(props) {
    super(props)
  }


  render() {
    return (<div className="left pane">
      <div className="left-holder">
        <div className="left-wrapper">
          <div className="img-area">
            <LoadImage src={this.props.mediaUrl} aliWidth={300}/>
          </div>
          {
                        this.props.wfType !== 'orderMeeting' &&
                        <div className="left-footer">
                          <span className="platform">来自{this.props.platformName}</span>
                          <span className="uname">{this.props.nickname}</span>
                        </div>}
        </div>
      </div>
            </div>)
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
    this.updateheight()
  }

  // 更新高度
  updateheight() {
    let right_h = this.refs.rightPane.offsetHeight,
      title_h = this.refs.title.offsetHeight
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
    // el = self.refs[`btn-${id}`],
    // ani = base.animationBtn(el)
    // 防重点
    // if (el.disabled) {
    //   return
    // }
    // ani.loading()
    base.request({
      url: `${base.baseUrl}/favorite/add`,
      type: 'POST',
      data: {
        blogId: self.props.blogId,
        folderId: id,
        source: wfTypeData[self.props.wfType].source
      }
    }).done((d) => {
      if (d.success) {
        // ani.success(() => {
        self.props.handleClose()
        df_alert({
          tipImg: base.ossImg(self.props.mediaUrl, 288),
          mainText: '成功加入精选集',
          subText: name
        })
        // })
        self.props.handleAddFolder(self.props.outIndex, id, d.result)
        base.eventCount.add(1018, {
          '精选方式': '已有精选集',
          '保存精选集名称': name,
          '图片Id': self.props.blogId
        })
      } else if (d.errorCode === 'D03') {
        // ani.cancel()
      }
    }).fail((d) => {
      // ani.cancel()
    })
  }

  newFolderAjax(name, id) {
    let self = this,
      el = self.refs[`btn-${id}`],
      ani = base.animationBtn(el)
    ani.loading()
    base.request({
      url: `${base.baseUrl}/favorite/create/add`,
      type: 'POST',
      data: {
        blogId: self.props.blogId,
        name,
        source: wfTypeData[self.props.wfType].source
      }
    }).done((d) => {
      if (d.success) {
        ani.success(() => {
          self.props.handleClose()
          df_alert({
            tipImg: base.ossImg(self.props.mediaUrl, 288),
            mainText: '成功加入精选集',
            subText: name
          })
        })
        self.props.handleAddFolder(self.props.outIndex, '', d.result)
        base.eventCount.add(1018, {
          '精选方式': id === 'new' ? '创建新精选集' : '选择标签',
          '保存精选集名称': name,
          '图片Id': self.props.blogId
        })
      } else if (d.errorCode === 'D03') {
        ani.cancel()
      }
      self.setState({
        readOnly: true
      })
    }).fail((d) => {
      ani.cancel()
      self.setState({
        readOnly: true
      })
    })
  }

  newFolder() {
    let newFolderName = this.state.newFolderName.removeNBSP().trim(),
      flag = true
    // 控制不处理
    if (!newFolderName) {
      return
    }

    if (newFolderName.length > 15) {
      this.setState({
        warningType: 2
      }, this.hideWarning)
      return
    }

    if (this.state.readOnly) {
      return
    }

    this.props.selfFolderList.forEach((d) => {
      d.name === newFolderName && (flag = false)
    })

    // 重名
    if (!flag) {
      this.setState({
        warningType: 1
      }, this.hideWarning)
      return
    }

    this.setState({
      readOnly: true
    }, this.newFolderAjax(newFolderName, 'new'))
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

  /* ==================================== */
  render() {
    return (<div className="right pane" ref="rightPane">
      <div className="title-container" ref="title">
        <div className="createTitle">添加到精选集</div>
        <TitleWarning data={this.props.hasFolder}/>
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
                                           item.hasFolder || this.addFolderAjax(item.name, item.id)
                                       }}
                            >
                              <div className="cover-img" style={_style}>
                                {item.shared !== 1 && <Icon type="folder-work"/>}
                              </div>
                              <span className="name">{item.name.trim()}</span>
                              <button ref={`btn-${item.id}`}
                                className={classNames('add-board-button btn-animation float-r', {'disabled': item.hasFolder})}
                              >
                                {item.hasFolder ? <Icon type="in-folder"/> : '选入'}
                              </button>
                            </li>)
                        })}
          </ul>
          {this.props.sysFolderList.length > 0 ? <ul className="section board-create-suggestions">
            <li className="section-title">推荐使用精选集名称</li>
            {this.props.sysFolderList.map((item) => {
                            return (<li className="system-folder"
                              key={`folder-system-${item.id}`}
                              onClick={this.newFolderAjax.bind(this, item.content, item.id)}
                            >
                              <Icon type="add-folder"/>
                              <span className="name">{item.content}</span>
                              <button className="add-board-button btn-effect btn-animation float-r"
                                ref={`btn-${item.id}`}
                              >创建并加入
                              </button>
                            </li>)
                        })}
                                                 </ul> : ''}
        </div>
      </div>
    </div>)
  }
}

class SelectPop extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isLogin: false,
      cancelClick: false, // 防止多次点击
      hidden: true,
      blogId: props.blogId,
      platformName: '',
      nickname: props.nickname || '',
      mediaUrl: props.mediaUrl || '',
      hasFolder: [],
      sysFolderList: [],
      selfFolderList: [],
      page: 0,
      closeBody: false
    }
  }

  // 第一次渲染前调用
  componentDidMount() {
    // 模块隐藏不触发
    if (!this.props.hidden) {
      this.state.isLogin ? this.init() : this.isLogin()
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.hidden === false) {
      this.setState({
        blogId: nextProps.blogId,
        mediaUrl: nextProps.mediaUrl,
        nickname: nextProps.nickname,
        hasFolder: [],
        page: 0,
        cancelClick: false
      }, () => {
        this.state.isLogin ? this.init() : this.isLogin()
      })
    } else {
      this.setState({
        cancelClick: false
      })
    }
  }

  getBlogInfo() {
    let self = this

    $.ajax({
      url: `${base.baseUrl}/favorite/detail?blogId=${self.state.blogId}`,
      type: 'GET'
    }).done((d) => {
      d.success && self.setState({
        platformName: d.result.blogger.platformName,
        nickname: d.result.blogger.nickname,
        mediaUrl: self.props.wfType === 'orderMeeting' ? self.state.mediaUrl : d.result.mediaUrl,
      }, () => {
        // 比对
        let newSysFolderList = self.compareFolderSS(d.result.postTag, self.state.selfFolderList)
        let {hasFolder, newSelfFolderList} = self.compareFolderSH(d.result.favoriteList, self.state.selfFolderList)

        // 过滤共享精选Id
        // newSelfFolderList = self.filterShareFolder(newSelfFolderList);

        // 添加系统随机标签
        newSysFolderList = self.addSystemFolder(newSysFolderList, newSelfFolderList)

        self.setState({
          sysFolderList: newSysFolderList,
          selfFolderList: newSelfFolderList,
          hasFolder
        })
      })

      // 锁定浮层下层
      self.state.closeBody = window.isBodyScroll
      window.isBodyScroll && base.bodyScroll(false)
    }).fail(() => {

    })
  }

  // 获取个人精选集信息
  getSelfFolder(cb) {
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
        d.result.resultList.length > 0 && self.setState({
          selfFolderList: self.state.selfFolderList.concat(d.result.resultList),
          hidden: false,
          cancelClick: false,
          page: self.state.page + 1
        }, () => {
          self.getSelfFolder(cb)
        });

        // 新用户无个人标签
        (d.result.resultList.length === 0) && (self.setState({
          cancelClick: false,
          hidden: false
        }, () => {
          cb && cb()
        }))
      } else {
        cb && cb()
      }
    }).fail(() => {

    })
  }

  // 初始化or重置
  init() {
    if (this.state.cancelClick) {
      return
    }
    this.state.cancelClick = true
    this.state.selfFolderList = []
    this.getSelfFolder(this.getBlogInfo.bind(this))
  }

  // 判断登陆
  isLogin() {
    let self = this
    console.log('login11', self.state.cancelClick)
    if (self.state.cancelClick) {
      return
    }
    self.state.cancelClick = true
    base.request({
      'type': 'GET',
      'url': `${base.baseUrl}/users/login-state`
    }).done((d) => {
      self.setState({
        cancelClick: false
      }, () => {
        if (!d.success) {
          return
        }
        d.result * 1 !== 0 && self.init() 
      })
    }).fail(() => {
      self.setState({
        cancelClick: false
      })
    })
  }

  // 个人精选与系统精选比对
  compareFolderSS(sysFolderList, selfFolderList) {
    let newSysFolderList = []
    sysFolderList.forEach((sysFolder) => {
      let flag = true
      selfFolderList.forEach((selfFolder) => {
        sysFolder.content === selfFolder.name && (flag = false)
      })
      flag && newSysFolderList.push(sysFolder)
    })
    return newSysFolderList
  }

  // 个人精选与已精选比对
  compareFolderSH(favoriteList, selfFolderList) {
    let newSelfFolderList = []
    let hasFolder = []
    selfFolderList.forEach((selfFolder) => {
      let flag = true
      favoriteList.forEach((favorite) => {
        favorite.folderId === selfFolder.id && (flag = false)
      })
      if (flag) {
        newSelfFolderList.push(selfFolder)
      } else {
        selfFolder.hasFolder = true
        newSelfFolderList.push(selfFolder)
        hasFolder.push(selfFolder)
      }
    })
    return {hasFolder, newSelfFolderList}
  }

  // 非创建者过滤共享精选集
  filterShareFolder(newSelfFolderList) {
    return newSelfFolderList.filter((item) => {
      return item.shared !== 3
    })
  }

  // 增加随机搜索标签
  addSystemFolder(sysFolderList, selfFolderList) {
    if (sysFolderList.length >= 4) {
      return sysFolderList
    }

    // 原始26个标签内删除用户已有标签(base.tagConfig)
    let originSysFolder = []
    let _length = selfFolderList.length
    base.tagConfig.forEach((sysFolder, index) => {
      let flag = true
      for (let i = 0; i < _length; i++) {
        if (sysFolder === selfFolderList[i].name) {
          flag = false
          break
        }
      }
      flag && originSysFolder.push({content: sysFolder, id: index})
    })

    // 随机添加标签，补足4个
    let folderNumNow = sysFolderList.length //
    let folderNumNeed = 4 - folderNumNow // 待补充数量
    let originSysFolderLength = originSysFolder.length // 系统标签剩余长度
    let randomArray = base.renderRandomNum(0, originSysFolderLength, folderNumNeed)// 随机数数组

    randomArray.forEach((val) => {
      sysFolderList.push(originSysFolder[val])
    })

    return sysFolderList
  }

  // 关闭弹窗
  closePop(cb) {
    this.setState({
      hidden: true
    }, () => {
      this.state.closeBody && base.bodyScroll(true)
      typeof cb === 'function' && cb()
    })
  }

  // 渲染
  render() {
    let data = this.state
    return (
      <div id="select-pop-panel" className={classNames({'hidden': this.state.hidden})}>
        <div className="select-pop-panel">
          <LeftPane wfType={this.props.wfType}
            mediaUrl={data.mediaUrl}
            nickname={data.nickname}
            platformName={data.platformName}
          />
          <RightPane wfType={this.props.wfType}
            mediaUrl={data.mediaUrl}
            hidden={this.props.hidden}
            sysFolderList={data.sysFolderList}
            selfFolderList={data.selfFolderList}
            hasFolder={data.hasFolder}
            blogId={this.state.blogId}
            handleClose={this.closePop.bind(this)}
            outIndex={this.props.outIndex}
            handleAddFolder={this.props.handleAddFolder}
          />
          <i className="iconfont cancel-pop btn-color-effect"
            onClick={this.closePop.bind(this)}
          />
        </div>
      </div>
    )
  }
}

export default SelectPop