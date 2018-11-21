import base from '../../common/baseModule'
import {VerifiedIcon, BtnFollow, BtnAllRecom} from '../base/baseComponents'
import NewTipGuide from '../../components/NewTipGuide/NewTipGuide'
import {BlogCover} from '../Blog/Blog'

let postViewGuide = 'postViewGuide4'
let followBtn
let guideEl

// 打开博主主页
const openOwnerDetail = (bloggerId, seeBlogger = {}, nickname = '') => {
  let content = {
    blogger_id: bloggerId
  }
  for (let key in seeBlogger) {
    content[key] = seeBlogger[key]
  }
  base.ajaxList.addPoint(2300001, content)
  // console.log(`/owner/${bloggerId}`, nickname)
  window.open(`/owner/${bloggerId}`, nickname)
}

/**
 * 根据博主标签推荐 -- 单图推荐 和 博主主页
 */
class RBFromBlogger extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      recomType: -1
    }
  }

  componentWillMount() {
    this.getRecomBloggerData()
  }

  getRecomBloggerData() {
    if (!this.props.bloggerId) {
      return
    }
    let self = this
    let {recommend} = self.props
    let content = {}
    base.ajaxList.basic({
      type: 'GET',
      url: `${base.baseUrl}/recommend/blogger?bloggerId=${this.props.bloggerId}`
    }, (d) => {
      let idList = []
      if (d.result) {
        let {recomType, resultList: data} = d.result
        self.setState({
          data, recomType
        })
        data.forEach(item => idList.push(item.id))
      }
      for (let key in recommend) {
        content[key] = recommend[key]
      }
      content.recommend_result = idList.join(',')
      content.recommend_type = 'blogger'
      base.ajaxList.addPoint(3200001, content)
    })
  }

  handleClose() {
    this.props.handleClose()
  }

  followBlogger(index) {
    let self = this
    let data = self.state.data
    let item = data[index]
    let {followBlogger} = this.props
    let content = {}

    // 订阅
    if (!item.followId) {
      // let code = '1010005'
      // let content = {
      //   preEvent: '订阅博主',
      //   content: '根据兴趣推荐博主',
      //   type: '2',
      //   typeDesc: '根据兴趣推荐博主'
      // }
      content.blogger_id = item.id
      for (let key in followBlogger) {
        content[key] = followBlogger[key]
      }
      content.recommend_type = 'blogger'
      base.ajaxList.addPoint(2300002, content)

      base.ajaxList.followOwner(item.id, (d) => {
        item.followId = d.result
        self.setState({
          data
        })
        df_alert({
          tipImg: base.ossImg(item.headImg, 36),
          mainText: '成功订阅博主',
          subText: item.nickname
        })
        base.eventCount.add(1010, {
          '来源页面': `相似博主-${self.props.source}`,
          '博主Id': item.id
        })
      })
      // base.ajaxList.addPoint(code, content)
      return
    }

    // 取消订阅
    base.ajaxList.unFollowOwner(item.followId, () => {
      item.followId = 0
      self.setState({data})
    })
  }

  renderTitle() {
    let title = ''
    switch (this.state.recomType) {
      case 1:
        title = '相关博主推荐'
        break
      case 2:
        title = '根据你的兴趣推荐'
        break
      case 3:
        title = '优质博主推荐'
        break
      default: break
    }
    return title
  }

  render() {
    // 无数据，不渲染
    if (this.state.data.length === 0) {
      return null
    }
    // 暂时隐藏 根据你的兴趣推荐
    if (this.state.recomType === 2) {
      return null
    }
    return (
      <div className="recom-blogger-pane">
        <div className="title">
          {this.renderTitle()}
          {this.props.close &&
          <i className="iconfont close-pane"
            onClick={this.handleClose.bind(this)}
          />}
        </div>
        <ul className="blogger-list">
          {
            this.state.data.map((blogger, index) => {
              let key = `blogger-${blogger.id}`
              return (<BloggerItemBlock key={key}
                data={blogger}
                source={this.props.source}
                seeBlogger={this.props.seeBlogger}
                followBlogger={this.followBlogger.bind(this, index)}
              />)
            })
          }
        </ul>
      </div>
    )
  }
}

