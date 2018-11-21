/**
 * Created by gewangjie on 2017/6/21.
 */

import base from '../../common/baseModule'
import {RadioGroup, Icon} from '../../components/base/baseComponents'
import classNames from 'classnames'

$('#app').append('<div id="set-folder-pop-wrapper"></div>')

function isFolderManage(url) {
  return (/\/users\/favorite-view/).test(url)
}

// 标签列表
class FolderTagList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      num: this.props.tagList.length,
      systemTag: this.props.systemTag || [],
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.systemTag.length !== this.props.systemTag.length) {
      this.init(nextProps.systemTag)
    }
  }

  init(systemTag) {
    // 获取已选标签id
    let tagList = this.props.tagList

    // 比对标签库，置选中态
    systemTag.forEach((tagGroup) => {
      tagGroup.childList.forEach((tag) => {
        tag.select = (tagList.indexOf(tag.content) !== -1)
      })
    })

    this.setState({
      systemTag
    })
  }

  // 选择标签
  handleClickTag(indexG, indexL) {
    let tagData = this.state.systemTag,
      originStatus = tagData[indexG].childList[indexL].select,
      num = this.state.num

    console.log(num)

    // 已选3项，跳出
    if (num === 3 && !originStatus) {
      return
    }

    tagData[indexG].childList[indexL].select = !originStatus
    this.setState({
      systemTag: tagData,
      num: originStatus ? num - 1 : num + 1
    })
  }

  handleClick() {
    let tagList = []
    this.state.systemTag.forEach((tagGroup) => {
      tagGroup.childList.forEach((tag) => {
        if (tag.select) {
          tagList.push(tag.content)
        }
      })
    })

    // 回调，返回
    this.props.setSelectTag(tagList)
    this.props.back()
  }

  renderTagList(tagGroup, indexG) {
    let keyG = `tag-group-${indexG}`
    return (<div className="tag-list" key={keyG}>
      <div className="tag-type">{tagGroup.content}</div>
      <ul>
        {tagGroup.childList.map((tag, indexL) => {
                    let keyItem = `tag-${indexG}-${indexL}`
                    return (<li className={classNames({'select': tag.select})}
                      key={keyItem}
                      onClick={this.handleClickTag.bind(this, indexG, indexL)}
                    ># {tag.content}
                    </li>)
                })}
      </ul>
    </div>)
  }

  render() {
    return (<div className={classNames('folder-tag-panel', {'show': this.props.show})}>
      <button className="btn-back"
        onClick={this.props.back}
      >
        <Icon type="back"/>
      </button>
      <div className="header">
                选择标签
        <div className="sub-text">选择合适的标签，最多可选 3 个</div>
      </div>
      <div className="content">
        <div className="tag-list-pane">
          {
                        this.state.systemTag.map((tagGroup, indexG) => {
                            return this.renderTagList(tagGroup, indexG)
                        })
                    }
        </div>
        <div className="footer">
          <button className='btn btn-block btn-round btn-effect btn-gradient-blue'
            onClick={this.handleClick.bind(this)}
          >确定
          </button>
        </div>
      </div>
    </div>)
  }
}

class SetFolderPop extends React.Component {
  constructor(props) {
    super(props)
    this.state = this.initParams()
  }

  // 第一次渲染前调用
  componentWillMount() {
    this.init()
  }

  // 初始化参数
  initParams() {
    let state = {
        id: '',
        name: '',
        intro: '',
        systemTag: [],
        isPrivate: 0,
        tagList: [],
        moreInfo: false,
        showFolderTagPanel: false,
        closeBody: false
      }, 
      folderInfo = this.props.folderInfo

    state.id = this.props.id
    for (let param in folderInfo) {
      state[param] = folderInfo[param]
    }

    state.introL = state.intro.length

    return state
  }

  init() {
    // 锁定浮层下层
    this.state.closeBody = window.isBodyScroll
    window.isBodyScroll && base.bodyScroll(false)

    this.getTagList()
    this.props.getData && this.getFolderDetail()
  }

