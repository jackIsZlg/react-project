import classNames from 'classnames'
import base from '../../common/baseModule'
import {VerifiedIcon} from '../base/baseComponents'

let dealNum = (num) => {
  if (num < 10000) {
    return num
  }
  return `${Math.round(num / 10000)}万`
}

$('#app').append('<div id="import-ins-pop-wrapper"></div>')

class ConfirmInsPanel extends React.Component {
  constructor(props) {
    super(props)
  }

  handleCheck() {
    let self = this
    let btn = self.refs['btn-post']
    let ani = base.animationBtn(btn)

    ani.loading()
    const {insBloggerId, followNum, insName: account} = self.props
    $.ajax({
      'type': 'GET',
      'url': `${base.baseUrl}/ins/blogger/import`,
      'data': {
        insBloggerId, account, followNum
      }
    }).done((d) => {
      if (!d.success) {
        ani.cancel()
        return
      }
      ani.success(() => {
        base.eventCount.add(1024)

        self.props.editSuccess && self.props.editSuccess(self.props.insName)
        self.props.closePop()
      })
    }).fail(() => {
      ani.cancel()
    })
  }

  handleCancel() {
    this.props.synchroData({
      status: 1
    })
  }

  render() {
    console.log(this.props)
    let bgStyle = {
      'backgroundImage': `url(${base.insHeadImg(this.props.headImg)}`
    }
    return (
      <div className="import-ins-pop-content confirm-panel">
        <div className="import-ins-tip">
          确定读取该instagram账号的关注列表？
          <ol>
            <li>一个DeepFashion账号只可读取一个instagram账号的关注列表</li>
            <li>约一天内读取完毕</li>
          </ol>
        </div>
        <div className="user-info">
          <div className="avatar"
            style={bgStyle}
          />
          <div className="pane-r">
            <div className="uname one-line">{this.props.insName}</div>
            <VerifiedIcon isVerified={this.props.isVerified}/>
            <div className="fans-num">粉丝数 <span>{dealNum(this.props.fansNum)}</span></div>
          </div>
        </div>
        <div className="import-ins-pop-footer">
          <button className="btn btn-round btn-block btn-default"
            onClick={this.handleCancel.bind(this)}
          >
            取消
          </button>
          <button className="btn btn-round btn-block btn-animation btn-gradient-deep-blue"
            ref="btn-post"
            onClick={this.handleCheck.bind(this)}
          >
            确认
          </button>
        </div>
      </div>
    )
  }
}

class EditInsPanel extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      insName: this.props.insName
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.insName !== this.props.insName) {
      this.setState({
        insName: nextProps.insName
      })
    }
  }

  handleInput(e) {
    // 限制中文
    this.setState({
      insName: e.target.value.replace(/[\u4e00-\u9fa5]/g, '')
    })
  }

  handleKeyDown(e) {
    if (e.keyCode !== 13) {
      return
    }
    this.handleClick()
  }

  handleClick() {
    let insName = this.state.insName.trim()
    let el = this.refs.insName
    if (!insName) {
      return
    }
    if (insName.length > 30) {
      new base.warningTip(el, '账号应为1-30个字符')
      return
    }
    this.getInsInfo(insName)
  }

  getInsInfo(insName) {
    let self = this
    let el = self.refs.insName
    let btn = self.refs['btn-ins-name']
    let ani = base.animationBtn(btn)

    ani.loading()
    $.ajax({
      'type': 'GET',
      'url': `${base.baseUrl}/ins/blogger/detail`,
      'data': {
        'account': insName,
      }
    }).done((d) => {
      if (!d.success) {
        ani.cancel()
        d.errorCode === 'D10' && new base.warningTip(el, '请输入正确的ins账号')
        return
      }

      if (d.result.isPrivate) {
        ani.cancel()
        new base.warningTip(el, '该账号为私密账号，请取消私密后重试')
        return
      }

      ani.success(() => {
        base.eventCount.add(1012, {
          'ins用户名': insName
        })

        // 回调给父组件insInfo，修改显示逻辑
        d.result.status = 2
        d.result.insName = d.result.nickname
        delete d.result.nickname

        self.props.synchroData(d.result)
      })
    }).fail(() => {
      ani.cancel()
    })
  }

  render() {
    return (
      <div className="import-ins-pop-content edit-panel">
        <div className="import-ins-tip">
          将您的instagram关注列表读取到DeepFashion中
        </div>
        <div className="edit-ins-name">
          <input type="text"
            ref="insName"
            placeholder="输入您的ins账号"
            onKeyDown={this.handleKeyDown.bind(this)}
            onChange={this.handleInput.bind(this)}
            value={this.state.insName}
          />
        </div>
        <div className="import-ins-pop-footer">
          <button className={classNames('btn btn-round btn-block btn-animation btn-post-name', {
            'btn-gradient-deep-blue': this.state.insName,
            'btn-disabled': !this.state.insName
          })}
            ref="btn-ins-name"
            onClick={this.handleClick.bind(this)}
          >确认
          </button>
        </div>
      </div>
    )
  }
}

