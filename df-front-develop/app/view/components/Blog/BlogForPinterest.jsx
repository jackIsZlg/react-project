import classNames from 'classnames'
import base from '../../common/baseModule'
import { Icon} from '../../components/base/baseComponents'
import SelectPop from '../SelectPop/SelectPopForPinterest'
import ReportPop from '../ReportPop/ReportPop'
import LoadImage from '../base/LoadImage'
import {wfTypeData} from '../../common/module/eventModule'
import PicturePreview from '../PicturePreview/PicturePreview'
import NewTipGuide from '../../components/NewTipGuide/NewTipGuide'

let guideEl
let postViewGuide = 'postViewGuide2'

$('#app').append('<div id="blog-pop-wrapper"></div>')
class BlogCover extends React.Component {
  componentWillMount() {
    this.__setState(this.props, this.props.hidden)
  }

  componentDidMount() {
    this.bindKeyDown()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.hidden === false) {
      // this.props = nextProps;
      this.__setState(nextProps, false)
      // this.setState(nextProps);
    } else {
      this.setState({hidden: true})
    }
  }

  // 更新数据
  __setState(props, hidden) {
    console.log('设置参数')
    let pagination
    let _blogId = props.wfData[props.outIndex].id
    this.setState({
      hidden,
      blogId: _blogId,
      outIndex: props.outIndex,
      loading: false,
      // closeBody: window.isBodyScroll
    }, () => {
      // 锁定浮层下层
      // window.isBodyScroll && base.bodyScroll(false);
      base.bodyScroll(false)
      pagination = this.calculatePagination()
      this.setState({
        itemNext: pagination.itemNext,
        itemPre: pagination.itemPre
      })
    })
  }

  // 关闭弹出层
  handleClose(e) {
    e.stopPropagation()
    let code = '1010002'
    let content = {
      preEvent: '用户点击大图',
      content: '用户点击大图-直接关闭页面',
      type: '1',
      typeDesc: '用户点击大图-直接关闭页面'
    }

    base.ajaxList.addPoint(code, content)

    if (this.props.unHidden) { // 单独页面逻辑
      return
    }
    this.setState({hidden: true}, function () {
      window.history.pushState(null, '', this.props.originalPath)
      // this.state.closeBody && base.bodyScroll(true);
      base.bodyScroll(true)
    })
  }

  // 绑定键盘事件
  bindKeyDown() {
    let self = this
    document.addEventListener('keydown', (e) => {
      // 未显示详情页，该事件不处理
      if (this.state.hidden) {
        return
      }

      // 方向键左
      if (e.keyCode * 1 === 37) {
        self.state.itemPre !== -1 && self.pagination('pre')
      }
      // 方向键右
      if (e.keyCode * 1 === 39) {
        self.state.itemNext !== -1 && self.pagination('next')
      }
    })
  }

  judgeIndex(i) {
    return this.props.wfData[i].isBlogCover !== false
  }

  // 计算下一条博客 ID
  calculateCurrentBlog(dir) {
    let self = this
    let len = self.props.wfData.length
    let outIndex = self.state.outIndex
    let newIndex = -1

    if (dir === 'next') {
      for (let i = outIndex + 1; i < len; i++) {
        if (self.judgeIndex(i)) {
          newIndex = i
          break
        }
      }
    }

    if (dir === 'pre') {
      for (let i = outIndex - 1; i > -1; i--) {
        if (self.judgeIndex(i)) {
          newIndex = i
          break
        }
      }
    }

    return newIndex
  }

  // 计算前一条 后一条数据
  calculatePagination() {
    let itemPre
    let itemNext

    if (this.props.wfData.length === 1) {
      itemNext = -1
      itemPre = -1
    } else {
      itemNext = this.calculateCurrentBlog('next')
      itemPre = this.calculateCurrentBlog('pre')
    }

    return {
      itemNext,
      itemPre,
    }
  }

  // 点击翻页
  pagination(dir) {
    let pagination
    let _outInex
    // let _blogId

    // 获取翻页动作对应索引
    if (dir === 'next') {
      _outInex = this.state.itemNext
    } else if (dir === 'pre') {
      _outInex = this.state.itemPre
    }

    // _blogId = this.props.wfData[_outInex].id
    // if (!_blogId) {
    //   return
    // }

    // 提前计算下一批前后页数据
    this.state.outIndex = _outInex
    pagination = this.calculatePagination()

    this.setState({
      itemPre: pagination.itemPre,
      itemNext: pagination.itemNext,
    })

    // 指定浏览器内url
    // let url = this.props.wfData[this.state.outIndex].wfItemType === 'runway' ?
    //   `/show/img/detail/${_blogId}` : `/blog/detail/${_blogId}`
    // this.setState({
    //   itemPre: pagination.itemPre,
    //   itemNext: pagination.itemNext,
    //   blogId: _blogId
    // }, () => {
    //   window.history.pushState({
    //     blogId: _blogId,
    //     outIndex: this.state.outIndex,
    //     originalPath: this.props.originalPath
    //   }, '', url)
    // })
  }

  // 下一页
  handleNext(e) {
    e.stopPropagation()
    this.pagination('next')
    base.eventCount.add(1061, {
      '用户ID': base.LS().id
    })
  }

  // 上一页
  handlePre(e) {
    e.stopPropagation()
    this.pagination('pre')
    base.eventCount.add(1061, {
      '用户ID': base.LS().id
    })
  }

  render() {
    console.log('BlogCover重新渲染', this.state)
    return (
      <div
        ref="cover"
        className={classNames('blog-cover', {hidden: this.state.hidden})}
        id="cover"
        onClick={this.handleClose.bind(this)}
      >
        <div className={classNames('paginate', 'pre', { hidden: this.state.itemPre === -1 })}
          onClick={this.handlePre.bind(this)}
        >
          <Icon type="pre"/>
        </div>

        <div className={classNames('paginate', 'next', { hidden: this.state.itemNext === -1 })}
          onClick={this.handleNext.bind(this)}
        >
          <Icon type="next"/>
        </div>

        <div className="close-btn" onClick={this.handleClose.bind(this)}>
          <Icon type="close-pop"/>
        </div>

        {
          !this.state.hidden &&
          <Blog
            wfType={this.props.wfType}
            handleCollection={this.props.handleCollection}
            // blogId={this.state.blogId}
            wfItemData={this.props.wfData[this.state.outIndex]}
            handleAddFolder={this.props.handleAddFolder}
            columnWidth={this.props.columnWidth}
            hidden={this.state.hidden}
            outIndex={this.props.outIndex}
            originalPath={this.props.originalPath}
          />
        }
      </div>
    )
  }
}

