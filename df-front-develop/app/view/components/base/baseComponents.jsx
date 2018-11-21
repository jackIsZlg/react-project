/**
 * Created by gewangjie on 2017/5/25.
 */
import classNames from 'classnames'
import base from '../../common/baseModule'

// DFIcon
class Icon extends React.Component {
  render() {
    const _class = `iconfont icon-${this.props.type}`
    return <i className={_class} title={this.props.title || ''} onClick={this.props.handleClick}/>
  }
}

// RadioGroup
class RadioGroup extends React.Component {
  render() {
    const {options, value, onChange} = this.props
    return (
      <div className="df-radio-group">
        {
          options.map((option, index) => {
            let key = `df-radio-${index}`
            return (<Radio key={key}
              {...option}
              selectValue={value}
              onChange={onChange}
            />)
          })
        }
      </div>
    )
  }
}

// Radio
class Radio extends React.Component {
  onRadioChange(value) {
    console.log('radio', value)
    this.props.onChange(value)
  }

  render() {
    const {text, selectValue, value} = this.props

    return (
      <label className="df-radio-wrapper" onClick={this.onRadioChange.bind(this, value)} >
        <span className={classNames('df-radio', {checked: selectValue === value})}>
          <span className="df-radio-inner"/>
        </span>
        <span>{text}</span>
      </label>
    )
  }
}

// 精选集选择弹窗提示
class TitleWarning extends React.Component {
  render() {
    let _hasFolder = ''
    if (this.props.data && this.props.data.length > 0) {
      let name = []
      this.props.data.forEach((d) => {
        name.push(d.name)
      })
      _hasFolder = <div className="title-warning warning">此图片已存在于 {name.join('、')} 精选集内！</div>
    }
    return _hasFolder || null
  }
}

class TipWarning extends React.Component {
  render() {
    let tip = ''
    let type = this.props.type
    let _class = classNames('tip-warning', 'warning', {
      show: type !== 0
    })
    type === 1 && (tip = '名字重复，请重新输入')
    type === 2 && (tip = '不能超过15个字符')
    return <div className={_class}>{tip}</div>
  }
}

// 认证icon
class VerifiedIcon extends React.Component {
  render() {
    if (!this.props.isVerified) {
      return null
    }
    return <Icon type="ins-verified" title="instagram官方认证"/>
  }
}

// 私密博主icon，读取中状态
class SpiderStatusIcon extends React.Component {
  render() {
    if (this.props.spiderStatus === 1) {
      return <div className="icon-spider icon-blogger-private">私密</div>
    }

    if (this.props.spiderStatus === 0) {
      return <div className="icon-spider icon-blogger-loading">读取中</div>
    }

    return null
  }
}

// 精选集共享Icon
function FolderShareIcon(props) {
  if (props.shared !== 1 && props.shared !== 4) {
    return <div className="icon-share-folder"/>
  }

  return null
}

// 精选集私密Icon
function FolderPricateIcon(props) {
  return props.isPrivate ? <div className="icon-private-folder"/> : null
}

// 图片抓取状态
class FetchStatus extends React.Component {
  render() {
    // 博主列表不需要
    if (this.props.wfType === 'followOwner') {
      return null
    }

    return (
      <div className={classNames('icon-fetch', {tip: this.props.tip})}>
        {this.props.fetch ?
          '已由DF用户订阅，并抓取内容' :
          '尚未被DF用户订阅，点击成为第一个订阅者'}
      </div>
    )
  }
}

// WFItem订阅按钮
class BtnFollow extends React.Component {
  componentDidMount() {
    this.getElementSize()
  }

  getElementSize() {
    let {getSize} = this.props
    getSize && getSize(this.followButton)
  }

  handleOver() {
    this.refs.btnToFan.innerHTML = '取消订阅'
  }

  handleOut() {
    this.refs.btnToFan.innerHTML = '已订阅'
  }

  handleClick() {
    this.props.handleFan()
  }

  isSubscribe() {
    return !!this.props.followId
  }

  render() {
    return this.isSubscribe() ?
      <button className="fan btn-follow"
        ref='btnToFan'
        // onMouseOver={this.handleOver.bind(this)}
        // onMouseOut={this.handleOut.bind(this)}
        onClick={this.handleClick.bind(this)}
      >
        已订阅
      </button>
      :
      <button className="btn-gradient-deep-blue btn-follow"
        ref={el => this.followButton = el}
        onClick={this.handleClick.bind(this)}
      >
        <Icon type="follow-blogger"/>订阅
      </button>
  }
}

