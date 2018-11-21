import base from '../../common/baseModule'
import {Icon} from '../../components/base/baseComponents'

base.headerChange('white')

let params = []

class NoticeInfo extends React.Component {
  // 点击关注和取消关注
  // handleFollow(id) {
  //     let self = this,
  //         {avatar, name, followFlag} = this.state;
  //
  //     if(!followFlag){
  //         base.ajaxList.followOwner(id, (data) => {
  //             if (data.success) {
  //                 self.setState({
  //                     followFlag: true
  //                 });
  //                 df_alert({
  //                     tipImg: base.ossImg(avatar, 120),
  //                     mainText: '成功订阅博主',
  //                     subText: name
  //                 });
  //             }
  //         });
  //     }else {
  //         base.ajaxList.unFollowOwner(id, (d) => {
  //             d.success && self.setState({
  //                 followFlag: false
  //             });
  //         });
  //     }
  //
  //
  // }

  render() {
    const {folderName, folderId, folderCount, mediaUrlList, isPrivate, user} = this.props,
      {name} = user

    let style = [],
      coverUrl = ''

    for (let i = 0; i < 3; i++) {
      if (i === 1) {
        coverUrl = mediaUrlList[0]
      }
      style.push({'backgroundImage': `url(${base.ossImg(mediaUrlList[i])})`})
    }

    return (
      <div className="file-item">
        <a href={`/folder/public/${folderId}`} target={folderName} className="file-cover-new" ref="file-cover">
          <div className="cover-0" style={style[0]}/>
          <div className="cover-1" style={style[1]}/>
          <div className="cover-2" style={style[2]}/>
        </a>
        <div className="folder-icon-list">
          {isPrivate === 1 && <i className="icon-private-folder"/>}
        </div>
        <div className="file-item-num">
          <Icon type="folder-num"/>{base.numberFormat(folderCount)}枚
        </div>

        <div className="file-footer">
          <div className="file-name">
            <a href={`/folder/public/${folderId}`} target={folderName}>
              {folderName}<br/><span>by&nbsp;{name}</span>
            </a>
            {/* <a href={`/users/folder/${id}`} target={name}>by&nbsp;{name}</a> */}
          </div>
        </div>
      </div>
    )
  }
}

class NoticeItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      mediaUrl: props.mediaUrl,
      folderId: props.folderId || 0,
      folderName: props.folderName || '',
      collectorFolderInfo: props.collectorFolderList.length ? this.dealPostData(props.collectorFolderList) : []
    }
  }

  componentWillReceiveProps(nextProps) {
    let that = this

    that.setState({
      mediaUrl: nextProps.mediaUrl,
      folderId: nextProps.id,
      folderName: nextProps.name,
      collectorFolderInfo: that.dealPostData(nextProps.collectorFolderInfo)
    })
  }

  dealPostData(info) {
    return info.filter(v => !v.isPrivate)
  }

  render() {
    let {collectorFolderInfo, mediaUrl} = this.state,
      collectorFolderList = collectorFolderInfo.map(item => <NoticeInfo {...item}/>),
      style = {
        'backgroundImage': `url(${base.ossImg(mediaUrl)})`
      }

    return (<div className='notice-item'>
      <div className="container">
        <div className="notice-item-up">
          <div className="file-cover collect-image" style={style}/>
          <div className="notice-item-basic-info">
                        您精选的图片被其他设计师精选了<em>{collectorFolderList.length}</em>次
          </div>
        </div>
        <div className="notice-item-down">
          <div className='notice-item-folder-info'>
            {collectorFolderList}
          </div>
        </div>
      </div>
    </div>)
  }
}

class NoticeList extends React.Component {
  constructor() {
    super()
    this.state = {
      noticeInfo: [],
      status: 1
    }
  }

  componentWillMount() {
    params = this.getParams()
    !!params.folderIdList && !!params.collectorFolderIdList && !!params.postIdList &&
        this.getCollectedInfo()
  }

  getParams() {
    let url = window.location.href,
      num = url.indexOf('?'),
      paramArr = url.substr(num + 1).split('&'),
      paramObj = {},
      itemArr = []

    for (let i = 0; i < paramArr.length; i++) {
      itemArr = paramArr[i].split('=')
      paramObj[itemArr[0]] = itemArr[1]
    }

    return paramObj
  }

  getCollectedInfo() {
    let that = this,
      {noticeInfo, status} = this.state

    base.ajaxList.basic({
      url: `${base.baseUrl}/folder/post-record-data`,
      type: 'GET',
      data: {
        folderIdList: params.folderIdList,
        collectorFolderIdList: params.collectorFolderIdList,
        postIdList: params.postIdList
      }
    }, (data) => {
      noticeInfo = data.result

      that.setState({
        noticeInfo
      }, () => {
        noticeInfo = noticeInfo.map((item) => {
          if (!item.collectorFolderList.filter(v => !v.isPrivate).length) {
            return
          }

          return item
        })
        let aa = noticeInfo.filter(v => !!v)

        if (aa.length) {
          status = 2
        } else {
          status = 3
        }
        that.setState({
          status,
          noticeInfo: aa
        })
      })
    })
  }

  render() {
    let {noticeInfo, status} = this.state,
      collectInfo = noticeInfo.map(item => <NoticeItem {...item}/>)

    return (
      <div className='notice-list'>
        <div className="notice-list-title">
          <div className="container">
                        精选集内的图片被精选
          </div>
        </div>
        <div ref='noticeContent' className="notice-list-content">
          {
                        status === 2 && collectInfo
                    }

          {
                        status === 3 &&
                        <div className="deny-folder-pane container">
                          <Icon type='folder-private'/>
                          <div className="main-tip font-style">啊哦！</div>
                          <div className="sub-tip font-style">精选图片的精选集都被设为私密或删除</div>
                            {/* <a href="/" className="btn-gradient-deep-blue btn-round">返回首页</a> */}
                        </div>
                    }
        </div>
      </div>
    )
  }
}

ReactDOM.render(<NoticeList/>, document.querySelector('.notice-content'))