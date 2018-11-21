import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import classNames from 'classnames'
import {fakeAuth} from '../../base/auth'
import { Button, message } from 'antd'
import base from '../../base/baseMoudle'
import request from '../../base/request'
import logo from '../../image/newlogo.png'
import indexLogo from '../../image/index/logo.png'
import './CommonComponent.less'

// 图标
class Icon extends Component {
  render() {
    const _class = `iconfont icon-${this.props.type}`;
    return <i className={_class} title={this.props.title || ''} onClick={this.props.handleClick} />
  }
}

// 支付功能
class Payment extends Component {
  constructor() {
    super();
    this.state = {
      status: -1, // 显示状态
      data: [], // 所有购买类型
      payType: {}, // 购买商品类型
      onTrial: false,// 是否可试用
    }
  }

  componentDidMount() {
    this.testProbation();
  }

  // 检测是否具备试用的条件
  testProbation() {
    let self = this;
    request.basic('user/trial/service/qualification')
      .then(data => {
        data && this.getPackageList();
        self.setState({
          onTrial: data
        })
      }, data => {
        message.warning(data.errorDesc)
      });
  }

  // 获取商品list
  getPackageList() {
    let url = '',
      self = this;
    const { serviceId } = self.props;
    switch (serviceId) {
      case 100:
        url = 'trade/dataline-combo';
        break;
      case 102:
        url = 'trade/selection-combo';
        break;
      default:
    }
    request.basic(url)
      .then(data => {
        let list = base.dealListData(data);
        self.getPackageData(list);
      }, data => {
        message.warning(data.errorDesc)
      })
  }

  // 根据处理商品信息里的展示的时长
  getTimeStage(length) {
    switch (Math.round(length / 30)) {
      case 1:
        return '月';
      case 3:
        return '季';
      case 6:
        return '半年';
      case 12:
        return '年';
      default:
        return '月';
    }
  }

  // 处理商品信息
  dealData(data) {
    if (!data.length) {
      return;
    }
    data.map(item => {
      item.price = item.price / 100;
      item.timeStage = this.getTimeStage(item.serviceLength);
      return item
    });
    return data;
  }

  // 获取商品信息
  getPackageData(list) {
    let self = this,
      { status } = self.state;
    request.basic('trade/goods-set?idListStr=' + list)
      .then(data => {
        data = self.dealData(data);
        status = 0;
        self.setState({ data, status }, () => {
          self.backStatus();
        })
      }, data => {
        message.warning(data.errorDesc)
      });
  }

  // 重新刷新页面
  reloadPage() {
    window.location.reload();
  }

  // 点击试用
  handleTrial() {
    let self = this;
    const { serviceId } = self.props;
    request.basic('user/trial/service?serviceId=' + serviceId, {
      method: 'POST'
    })
      .then(data => {
        if (!data) {
          return
        }
        let packageDom = document.querySelector('#package');
        !!packageDom && packageDom.remove();
        self.reloadPage()
      }, data => {
        message.warning(data.errorDesc)
      })
  }

  // 点击购买商品
  handleBuy(obj) {
    let self = this,
      id = 0,
      callBack;
    request.basic(`trade/create-order?goodsId=${obj.goodsId}&count=1`, {
      method: 'POST'
    })
      .then(data => {
        id = data.longOrderId;
      }, data => {
        console.log(data.errorDesc)
      });
    callBack = setInterval(() => {
      !!id && self.setState({
        status: 1,
        payType: obj
      }, () => {
        clearInterval(callBack);
        window.open('/page/pay?orderId=' + id)
      })
    }, 400)
  }

  // 改变页面显示内容状态
  backPackage() {
    this.setState({
      status: 0
    })
  }