  // 获取当前精选集详情
  getFolderDetail() {
    let self = this,
      state = self.state
    console.log(state)
    base.ajaxList.getFolderInfo(state.id, (data) => {
      const {name, comment: intro, isPrivate, tagArray} = data.result
      self.setState({
        name, intro, isPrivate, tagList: tagArray ? tagArray.split('#') : []
      })
    })
  }

  // 获取标签数据
  getTagList() {
    let self = this
    base.ajaxList.basic({
      'type': 'GET',
      'url': `${base.baseUrl}/tag/list/folder`
    }, (d) => {
      self.setState({
        systemTag: d.result
      })
    })
  }

  // 输入监听
  handleInputName(e) {
    this.setState({
      name: e.target.value
    })
  }

  handleInputIntro(e) {
    let val = e.target.value
    this.setState({
      intro: val,
      introL: val.length
    })
  }

  handlePrivate(value) {
    console.log('parent', value)
    this.setState({
      isPrivate: value
    })
  }

  // 提交修改数据
  handlePost() {
    let self = this
    let input = self.refs['input-name']
    let textarea = self.refs['textarea-intro']
    // let btn = self.refs['btn-edit']
    // let ani = base.animationBtn(btn)
    let {id, name, intro, introL, tagList, isPrivate} = this.state

    if (!name) {
      return
    }

    if (name.length > 15) {
      new base.warningTip(input, '不能超过15个字符')
      return
    }

    if (introL > 260) {
      new base.warningTip(textarea, '不能超过260个字符')
      return
    }

    // ani.loading()

    let postData = {
      name,
      id,
      isPrivate,
      'tagArray': tagList.join('#') || '',
      'comment': intro || ''
    }


    // 编辑
    if (this.props.mode === 'edit') {
      base.ajaxList.basicLogin({
        type: 'POST',
        url: `${base.baseUrl}/folder/modify`,
        data: postData
      }, (d) => {
        // ani.success(() => {
        self.props.callBack && self.props.callBack({
          id,
          name,
          tagList,
          isPrivate,
          intro
        }, self.props.editIndex)
        self.closePop()
        // })
      }, (d) => {
        if (d.errorCode === 'D03') {
          new base.warningTip(input, '名称重复，请重新输入')
        }
        df_alert({
          type: 'warning',
          mainText: '设置精选集失败',
        })
        // ani.cancel()
      })
      return
    }

    // 新增
    base.ajaxList.basicLogin({
      type: 'POST',
      url: `${base.baseUrl}/favorite/create`,
      data: postData
    }, (d) => {
      // ani.success(() => {
      self.props.callBack && self.props.callBack({
        id: d.result,
        name,
        tagList,
        isPrivate,
        intro
      })
      self.closePop()
      // })
    }, (d) => {
      if (d.errorCode === 'D03') {
        new base.warningTip(input, '名称重复，请重新输入')
      }
      df_alert({
        type: 'warning',
        mainText: '创建精选集失败',
        subText: name
      })
      // ani.cancel()
    })
  }

  // 删除精选集
  handleDelete() {
    let self = this
    // let el = self.refs['btn-delete']
    const {id} = self.state
    console.log('删除', id)
    df_confirm({
      header: '删除精选集',
      content: '一旦删除该精选集和其中精选的时尚，您将无法恢复该操作',
      success: () => {
        // let ani = base.animationBtn(el)
        // ani.loading()
        base.ajaxList.basicLogin({
          type: 'GET',
          url: `${base.baseUrl}/folder/remove/${id}`,
        }, () => {
          let reloadFlag = false
          if (window.opener && isFolderManage(window.opener.location.pathname)) {
            window.opener.location.reload()
            reloadFlag = true
          }
          // ani.success(() => {
          // opener为精选集列表页，则刷新opener并关闭当前页面
          if (isFolderManage(window.location.pathname)) {
            self.props.delFolder && self.props.delFolder(self.props.editIndex)
            self.closePop()
          } else if (reloadFlag) {
            window.close()
          } else {
            window.location.href = '/users/favorite-view'
          }
          // })
        })
      }
    })
  }

  // 展开选择标签面板
  handleFolderTagShow(status) {
    this.setState({
      showFolderTagPanel: status,
    })
  }