// 单条数据block
class BloggerItemBlock extends React.Component {
  render() {
    const {props} = this
    const {data, seeBlogger} = props
    let avatarStyle = base.avatarStyle(data.headImg, 94)
    return (
      <li className="blogger-item">
        <div className="blogger-info"
          onClick={openOwnerDetail.bind(this, data.id, seeBlogger, data.nickname)}
        >
          <div className="avatar" style={avatarStyle}/>
          <div className="name">
            <span className="one-line">{data.nickname}</span>
            <VerifiedIcon isVerified={data.isVerified}/>
          </div>
        </div>
        <BtnFollow followId={data.followId}
          handleFan={props.followBlogger}
        />
      </li>
    )
  }
}

// function renderGuideWrapper() {
//     let guideInfo=window.tipList,
//         tipMessage = {
//         targetElInfo: guideInfo.targetElInfo,
//         tip: guideInfo.tipInfo,
//         total: 1,
//         renderGuideFun: renderGuideWrapper,
//         wrapper: guideInfo.guideEl,
//         bodyScroll: true,
//         localName: guideInfo.postViewGuide
//     };
//
//
//     ReactDOM.render(<NewTipGuide {...tipMessage}/>, guideInfo.guideEl);
// }

/**
 * 根据用户标签推荐 -- 动态、搜索、订阅列表
 */
class RBFromTag extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      guideFlag: false
    }
  }

  componentWillMount() {
    this.getBloggerData()
  }

  componentDidMount() {
    if (this.props.source !== '搜索博主') {
      return
    }
    this.judgeGuideDesign()
    // this.setState({
    //     guideFlag: true
    // })
  }
  getGuideSize(ele) {
    followBtn = ele
    this.createWrapperElement()
  }
 
  getBloggerData() {
    let self = this
    let num = this.props.number || 5
    let {recommendContent} = self.props
    let content = {}
    base.ajaxList.getRecomBlogger(num, (d) => {
      let idList = []
      d.result.forEach(item => idList.push(item.bloggerId))
      content.recommend_result = idList.join(',')
      for (let key in recommendContent) {
        content[key] = recommendContent[key]
      }
      base.ajaxList.addPoint(3200001, content)
      self.setState({
        data: d.result
      })
    })
  }
  createWrapperElement() {
    let that = this

    guideEl = document.createElement('div')
    guideEl.id = 'guide-wrapper4'
    document.body.appendChild(guideEl)

    that.renderGuideWrapper()

    window.onresize = () => {
      that.renderGuideWrapper()
    }
  }
  judgeGuideDesign() {
    let that = this
    if (base.LS()[postViewGuide]) {
      return
    }

    // 4：博主搜索
    base.ajaxList.getNewGuide(4, (d) => {
      // d.result(0:需要指引；1:不需要指引)
      if (d.result) {
        let store = {}
        store[postViewGuide] = 1
        base.LS.set(store)
        return
      }

      // 禁止遮罩层后面页面滚动
      base.bodyScroll(false)
      that.setState({
        guideFlag: true
      })
    })
  }

  // 关注博主
  followBlogger(index) {
    let self = this
    let data = this.state.data
    let item = data[index]
    let followId = item.followId || 0
    let {bloggerId: id, nickname, headImg} = item
    let {followBlogger} = this.props
    let content = {
      blogger_id: id
    }

    // 取消订阅
    if (followId !== 0) {
      base.ajaxList.unFollowOwner(followId, () => {
        item.followId = 0
        self.setState({
          data
        })
      })
      return
    }

    for (let key in followBlogger) {
      content[key] = followBlogger[key]
    }
    base.ajaxList.addPoint(2300002, content)

    // 正常订阅
    base.ajaxList.followOwner(id, (d) => {
      item.followId = d.result
      self.setState({
        data
      })
      df_alert({
        tipImg: base.ossImg(headImg, 120),
        mainText: '成功订阅博主',
        subText: nickname
      })

      base.eventCount.add(1010, {
        '来源页面': `推荐博主-${self.props.source}`,
        '博主Id': id
      })
    })
  }

  getRecommendBloggerData() {
    let {recommendContent} = this.props
    base.ajaxList.addPoint(3200002, recommendContent)
    this.getBloggerData()
  }

  renderGuideWrapper() {
    let that = this
    let tipMessage = {
      targetElInfo: [{targetEl: followBtn, position: 'top right'}],
      tip: ['点击订阅，在DF查看这个博主'],
      total: 1,
      renderGuideFun: that.renderGuideWrapper,
      wrapper: guideEl,
      bodyScroll: true,
      localName: postViewGuide
    }
    ReactDOM.render(<NewTipGuide {...tipMessage}/>, guideEl)
  }
  render() {
    let {guideFlag} = this.state
    return (
      <div className="recom-blogger-tag-pane long">
        <div className="title">
          为您推荐以下博主
          <button onClick={this.getRecommendBloggerData.bind(this)}>换一批</button>
          <BtnAllRecom source={this.props.source}/>
        </div>
        <div className="recom-blogger-list">
          {
            this.state.data.map((item, index) => {
              let key = `blogger-${item.bloggerId}`
              return (<BloggerItemCol data={item}
                key={key}
                followBlogger={this.followBlogger.bind(this, index)}
                getSize={guideFlag && !index && this.getGuideSize.bind(this)}
                seeBlogger={this.props.seeBlogger}
              />)
            })
          }
        </div>
      </div>
    )
  }
}