  // 按条件获取需要展示的页面
  backStatus() {
    let { status, data, payType, onTrial } = this.state,
      _list;
    switch (status) {
      case 0:
        let payItem = data.map((item, i) => (
          <div key={`item-${i}`} className="pay-item" onMouseEnter={() => { }}>
            <div className="wechat-img-wrap">
              <div className='wechat-title'>购买咨询</div>
              <div className="wechat-img" />
              <div className='wechat-msg-wrap'>
                <Button onClick={this.handleBuy.bind(this, item)}>点击购买</Button>
              </div>
            </div>
            <div className="pay-item-header">
              {item.name}<br />
              <span>{item.description}</span>
            </div>
            <div className="pay-price">
              <span>{item.price}</span> RMB / <em>{item.timeStage}</em>
            </div>
            <Button onClick={this.handleBuy.bind(this, item)}>点击购买</Button>
          </div>
        ));
        _list = <div id='pay-container' className={classNames({ 'pay-container': payItem.length > 4, 'pay-fullscreen': payItem.length <= 4 })}>
          <div className={classNames('pay-content', { 'max-4': payItem.length <= 4, 'min-4': payItem.length > 4 })}>
            <header>
              套餐购买<br />
              <span>购的越多，优惠越多</span>
              {onTrial &&
                <div className="pay-try">
                  <Button onClick={this.handleTrial.bind(this)} style={{ float: 'right' }}>试用7天</Button>
                </div>}
            </header>
            <div className="pay-package">
              {payItem}
            </div>
            <div className="contact-info">
              &nbsp;
                            {/* 咨询联系方式:18254639113 */}
            </div>
            {/* <div style={{display:'flex'}}>
                            <div style={{width:'50%'}}>
                                <header>套餐购买<br/>
                                <span>购的越多，优惠越多</span>
                                {onTrial &&
                                <div className="pay-try">
                                <Button onClick={this.handleTrial.bind(this)} style={{float: 'right'}}>试用7天</Button>
                                </div>}
                                </header>
                                    <div className="pay-package">
                                        {payItem}
                                    </div>
                            </div>
                            <div style={{width:'50%'}}>
                                <header>购买咨询</header>
                                <div className="wechat-img">
                                    <img  alt='' src='../../image/wechat.jpeg' />
                                </div> 
                            </div>
                        </div> */}
          </div>
        </div>
        break;
      case 1:
        _list = <div id='pay-container'>
          <div className='pay-content max-4 confirm'>
            <header>
              支付结果<br />
              <span>请确认你的支付结果</span>
            </header>
            <div className="pay-package">
              <div className="pay-result-header">
                <span>{payType.price}</span> RMB / {payType.timeStage} <em>{payType.description}</em>
              </div>
              <div className='confirm-pay'>
                是否支付成功？
                            </div>
              <Button onClick={this.reloadPage}>是</Button>
              <Button onClick={this.backPackage.bind(this)}>否</Button>
            </div>
          </div>
        </div>;
        break;
      case -1:
      default:
        _list = null
    }
    return _list
  }

  render() {
    return this.backStatus()
  }
}

