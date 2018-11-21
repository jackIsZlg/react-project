import classNames from 'classnames'
import base from '../../common/baseModule'
import { BtnFollow, Icon } from '../../components/base/baseComponents'
import SelectPop from '../SelectPop/SelectPop'
import ReportPop from '../ReportPop/ReportPop'
import LoadImage from '../base/LoadImage'
import SharePane from '../../components/SharePane/SharePane'
import { wfTypeData } from '../../common/module/eventModule'
import { RBFromBlogger } from '../RecomBlogger/RecomBlogger'
import WaterFall from '../../components/WaterFall/WaterFall'
import PicturePreview from '../PicturePreview/PicturePreview'
import NewTipGuide from '../../components/NewTipGuide/NewTipGuide'
import {Folderlist} from '../../components/FolderItem/Folder'

let guideEl
let postViewGuide = 'postViewGuide2'
let waterFallPointContent = {
  source_page: 'pic_detail',
  source_type: 'recommended'
}
let mainPointContent = {
  source_page: 'pic_detail',
  source_type: 'main_pic',
}
let seeBlogger = {
  source_page: 'pic_detail',
  source_type: 'recommended_pic_blogger'
}
let nextPic = {
  source_page: 'pic_detail',
  source_type: 'next_pic'
}

$('#app').append('<div id="blog-pop-wrapper"></div>')

let handleAddFolder = function () {
  let {handleAddFolder} = this.state
  handleAddFolder && handleAddFolder()
}

// cover close pagination
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
      this.setState({ hidden: true })
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
      // loading: false,
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

    if (this.props.unHidden) { // 单独页面逻辑
      return
    }
    this.setState({ hidden: true }, () => {
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
          // if (!self.state.loading && self.props.wfData.length - outIndex < 10) {
          //     self.state.loading = true;
          //     self.props.getData(() => {
          //         self.state.loading = false;
          //     });
          // }
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

    // console.log(itemPre, itemNext);

    return {
      itemNext,
      itemPre,
    }
  }

  // 点击翻页
  pagination(dir) {
    let pagination
    let _blogId
    let bloggerId
    let _outInex
    let postId
    // 获取翻页动作对应索引
    if (dir === 'next') {
      _outInex = this.state.itemNext
    } else if (dir === 'pre') {
      _outInex = this.state.itemPre
    }

    _blogId = this.props.wfData[_outInex].id
    postId = this.props.wfData[_outInex].postId || this.props.wfData[_outInex].id
    bloggerId = this.props.wfData[_outInex].bloggerId

    if (!_blogId) {
      return
    }
    this.content = this.props.pointContent || nextPic
    this.content.source_type = 'next_pic'
    this.content.pic_id = _blogId
    this.content.blogger_id = bloggerId
    this.content.index = _outInex - 1
    if (this.content.source_page === 'pic_detail') {
      this.content.source_pic_id = this.props.wfData[_outInex].sourceId
    }
    base.ajaxList.addPoint(2100001, this.content)

    // 提前计算下一批前后页数据
    this.state.outIndex = _outInex
    pagination = this.calculatePagination()

    // 指定浏览器内url
    let folderId = base.queryString('folderId')
    let picUrl = folderId ? `/blog/detail/${postId}?folderId=${folderId}` : `/blog/detail/${postId}`
    let url = this.props.wfData[this.state.outIndex].wfItemType === 'runway' ?
      `/show/img/detail/${_blogId}` : picUrl
    console.log('翻页跳转', this.props.wfData)
    this.setState({
      itemPre: pagination.itemPre,
      itemNext: pagination.itemNext,
      blogId: _blogId
    }, () => {
      window.history.pushState({
        blogId: _blogId,
        outIndex: this.state.outIndex,
        originalPath: this.props.originalPath
      }, '', url)
    })
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
    return (
      <div ref="cover"
        className={classNames('blog-cover', {
          hidden: this.state.hidden,
          isScroll: this.props.wfType === 'orderMeeting' || this.props.wfType === 'brandImage'
        })}
        id="cover"
        style={{zIndex: 101}}
        onClick={(!(this.props.wfType === 'orderMeeting' || this.props.wfType === 'brandImage')) && this.handleClose.bind(this)}
      >
        <div className={classNames('paginate', 'pre', {
          hidden: this.state.itemPre === -1
        })}
          onClick={this.handlePre.bind(this)}
        >
          <Icon type="pre" />
        </div>
        <div className={classNames('paginate', 'next', {
          hidden: this.state.itemNext === -1
        })}
          onClick={this.handleNext.bind(this)}
        >
          <Icon type="next" />
        </div>

        <div className="close-btn" onClick={this.handleClose.bind(this)}>
          <Icon type="close-pop" />
        </div>

        {
          !this.state.hidden && <Blog wfType={this.props.wfType}
            handleCollection={this.props.handleCollection}
            blogId={this.state.blogId}
            wfItemData={this.props.wfData[this.state.outIndex]}
            handleAddFolder={handleAddFolder.bind(this)}
            columnWidth={this.props.columnWidth}
            hidden={this.state.hidden}
            outIndex={this.props.outIndex}
            originalPath={this.props.originalPath}
            pointContent={this.content}
          />
        }
      </div>)
  }
}

