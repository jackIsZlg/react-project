import classNames from 'classnames'
import base from '../../common/baseModule'
import QRCodeComponent from '../base/Qrcode'
import { LoginType, Button } from './LoginBase'

// 微信登录 or 注册
class WeixinLogin extends React.Component {
  constructor(props) {
    super(props)
    // 默认数据
    this.state = {
      // index_qr: 0,
      text: '',
      hidden: false,
      index: 1,
      time: 20
    }
    this.index_qr = 0
  }

  componentDidMount() {
    this.getQRCodeUrl()
  }

  // 组件被移除
  componentWillUnmount() {
    this.state.index = this.state.time
  }

  getQRCodeUrl() {
    let self = this
    $.ajax({
      url: `${base.baseUrl}/wechatStr`,
      type: 'GET',
      complete() {
        self.index_qr++
      }
    }).done((d) => {
      if (d.success) {
        self.setState({
          text: d.result
        }, () => {
          this.loopRequest()
        })
      } else {
        self.index_qr < self.state.time && self.getQRCodeUrl()
      }
    }).fail(() => {
      self.index_qr < self.state.time && self.getQRCodeUrl()
    })
  }

  changeStep(step) {
    this.props.changeStep(step)
  }

  isLogin() {
    let self = this
    $.ajax({
      url: `${base.baseUrl}/wechat/qrcode/status`,
      complete() {
        self.state.index++
      }
    }).done((response) => {
      if (!response.success || response.result.status === 0) {
        self.state.index !== self.state.time && setTimeout(self.isLogin.bind(self), 2000)
      }
      if (response.success && response.result.status === 1) {
        // 停止计时器
        self.state.index = self.state.time
        // 微信注册
        if (response.result.registerFlag * 1 === 1) {
          base.eventCount.add(1032)
          self.props.synchroData({
            avatar: response.result.user.avatar,
            nickname: response.result.user.name,
            sex: response.result.user.sex || 1
          })
          self.changeStep(8)
        } else {
          base.eventCount.add(1005)
          self.props.synchroData({
            avatar: response.result.user.avatar,
            nickname: response.result.user.name
          })
          self.changeStep(7)
        }
      }
      self.state.index === self.state.time && self.setState({
        hidden: true
      })
    }).fail(() => {
      self.state.index < self.state.time && self.isLogin.bind(self)
    })
  }

  loopRequest() {
    this.setState({
      hidden: false,
      index: 1,
      time: 20
    }, () => {
      this.isLogin()
    })
  }

  changeHidden() {
    this.setState({
      hidden: !this.state.hidden
    }, () => {
      this.loopRequest()
    })
  }

  // 销毁
  handleCancel() {
    if (/\/login/.test(window.location.pathname)) {
      return
    }
    this.state.index = this.state.time
    let el = this.wechatWrapper
    el.parentNode.removeChild(el)
    delete this
  }

  render() {
    return (
      <div className="login-panel login-panel-2" ref={el => this.wechatWrapper = el}>
        <LoginType style={{ textAlign: 'center' }} title='微信登录' />
        <div className="login-qr">
          {this.state.text && <QRCodeComponent text={this.state.text} size={245} />}
          <div className={classNames('reload ', {
            'hidden': !this.state.hidden
          })}
            onClick={this.changeHidden.bind(this)}
          />
        </div>
        <div className="wx-login">
          请使用微信扫描二维码登录
        </div>
        {/* <LoginFooter step={data.step} changeStep={this.changeStep.bind(this)} /> */}
        <div className="login-footer">
          <Button type='wechat-to-phone' handleClick={this.changeStep.bind(this, 3)}>手机号登录</Button>
          <span></span>
          <Button type='wechat-to-phone' handleClick={this.changeStep.bind(this, 1)}>账号密码登录</Button>
        </div>
      </div>
    )
  }
}

export default WeixinLogin