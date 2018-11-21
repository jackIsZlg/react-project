import base from '../../../common/baseModule'
import WaterFall from '../../../components/WaterFall/WaterFall'
import SharePane from '../../../components/SharePane/SharePane'
import {BtnFollow, Icon} from '../../../components/base/baseComponents'
import {RBFromBlogger} from '../../../components/RecomBlogger/RecomBlogger'
import NewTipGuide from '../../../components/NewTipGuide/NewTipGuide'

base.channel(-1)

let postViewGuide = 'postViewGuide3'
let guideEl
let ownerInfo = {}
let shareData = {}
let bloggerId = base.getUrlStringId()

class Banner extends React.Component {
  componentDidMount() {
    this.judgeGuide()
  }

  judgeGuide() {
    let that = this
    if (base.LS()[postViewGuide]) {
      return
    }

    // 3：博主详情页
    base.ajaxList.getNewGuide(3, (d) => {
      // d.result(0:需要指引；1:不需要指引)
      if (d.result) {
        let store = {}
        store[postViewGuide] = 1
        base.LS.set(store)
        return
      }

      // 禁止遮罩层后面页面滚动
      base.bodyScroll(false)
      that.tipGuide()
    })
  }

  tipGuide() {
    let that = this

    guideEl = document.createElement('div')
    guideEl.id = 'guide-wrapper3'

    document.body.appendChild(guideEl)

    that.renderGuide()

    window.onresize = function () {
      that.renderGuide()
    }
  }

  renderGuide() {
    let that = this
    let tipMessage = {
      targetElInfo: [{targetEl: that.followBtn, position: 'top right'}],
      tip: ['喜欢这位博主？订阅Ta吧'],
      total: 1,
      renderGuideFun: that.renderGuide,
      wrapper: guideEl,
      bodyScroll: true,
      localName: postViewGuide
    }


    ReactDOM.render(<NewTipGuide {...tipMessage}/>, guideEl)
  }

  render() {
    const {props} = this
    const {fansNum, postNum, headImg, nickname, introduction, followId, tagList, shareContent} = props

    return (
      <div className="banner owner-home">
        <div className="container">
          <div className="detail">粉丝 {base.numberFormat(fansNum)}&nbsp;&nbsp;&nbsp;博客 {base.numberFormat(postNum)}</div>
          <div className="user-info">
            <div className="avatar">
              <img src={headImg}
                width="100%"
                alt=''
              />
            </div>
            <div className="name">
              {nickname}
            </div>
            <ul className="tag-list">
              {
                                tagList && tagList.map((tag, index) => {
                                  if (index >= 5) {
                                    return
                                  }
                                  let key = `tag-${index}`
                                  return <li key={key}># {tag}</li>
                                })
                            }
            </ul>
            <div className="intro">
              {introduction}
            </div>
          </div>
          <div className="user-action">
            <div className="share-wrapper">
              <button className="btn-round btn-to-share">
                <Icon type="fenxiang1"/>分享
              </button>
              <div id="share-pane">
                <SharePane title='博主'
                  pos="right"
                  shareType="博主"
                  showShare={true}
                  shareData={shareData}
                  pointContent={shareContent}
                />
              </div>
            </div>
            <div ref={el => this.followBtn = el} className="follow-wrapper">
              <BtnFollow followId={followId}
                handleFan={this.props.handleFollow}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      ...props,
      showRecom: !!props.followId
    }
  }

  handleFollow() {
    let self = this
    let {followId, id, headImg, nickname} = self.state

    if (followId === 0) {
      console.log('订阅')
      let content = {
        blogger_id: id,
        source_page: 'blogger_detail',
        source_type: 'main_blogger'
      }
      base.ajaxList.addPoint(2300002, content)
      base.ajaxList.followOwner(id, (d) => {
        self.setState({
          followId: d.result,
          showRecom: true
        })
        df_alert({
          tipImg: headImg,
          mainText: '成功订阅博主',
          subText: nickname
        })
        base.eventCount.add(1010, {
          '来源页面': '博主主页',
          '博主Id': id
        })
      })
      return
    }

    console.log('取关')
    base.ajaxList.unFollowOwner(followId, () => {
      self.setState({
        followId: 0,
        showRecom: false
      })
    })
  }

  handleClose() {
    this.setState({
      showRecom: false
    })
  }

  render() {
    const {state} = this
    const {id, status, showRecom} = state
    let _url = `/owner/blog?b=${id}`
    let tip = status === 1 ? '该博主已设置为私密账户，暂时无法查看图片' : '同步图片大约需要5分钟，请稍后…'
    let pointContent = {
      source_page: 'blogger_detail',
      source_type: 'recommended'
    }
    let shareContent = {
      source_page: 'blogger_detail',
      blogger_id: id
    }
    let recommendContent = {
      source_page: 'blogger_detail',
      recommend_type: 'picture'
    }
    return (
      <div>
        <Banner {...state} handleFollow={this.handleFollow.bind(this)} shareContent={shareContent}/>
        {
                    showRecom && <RBFromBlogger bloggerId={id}
                      source="博主主页"
                      handleClose={this.handleClose.bind(this)}
                      close={true}
                      recommend={recommendContent}
                      followBlogger={recommendContent}
                      seeBlogger={pointContent}
                    />
                }
        <div className="container">
          <div id="water-fall-panel">
            <WaterFall key="waterWall"
              wfType="ownerId"
              noResultTip={tip}
              dataUrl={_url}
              pointContent={pointContent}
              recommendContent={recommendContent}
            />
          </div>
        </div>

      </div>
    )
  }
}

// 获取博主详情
base.ajaxList.getBloggerDetail(bloggerId, (d) => {
  ownerInfo = d.result
  const {headImg, nickname, id} = ownerInfo
  // 配置分享按钮
  shareData = {
    id,
    url: `${base.baseUrl}/mobile/owner/share/${id}-`,
    image: headImg,
    title: `博主 ${nickname}`,
    description: 'DeepFashion-每天都想刷的时尚'
  }
  ReactDOM.render(<App {...ownerInfo}/>, document.getElementById('app-wrapper'))
})

// 滚动事件
document.addEventListener('scroll', () => {
  let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
  if (scrollTop > 100) {
    base.headerChange('white')
  } else {
    base.headerChange()
  }
  // 视差,safari scrollTop可为负
  (scrollTop <= 150 && scrollTop >= 0)
    && (document.getElementsByClassName('banner')[0].style.backgroundPosition = `center ${scrollTop / 1.5}px`)
})