  // 设置标签数据
  setSelectTag(tagList) {
    this.setState({
      tagList
    })
  }

  // 展开更多内容
  handleMore() {
    let {moreInfo} = this.state
    this.setState({
      moreInfo: !moreInfo
    })
  }

  closePop() {
    this.state.closeBody && base.bodyScroll(true)
    let el = ReactDOM.findDOMNode(this)
    el.parentNode.removeChild(el)
    delete this
  }

  render() {
    const {name, isPrivate, tagList, intro, introL, systemTag, moreInfo} = this.state
    const {mode} = this.props
    let options = [{
      text: <span>公开<span className="gray">(受欢迎的公开精选集会被推荐)</span></span>,
      value: 0
    }, {
      text: <span>私密 <span className="gray">(仅自己可见)</span></span>,
      value: 1
    }]
    return (
      <div id="set-folder-pop-panel">
        <div className="set-folder-pop-panel">
          <i className="iconfont cancel-pop" onClick={this.closePop.bind(this)}/>
          <div className="set-folder-pop-header">
            {mode === 'new' ? '新建精选集' : '精选集设置'}
          </div>
          <div className="set-folder-pop-content">
            <div className="content-item">
              <div className="title">精选集名称</div>
              <div>
                <input type="text"
                  value={name}
                  placeholder="输入精选集名称"
                  ref="input-name"
                  onChange={this.handleInputName.bind(this)}
                />
              </div>
            </div>
            <div className="content-item">
              <div className="title">状态</div>
              <div>
                <RadioGroup options={options}
                  value={isPrivate}
                  onChange={this.handlePrivate.bind(this)}
                />
              </div>
            </div>
            <div className={classNames('more-info', {'show': moreInfo})}>
              <div className="content-item">
                <div className="title">标签<span className="gray">（选填）</span></div>
                <ul className="input-panel tag-list">
                  {tagList.map((tag, index) => {
                                        let key = `tag-${index}`
                                        return <li key={key}># {tag}</li>
                                    })}
                  <li key='tag-add'
                    className="tag-add"
                    onClick={this.handleFolderTagShow.bind(this, true)}
                  >
                    {tagList.length === 0 ? '选择' : '修改'}标签
                  </li>
                </ul>
              </div>
              <div className="content-item">
                <div className="title">描述<span className="gray">（选填）</span></div>
                <div className="input-panel">
                  <textarea value={intro}
                    placeholder="输入描述"
                    ref="textarea-intro"
                    onChange={this.handleInputIntro.bind(this)}
                  />
                  <span className={classNames('word-tip', {
                                        'red': introL > 260
                                    })}
                  >{introL}
                  </span>
                </div>
              </div>
            </div>
            <div className={classNames('more-info-control', {'up': moreInfo})}
              onClick={this.handleMore.bind(this)}
            >
              {moreInfo ? '收起' : '添加'}更多信息
              <Icon type="shouqi"/>
            </div>
          </div>
          <div className="set-folder-pop-footer">
            {mode === 'edit' &&
            <button
              className="btn btn-animation btn-block btn-round btn-default btn-effect-gray btn-delete-folder"
              ref="btn-delete"
              onClick={this.handleDelete.bind(this)}
            >删除精选集
            </button>}

            <button className={classNames('btn btn-animation btn-block btn-round btn-effect float-r', {
                            'btn-gradient-blue': name,
                            'btn-disabled ': !name,
                        })}
              ref="btn-edit"
              onClick={this.handlePost.bind(this)}
            >
              {mode === 'edit' ? '确定' : '新建'}
            </button>
            <button className="btn btn-block btn-round btn-default btn-effect-gray float-r"
              onClick={this.closePop.bind(this)}
            >取消
            </button>
          </div>
          <FolderTagList back={this.handleFolderTagShow.bind(this, false)}
            setSelectTag={this.setSelectTag.bind(this)}
            show={this.state.showFolderTagPanel}
            systemTag={systemTag}
            tagList={tagList}
          />
        </div>
      </div>
    )
  }
}

export default SetFolderPop