// 主体部分
class Blog extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      defaultContent: <Icon type="indicator" />
    }
  }

  componentWillMount() {
    this.getBlogData(this.props)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.blogId !== nextProps.blogId) {
      this.getBlogData(nextProps)
    }
  }

  // 获取博客信息
  getBlogData(props) {
    let self = this
    let blogId = props.blogId
    let folderId = (props.wfItemData && props.wfItemData.folderId) || base.queryString('folderId')
    let type = props.wfItemData.wfItemType
    let getData
    if (!blogId) return

    if (type === 'runway') {
      getData = base.ajaxList.getRunwayImgDetail
      getData(blogId, d => self.callBack(d, type))
    } else {
      switch (self.props.wfType) {
        case 'orderMeeting':
          getData = base.ajaxList.getOrderDetail
          getData(blogId, d => self.callBack(d, type))
          break
        case 'brandImage':
          getData = base.ajaxList.getMarketDetail
          getData(blogId, d => self.callBack(d, type))
          break
        default:
          getData = base.ajaxList.getInsImgDetail
          getData(blogId, folderId, d => self.callBack(d, type))
      }
    }

    self.state = {}
  }

  getBlogMoreData(data) {
    base.ajaxList.basic({
      type: 'GET',
      url: `${base.baseUrl}/owner/get-detail-by-post?id=${data.id}&postId=${data.id}`
    }, (d) => {
      let moreInfo = {}
      for (let key in d.result) {
        if (!data.hasOwnProperty(key)) {
          let itemInfo = d.result[key]
          key === 'postList' && itemInfo && itemInfo.map(v => v.wfItemType = 'ins')
          moreInfo[key] = itemInfo
        }
      }
      this.setState({...moreInfo, ...data}, () => {
        console.log(this.state)
      })
    })
  }

  callBack(d, type) {
    let basicInfo = this.preDealImgData(d.result, type)
    basicInfo.platformId * 1 === 1 ? this.getBlogMoreData(basicInfo) : this.setState(basicInfo)
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
            userId: d.post.blogger.bloggerPlatformId,
            postUrl: d.post.postUrl,
            platformId: d.post.blogger.platformId,
            // remarks: d.post.remark || 'Mini bouquets are an easy way to make someone happy any day of the week. Today, we broke down what flowers we used for three different styles of mini bouquets. are an easy way to make someone happy easy way to make someone happy any day of the week. Today, we broke down what flowers we used for three different styles of mini bouquets. are an easy way to make someone happyanya',
            remarks: d.favoriteRemark || ''
          }
      }
    }
    return data
  }

  // 加入精选集
  addSelectPop() {
    let { id, postId, mediaUrl, nickname } = this.state
    let wrapperEl = document.getElementById('select-pop-wrapper')
    let _id = this.props.wfType === 'orderMeeting' ? postId : id
    base.ajaxList.addPoint(2100002, mainPointContent)
    ReactDOM.render(<SelectPop blogId={_id}
      wfType={this.props.wfType}
      mediaUrl={mediaUrl}
      nickname={nickname}
      outIndex={this.props.outIndex}
      handleAddFolder={handleAddFolder.bind(this)}
      hidden={false}
    />, wrapperEl)
    base.eventCount.add(1017, {
      '来源页面': wfTypeData[this.props.wfType].name,
      '图片Id': id,
      '用户ID': base.LS().id
    })
  }

  changeImage(imgSrc) {
    this.setState({
      mediaUrl: imgSrc
    })
  }

  downloadPic() {
    // let self = this
    base.request({
      'type': 'GET',
      'url': `${base.baseUrl}/users/login-state`
    }).done((d) => {
      if (d.success) {
        let content = {
          pic_qty: 1
        }
        for (let key in mainPointContent) {
          content[key] = mainPointContent[key]
        }
        base.ajaxList.addPoint(2100004, content)
        // d.result * 1 !== 0 && self.setState({ href: `${this.props.mediaUrl}?response-content-type=application/octet-stream` })
      }
    }).fail()
  }

  openNewPage(index) {
    let {postList, bloggerId} = this.state
    let itemData = postList[index]
    let url = `/blog/detail/${itemData.id}`

    if (itemData.id * 1 === base.getUrlStringId() * 1) {
      return
    }
    if (index === 8) {
      let content = {
        source_page: 'pic_detail',
        source_type: 'recommend_blogger_pic',
        blogger_id: bloggerId
      }
      base.ajaxList.addPoint(2300001, content)
      window.open(`/owner/${bloggerId}`, '_target')
      return
    }
    let originalPath = this.props.originalPath || window.location.toString()
    let content = {
      source_page: 'pic_detail',
      source_type: 'recommend_blogger_pic',
      pic_type: itemData.platformId,
      pic_id: itemData.id,
      blogger_id: bloggerId,
      index,
    }
    base.ajaxList.addPoint(2100001, content)
    ReactDOM.render(<BlogCover wfType='recommendBlog'
      columnWidth={288}
      hidden={false}
      outIndex={index}
      wfData={postList}
      originalPath={originalPath}
    />, document.getElementById('blog-pop-wrapper'))
    window.history.pushState({
      blogId: itemData.id,
      outIndex: index,
      originalPath: window.location.toString()
    }, '', url)
  }

  render() {
    let data = this.state
    let wfUrl = `/recommend/post-list?postId=${this.props.blogId}`
    if (JSON.stringify(data) === '{}') {
      return <div style={{marginTop: '210px', textAlign: 'center'}}>加载中...</div>
    }
    console.log('renderId', data.id)
    if (!data.id) {
      return null
      // return (
      //   <div className="blog-wrapper empty" onClick={e => e.stopPropagation()}>
      //     <div className="blog-wrapper-none">{this.state.defaultContent}</div>
      //   </div>
      // )
    }

    mainPointContent.blogger_id = data.bloggerId
    mainPointContent.pic_type = this.state.platformId || this.props.pointContent && this.props.pointContent.pic_type
    mainPointContent.tag = this.props.pointContent && this.props.pointContent.tag
    if (this.props.wfType === 'orderMeeting' || this.props.wfType === 'brandImage') {
      mainPointContent.pic_id = data.postId
      return (
        <div className="blog-container">
          <div className="blog-detail">
            <div className="blog-detail-left">
              <OrderDetail id={data.id}
                postId={data.postid || data.postId}
                src={data.mediaUrl}
                bgColor={data.averageHue}
                handleSelect={this.addSelectPop.bind(this)}
                width={data.width}
                height={data.height}
                downloadPic={this.downloadPic.bind(this)}
              />
            </div>
            <div className="blog-detail-right">
              <p className="blog-detail-title">
                {data.season} {data.brand}
              </p>
              <div className="blog-detail-intro">
                <div className="blog-detail-count">
                  <div className="font-set browse">
                    <span>浏览量：</span>{data.views || 0}次
                  </div>
                  <div className="font-set selected">
                    <span>精选：</span>{data.collect || 0}次
                  </div>
                </div>
                <div className='font-set'><span>更新日期：</span>{data.createdAt}</div>
                {
                  data.itemUrl &&
                  <div className='font-set'><span>图片来源：</span>
                    <a href={data.itemUrl} rel="noopener noreferrer" target='_blank'>{data.itemUrl}</a>
                  </div>
                }
                {data.brand && <div className='font-set'><span>品牌：</span>{data.brand}</div>}
                {
                  (data.category || data.brand) &&
                  <div className='font-set tag'>
                    <span>标签：</span>
                    <ul className='font-set-tag-list'>
                      {data.category &&
                        <li className='font-set-tag-list-item'>{data.category}</li>}
                      {data.brand && <li className='font-set-tag-list-item'>{data.brand}</li>}
                    </ul>
                  </div>
                }
                {
                  data.detailUrls && !!data.detailUrls.length &&
                  <div className="details-image images">
                    <div className="details-image-title">
                      细节图
                    </div>
                    <ul className='details-image-total'>
                      {data.detailUrls.map(item => (
                        <li className='details-image-item'
                          onClick={this.changeImage.bind(this, item)}
                        >
                          <img src={base.ossImg(item, 160)} alt="" />
                        </li>
                      ))}
                    </ul>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      )
    }
    mainPointContent.pic_id = data.id
    if (data.platformId * 1 === 1) {
      return (
        <div className="blog-container ins">
          <div className="blog-wrapper-info">
            <div className="blog-wrapper" onClick={e => e.stopPropagation()}>
              <BlogHeader id={data.id}
                type={this.props.wfItemData.wfItemType}
                bloggerId={data.bloggerId}
                nickname={data.nickname}
                mediaUrl={data.mediaUrl}
                width={data.width}
                height={data.height}
                addSelectPop={this.addSelectPop.bind(this)}
                downloadPic={this.downloadPic.bind(this)}
              />
              <div className="blog-content">
                <BlogImage src={data.mediaUrl}
                  bgColor={data.averageHue}
                  aliWidth={this.props.columnWidth}
                  width={data.width}
                  height={data.height}
                  setWidth={622}
                  pointContent={mainPointContent}
                />
                <BlogExtraInfo postUrl={data.postUrl}
                  platformId={data.platformId}
                  platformName={data.platformName}
                  postTime={data.postTime}
                  num={data.favoriteCount}
                />
                {
                  data.remarks ? <Remarks remark={data.remarks}/> : <BlogTextContent textContent={data.textContent} />
                }
              </div>
            </div>
            <div className="blog-info" onClick={e => e.stopPropagation()}>
              {
              this.props.wfItemData.wfItemType === 'runway' ?
                <Designer id={data.id}
                  nickname={data.nickname}
                  designerId={data.designerId}
                  avatarImg={data.avatarImg}
                  followId={data.followId}
                /> :
                <Blogger {...data} 
                  seeBlogger={seeBlogger}
                  followBlogger={seeBlogger}
                />
              }
              <ul className="blogger-basic">
                <li className="blogger-basic-item">
                  <div className="count">{base.numberFormat(data.postNum)}</div>
                  图片
                </li>
                <li className="blogger-basic-item">
                  <div className="count">{base.numberFormat(data.fansNum)}</div>
                  粉丝
                </li>
              </ul>
              <ul className="blogger-img">
                <div className="blogger-img-header">
                TA的最新图片
                </div>
                {
                  data.postList && data.postList.map((item, index) => {
                    let bgStyle = {
                      background: item.averageHue ? item.averageHue.replace('0x', '#') : base.getRandomColor()
                    }
                    return (
                      <li className="blogger-img-item" style={bgStyle} onClick={this.openNewPage.bind(this, index)}>
                        {
                        data.postNum > data.postList.length && index === data.postList.length - 1 &&
                        <div className="blogger-img-item-mask">
                          <Icon type="follow-blogger"/>
                          查看更多
                        </div>
                      }
                        <img src={base.ossImg(item.mediaUrl, 120)} alt=""/>
                      </li>
                    ) 
})
                }
              </ul>
            </div>
          </div>
          {
            this.props.wfItemData.wfItemType === 'ins' &&
            <div onClick={e => e.stopPropagation()}>
              <NewFolder id={data.id}/>
              <WaterFall key="waterWall"
                popStateFlag={false}
                originalPath={this.props.originalPath || ''}
                wfType="recommendBlog"
                dataUrl={wfUrl}
                sourceId={data.id}
                pointContent={waterFallPointContent}
                seeBlogger={seeBlogger}
                recommendContent={{
                  source_page: 'pic_detail',
                  recommend_type: 'picture'
                }}
              />
            </div>
          }
        </div>
      )
    }
    return (
      <div className="blog-container">
        <div className="blog-wrapper" onClick={e => e.stopPropagation()}>
          <BlogHeader id={data.id}
            type={this.props.wfItemData.wfItemType}
            bloggerId={data.bloggerId}
            nickname={data.nickname}
            mediaUrl={data.mediaUrl}
            width={data.width}
            height={data.height}
            addSelectPop={this.addSelectPop.bind(this)}
            downloadPic={this.downloadPic.bind(this)}
          />
          <div className="blog-content">
            <BlogImage src={data.mediaUrl}
              bgColor={data.averageHue}
              aliWidth={this.props.columnWidth}
              width={data.width}
              height={data.height}
              pointContent={mainPointContent}
            />
            <BlogExtraInfo postUrl={data.postUrl}
              platformName={data.platformName}
              postTime={data.postTime}
            />
            <BlogTag postTag={this.state.postTag || []} />
            <ImgFolderNum num={data.favoriteCount} />
            {this.props.wfItemData.wfItemType === 'runway' ?
              <Designer id={data.id}
                nickname={data.nickname}
                designerId={data.designerId}
                avatarImg={data.avatarImg}
                followId={data.followId}
              /> :
              <Blogger {...data} 
                seeBlogger={seeBlogger}
                followBlogger={seeBlogger}
              />
            }
            {
              data.remarks ? <Remarks remark={data.remarks}/> : data.platformId * 1 !== 5 && <BlogTextContent textContent={data.textContent} />
            }
          </div>
        </div>
        {this.props.wfItemData.wfItemType === 'ins' &&
          <div onClick={e => e.stopPropagation()}>
            <RBFromBlogger bloggerId={data.bloggerId}
              source="图片详情"
              followBlogger={seeBlogger}
              recommend={{
                source_page: 'pic_detail',
                recommend_type: 'blogger'
              }}
              seeBlogger={{
                source_page: 'pic_detail',
                source_type: 'recommended'
              }}
            />
            <WaterFall key="waterWall"
              popStateFlag={false}
              originalPath={this.props.originalPath || ''}
              wfType="recommendBlog"
              dataUrl={wfUrl}
              pointContent={waterFallPointContent}
              seeBlogger={seeBlogger}
              recommendContent={{
                source_page: 'pic_detail',
                recommend_type: 'picture'
              }}
            />
          </div>}
      </div>
    )
  }
}

