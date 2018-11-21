/**
 * Created by gewangjie on 2017/10/11
 */
import base from '../../common/baseModule'
import {Icon} from '../../components/base/baseComponents'
import classNames from 'classnames'

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
  window.open(`${base.baseUrl}/share-jump#${hash}`)
}

class SharePane extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      copy: false
    }
  }

  handleShare(e, site) {
    let {shareData, shareType, pointContent} = this.props
    shareData.site = site
    shareData.url = shareData.mobileUrl || shareData.url
    let code = 0
    switch (shareType) {
      case '图片':
        code = 2100003
        break
      case '精选集':
        code = 2200003
        break
      case '博主':
        code = 2300003
        break
      default:
        break
    }
    // let content = {
    //   pic_id: shareData.id,
    //   blogger_id: bloggerId
    // }
    let content = pointContent
    // for (let key in pointContent) {
    //   content[key] = pointContent[key]
    // }
    code && base.ajaxList.addPoint(code, content)
    base.eventCount.add(1019, {
      '分享途径': shareSite[site],
      'id': shareData.id,
      '类型': shareType || '图片',
      '用户ID': base.LS().id
    })
    shareJump(shareData)
    e.stopPropagation()
  }

  // 复制
  copy() {
    this.refs['share-url'].select()
    document.execCommand('Copy')
    this.setState({
      copy: true
    })

    let {shareData, shareType} = this.props
    base.eventCount.add(1019, {
      '分享途径': '复制',
      'id': shareData.id,
      '类型': shareType || '图片'
    })
  }

  render() {
    const {showShare, pos, shareData, title, hiddenLink} = this.props,
      {url} = shareData
    return (
      <div className={classNames('share-pane', {
                'hidden': !showShare,
                'right': pos === 'right'
            })}
      >
        <div className="title">分享{title || '图片'}至：</div>
        <ul>
          <li className="share-qq"
            key="share-qq"
            onClick={(e) => {
                            this.handleShare(e, 'qq')
                        }}
          >
            <Icon type="QQ"/>
          </li>
          <li className="share-qzone"
            key="share-qzone"
            onClick={(e) => {
                            this.handleShare(e, 'qzone')
                        }}
          >
            <Icon type="qzone"/>
          </li>
          <li className="share-wechat"
            key="share-wechat"
            onClick={(e) => {
                            this.handleShare(e, 'wechat')
                        }}
          >
            <Icon type="wechat"/>
          </li>
          <li className="share-weibo"
            key="share-weibo"
            onClick={(e) => {
                            this.handleShare(e, 'weibo')
                        }}
          >
            <Icon type="weibo"/>
          </li>
        </ul>
        {
                    !hiddenLink &&
                    <div>
                      <div className="title">分享链接：</div>
                      <div className="url-pane">
                        <input type="text"
                          ref='share-url'
                          readOnly
                          value={url}
                        />
                        <button onClick={this.copy.bind(this)}>
                          {this.state.copy ? '已复制' : '复制'}
                        </button>
                      </div>
                    </div>
                }
      </div>
    )
  }
}

export default SharePane