// 主体部分
class Blog extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      imgData: this.props.wfItemData,
    }
    // this.userCountB()
  }

  componentWillMount() {
    // this.getBlogData(this.props)
  }

  componentWillReceiveProps(nextProps) {
    // if (this.props.blogId !== nextProps.blogId) {
    //   this.getBlogData(nextProps)
    // }
    this.setState({
      imgData: nextProps.wfItemData,
    })
  }

  // 获取博客信息
  getBlogData(props) {
    let self = this
    let blogId = props.blogId
    let type = props.wfItemData.wfItemType
    let getData

    if (!blogId) return

    if (type === 'runway') {
      getData = base.ajaxList.getRunwayImgDetail
    } else {
      switch (self.props.wfType) {
        case 'orderMeeting':
          getData = base.ajaxList.getOrderDetail
          break
        case 'brandImage':
          getData = base.ajaxList.getMarketDetail
          break
        default:
          getData = base.ajaxList.getInsImgDetail
      }
    }

    getData(blogId, (d) => {
      self.setState(self.preDealImgData(d.result, type))
    }, () => {
      console.log('网络错误')
    })

    self.state = {}
  }

  // 埋点
  userCountB() {
    let code = '1010004'
    let content = {
      preEvent: document.referrer,
      content: window.location.href,
      type: '5',
      typeDesc: '进入到博客详情页'
    }
    base.ajaxList.basic({
      type: 'GET',
      async: false,
      url: `${base.baseUrl}/track-log?code=${code}&content=${encodeURIComponent(JSON.stringify(content))}`,
    }, () => {
      console.log('success')
    }, () => {
    })
  }

  // 预处理后端返回图片数据
  preDealImgData(d, type) {
    let data = {}
    if (type === 'runway') {
      data = {
        averageHue: d.averageHue,
        mediaUrl: d.mediaUrl,
        width: d.width,
        height: d.height,
        id: d.id,
        nickname: d.showName || 'RA',
        platformName: d.season || '',
        designerId: d.designerId,
        followId: d.followId,
        favoriteCount: d.favoriteCount
      }
    } else {
      switch (this.props.wfType) {
        case 'orderMeeting':
          data = {
            averageHue: d.current.averageHue, // 图片主色调
            mediaUrl: d.current.mediaurl, // 主图
            width: d.current.width, // 主图宽
            height: d.current.height, // 主图高
            id: d.current.id,
            postId: d.current.postid || d.current.postId,
            createdAt: d.current.createdAt, // 图片上传时间
            collect: d.current.collect,
            views: d.current.views,
            brand: d.current.brand,
            season: d.current.season,
            category: d.current.category,
          }
          break
        case 'brandImage':
          data = {
            averageHue: d.averageHue, // 图片主色调
            mediaUrl: d.mediaUrl, // 主图
            id: d.postId,
            postId: d.postId,
            createdAt: d.time, // 图片上传时间
            collect: d.collect,
            views: d.views,
            brand: d.brand,
            category: d.category,
            itemUrl: d.itemUrl,
            detailUrls: d.detailUrls
          }
          break
        default:
          data = {
            averageHue: d.post.averageHue, // 图片主色调
            mediaUrl: d.post.mediaUrl, // 主图
            width: d.post.width, // 主图宽
            height: d.post.height, // 主图高
            id: d.post.id,
            postTime: d.post.postTime, // 图片上传时间
            textContent: d.post.textContent, // 评论
            postTag: d.postTag, // 图片标签
            platformName: d.post.blogger.platformName, // 来源
            bloggerId: d.post.blogger.id,
            followId: d.post.blogger.followId,
            favoriteCount: d.post.favoriteCount,
            nickname: d.post.blogger.nickname,
            avatarImg: d.post.blogger.headImg,
            postUrl: d.post.postUrl,
            platformId: d.post.blogger.platformId
          }
      }
    }
    return data
  }

  // 加入精选集
  handleSelectPop11() {
    let {id, postId, mediaUrl, nickname} = this.state
    let wrapperEl = document.getElementById('select-pop-wrapper')
    let _id = this.props.wfType === 'orderMeeting' ? postId : id
    let code = '1010006'
    let content = {
      preEvent: '精选图片',
      content: '打开图片详情-精选大图',
      type: '1',
      typeDesc: '打开图片详情-精选大图'
    }

    if (!!wrapperEl.innerHTML) {
      wrapperEl.innerHTML = ''
    }

    if (this.props.wfType === 'index' || this.props.wfType === 'runwayDetail') {
      base.ajaxList.addPoint(code, content)
    }

    ReactDOM.render(<SelectPop blogId={_id}
      wfType={this.props.wfType}
      mediaUrl={mediaUrl}
      nickname={nickname}
      outIndex={this.props.outIndex}
      handleAddFolder={this.props.handleAddFolder}
      hidden={false}
    />, wrapperEl)
    base.eventCount.add(1017, {
      '来源页面': wfTypeData[this.props.wfType].name,
      '图片Id': id,
      '用户ID': base.LS().id
    })
  }

  // 打开精选集管理
  handleSelectPop() {
    let { nickname} = this.state
    let wrapperEl = document.getElementById('select-pop-wrapper')
    if (!!wrapperEl.innerHTML) {
      wrapperEl.innerHTML = ''
    }
    ReactDOM.render(<SelectPop
      blogId=""
      wfType="orderMeeting"
      mediaUrl={this.props.wfItemData.bigUrl}
      nickname={nickname}
      outIndex={this.props.outIndex}
      handleAddFolder={this.props.handleAddFolder}
      hidden={false}
    />, wrapperEl)
  }

  changeImage(imgSrc) {
    this.setState({
      mediaUrl: imgSrc
    })
  }

  render() {
    const {imgData} = this.state
    return (
      <div className="blog-container">
        <div className="blog-wrapper" onClick={e => e.stopPropagation()}>
          <BlogHeader
            // id={imgData.id}
            type={this.props.wfItemData.wfItemType}
            // bloggerId={imgData.bloggerId}
            nickname={imgData.nickname}
            mediaUrl={imgData.bigUrl}
            width={imgData.bigWidth}
            height={imgData.bigHeight}
            handleSelectPop={this.handleSelectPop.bind(this)}
          />
          <div className="blog-content">
            <BlogImage src={imgData.bigUrl}
              bgColor={imgData.averageHue}
              aliWidth={this.props.columnWidth}
              width={imgData.bigWidth}
              height={imgData.bigHeight}
            />
          </div>
        </div>
      </div>
    )
  }
}

