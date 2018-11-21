/**
 * Created by gewangjie on 2017/3/7.
 */
import LoadImage from '../base/LoadImage'
import {
  VerifiedIcon,
  SpiderStatusIcon,
  FetchStatus,
  BtnFollow,
  BtnSearchBlog,
  BtnAllRecom
} from '../base/baseComponents'
import base from '../../common/baseModule'
import {RBFromTagS} from '../../components/RecomBlogger/RecomBlogger'

let dealNum = (num) => {
  if (num < 10000) {
    return num
  }
  return `${Math.round(num / 10000)}万`
}
let handleToOwner = function (id) {
  const {props} = this
  const {wfType, outIndex, seeBlogger} = props
  const {fetchStatus} = props.data
  let content = {}

  // 单图推荐
  if (wfType === 'recommendBlog') {
    base.eventCount.add(1040, {
      '来源页面': '单图推荐',
      '博主Id': id,
      '图片位置': outIndex
    })
  }

  content.blogger_id = id
  for (let key in seeBlogger) {
    content[key] = seeBlogger[key]
  }
  base.ajaxList.addPoint(2300001, content)

  if (fetchStatus || wfType === 'followOwner') {
    window.open(`${base.baseUrl}/owner/${id}`)
    return
  }

  // 提示动画，2s
  this.setState({
    tip: true
  }, () => {
    setTimeout(() => {
      this.setState({
        tip: false
      })
    }, 2000)
  })
}

// 粉丝数
class FansNum extends React.Component {
  render() {
    return (
      <div className="post-fan">
        粉丝 {base.numberFormat(this.props.fansNum)}
      </div>
    )
  }
}

// loading
class GetDataLoading extends React.Component {
  render() {
    return (
      <div className="loading">
        <div className="line"/>
        <div className="line"/>
        <div className="line"/>
      </div>
    )
  }
}

// 搜索博主、订阅列表
class WFItemInsOwner extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      tip: false
    }
  }

  render() {
    let data = this.props.data
    let _wfItemStyle = base.setDivStyle(data)
    return (
      <div className="water-fall-item ins owner shadow"
        style={_wfItemStyle}
      >
        <div className="blog-content" onClick={handleToOwner.bind(this, data.id)}>
          <div className="avatar">
            {
              data.inLib ? 
                <LoadImage src={data.headImg} aliWidth={120}/>
                : 
                <img src={`${base.insHeadImg(data.headImg)}`} alt=""/>
            }
            <SpiderStatusIcon spiderStatus={data.spiderStatus}/>
          </div>
          <div className="user-info">
            <div className="name">
              <div className="one-line" title={data.nickname}>{data.nickname}</div>
              <VerifiedIcon isVerified={data.isVerified}/>
            </div>
            {this.props.wfType === 'owner' && <FansNum wfType={this.props.wfType}
              fansNum={data.fansNum}
            />}
          </div>
        </div>
        <FetchStatus wfType={this.props.wfType}
          fetch={data.fetchStatus}
          tip={this.state.tip}
        />
        <BtnFollow followId={data.followId}
          handleFan={this.props.handleFan}
        />
      </div>
    )
  }
}

// 搜索秀场、订阅列表
class WFItemRunwayOwner extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      avatarBg: base.getRandomColor()
    }
  }

  handleToOwner() {
    const { id } = this.props.data
    // window.open(`${base.baseUrl}/show/designer/${id}`)
    window.open(`${base.baseUrl}/show/brand/${id}`)
  }

  render() {
    let data = this.props.data
    let _style = {
      background: this.state.avatarBg
    }
    let _wfItemStyle = base.setDivStyle(data)
    return (
      <div className="water-fall-item runway owner shadow" style={_wfItemStyle}>
        <div className="blog-content" onClick={this.handleToOwner.bind(this)}>
          <div className="avatar runway-avatar" style={_style}>
            {base.getRunwayName(data.nickname)}
          </div>
          <div className="user-info">
            <div className="name">{data.nickname}</div>
          </div>
        </div>
        <BtnFollow followId={data.followId}
          handleFan={this.props.handleFan}
        />
      </div>)
  }
}

// 我的ins关注列表
class WFItemInsOwnerSub extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      tip: false
    }
  }

  render() {
    let data = this.props.data
    let _wfItemStyle = base.setDivStyle(data)
    return (
      <div className="water-fall-item ins owner ins-follow shadow"
        style={_wfItemStyle}
      >
        <div className="blog-content" onClick={handleToOwner.bind(this, data.id)}>
          <div className="avatar">
            <LoadImage src={data.headImg} aliWidth={120}/>
          </div>
          <div className="user-info">
            <div className="name">
              <div className="one-line" title={data.nickname}>{data.nickname}</div>
              <VerifiedIcon isVerified={data.isVerified}/>
            </div>
            <div className="post-fan">图片 {data.postNum} 粉丝 {dealNum(data.fansNum)}</div>
            <FetchStatus wfType={this.props.wfType}
              fetch={data.fetchStatus}
              tip={this.state.tip}
            />
            <div className="intro">
              <div>{data.intro}</div>
            </div>
          </div>
        </div>
        <BtnFollow followId={data.followId}
          handleFan={this.props.handleFan}
          getSize={this.props.getSizeFn}
        />
      </div>
    )
  }
}

// 订阅列表页面推荐博主、订阅博主
class WFItemRecommendOwner extends React.Component {
  render() {
    let data = this.props.data
    let _wfItemStyle = base.setDivStyle(data)

    return (
      <div className="water-fall-item recommend-owner"
        style={_wfItemStyle}
      >
        <RBFromTagS source="动态" recommendContent={this.props.recommendContent} followBlogger={this.props.followBlogger} seeBlogger={this.props.seeBlogger}/>
        <div className="btn-group">
          <BtnAllRecom source="动态" text="查看更多推荐博主"/>
          <BtnSearchBlog source="动态" text="搜索博主用户名"/>
        </div>
      </div>
    )
  }
}


export {WFItemInsOwner, WFItemInsOwnerSub, WFItemRunwayOwner, WFItemRecommendOwner}