// 人气博主TOP
class BloggerItem extends React.Component {
  render() {
    const {props} = this
    const {data} = props
    let avatarStyle = {
      backgroundImage: `url(${base.ossImg(data.headImg, 96)})`
    }
    let mediaList = (data.mediaUrlList || []).map((v, i) => (<div key={i + 1}
      className="info-img"
      style={{backgroundImage: `url(${base.ossImg(v, 180)})`}}
    />))

    return (
      <div className="blogger-item blogger-item-col">
        <div className='avatar'
          style={avatarStyle}
          onClick={openOwnerDetail.bind(this, data.bloggerId, {}, data.nickname)}
        />
        <div className='info'>
          <div className="info-left">
            <div className="name">
              <span onClick={openOwnerDetail.bind(this, data.bloggerId, {}, data.nickname)}>
                {data.nickname}
              </span>
              <VerifiedIcon isVerified={data.isVerified}/>
              <span className='reason'>{data.recomReason || ''}</span>
            </div>
            <div className="intro one-line">
              {(!data.introduction || data.introduction === 'null')
                ? 'TA还没有自我介绍' : data.introduction}
            </div>
            <TagList tagList={data.tagList}/>
            <BtnFollow followId={data.followId}
              handleFan={props.followBlogger}
              getSize={props.getSize}
            />
          </div>
        </div>
      </div>
    )
  }
}
// 单条数据--行
class BloggerItemCol extends React.Component {
  // 加入精选
  handleAddFolder(index, folderId, favoriteId) {
    let _list = this.state.waterFallData
    _list[index].favoriteId = favoriteId
  }
  
  openBlogDetail(index, bloggerId) {
    let originalPath = `/blog/detail/${bloggerId}`
    let {seeBlogger, data} = this.props

    let content = {
      bloggerId,
      pic_url: data.mediaUrl,
      index
    }
    for (let key in seeBlogger) {
      content[key] = seeBlogger[key]
    }
    base.ajaxList.addPoint(2100001, content)

    ReactDOM.render(
      <BlogCover
        wfType='followBlog'
        columnWidth={288}
        hidden={false}
        handleAddFolder={this.handleAddFolder.bind(this)}
        outIndex={index}
        wfData={this.props.data.mediaList}
        originalPath={originalPath}
      />,
      document.getElementById('blog-pop-wrapper')
    )
  }
  render() {
    const { props } = this
    const { data, seeBlogger, selectedType } = props
    let avatarStyle = {
      backgroundImage: `url(${base.ossImg(data.headImg, 96)})`
    }
    let mediaList = (
      data.mediaList || []).map((v, i) => {
      let maxImg = 1
      if (selectedType && selectedType > 3) {
        maxImg = window.innerWidth > 1828 ? 3 : 2
      } else {
        maxImg = window.innerWidth > 1828 ? 2 : 1
      }
      if (i > maxImg) return null
      return (
        <div key={i + 1}
          className="info-img"
          onClick={this.openBlogDetail.bind(this, i, v.id, data.nickname)}
          style={{ background: `url(${base.ossImg(v.mediaUrl, 143)}) no-repeat 100%/100%` }}
        />
      ) 
    })

    return (
      <div className="blogger-item blogger-item-col">
        <div className='avatar'
          style={avatarStyle}
          onClick={openOwnerDetail.bind(this, data.bloggerId, seeBlogger, data.nickname)}
        />
        <div className='info'>
          <div className="info-left">
            <div className="name">
              <span onClick={openOwnerDetail.bind(this, data.bloggerId, seeBlogger, data.nickname)}>
                {data.nickname}
              </span>
              <VerifiedIcon isVerified={data.isVerified}/>
              <span className='reason'>{data.recomReason || ''}</span>
            </div>
            <div className="intro one-line">
              {(data.recommendWord || !data.introduction || data.introduction === 'null')
                ? 'TA还没有自我介绍' : data.introduction}
            </div>
            <TagList tagList={data.tagList}/>
            <BtnFollow followId={data.followId}
              handleFan={props.followBlogger}
              getSize={props.getSize}
            />
          </div>
          <div className="info-right">
            {mediaList}
          </div>
        </div>
      </div>
    )
  }
}