// 大图预览功能
class PicturePreview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      src: props.src,
      width: props.picWidth,
      height: props.picHeight,
      zoomRatio: 1,//图片缩放比例
      rotate: 0,//旋转角度
      position: { l: 0, t: 0 },
      percentTipsVisible: false,//缩放百分比提示
      percentTips: false,
      transitionFlag: false
    };
    this.mouseWheelScroll = this.mouseWheelScroll.bind(this);
  }

  // 获取视口宽高
  getViewportSize() {
    this.screenWidth = document.documentElement.clientWidth;
    this.screenHeight = document.documentElement.clientHeight;
  }

  componentWillMount() {
    this.getViewportSize();
  }

  componentDidMount() {
    // 初始化位置
    this.setState({ position: this.initPosition() });
    // 初始化百分数
    this.initPercent();
    // 绑定滚轮事件
    this.bindMouseWheelEvent();
    // 添加监听视口尺寸改变的函数
    this.resizeSetting()
  }

  // 添加监听视口尺寸改变的函数
  resizeSetting() {
    let self = this;
    window.addEventListener('resize', () => {
      self.getViewportSize();
      self.setState({ position: self.initPosition() });
    }, false)
  }

  // 初始化图片位置
  initPosition() {
    let pos = {},
      { width, height } = this.state,
      r = width / height,
      offW = this.pictureEl.offsetHeight * r;

    pos.l = this.screenWidth / 2 - offW / 2;
    pos.t = this.screenHeight / 2 - this.pictureEl.offsetHeight / 2;
    return pos;
  }

  // 初始化百分比设置
  initPercent() {
    let that = this,
      { percentTipsVisible, percentTips } = that.state;

    clearTimeout(that.percent2);
    clearTimeout(that.percent1);

    percentTipsVisible = false;
    percentTips = false;
    that.setState({ percentTipsVisible, percentTips }, () => that.percentageHidden());
  }

  // 百分比消失
  percentageHidden() {
    let { percentTipsVisible, percentTips } = this.state,
      that = this;
    this.percent1 = setTimeout(() => {
      percentTipsVisible = true;
      that.setState({ percentTipsVisible }, () => {
        that.percent2 = setTimeout(() => {
          percentTipsVisible = false;
          percentTips = true;
          that.setState({ percentTipsVisible, percentTips })
        }, 3000)
      });
    }, 1500)
  }

  // 点击关闭按钮关闭弹窗
  closePicture() {
    this.unbindMouseWheelEvent();
    let mask = document.getElementById('pic-mask');
    document.body.removeChild(mask);
  }

  // 阻止冒泡
  stopPropagation(e) {

    let evt = e ? e : window.event;

    // W3C: evt.stopPropagation()  IE: evt.cancelBubble = true
    evt.stopPropagation ? evt.stopPropagation() : evt.cancelBubble = true;
  }

  // 旋转图片
  turnRight(e) {

    e.stopPropagation();

    let that = this,
      { rotate } = this.state;

    that.setState({
      position: that.initPosition()
    }, () => {
      rotate = rotate + 90;
      this.setState({ rotate });
    })

  }

  // 缩放图片，100%查看
  zoomImage(type = '') {

    let that = this,
      { zoomRatio } = that.state,
      ratio = 1.03,
      pic = that.pictureEl;

    that.setState({
      position: that.initPosition()
    }, () => {
      that.initPercent();

      switch (type) {
        case 'enlarge':
          zoomRatio = zoomRatio * ratio;
          break;
        case 'narrow':
          zoomRatio = zoomRatio / ratio;
          break;
        default:
          zoomRatio = 1;
          break;
      }

      if (zoomRatio >= 3) {
        zoomRatio = 3;
      }

      if (zoomRatio <= 0.2) {
        zoomRatio = 0.2;
      }

      that.setState({ zoomRatio }, () => {
        if (that.state.zoomRatio <= 1) {
          pic.onmousedown = null;
          return;
        }

        that.bindMouseMoveEvent();

      });
    })

  }

  bindMouseMoveEvent() {

    let that = this,
      picX = 0,
      picY = 0,
      picEl = that.pictureEl;

    picEl.onmousedown = (e) => {
      e.preventDefault();

      let { position, transitionFlag } = that.state,
        { l, t } = position,
        picSize = picEl.getBoundingClientRect();

      transitionFlag = true;

      that.setState({ transitionFlag }, () => {
        //鼠标在图片中的位置
        picX = e.clientX;
        picY = e.clientY;

        picEl.onmousemove = (e) => {
          e.preventDefault();

          let x = e.clientX - picX,
            y = e.clientY - picY;

          position.l = l + x;
          position.t = t + y;

          let // 相对100%图片偏移量
            cx = picSize.top - t,
            cy = picSize.left - l,
            // 图片在浏览器中的位置
            top = position.t + cx,
            left = position.l + cy;

          if (top <= this.screenHeight / 2 - picSize.height) {
            position.t = this.screenHeight / 2 - picSize.height - cx;
          }

          if (top >= this.screenHeight / 2) {
            position.t = this.screenHeight / 2 - cx;
          }

          if (left <= this.screenWidth / 2 - picSize.width) {
            position.l = -(picSize.width - this.screenWidth / 2) - cy;
          }
          if (left >= this.screenWidth / 2) {
            position.l = this.screenWidth / 2 - cy;
          }

          that.setState({ position });

        };
        document.onmouseup = () => {
          this.setState({
            transitionFlag: false
          }, () => picEl.onmousemove = null)
        }
      })

    };
  }

  //滚轮事件
  mouseWheelScroll(e) {

    e.preventDefault();

    let _delta = parseInt((e.wheelDelta || -e.detail), 10);

    _delta > 0 ? this.zoomImage('enlarge') : this.zoomImage('narrow');
  }

  //绑定鼠标滚轮事件
  bindMouseWheelEvent() {

    let MOUSE_WHEEL_EVENT = navigator.userAgent.indexOf("Firefox") > -1 ? "DOMMouseScroll" : "mousewheel";


    if (document.attachEvent) {
      document.body.attachEvent("on" + MOUSE_WHEEL_EVENT, this.mouseWheelScroll);
    } else if (document.addEventListener) {
      document.body.addEventListener(MOUSE_WHEEL_EVENT, this.mouseWheelScroll, false);
    }
  }

  //解除鼠标滚轮事件
  unbindMouseWheelEvent() {
    let MOUSE_WHEEL_EVENT = navigator.userAgent.indexOf("Firefox") > -1 ? "DOMMouseScroll" : "mousewheel";

    if (document.attachEvent) {
      document.body.detachEvent("on" + MOUSE_WHEEL_EVENT, this.mouseWheelScroll);
    } else if (document.addEventListener) {
      document.body.removeEventListener(MOUSE_WHEEL_EVENT, this.mouseWheelScroll);
    }
  }

  render() {

    let { src, zoomRatio, rotate, percentTipsVisible, percentTips, position, transitionFlag } = this.state,
      { l, t } = position,
      style = {
        'transform': `rotate(${rotate}deg) scale(${zoomRatio})`,
        'transition': `all ${transitionFlag ? '0s' : '.2s'} linear`,
        'top': t + 'px',
        'left': l + 'px'
      },
      ratio = Math.round(zoomRatio * 100);


    return (
      <div id='picturePreview-container'>
        <Icon type='close-collect' handleClick={this.closePicture.bind(this)} />
        <div className="picturePreview-container-up" onClick={this.closePicture.bind(this)}>
          <img ref={el => this.pictureEl = el} src={src} className="picturePreview-pic" style={style}
            onClick={this.stopPropagation.bind(this)} alt='' />
          <div ref='percentage'
            className={classNames('picturePreview-percentage', {
              'picturePreview-hidden': percentTipsVisible,
              'no-percentage': percentTips
            })}
            onClick={this.stopPropagation.bind(this)}>{ratio}&nbsp;%
                    </div>
        </div>
        <div className="picturePreview-container-down">
          <Icon type='full' title='100%显示' handleClick={this.zoomImage.bind(this)} />
          <Icon type='fangda' title='放大' handleClick={this.zoomImage.bind(this, 'enlarge')} />
          <Icon type='suoxiao1' title='缩小' handleClick={this.zoomImage.bind(this, 'narrow')} />
          <Icon type='rotate' title='向右旋转' handleClick={this.turnRight.bind(this)} />
        </div>
      </div>
    )
  }
}

