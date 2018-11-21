import base from '../../common/baseModule'
import SharePane from '../../components/SharePane/SharePane'

class InviteHeader extends React.Component {
  constructor() {
    super()
    this.state = {
      copy: false
    }
  }

  copy() {
    this.refs['share-url'].select()
    document.execCommand('Copy')
    this.setState({
      copy: true
    })
    base.eventCount.add(1044, {
      '用户ID': base.LS().id
    })
  }

  render() {
    let {shareData, shareInfo} = this.props
    let {avatar, name, code, hiddenLink} = shareInfo
    let avatarBg = {
      backgroundImage: `url(${base.ossImg(avatar || 'https://zhiyi-image.oss-cn-hangzhou.aliyuncs.com/self-selected/1530244007170_431.png', 106)})`
    }
    console.log(this.props)
    return (
      <div className='invite-header container'>
        <div className="avatar" style={avatarBg}/>
        <div className="name">{name}</div>
        <div className="code">
          <div className="invite-code">
                        我的邀请码
            <input type="text"
              ref='share-url'
              readOnly
              value={code}
            />
            <button className='copy' onClick={this.copy.bind(this)}>
              {this.state.copy ? '已复制' : '复制'}
            </button>
          </div>
          <div className="invite-btn">
            <button className='invitation'>邀请</button>
            <div id="share-pane-invite">
              <SharePane title='DEEPFASHION'
                shareType="邀请分享"
                showShare={true}
                shareData={shareData}
                hiddenLink={hiddenLink}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default InviteHeader