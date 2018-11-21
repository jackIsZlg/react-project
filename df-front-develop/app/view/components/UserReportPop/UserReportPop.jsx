/**
 * Created by gewangjie on 2017/8/8
 */

import classNames from 'classnames'
import base from '../../common/baseModule'

$('#app').append('<div id="user-report-pop-wrapper"></div>')

class UserReportPop extends React.Component {
  constructor(props) {
    super(props)
    // 默认数据
    this.state = {
      isLogin: false,
      hidden: true,
      content: ''
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
      this.init()
    } else {
      this.setState({
        hidden: true
      })
    }
  }

  init() {
    this.setState({
      isLogin: true,
      content: '',
      hidden: false
    })
  }

  // 判断登陆
  isLogin() {
    let self = this
    base.request({
      'type': 'GET',
      'url': `${base.baseUrl}/users/login-state`
    }).done((d) => {
      if (d.success) {
        d.result * 1 !== 0 && self.init()
      }
    }).fail()
  }

  // 关闭弹窗
  closePop(cb) {
    this.setState({
      hidden: true
    }, () => {
      typeof cb === 'function' && cb()
    })
  }

  // 输入
  handleTextArea(e) {
    let val = e.target.value
    this.setState({
      content: val
    })
  }

  // 提交数据
  postData() {
    let self = this
    let el = self.refs['btn-post']
    let ani = base.animationBtn(el)
    // 用户无输入
    if (!self.state.content) {
      console.log('空数据')
      return
    }
    ani.loading()

    base.ajaxList.basicLogin({
      type: 'GET',
      url: `${base.baseUrl}/feedback`,
      data: {
        content: self.state.content
      }
    }, () => {
      ani.success(() => {
        self.closePop()
        df_alert({
          mainText: '成功提交反馈意见',
        })
      })
    }, ani.cancel)
  }

  render() {
    return (<div id="user-report-pop-panel" className={classNames({'hidden': this.state.hidden})}>
      <div className="user-report-pop-panel">
        <i className="iconfont cancel-pop" onClick={this.closePop.bind(this)}/>
        <div className="user-report-pop-header">
                    提交反馈
        </div>
        <div className="user-report-pop-content">
          <div className="report-textarea">
            <div className="textarea-pane">
              <textarea value={this.state.content}
                placeholder="告诉我们您的建议或者您遇到的问题"
                onChange={this.handleTextArea.bind(this)}
              />
            </div>
            <button ref="btn-post"
              onClick={this.postData.bind(this)}
              className={classNames(
'btn btn-round btn-red btn-to-post btn-animation',
                                    {'null': !this.state.content}
)}
            >
                            提交
            </button>
          </div>
          <div className="clearfix"/>
        </div>
      </div>
            </div>)
  }
}

export default UserReportPop