class Remarks extends React.Component {
  render() {
    return (
      <div className='blog-text-content remark-content'>{this.props.remark}</div>
    )
  }
}

class NewFolder extends React.Component {
  constructor() {
    super()
    this.state = {
      resultList: [],
      index: 0,
      pageSize: 4,
      resultCount: 0
    }
  }
  componentDidMount() {
    this.getFolderInfo()
  }

  getFolderInfo() {
    let {id} = this.props
    let {index, pageSize, resultList} = this.state
    base.ajaxList.basic({
      type: 'GET',
      url: `${base.baseUrl}/folder/public/rel-folder-with-post?id=${id}&postId=${id}&start=${index * pageSize}&pageSize=${pageSize}`
    }, (d) => {
      let newData = this.dealFolderList(d.result.resultList)
      this.setState({
        resultList: [...resultList, ...newData],
        index: index += 1,
        resultCount: d.result.resultCount
      })
    })
  }

  // 处理精选集数据
  dealFolderList(folderList) {
    let newFolderList = []
    folderList.forEach((item) => {
      let newFolderListItem = {}
      let count = item.mediaUrls.length >= 5 ? 5 : item.mediaUrls.length
      newFolderListItem.cover = base.ossImg(item.mediaUrls[0])
      for (let i = 0; i < count; i++) {
        if (item.mediaUrls[i]) {
          let w = 0
          if (i === 0) {
            w = 275
          } else {
            w = 65
          }
          newFolderListItem[`cover_${i}`] = {
            backgroundImage: `url(${base.ossImg(item.mediaUrls[i], w)})`
          }
        } else {
          newFolderListItem[`cover_${i}`] = ''
        }
      }
      console.log('id', item.id)
      newFolderListItem.id = item.id
      newFolderListItem.num = item.folderCount
      newFolderListItem.folderName = item.name
      newFolderListItem.createrName = item.createrName
      newFolderListItem.colleced = item.colleced
      newFolderListItem.viewCount = item.viewCount
      newFolderListItem.firstFolder = item.firstFolder
      newFolderListItem.url = `/folder/public/${item.id}`

      newFolderList.push(newFolderListItem)
    })
    return newFolderList
  }