class ImportIns extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      status: 1,
      insName: this.props.insName || '',
      fansNum: 0,
      headImg: '',
      isVerified: false,
      insBloggerId: 0,
      isPrivate: false,
      closeBody: false,
      followNum: 0
    }
  }

  // 第一次渲染前调用
  componentWillMount() {
    // 未传递insName,则获取
    this.props.insName === undefined && this.getData()
    this.init()
  }

  init() {
    // 锁定浮层下层
    this.state.closeBody = window.isBodyScroll
    window.isBodyScroll && base.bodyScroll(false)
  }

  // 获取数据
  getData() {
    let self = this
    base.ajaxList.getInsAccount((d) => {
      self.setState({
        insName: d.result.insAccount,
        status: d.status === 4 ? 4 : 1
      })
    })
  }

  // 同步数据
  synchroData(options, cb) {
    let _data = this.state
    for (let i in options) {
      _data[i] = options[i]
    }
    this.setState(_data, () => {
      cb && cb()
    })
  }

  closePop() {
    this.state.closeBody && base.bodyScroll(true)

    let el = ReactDOM.findDOMNode(this)
    el.parentNode.removeChild(el)
    delete this
  }

  _render() {
    let _compoment
    switch (this.state.status) {
      case 1:
        _compoment = (<EditInsPanel insName={this.state.insName}
          synchroData={this.synchroData.bind(this)}
        />)
        break
      case 2:
        _compoment = (<ConfirmInsPanel {...this.state}
          synchroData={this.synchroData.bind(this)}
          editSuccess={this.props.editSuccess}
          closePop={this.closePop.bind(this)}
        />)
        break
      // case 3:
      //     _compoment = <WaitInsPanel changeStatus={this.changeStatus.bind(this)}
      //                                closePop={this.closePop.bind(this)}/>;
      //     break;
      default:
        _compoment = (<EditInsPanel insName={this.state.insName}
          synchroData={this.synchroData.bind(this)}
          closePop={this.closePop.bind(this)}
        />)
    }
    return _compoment
  }

  render() {
    return (
      <div id="import-ins-pop-panel">
        <div className="import-ins-pop-panel">
          <i className="iconfont cancel-pop" onClick={this.closePop.bind(this)}/>
          <div className="import-ins-pop-header">
            读取ins关注列表
          </div>
          {this._render()}
        </div>
      </div>
    )
  }
}

// 临时废弃
class WaitInsPanel extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="import-ins-pop-content">
        <div className="import-ins-tip vt">
          我们正在同步您的instagram账号信息，同步时间约为
          <span className="red">1天</span>，完成后会根据您的账号信息，为您推荐博主。
          <br/> <br/>
          {/* (时间从您保存ins账号开始计算) */}
        </div>
      </div>
    )
  }
}

export default ImportIns