// 导入ins关系按钮
class BtnExportIns extends React.Component {
  show() {
    base.eventCount.add(1023, {
      '来源页面': this.props.source
    })
    window.open('/users/ins/list')
    // location.href = '/users/ins/list';
    // ReactDOM.render(<ImportIns/>, document.getElementById('import-ins-pop-wrapper'));
  }

  render() {
    return (
      <button className="btn btn-show-import-ins btn-effect" onClick={this.show.bind(this)}>{this.props.text || '我的Ins关注列表'} </button>)
  }
}

// 查看推荐博主
class BtnAllRecom extends React.Component {
  show() {
    base.eventCount.add(1034, {
      '来源页面': this.props.source
    })
    window.open(`${base.baseUrl}/owner/recom/home`)
  }

  render() {
    return (
      <button className="btn btn-effect btn-recom-blogger"
        onClick={this.show.bind(this)}
      >
        {this.props.text || '查看所有推荐博主'}
      </button>)
  }
}

// 查找博主按钮
class BtnSearchBlog extends React.Component {
  show() {
    base.eventCount.add(1013, {
      '来源页面': this.props.source
    })
    window.location.href = '/search-view#/=&searchType=owner&searchValue='
  }

  render() {
    return (
      <button className="btn btn-search-owner" onClick={this.show.bind(this)}>
        {this.props.text || '查找博主'}
      </button>)
  }
}

// 下拉框
class Select extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      // 默认选中第一个
      selectedObj: props.value,
      dropFlag: false,
      backgroundColor: false
    }
  }

  componentDidMount() {
    let that = this
    if (that.props.value * 1 >= 0) {
      that.setState({
        selectedObj: that.props.value,
        backgroundColor: false
      })
    } else {
      that.setState({
        backgroundColor: true
      })
    }
  }

  // 点击下拉框：显示或取消下拉框
  dropDown() {
    this.setState({
      dropFlag: true
    })
    if (this.props.value >= 0) {
      this.setState({
        backgroundColor: true
      })
    } else if (this.state.selectedObj !== '-1') {
      this.setState({
        backgroundColor: false
      })
    }
  }

  dropUp() {
    this.setState({
      dropFlag: false
    })
    if (this.props.value >= 0) {
      this.setState({
        backgroundColor: false
      })
    } else if (this.state.selectedObj !== '-1') {
      this.setState({
        backgroundColor: true
      })
    }
  }

  liClick(val) {
    console.log(val)
    let stae = this.state
    stae.backgroundColor = !this.state.backgroundColor
    stae.selectedObj = val
    stae.dropFlag = !this.state.dropFlag

    this.setState(stae)
    const onChange = this.props.onChange
    onChange && onChange(val)
  }

  render() {
    let selectedOption = '请选择'
    let options = this.props.options && this.props.options.length ? this.props.options.map((v, i) => {
      let key = 0
      let value = ''
      for (let x in v) {
        key = x
        value = v[x]
      }

      if (key * 1 === this.state.selectedObj * 1) {
        selectedOption = value
      }
      return (
        <li key={i}
          className={key.toString() === this.state.selectedObj ? 'active' : null}
          onClick={this.liClick.bind(this, key)}
        >{value}
        </li>)
    }) : null


    return (
      <div className='df-select' onMouseEnter={this.dropDown.bind(this)} onMouseLeave={this.dropUp.bind(this)}>
        <div
          className={`df-select-selection ${this.state.dropFlag ? 'active' : null} ${this.state.backgroundColor ? null : 'backgroundColor'}`}
        >
          {selectedOption}
          <i className="iconfont"/>
        </div>
        <ul
          className={`df-select-down ${this.state.dropFlag ? 'active' : null} ${this.props.options.length < 5 ? 'max-select-height' : ''}`}
        >
          {options}
        </ul>
      </div>
    )
  }
}

export {
  Icon,
  RadioGroup,
  TitleWarning,
  TipWarning,
  VerifiedIcon,
  SpiderStatusIcon,
  FolderPricateIcon,
  FolderShareIcon,
  FetchStatus,
  BtnFollow,
  BtnExportIns,
  BtnAllRecom,
  BtnSearchBlog,
  Select
}