// 标签
class TagList extends React.Component {
  render() {
    return (
      <ul className="tag-list">
        {this.props.tagList && this.props.tagList.length && this.props.tagList.map((tag, index) => {
        let key = `tag-${index}`
        return <li key={key}>{tag}</li>
      })}
      </ul>)
  }
}

/**
 * 动态页瀑布流单元块
 */
class RBFromTagS extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      getDataIng: true,
      hasBlogInfo: true
    }
  }

  componentDidMount() {
    this.getBloggerData()
  }

  getBloggerData() {
    let self = this
    let {recommendContent} = self.props
    self.setState({
      getDataIng: true
    })
    base.ajaxList.getRecomBlogger(3, (d) => {
      let idList = []
      let content = {}
      // 查询结果为空,删除此模块
      if (d.result.length === 0) {
        self.setState({
          hasBlogInfo: false
        })
        return
      }

      // 截取4个标签
      d.result.forEach((item) => {
        if (item.tagList.length > 4) {
          item.tagList = item.tagList.slice(0, 4)
        }
        idList.push(item.bloggerId)
      })

      content.recommend_result = idList.join(',')
      for (let key in recommendContent) {
        content[key] = recommendContent[key]
      }
      base.ajaxList.addPoint(3200001, content)

      self.setState({
        data: d.result,
        getDataIng: false
      })
    })
  }

  // 订阅博主
  followBloggerBtn(index) {
    let self = this
    let bloggerList = self.state.data
    let blogger = bloggerList[index]
    let {followBlogger} = self.props
    let content = {}
    console.log('followBlogger11111', followBlogger)
    // 取关
    if (blogger.followId) {
      base.ajaxList.unFollowOwner(blogger.followId, () => {
        blogger.followId = null
        self.setState({
          data: bloggerList
        })
      })
      return
    }

    content.blogger_id = blogger.bloggerId
    for (let key in followBlogger) {
      content[key] = followBlogger[key]
    }
    base.ajaxList.addPoint(2300002, content)

    // 订阅
    base.ajaxList.followOwner(blogger.bloggerId, (d) => {
      blogger.followId = d.result
      base.eventCount.add(1010, {
        '来源页面': `推荐博主-${self.props.source}`,
        '博主Id': blogger.bloggerId
      })
      self.setState({
        data: bloggerList
      })
    })
  }

  getAnotherBloggerData() {
    let {recommendContent} = this.props
    base.ajaxList.addPoint(3200002, recommendContent)
    this.getBloggerData()
  }

  render() {
    return (
      <div className="recom-blogger-tag-pane short">
        <div className="title">
          推荐的instagram博主
          <button className="float-r" onClick={this.getAnotherBloggerData.bind(this)}>换一批</button>
        </div>
        <div className="recom-blogger-list">
          {
            this.state.data.map((item, index) => {
              let key = `blogger-${item.bloggerId}`
              return (<BloggerItemColS data={item}
                key={key}
                followBlogger={this.followBloggerBtn.bind(this, index)}
                seeBlogger={this.props.seeBlogger}
              />)
            })
          }
          {!this.state.hasBlogInfo &&
          <div className="null">恭喜你！完成四大皆空的成就！</div>}
        </div>
      </div>
    )
  }
}

class BloggerItemColS extends React.Component {
  render() {
    const {props} = this
    const {data, seeBlogger} = props
    let avatarStyle = {
      backgroundImage: `url(${base.ossImg(data.headImg, 44)})`
    }
    return (
      <div className="blogger-item blogger-item-col">
        <div className='avatar'
          style={avatarStyle}
          onClick={openOwnerDetail.bind(this, data.bloggerId, seeBlogger, data.nickname)}
        />
        <div className='info'>
          <div className="name">
            <span className='one-line' onClick={openOwnerDetail.bind(this, data.bloggerId, seeBlogger, data.nickname)}>
              {data.nickname}
            </span>
            <VerifiedIcon isVerified={data.isVerified}/>
          </div>
          <div className='reason'>{data.recomReason || ''}</div>
          <TagList tagList={data.tagList}/>
        </div>
        <BtnFollow followId={data.followId}
          handleFan={props.followBlogger}
        />
      </div>
    )
  }
}

export {
  RBFromBlogger,
  RBFromTag,
  RBFromTagS,
  BloggerItem,
  BloggerItemCol
}