import base from '../../common/baseModule'

base.headerChange('white')

const folderId = FolderId
const inviteId = InviteId
const status = Status

class InvitePanel extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      status,
      more: false,
      folder: {
        name: '',
        intro: '',
        inviterName: '',
        inviterAvatar: ''
      },
      imgList: []
    }
  }

  // 第一次渲染前调用
  componentWillMount() {
    let self = this
    base.ajaxList.getFolderInfo(folderId, (d) => {
      let {name, comment, creator} = d.result
      let intro = comment || ''
      let inviterName = creator.creatorName
      let inviterAvatar = creator.avatar
      self.setState({
        folder: {
          name, intro, inviterName, inviterAvatar
        },
        more: intro.length < 46
      })
    })
    base.ajaxList.getFolderImg(folderId, (d) => {
      self.setState({
        imgList: d.result
      })
    })
  }

  handleAgree() {
    let self = this
    base.ajaxList.agreeInvite(inviteId, (d) => {
      self.setState({
        status: 1
      }, () => {
        window.location.href = `${base.baseUrl}/folder/work/${folderId}`
      })
    })
  }

  handleMore() {
    this.setState({
      more: true
    })
  }

  handleRefuse() {
    let self = this
    base.ajaxList.refuseInvite(inviteId, (d) => {
      self.setState({
        status: 2
      })
    })
  }

  renderBtn() {
    if (this.state.status * 1 === 5) {
      return (
        <div className="btn-list">
          <button className="btn-round btn-refuse btn-default"
            onClick={this.handleRefuse.bind(this)}
          >拒绝邀请
          </button>
          <button className="btn-round btn-agree btn-gradient-blue"
            onClick={this.handleAgree.bind(this)}
          >接受邀请并查看精选集
          </button>
        </div>
      )
    }
    return (
      <div className="btn-list">
        <button className="btn-round btn-status btn-grey">
          已{this.state.status * 1 === 1 ? '接受' : '拒绝'}邀请
        </button>
      </div>
    )
  }

  renderFolderImg() {
    let imgList = []
    for (let i = 0; i < 4; i++) {
      let img = this.state.imgList[i] || ''
      let _class = `cover-${i}`
      let bgStyle = img ? {
        'backgroundImage': `url(${base.ossImg(img.mediaUrl)})`
      } : {}
      imgList.push(<div className={_class} style={bgStyle}/>)
    }
    return <div className="file-cover">{imgList}</div>
  }

  renderIntro() {
    if (!this.state.folder.intro) {
      return null
    }

    if (this.state.more) {
      return (
        <div className="intro">
          {this.state.folder.intro}
        </div>)
    }
    return (
      <div className="intro">
        {this.state.folder.intro.substr(0, 42)}...
        <span className="more"
          onClick={this.handleMore.bind(this)}
        >【查看更多】
        </span>
      </div>)
  }


  render() {
    let {inviterName, inviterAvatar} = this.state.folder
    let avatarBg = {
      'backgroundImage': `url(${base.ossImg(inviterAvatar)})`
    }
    return (
      <div>
        <div className="user-info">
          <span className="name one-line">
            {inviterName}
          </span>
          邀请您加入精选集
          <div className="avatar"
            style={avatarBg}
          />
        </div>
        <div className="folder-info">
          <div className="name">{this.state.folder.name}</div>
          {this.renderIntro()}
          {this.renderFolderImg()}
        </div>
        {this.renderBtn()}
      </div>
    )
  }
}

ReactDOM.render(
  <InvitePanel/>,
  document.getElementsByClassName('invite-confirm-pane')[0]
)