  changeStatus(id) {
    let {resultList} = this.state
    let name = ''
    let url = ''
    let albumId = 0
    let content = waterFallPointContent
    resultList && resultList.map((item) => {
      console.log('listId', item.id)
      if (item.id !== id) {
        return item
      }
      if (!item.colleced) {
        albumId = item.id
        name = item.folderName
        url = item.cover
        item.colleced = 1
        return item
      }
      item.colleced = 0
      return item
    })
    content.album_id = albumId
    name && base.ajaxList.addPoint(2200002, content)
    this.setState(resultList, () => {
      name && df_alert({
        tipImg: url,
        mainText: '收藏成功',
        subText: name
      })
    })
  }

  render() {
    let {resultList, resultCount} = this.state
    return (
      <div>
        {
          !!resultList.length &&
          <div className="pic-in-folder">
            <div className="pic-in-folder-header">
              图片所在精选集推荐
            </div>
            { 
              resultList && resultList.map(item => (
                <Folderlist
                  isIns={true}
                  key={item.id}
                  {...item}
                  changeStatus={this.changeStatus.bind(this)}
                  pointContent={waterFallPointContent}
                />
                ))
            }
            {
              resultCount !== resultList.length &&
              <div className="more-folder" onClick={this.getFolderInfo.bind(this)}>
                <Icon type="follow-blogger"/>
                加载更多
              </div>
            }
          </div>
        }
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
      shareData: this.initShareInfo()
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

    window.onresize = () => {
      that.renderPostViewGuide()
    }
  }

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

  // handleMouseHover(hidden = true) {
  //     if (!this.handleHover) {
  //         this.handleHover = true;
  //         this.createMessageTip = document.createElement('div');
  //         document.body.appendChild(this.createMessageTip);
  //         ReactDOM.render(<ToolTip hidden={hidden} pos='top' el={this.btnEl} background='white'>
  //             喜欢这张图片？点击精选保存下来吧
  //         </ToolTip>, this.createMessageTip);
  //     }else {
  //         this.handleHover = false;
  //         document.body.removeChild(this.createMessageTip);
  //     }
  // }

  // 渲染指引组件
  renderPostViewGuide() {
    let that = this
    let messages = {
      targetElInfo: [{ targetEl: that.btnEl, position: 'top right' }],
      tip: ['喜欢这张图片？点击精选保存下来吧'],
      total: 1,
      renderGuideFun: that.renderPostViewGuide,
      wrapper: guideEl,
      localName: postViewGuide
    }

    ReactDOM.render(<NewTipGuide {...messages} />, guideEl)
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
            <Icon type="fangda" />
          </button>
        </div>
        <div className="btn-wrapper btn-share-wrapper">
          <button className="btn-share-img">
            <Icon type="fenxiang1" />
          </button>
          <div className="share-wrapper">
            <SharePane showShare={true}
              shareType="图片"
              shareData={this.state.shareData}
              pointContent={mainPointContent}
            />
          </div>
        </div>
        <div className="btn-wrapper">
          <button className="btn-to-report"
            onClick={e => this.handleReport(e)}
          >
            <Icon type="jubao" />
          </button>
        </div>
        <div className="btn-wrapper">
          <a className="img-btn-download" href={`${this.state.href}?response-content-type=application/octet-stream`} download onClick={this.props.downloadPic}>
            <Icon type="img-download" />
          </a>
        </div>
        <button ref={el => this.btnEl = el}
          className="add-folder float-r"
          onClick={this.props.addSelectPop}
        >
          <Icon type="follow-blog" />精选
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

    ReactDOM.render(<PicturePreview {...picInfo} closeClick={this.closeMask.bind(this, newEl)} />, newEl)
  }

  noRightClick(event) {
    event.preventDefault ? event.preventDefault() : (event.returnValue = false)
  }

  render() {
    let _scale = this.props.height / this.props.width
    let _w = this.props.setWidth || 560
    let _h = _w * _scale
    return (
      <div className="blog-meida-img"
        onClick={this.handleEvent.bind(this)}
        ref="zoom"
        data-max-pic={this.props.src}
        onContextMenu={this.noRightClick.bind(this)}
      >
        <LoadImage bgColor={this.props.bgColor} src={this.props.src} aliWidth={560} width={_w} height={_h} />
      </div>
    )
  }
}

// 订货会详情页
class OrderDetail extends React.Component {
  // 举报
  handleReport(e) {
    let wrapperEl = document.getElementById('report-pop-wrapper')
    if (!!wrapperEl.innerHTML) {
      wrapperEl.innerHTML = ''
    }
    console.log(this.props.id)
    ReactDOM.render(<ReportPop hidden={false}
      mediaUrl={this.props.src}
      blogId={this.props.id}
    />, wrapperEl)
    e.stopPropagation()
    base.eventCount.add(1060, {
      '用户ID': base.LS().id
    })
  }

