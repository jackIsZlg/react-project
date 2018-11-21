import base from '../../common/baseModule'
import className from 'classnames'
import {Icon} from '../../components/base/baseComponents'

base.channel(6)
base.headerChange('white')

const authEl = document.querySelector('#unauth')
const shareSite = {
  'weibo': '微博',
  'wechat': '微信',
  'qzone': 'qq空间',
  'qq': 'qq好友'
}

// 携带信息跳转分享过渡页面
const shareJump = (options) => {
  let defaults = {
    id: '',
    url: '',
    image: '',
    site: '',
    title: '',
    description: ''
  }
  for (let i in options) {
    defaults[i] = options[i]
  }
  let hash = base.hashManage.toStringHash(defaults)
  // sessionStorage.setItem('shareId', defaults.id);
  // sessionStorage.setItem('shareUrl', defaults.url);
  // sessionStorage.setItem('shareImage', defaults.image);
  // sessionStorage.setItem('shareSite', defaults.site);
  // sessionStorage.setItem('shareTitle', defaults.title);
  // sessionStorage.setItem('shareDescription', defaults.description);

  window.location.hostname === '127.0.0.1' ? window.open(`/views/platform/shareJump.html#${hash}`)
    : window.open(`${base.baseUrl}/share-jump#${hash}`)
}

class Unauth extends React.Component {
  constructor() {
    super()
    this.state = {
      shareActive: false,
      shareData: {
        id: '',
        url: '',
        image: '',
        title: '分享 DEEPFASHION',
        description: 'DeepFashion-每天都想刷的时尚'
      }
    }
  }

  componentDidMount() {
    this.getErweiCode()
  }

  getErweiCode() {
    let self = this, 
      {shareData} = self.state
    base.ajaxList.basic({
      type: 'GET',
      url: `${base.baseUrl}/users/invite/generate-code`,
    }, (d) => {
      let {id, avatar, inviteUrl} = d.result

      shareData.id = id
      shareData.url = base.baseUrl + inviteUrl
      shareData.image = avatar
      self.setState({
        shareData
      })
    })
  }

  closeShare() {
    this.setState({
      shareActive: !this.state.shareActive
    })
    base.eventCount.add(1042)
  }

  handleShare(e, site) {
    let {shareData} = this.state
    shareData.site = site
    shareJump(shareData)
    base.eventCount.add(1019, {
      '分享途径': shareSite[site],
      '邀请码': shareData.code,
      '类型': '邀请分享'
    })
    e.stopPropagation()
  }

  render() {
    let {shareActive} = this.state
    return (
      <div className='auth-info'>
        {/* 邀请好友&nbsp;&nbsp;免费看订货会
                <div className="auth-desc">
                    只需邀请3位好友，下载并注册deepfashion<br/>
                    即可免费查看订货会
                </div>
                <button onClick={this.closeShare.bind(this)}>立即邀请</button> */}

        <div className="auth-top">
          <div className="invite">
            <div className="invite-info-title">品牌精选限时福利</div>
            <div className="invite-info-text">
                            只需邀请1位好友注册<br/>
                            即可免费查看&下载大牌订货会图片
            </div>
            <button className="invite-info-but" onClick={this.closeShare.bind(this)}>立即邀请</button>
            <div className="invite-info-img"></div>
          </div>
        </div>

        {/* <div className="auth-mid">
          <div className="welfare">我的福利</div>
          <div className="welfare-list">
            <div className="welfares">
              <div className="welfares-img img-A"></div>
              <div className="welfares-info">
                                只需邀请1位好友<br/>
                                免费查看下载所有品牌精选图片
              </div>
              <div className="welfares-desc">
                                好友注册时填写你的邀请码<br/>
                                就算成功邀请
              </div>
            </div>
            <div className="welfares">
              <div className="welfares-img img-B"></div>
              <div className="welfares-info">
                                邀请好友越多<br/>
                                奖励越大
              </div>
              <div className="welfares-desc">
                                除看到图片，还能获得：PS/AI/CAD<br/>
                                全套教程、手工打板教程等
              </div>
            </div>
            <div className="welfares">
              <div className="welfares-img img-C"></div>
              <div className="welfares-info">
                                新用户注册并填写邀请码<br/>
                                获得新人奖励
              </div>
              <div className="welfares-desc">
                                你的好友同样可以获得<br/>
                                服装设计必备工具教程包
              </div>
            </div>
          </div>
        </div> */}

        <div className="auth-bot">
          <div className="brand">部分品牌精选品牌</div>
          <div className="brand-list"></div>
        </div>

        <div className={className('auth-mask', {'active': shareActive})}>
          <div className="auth-share">
            <div className="auth-share-title">
                            分享至
            </div>
            <Icon type='close-collect' handleClick={this.closeShare.bind(this)}/>
            <div className="auth-share-pane">
              <div className="share-pane-item"
                onClick={(e) => {
                                this.handleShare(e, 'qq')
                            }}
              >
                <div className="share-icon qq">
                  <Icon type='QQ'/>
                </div>
                                QQ
              </div>
              <div className="share-pane-item"
                onClick={(e) => {
                                this.handleShare(e, 'wechat')
                            }}
              >
                <div className="share-icon wechat">
                  <Icon type='wechat'/>
                </div>
                                微信
              </div>
              <div className="share-pane-item"
                onClick={(e) => {
                                this.handleShare(e, 'weibo')
                            }}
              >
                <div className="share-icon weibo">
                  <Icon type='weibo'/>
                </div>
                                微博
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

ReactDOM.render(<Unauth/>, authEl)