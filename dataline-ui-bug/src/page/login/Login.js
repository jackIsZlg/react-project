/**
 * Created by gewangjie on 2018/3/7
 */
import React, { Component } from 'react';
import request from '../../base/request'
import { fakeAuth } from "../../base/auth";
import './style/Login.less';

class Login extends Component {
  constructor() {
    super()
    this.state = {
      status: 0,
      redirectToReferrer: false,
      addUserInfo: false
    };
  }
  componentDidMount() {
    if (fakeAuth.isAuthenticated) {
      this.loginSuccess()
      return
    }
    this.setState({
      status: 1
    }, () => {
      this.iframe.addEventListener('load', this.ssoRegister.bind(this), false);
      window.addEventListener('message', this.ssoCallBack.bind(this), false);
    })
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.ssoCallBack);
  }

  ssoRegister() {
    let type = this.props.match.params.type
    let data = { type }
    this.iframe.contentWindow.postMessage(data, '*');
  }

  ssoCallBack(e) {
    const self = this;
    const { type, data } = e.data;
    if (type !== 'sso-login') return;
    const { token, source, isAutoLogin } = data;
    localStorage.setItem('isAutoLogin', isAutoLogin)

    if (!token) return;

    request.basic(`auth/sso-entry?token=${token}`).then(() => {
      if (isAutoLogin) {
        localStorage.setItem('token', token)
        sessionStorage.setItem('token', '')
      } else {
        localStorage.setItem('token', '')
        sessionStorage.setItem('token', token)
      }
      // 注册用户
      if (source === 'register') {
        self.setState({
          addUserInfo: true
        });
        return;
      }
      // 登录用户
      self.loginSuccess();
    }, (d) => {
      if (d.errorCode === 'L17') {
        alert(d.errorDesc);
      }
    });
  }

  loginSuccess() {
    fakeAuth.authenticate(async () => {
      const router = this.props.history
      request.getUserInfo().then((d) => {
        for (let key in d) {
          localStorage.setItem(key, JSON.stringify(d[key]))
        }
        router.replace(d.userPlatformData.shopListCount ? '/dataline/shopwatch' : '/dataline/dataexpress')
      })
    })
  }

  render() {
    const {status} = this.state
    if (!status) {
      return null
    }
    // 未登录 => 登录面板
    return (
      <div className="login-page">
        <div className="login-wrapper">
          <i className='iconfont'>&#xe664;</i>
          <iframe ref={el => this.iframe = el} src={`${request.ssoUrl}/web/index.html`} frameBorder={0} title="登录"
            width={359}
            height={400} />
        </div>
      </div>
    )
  }
}

export default Login