  closeMask(el) {
    document.body.removeChild(el)
  }

  handleEnlarge(e) {
    e.stopPropagation()
    let newEl = document.createElement('div')
    newEl.id = 'picture-mask-wrapper'
    document.body.appendChild(newEl)

    let picInfo = {
      src: this.props.src,
      picWidth: this.props.width,
      picHeight: this.props.height
    }

    ReactDOM.render(<PicturePreview {...picInfo} closeClick={this.closeMask.bind(this, newEl)} />, newEl)

    base.eventCount.add(1059, {
      '用户ID': base.LS().id
    })
  }

  handleSelect(e) {
    let { handleSelect } = this.props
    handleSelect && handleSelect()
    e.stopPropagation()
    base.ajaxList.addPoint(2100002, mainPointContent)
  }

  render() {
    let { src } = this.props
    return (
      <div className='order-img'>
        <div className='order-pic'>
          <img src={base.ossImg(src, 540)} alt="" />
        </div>
        <div className="order-fun">
          <Icon type='jubao' handleClick={this.handleReport.bind(this)} />
          <div className='order-operation'
            onClick={this.handleSelect.bind(this)}
          >
            <Icon type='jingxuan' />
            精选
          </div>
          <a href={`${src}?response-content-type=application/octet-stream`} download className='order-operation' onClick={this.props.downloadPic}>
            <Icon type='download' />
            下载
          </a>
        </div>
        <div className="order-enlarge" onClick={this.handleEnlarge.bind(this)}>
          <Icon type='fangda' />
        </div>
      </div>
    )
  }
}

// 图片附属信息
function BlogExtraInfo(props) {
  const { platformName, postTime, postUrl } = props
  return (
    <div className="blog-from-line">
      来自&nbsp;
      <a className="platform" href={postUrl} rel="noopener noreferrer" target='_blank'>{platformName}</a>
      <span className="time">
        {postTime ?
          postTime.split(' ')[0].replace(/(\d{4})-(\d{2})-(\d{2})/, '$1.$2.$3') : ''}
      </span>
      {
        (props.num && props.platformId === 1) ? 
          <div className="img-folder-num">
            已被精选 {props.num} 次
          </div> 
          : 
          null
      }
    </div>
  )
}

// 标签部分
class BlogTag extends React.Component {
  getLink(data) {
    let { frontType, tagId, content } = data
    let _link = ''
    switch (frontType * 1) {
      case 1:
        _link = `ca=${content}&caid=${tagId}`
        break
      case 2:
        _link = `li=${content}&liid=${tagId}`
        break
      case 3:
        _link = `ma=${content}&maid=${tagId}`
        break
      case 4:
        _link = `br=${content}&brid=${tagId}`
        break
      case 6:
        _link = `co=${content}&coid=${tagId}`
        break
      default:
        _link = ''
    }
    return `/gallery/styles#/${_link}`
  }

