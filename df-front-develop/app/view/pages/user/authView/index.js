/**
 * Created by gewangjie on 2017/12/6
 */
import base from '../../../common/baseModule'
import classNames from 'classnames'
import QRCodeComponent from '../../../components/base/Qrcode'

const authUrl = AuthUrl || ''
const redirectUrl = RedirectUrl || ''

class AuthPane extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      text: authUrl, // 授权Url
      success: 0, // 授权成功
      current: 1, // 当前轮询次数
      count: 20, // 轮询上线
      timeout: 2000, // 轮询间隔
      hidden: true // 二维码遮罩层
    }
  }

  componentDidMount() {
    this.isLogin()
    this.getAuth()
  }
  getAuth() {
    $.ajax({ url: `${base.baseUrl}/user/auth/get-auth-url` })
      .done((response) => {
        if (response.success) { window.location.href = response.result.authUrl || response.result.redirectUrl }
      })
  }
  isLogin() {
    let self = this
    $.ajax({
      url: `${base.baseUrl}/user/auth/success`,
      complete() {
        self.state.current++
      }
    }).done((response) => {
      if (!response.success || response.result === 0) {
        self.state.current !== self.state.count
                && setTimeout(self.isLogin.bind(self), self.state.timeout)
      }
      if (response.success && response.result === 1) {
        // 停止计时器
        self.state.current = self.state.count
        // 授权成功

        self.setState({
          success: 1
        })
      }

      self.state.current === self.state.count && self.setState({
        hidden: false
      })
    }).fail(() => {
      self.state.current < self.state.count && self.isLogin.call(self)
    })
  }

  loopRequest() {
    this.setState({
      hidden: true,
      current: 1,
    }, this.isLogin)
  }

  authSuccess() {
    location.href = base.base64decode(redirectUrl)

    // setTimeout(() => {
    // console.log(redirectUrl);
    // location.href = base.base64decode(redirectUrl);
    // }, 5000)
  }

  changeHidden(e) {
    this.setState({
      hidden: true
    }, this.loopRequest)
  }

  render() {
    const {text, success, hidden} = this.state

    if (success) {
      return (
        <div className="auth-pane container">
          <div className="title">绑定成功！</div>
          <div className="tips middle">
                        你已成功授权绑定微信服务号，现已可以正常使用。<br/>
                        感谢你对deepfashion的支持！
          </div>
          <div className="qr">

          </div>
          <div className="tips small href"
            onClick={this.authSuccess.bind(this)}
          >
                        返回
          </div>
        </div>
      )
    }
    return (
      <div className="auth-pane container">
        <div className="title">服务号升级啦！</div>
        <div className="tips middle">
                    亲爱的用户，为了让大家获得更好的浏览体验，
                    我们升级了DeepFashion服务号，
                    请微信扫码进行绑定授权，
                    若绑定后页面没有响应，
                    请刷新后重试。
        </div>
        <div className="qr">
          {this.state.text && <QRCodeComponent text={text}
            correctLevel={1}
            size={170}
          />}
          <div className={classNames('cover', {hidden})}
            onClick={this.changeHidden.bind(this)}
          />
        </div>
        <div className="tips small">
                    扫描二维码绑定
        </div>
      </div>
    )
  }
}

ReactDOM.render(
  <AuthPane/>,
  document.getElementsByClassName('auth-wrapper')[0]
)