// header 部分 ，包括放大、分享、举报、精选
class BlogHeader extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      href: base.LS().userId ? `${this.props.mediaUrl}?response-content-type=application/octet-stream` : 'javascript:;',
    }
  }

  componentDidMount() {
    this.judgePostViewGuide()
  }

  // 判断是否需要指引
  judgePostViewGuide() {
    if (base.LS()[postViewGuide]) {
      return
    }

    // 2:图片详情页
    base.ajaxList.getNewGuide(2, (d) => {
      // d.result(0:需要指引；1:不需要指引)
      if (d.result) {
        let store = {}
        store[postViewGuide] = 1
        base.LS.set(store)
        return
      }

      this.showGuide()
    })
  }

  // 创建指引容器，并把指引组件渲染到容器中
  showGuide() {
    let that = this

    guideEl = document.createElement('div')
    guideEl.id = 'guide-wrapper2'

    document.body.appendChild(guideEl)

    that.renderPostViewGuide()

    window.onresize = function () {
      that.renderPostViewGuide()
    }
  }

  // downloadPic() {
  //   let self = this
  //   base.request({
  //     'type': 'GET',
  //     'url': `${base.baseUrl}/users/login-state`
  //   }).done((d) => {
  //     if (d.success) {
  //       d.result * 1 !== 0 && self.setState({ href: `${this.props.mediaUrl}?response-content-type=application/octet-stream` })
  //     }
  //   }).fail()
  // }


  initShareInfo() {
    let shareObj = {
      runway: {
        id: this.props.id,
        url: `${base.baseUrl}/mobile/show/share/${this.props.id}`,
        image: this.props.mediaUrl,
        title: `${this.props.nickname}的秀场`,
        description: 'DeepFashion-每天都想刷的时尚'
      },
      defaults: {
        id: this.props.id,
        url: `${base.baseUrl}/mobile/blog/share/${this.props.id}`,
        image: this.props.mediaUrl,
        title: `${this.props.nickname}的时尚图片`,
        description: 'DeepFashion-每天都想刷的时尚'
      }
    }
    let obj = shareObj.hasOwnProperty(this.props.type) ?
      shareObj[this.props.type] :
      shareObj.defaults

    return obj
  }

  // 举报
  handleReport(e) {
    let wrapperEl = document.getElementById('report-pop-wrapper')
    if (!!wrapperEl.innerHTML) {
      wrapperEl.innerHTML = ''
    }
    ReactDOM.render(<ReportPop hidden={false}
      mediaUrl={this.props.mediaUrl}
      blogId={this.props.id}
    />, wrapperEl)
    e.stopPropagation()
  }

  closeMask(el) {
    document.body.removeChild(el)
  }

  handleZoomEvent() {
    let newEl = document.createElement('div')
    newEl.id = 'picture-mask-wrapper'
    document.body.appendChild(newEl)

    base.eventCount.add(1016)
    let picInfo = {
      src: this.props.mediaUrl,
      picWidth: this.props.width,
      picHeight: this.props.height
    }

    ReactDOM.render(<PicturePreview {...picInfo}
      closeClick={this.closeMask.bind(this, newEl)}
    />, newEl)
  }

  // 渲染指引组件
  renderPostViewGuide() {
    let that = this
    let messages = {
      targetElInfo: [{targetEl: that.btnEl, position: 'top right'}],
      tip: ['喜欢这张图片？点击精选保存下来吧'],
      total: 1,
      renderGuideFun: that.renderPostViewGuide,
      wrapper: guideEl,
      localName: postViewGuide
    }

    ReactDOM.render(<NewTipGuide {...messages}/>, guideEl)
  }
  render() {
    return (
      <div className="blog-header">
        <div className="btn-wrapper">
          <button className="btn-media-img"
            onClick={this.handleZoomEvent.bind(this)}
            data-max-pic={this.props.mediaUrl}
            ref="btnZoom"
          >
            <Icon type="fangda"/>
          </button>
        </div>
        {/* <div className="btn-wrapper">
          <a className="img-btn-download" href={this.state.href} onClick={this.downloadPic.bind(this)}>
            <Icon type="img-download" />
          </a>
        </div> */}
        <button ref={el => this.btnEl = el}
          className="add-folder float-r"
          onClick={this.props.handleSelectPop}
        >
          <Icon type="follow-blog"/>精选
        </button>
      </div>
    )
  }
}

// 图片
class BlogImage extends React.Component {
  closeMask(el) {
    document.body.removeChild(el)
  }

  handleEvent() {
    let newEl = document.createElement('div')
    newEl.id = 'picture-mask-wrapper'
    document.body.appendChild(newEl)

    let picInfo = {
      src: this.props.src,
      picWidth: this.props.width,
      picHeight: this.props.height
    }

    ReactDOM.render(<PicturePreview {...picInfo} closeClick={this.closeMask.bind(this, newEl)}/>, newEl)
  }

  noRightClick(event) {
    event.preventDefault ? event.preventDefault() : (event.returnValue = false)
  }

  render() {
    let _scale = this.props.height / this.props.width
    let _w = 560
    let _h = 560 * _scale
    return (
      <div className="blog-meida-img"
        onClick={this.handleEvent.bind(this)}
        ref="zoom"
        data-max-pic={this.props.src}
        onContextMenu={this.noRightClick.bind(this)}
      >
        <LoadImage
          bgColor={this.props.bgColor}
          src={this.props.src}
          aliWidth={560}
          width={_w}
          height={_h}
        />
      </div>
    )
  }
}


export {BlogCover, Blog}