  renderTag() {
    let self = this
    return self.props.postTag && self.props.postTag.map((item, index) => {
      let _key = `blog-tag-${index}`
      let _link = `${self.getLink(item)}`
      return (
        <a href={_link}
          rel="noopener noreferrer"
          target="_blank"
          key={_key}
        >#{item.content}
        </a>
      )
    })
  }

  render() {
    return (
      <div className="blog-tag">
        {this.renderTag()}
      </div>
    )
  }
}

function jumpPage(link, bloggerId, seeBlogger) {
  // let code = '1010004'
  // let content = {
  //   preEvent: '进入到博客',
  //   content: '图片详情页-',
  //   type: '1',
  //   typeDesc: '图片详情页-点击根据兴趣推荐博主'
  // }
  let content = {
    blogger_id: bloggerId
  }
  for (let key in seeBlogger) {
    content[key] = seeBlogger[key]
  }
  content.source_type = 'main_pic_blogger'
  base.ajaxList.addPoint(2300001, content)
  window.open(link, '_blank')
}

// 博主 or 发布秀场
function Blogger(props) {
  const { bloggerId, avatarImg, nickname, followId, userId, platformId } = props
  let url = userId === base.LS().userId ? '/users/favorite-view' : `/users/folder/detail/${userId}`
  let _link = (platformId === 5 || platformId === 6) ? url : `/owner/${bloggerId}`
  return (
    <div className="blogger-info">
      <div className="blogger-avatar"
        onClick={() => jumpPage(_link, bloggerId, props.seeBlogger)}
      >
        <img src={base.ossImg(avatarImg, platformId === 1 ? 72 : 36)} alt={nickname} />
      </div>
      <div className="blogger-nickname"
        onClick={() => jumpPage(_link, bloggerId, props.seeBlogger)}
      >{nickname}
      </div>
      {
        (platformId === 5 || platformId === 6) ? null :
        <BloggerSupportButton
          id={bloggerId}
          type='ins'
          avatarImg={avatarImg}
          nickname={nickname}
          followId={followId}
        />
      }

    </div>
  )
}

function Designer(props) {
  const { designerId, nickname, followId } = props
  let _link = `${base.baseUrl}/show/brand/${designerId}`
  let _style = {
    background: base.getRandomColor(),
  }
  return (
    <div className="blogger-info">
      <a className="runway-avatar"
        style={_style}
        href={_link}
        rel="noopener noreferrer"
        target="_blank"
      >
        {base.getRunwayName(nickname)}
      </a>
      <a className="blogger-nickname" href={_link} rel="noopener noreferrer" target="_blank">{nickname}</a>
      <BloggerSupportButton id={designerId}
        type='runway'
        nickname={nickname}
        followId={followId}
      />
    </div>
  )
}

// 订阅|取关 按钮
class BloggerSupportButton extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      id: this.props.id,
      followId: this.props.followId
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.id !== nextProps.id ||
      this.props.followId !== nextProps.followId
    ) {
      this.setState({
        id: this.props.id,
        followId: this.props.followId
      })
    }
  }

  handleClick() {
    let self = this
    let followId = this.state.followId * 1
    let id = this.state.id * 1
    let content = {
      blogger_id: id,
      source_page: 'pic_detail',
      source_type: 'main_blogger'
    }

    if (typeof followId === 'number' && followId > 0) {
      // 异步处理 取关
      base.ajaxList.unFollowOwner(followId, () => {
        self.setState({ followId: 0 })
      })
    } else {
      base.ajaxList.addPoint(2300002, content)
      base.ajaxList.followOwner(id, (d) => {
        self.setState({ followId: d.result })
        if (self.props.type === 'ins') {
          df_alert({
            tipImg: base.ossImg(self.props.avatarImg, 36),
            mainText: '成功订阅博主',
            subText: self.props.nickname
          })
        } else {
          df_alert({
            mainText: '成功订阅秀场',
            subText: self.props.nickname
          })
        }
        base.eventCount.add(1010, {
          '来源页面': '图片详情页',
          '博主Id': id
        })
      })
    }
  }

  render() {
    return (<BtnFollow followId={this.state.followId}
      handleFan={this.handleClick.bind(this)}
    />)
  }
}

