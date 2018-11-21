import classNames from 'classnames'
import base from '../../common/baseModule'
import { Button } from './LoginBase'

class SelectTag extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      tags: [],
      selectNum: 0,
      footerText: this.selectFooter(props.mode),
      closeBody: false
    }
  }

  componentDidMount() {
    // 锁定浮层下层
    this.state.closeBody = window.isBodyScroll
    window.isBodyScroll && base.bodyScroll(false)
    this.getTagList()
  }

  getTagList() {
    let self = this
    base.ajaxList.basic({
      'type': 'GET',
      'url': `${base.baseUrl}/tag/list/user`
    }, (d) => {
      self.setState({
        tags: self.preData(d.result),
        selectNum: self.props.hasSelect ? self.props.hasSelect.length : 0
      })
    })
  }

  selectFooter(mode) {
    if (mode === 'login') {
      return '进入DeepFashion'
    }
    if (mode === 'edit') {
      return '完成修改'
    }
    return '进入DeepFashion'
  }

  preData(data) {
    return data.map((group) => {
      let { content, childList } = group
      let newChildList = childList.map((tag) => {
        let tag_content = tag.content
        let tagId = ''

        // 比对已选数据
        if (this.props.hasSelect && this.props.hasSelect.length > 0) {
          let cache = this.props.hasSelect.filter((tag) => {
            return tag.content === tag_content
          })
          // cache.length === 1 && (tagId = cache[0].id)
          if (cache.length === 1) {
            tagId = cache[0].id
          }
        }

        return {
          id: tagId || '',
          content: tag_content,
          select: !!tagId, // 选中状态
        }
      })

      return {
        content,
        childList: newChildList
      }
    })
  }

  handleTag(index_g, index_t) {
    let { tags, selectNum } = this.state
    let tag = tags[index_g].childList[index_t]

    if (selectNum < 5) {
      tag.select = !tag.select
    } else {
      if (!tag.select) {
        return
      }
      tag.select = false
    }

    this.setState({
      tags,
      selectNum: tag.select ? ++selectNum : --selectNum
    })
  }

  handleConfirm() {
    if (this.state.selectNum === 0) {
      return
    }

    let result = []

    // 过滤操作次数为奇数的tag，并组装后端需要格式
    this.state.tags.forEach((group) => {
      group.childList.forEach((tag) => {
        if (tag.select) {
          result.push({
            id: '',
            type: group.content,
            content: tag.content
          })
        } else if (tag.id) {
          result.push({
            id: tag.id,
            type: group.content,
            content: tag.content
          })
        }
      })
    })

    console.log('result', result)

    // 注册流程跳登录成功页
    if (this.props.mode === 'login') {
      base.eventCount.add(1063, {
        '用户ID': base.LS().id,
        '选择标签': result
      })
      this.ajaxLogin(result)
    }

    if (this.props.mode === 'edit') {
      this.ajaxEdit(result)
    }
  }

  ajaxLogin(tags) {
    let self = this

    base.ajaxList.basic({
      'type': 'POST',
      'url': `${base.baseUrl}/user/tag/save`,
      'contentType': 'application/json',
      'dataType': 'json',
      'data': JSON.stringify(tags)
    }, () => {
      base.eventCount.add(1033, {
        '选择数量': tags.length
      })
      self.props.onFinish()
    })
  }

  ajaxEdit(tags) {
    let self = this

    if (tags.length === 0) {
      self.close()
      self.props.onFinish()
      return
    }

    base.ajaxList.basic({
      'type': 'POST',
      'url': `${base.baseUrl}/user/tag/modify`,
      'contentType': 'application/json',
      'dataType': 'json',
      'data': JSON.stringify(tags)
    }, (d) => {
      base.eventCount.add(1035, {
        '页面来源': '设置',
        '选择数量': tags.length
      })
      d.success && self.close()
      self.props.onFinish()
    })
  }

  close() {
    this.state.closeBody && base.bodyScroll(true)
    let el = ReactDOM.findDOMNode(this)
    el.parentNode.removeChild(el)
    delete this
  }

  backPrevPage() {
    this.props.changeStep(4)
  }

  render() {
    const { mode } = this.props
    const { tags, selectNum, footerText } = this.state
    return (
      <div className="login-panel login-panel-10" ref={el => this.selectTag = el}>
        <div className="login-panel-tag-header">
          {
            mode === 'login' && <Button type='wechat-to-phone' handleClick={this.backPrevPage.bind(this)}>返回上一页</Button>
          }
          <div className={classNames('personal-job-header', {
            'setting': mode === 'edit'
          })}
          >
            您的设计偏好
          </div>
        </div>
        <div className="tag-wrapper">
          <div className="tag-wrapper-scroll">
            <div className="personal-job-intro">
              选择真实的身份及设计偏好，我们将努力为你推荐<br />更适合你的时尚图片
            </div>
            {
              tags.map((group, index_g) => {
                let key_g = `group-${index_g}`
                return (
                  <div key={key_g} className="tag-pane">
                    <div className="left-pane">{group.content}</div>
                    <div className="right-pane">
                      <ul className='login-tag'>
                        {group.childList.map((tag, index_t) => {
                          let key_t = `tag-${index_g}-${index_t}`
                          return (
                            <li key={key_t}>
                              <button className={classNames({ 'select': tag.select })}
                                onClick={this.handleTag.bind(this, index_g, index_t)}
                              >
                                {tag.content}
                              </button>
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  </div>
                )
              })
            }
          </div>
        </div>
        <div className="footer">
          <div className={classNames('footer-tip', { 'active': selectNum === 5 })}>
            最多可设置5个标签
          </div>
          <button ref="btn-finish"
            className={classNames('btn-round btn-animation', {
              'btn-black': selectNum > 0,
              'btn-grey': selectNum === 0,
            })}
            onClick={this.handleConfirm.bind(this)}
          >
            {footerText}
          </button>
        </div>
      </div>
    )
  }
}

export default SelectTag