// 头部
class Header extends Component {
  state = {
    login: false
  }
  async componentWillMount() {
    // const res = await request.isLogin()
    this.setState({ login: fakeAuth.isAuthenticated })
  }
  renderLogin() {
    const { showContact } = this.props
    const { login } = this.state
    const p = <li className="login-header-list-item contact">联系我们
      <div className={classNames('login-list-content', { 'visible': showContact })}>
        {/* <div className="login-list-hot-line line">
          <div className="hot-line-header">咨询热线</div>
          <div className="hot-line-text"><span>400-853-9999</span>咨询高峰期请耐心等待</div>
        </div> */}
        <div className="login-list-hot-line">
          <div className="hot-line-header">微信客服咨询</div>
          <div className="hot-line-text">请使用微信扫一扫，扫码即可人工咨询服务</div>
          <div className="login-footer-code"></div>
        </div>
      </div>
    </li>
    if (!login) {
      return <ul className="login-header-list">
        <li className="login-header-list-item"><a target="_black" href="https://www.deepfashion.cn">Deepfashion</a></li>
        {p}
        <li className="login-header-list-item"><Link to="/index/login">登录</Link></li>
        <li className="login-header-list-item"><Link className="register" to="/index/register">注册账号</Link></li>
      </ul>
    } else {
      return <ul className="login-header-list">
        {p}
        <li className="login-header-list-item">{this.props.rightSolt}</li>
      </ul>
    }
  }
  render() {
    let { type, noFixed, isTransparent } = this.props
    return (
      <div className={classNames('login-header', { 'fixed': !noFixed, 'white': type ,'is-transparent':isTransparent})}>
        <div className="login-header-logo">
          <div className="logo">
            <img src={isTransparent ? indexLogo : logo} alt='logo' />
          </div>
        </div>
        {this.renderLogin()}
      </div>
    )
  }
}

// 尾部
class Footer extends Component {
  render() {
    let { noFixed } = this.props
    return (
      <div className={classNames('login-footer', { 'fixed': !noFixed })}>
        <div className="login-footer-contact">
          <div className="login-footer-code-wrapper">
            <div className="login-footer-code"></div>
            <div className="login-footer-code-text">
              联系我们:<br /><span>微信扫码咨询</span>
                            </div>
          </div>
          <div className="login-footer-state">
            ©杭州知衣科技有限公司   浙ICP备18010474号
            {/* <ul className="login-footer-state-all">
              <li className="login-footer-state-item">
                关于我们
                                </li>
              <li className="login-footer-state-item">
                服务条款
                                </li>
              <li className="login-footer-state-item">
                ©知衣科技 浙ICP备13037466号
                                </li>
            </ul> */}
          </div>
        </div>
      </div>
    )
  }
}

export {
  Icon,
  Payment,
  PicturePreview,
  Header,
  Footer
}