// 精选数量
function ImgFolderNum(props) {
  return props.num ? 
    <div className="img-folder-num">
      该时尚已精选 {props.num} 次
    </div> 
    : 
    null
}

// 博客TextContent
class BlogTextContent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      content: props.textContent,
      status: 0
    }
  }
  
  componentDidMount() {
    if (!!this.contentWrapper && !!this.content) {
      let wrapperWidth = this.contentWrapper.getBoundingClientRect().width
      let contentWidth = this.content.getBoundingClientRect().width
      contentWidth > wrapperWidth && this.changeStatus()
    }
  }

  changeStatus(type) {
    let {content} = this.state
    if (!content) {
      return
    }
    this.setState({
      status: type === 'down' ? 2 : 1
    })
  }

  render() {
    let {content, status} = this.state
    return (
      !!content &&
      <div ref={el => this.contentWrapper = el} className="blog-text-content">
        <span ref={el => this.content = el} className={classNames('blog-text', {'ellipsis': status === 1, 'no-ellipsis': status === 2})}>
          {content}
        </span>
        {
          !!status && 
          <div className='blog-text-btn'>
            <div className={classNames('blog-btn', {'up': status === 2})} onClick={this.changeStatus.bind(this, status === 1 && 'down')}>
              <Icon type="select-down"/>
            </div>
          </div>
        }
      </div> 
    )
  }
}


export { BlogCover, Blog }

