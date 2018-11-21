import base from '../../common/baseModule'
import { Icon, Select } from '../../components/base/baseComponents'
import WaterFall from '../../components/WaterFall/WaterFall'

let pointContent = {
  source_page: 'discover',
  source_type: 'recommended',
  pic_type: 1
}
let albumContent = {
  source_page: 'discover',
  source_type: 'hot_recommended'
}
const menuRelevance = [
  { '0': '全部类目' },
  { '1': '男装' },
  { '2': '女装' }
]
const styleRelevance = [
  { '0': '全部风格' },
  { '1': '日韩' },
  { '2': '欧美' }
]

base.headerChange('white')
base.channel('10')

base.eventCount.add('1088', {
  '登录状态': !base.LS().userId ? '未登陆' : '已登陆',
  '访问的页面来源': window.location.origin
})

function getFloorInfo(type, pageSize, successResult, failureResult) {
  base.ajaxList.basic({
    type: 'GET',
    url: `${base.baseUrl}/resource/manage/list?orderType=2&terminal=0&targetPage=1&targetType=${type}&start=0&pageSize=${pageSize}`,
  }, successResult, failureResult)
}

// banner
class Banner extends React.Component {
  constructor() {
    super()
    this.state = {
      bannerList: [],
      insList: [],
      runwayList: [],
      orderingList: [],
      brandChoiceList: []
    }
  }

  componentDidMount() {
    this.getBannerInfo()
    $('.block-tip').css({ 'display': 'none' })
  }

  getBannerInfo() {
    let self = this
    // 3-banner，4-ins,5-秀场，6-订货会，7-电商
    getFloorInfo(3, 5, (data) => {
      let { resultList } = data.result
      if (resultList && !!resultList.length) {
        self.setState({ bannerList: resultList }, () => {
          self.bannerShuffling()
        })
      }
    }, (data) => {
      console.log(data.result.errorDesc)
    })
    getFloorInfo(4, 3, (data) => {
      let { resultList } = data.result
      if (resultList && !!resultList.length) {
        self.setState({ insList: resultList })
      }
    }, (data) => {
      console.log(data.result.errorDesc)
    })
    getFloorInfo(5, 6, (data) => {
      let { resultList } = data.result
      if (resultList && !!resultList.length) {
        self.setState({ runwayList: resultList })
      }
    }, (data) => {
      console.log(data.result.errorDesc)
    })
    getFloorInfo(6, 6, (data) => {
      let { resultList } = data.result
      if (resultList && !!resultList.length) {
        self.setState({ orderingList: resultList })
      }
    }, (data) => {
      console.log(data.result.errorDesc)
    })
    getFloorInfo(7, 6, (data) => {
      let { resultList } = data.result
      if (resultList && !!resultList.length) {
        self.setState({ brandChoiceList: resultList })
      }
    }, (data) => {
      console.log(data.result.errorDesc)
    })
  }

  dealData(data) {
    data && data.map((item) => {
      console.log(item.newTitle.charAt(0), /[a-z]/.test(item.newTitle.charAt(0)))
      if (/[a-z]/.test(item.newTitle.charAt(0))) {
        item.newTitle = base.getRunwayName(item.newTitle)
      }
      console.log(item.newTitle)
      return item
    })
    return data
  }

  bannerShuffling() {
    let self = this
    let swiper = new Swiper(self.container, {
      slidesPerView: 1,
      spaceBetween: 30,
      loop: true,
      autoplay: true,
      pagination: {
        el: self.bannerPagination,
        clickable: true,
      },
      navigation: {
        nextEl: self.nextBtn,
        prevEl: self.prevBtn
      },
      on: {
        click: (e) => {
          let targetData = e.target
          switch (targetData.className) {
            case `banner-img-${!!targetData.attributes['data-index'] && targetData.attributes['data-index'].value}`:
              window.open(targetData.attributes['data-url'].value, '_target')
              base.eventCount.add('1074', {
                '登录状态': !base.LS().userId ? '未登陆' : '已登陆',
                'banner位': `首页banner${targetData.attributes['data-index'].value}的曝光或点击`
              })
              break
            case 'swiper-button-next':
            case 'icon-next':
              base.eventCount.add('1079', {
                '登录状态': !base.LS().userId ? '未登陆' : '已登陆',
                '点击按钮': '下一张'
              })
              break
            case 'swiper-button-prev':
            case 'icon-pre':
              base.eventCount.add('1079', {
                '登录状态': !base.LS().userId ? '未登陆' : '已登陆',
                '点击按钮': '上一张'
              })
              break
            default:
              break
          }
        }
      }
    })

    // 鼠标覆盖停止自动切换
    swiper.el.onmouseover = () => {
      swiper.autoplay.stop()
    }

    // 鼠标移出开始自动切换
    swiper.el.onmouseout = () => {
      swiper.autoplay.start()
    }
  }

  openIndexPage(type, secondaryUrl = '', index = 0) {
    let url = ''
    let barLocation = ''

    console.log(secondaryUrl)
    switch (type) {
      case 'runway':
        url = secondaryUrl || '/show/runway'
        barLocation = 'B'
        break
      case 'market':
        url = secondaryUrl || '/market/collections'
        barLocation = 'C'
        break
      case 'ordering':
        url = secondaryUrl || '/ordering/collections'
        barLocation = 'D'
        break
      case 'hot':
      default:
        url = secondaryUrl || '/index'
        barLocation = 'A'
        break
    }
    window.open(url, '_target')
    let secondBarLocation = `${barLocation}-${index + 1}`

    if (!secondaryUrl) {
      base.eventCount.add('1077', {
        '登录状态': !base.LS().userId ? '未登陆' : '已登陆',
        '菜单栏位': `首页分类导航菜一级菜单${barLocation}`
      })
      return
    }
    base.eventCount.add('1078', {
      '登录状态': !base.LS().userId ? '未登陆' : '已登陆',
      '菜单栏位': `首页分类导航二级导航菜单${secondBarLocation}`
    })
  }

  openPage(url, index) {
    window.open(url, '_target')
    base.eventCount.add('1074', {
      '登录状态': !base.LS().userId ? '未登陆' : '已登陆',
      'banner位': `首页banner${index + 1}的曝光或点击`
    })
  }

  render() {
    let { bannerList, insList, runwayList, orderingList, brandChoiceList } = this.state

    if (bannerList && !bannerList.length) {
      return null
    }

    return (
      <div className='banner-content'>
        <div className="banner-content-list">
          <ul className='content-list'>
            <li className='content-list-item'>
              <div className='list-item-title' onClick={this.openIndexPage.bind(this, 'hot', '', 0)}>
                Instagram
                <Icon type='next' />
              </div>
              <div className="list-item-wrapper">
                {
                  insList && insList.map((item, index) => (
                    <div key={`list-item-${item.id}`}
                      onClick={this.openIndexPage.bind(this, 'hot', item.url, index)}
                      className='list-item-tag'
                    >{item.newTitle}
                    </div>))
                }
              </div>
            </li>
            <li className='content-list-item'>
              <div className='list-item-title' onClick={this.openIndexPage.bind(this, 'runway', '', 0)}>
                秀场
                <Icon type='next' />
              </div>
              <div className="list-item-wrapper">
                {
                  runwayList && runwayList.map((item, index) => (
                    <div key={`list-item-${item.id}`}
                      onClick={this.openIndexPage.bind(this, 'runway', item.url, index)}
                      className='list-item-tag'
                    >{item.newTitle}
                    </div>))
                }
              </div>
            </li>
            <li className='content-list-item'>
              <div className='list-item-title' onClick={this.openIndexPage.bind(this, 'market', '', 0)}>
                品牌精选
                <Icon type='next' />
              </div>
              <div className="list-item-wrapper">
                {
                  brandChoiceList && brandChoiceList.map((item, index) => (
                    <div key={`list-item-${item.id}`}
                      onClick={this.openIndexPage.bind(this, 'market', item.url, index)}
                      className='list-item-tag'
                    >{item.newTitle}
                    </div>))
                }
              </div>
            </li>
            <li className='content-list-item'>
              <div className='list-item-title' onClick={this.openIndexPage.bind(this, 'ordering', '', 0)}>
                订货会
                <Icon type='next' />
              </div>
              <div className="list-item-wrapper">
                {
                  orderingList && orderingList.map((item, index) => (
                    <div key={`list-item-${item.id}`}
                      onClick={this.openIndexPage.bind(this, 'ordering', item.url, index)}
                      className='list-item-tag'
                    >{item.newTitle}
                    </div>))
                }
              </div>
            </li>
          </ul>
        </div>
        <div className="banner-loop-list">
          <div className="swiper-container" ref={el => this.container = el}>
            <div className="swiper-wrapper">
              {
                bannerList && bannerList.map((item, index) => (
                  <div className="swiper-slide" key={`swiper-slide-${index}`}>
                    <img className={`banner-img-${index + 1}`}
                      data-index={index + 1}
                      data-url={item.url}
                      src={base.ossImg(item.cover, 1920)}
                      alt=""
                    />
                  </div>
                ))
              }
            </div>
            <div className="swiper-pagination" ref={el => this.bannerPagination = el}>
            </div>
            <div className="swiper-button-next" ref={el => this.nextBtn = el}>
            </div>
            <div className="swiper-button-prev" ref={el => this.prevBtn = el}>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

// 热门精选
class HotCollection extends React.Component {
  constructor() {
    super()
    this.state = {
      folderList: []
    }
  }

  componentDidMount() {
    let self = this
    getFloorInfo(1, 10, (data) => {
      let { resultList } = data.result
      self.setState({ folderList: self.dealHotData(resultList) })
    }, () => {

    })
  }

  dealHotData(data) {
    let hotData = []
    data && data.forEach((item) => {
      !!item.folderDTO && hotData.push(item)
    })
    return hotData
  }

  openPage(type = '', index) {
    let { folderList } = this.state
    let url = ''
    switch (type) {
      case 'more':
        url = '/folder/public/index'
        base.eventCount.add('1080', {
          '登录状态': !base.LS().userId ? '未登陆' : '已登陆',
        })
        break
      case 'folder':
        url = folderList[index].url
        let content = {
          album_id: folderList[index].folderDTO.id
        }
        for (let key in albumContent) {
          content[key] = albumContent[key]
        }
        base.ajaxList.addPoint(2200001, content)
        base.eventCount.add('1081', {
          '登录状态': !base.LS().userId ? '未登陆' : '已登陆',
          '精选集ID': folderList[index].id,
          '精选集位': `首页-必看精选集-精选集列表${index + 1}的点击`
        })
        break
      default:
        url = `/users/folder/detail/${folderList[index].folderDTO.userId}`
        break
    }
    window.open(url, '_target')
  }

  render() {
    let { folderList } = this.state

    if (folderList && !folderList.length) {
      return null
    }

    return (
      <div>
        <div className="floor-header">
          <div className="floor-header-title">
            热门精选集
            <span>体现了流行款式和设计热点的精选图集</span>
          </div>
          <div onClick={this.openPage.bind(this, 'more')} className='see-more'>查看更多</div>
        </div>
        <ul className="hot-content">
          {
            folderList && folderList.map((item, index) => (
              <li key={`hot-image-${item.id}`} className='hot-image-item'>
                <div className="folder-img">
                  <img className='folder-cover'
                    src={base.ossImg(item.cover, 288)}
                    onClick={this.openPage.bind(this, 'folder', index)}
                    alt=""
                  />
                </div>
                <div className="hot-image-footer">
                  <div className="hot-folder-name"
                    onClick={this.openPage.bind(this, 'folder', index)}
                  >{item.newTitle}
                  </div>
                  <div className="hot-folder-info">
                    图片<span>{base.numberFormat(item.folderDTO.folderCount)}</span>
                    <em></em>
                    浏览<span>{base.numberFormat(item.folderDTO.viewCount)}</span>
                  </div>
                  <div className="hot-folder-user"
                    onClick={this.openPage.bind(this, 'blogger', index)}
                  >
                    <img src={base.ossImg(item.folderDTO.createrAvator, 30)} alt="" />
                    <div className="hot-folder-nickname">
                      {item.folderDTO.createrName}
                    </div>
                  </div>
                </div>
              </li>
            ))
          }
        </ul>
      </div>
    )
  }
}

// ins博主
class InsBlogger extends React.Component {
  constructor() {
    super()
    this.state = {
      bloggerList: []
    }
  }

  componentDidMount() {
    this.getBloggerInfo()
  }

  getBloggerInfo() {
    let self = this
    base.ajaxList.basic({
      type: 'GET',
      url: `${base.baseUrl}/owner/recommond-list?parentType=0&pageNo=1`,
    }, (data) => {
      let { resultList } = data.result
      let { idList, newData } = self.dealData(resultList)
      let content = {
        source_page: 'discover',
        recommend_type: 'blogger',
        recommend_result: idList.join(',')
      }
      base.ajaxList.addPoint(3200001, content)
      self.setState({ bloggerList: newData }, () => {
        self.swiperComponent()
      })
    })
  }
  dealData(data) {
    let newData = []
    let idList = []
    data && data.forEach((item) => {
      item.url = `${base.baseUrl}/owner/${item.bloggerId}`
      item.cover = item.headImg || 'https://zhiyi-image.oss-cn-hangzhou.aliyuncs.com/self-selected/1530244007170_431.png'
      if (!!item.tagList) {
        if (item.tagList.length > 3) {
          item.tagList = item.tagList.slice(0, 3)
        }

        newData.push(item)
      }
      idList.push(item.id)
    })
    return { idList, newData }
  }

  swiperComponent() {
    let self = this
    new Swiper(self.insBlogger, {
      slidesPerView: 5,
      spaceBetween: 20,
      slidesPerGroup: 5,
      // loop: true,
      navigation: {
        nextEl: self.insNext,
        prevEl: self.insPrev,
      },
    })
  }

  openBloggerPage(index) {
    let { bloggerList } = this.state
    base.eventCount.add('1082', {
      '登录状态': !base.LS().userId ? '未登陆' : '已登陆',
      '博主ID': bloggerList[index].id,
      '博主位': `首页-必看精选集-精选集列表${index + 1}点击`
    })
    let content = {
      source_page: 'discover',
      source_type: 'recommended_blogger',
      blogger_id: bloggerList[index].id
    }
    base.ajaxList.addPoint(2300001, content)
    window.open(bloggerList[index].url, '_target')
  }

  followBlogger(index, id) {
    let self = this
    let { bloggerList } = self.state
    let blogger = bloggerList[index]
    // 取关
    if (!!blogger.followId) {
      base.ajaxList.unFollowOwner(blogger.followId, () => {
        bloggerList[index].followId = 0
        self.setState({
          bloggerList
        })
      })
      return
    }

    let content = {
      blogger_id: id,
      source_page: 'discover',
      source_type: 'recommended'
    }
    base.ajaxList.addPoint(2300002, content)

    // 订阅
    base.ajaxList.followOwner(blogger.id, (d) => {
      bloggerList[index].followId = d.result
      base.eventCount.add('1010', {
        '来源页面': '推荐博主',
        '博主Id': blogger.bloggerId
      })
      base.eventCount.add('1083', {
        '登录状态': !base.LS().userId ? '未登陆' : '已登陆',
        '博主ID': id,
        '博主订阅按钮位': `首页-必看精选集-精选集列表${index + 1}-订阅按钮点击`
      })
      self.setState({
        bloggerList
      })
    })
  }

  openMorePage(url) {
    base.eventCount.add('1084', {
      '登录状态': !base.LS().userId ? '未登陆' : '已登陆',
    })
    window.open(url, '_target')
  }

  render() {
    let { bloggerList } = this.state
    if (bloggerList && !bloggerList.length) {
      return null
    }
    return (
      <div>
        <div className="floor-header">
          <div className="floor-header-title">
            热门INS博主
            <span>精选自设计师们在instagram上关注的服装设计领域的优质博主</span>
          </div>
          {
            bloggerList && bloggerList.length > 5 &&
            <div onClick={this.openMorePage.bind(this, '/owner/recom/home')} className='see-more'>查看更多</div>
          }
        </div>
        <div className="blogger-group">
          <div className="blogger-content">
            <div className="swiper-container" ref={el => this.insBlogger = el}>
              <div className="swiper-wrapper">
                {
                  bloggerList && bloggerList.map((item, index) => (
                    <div className="swiper-slide">
                      <img src={base.ossImg(item.cover, 118)}
                        onClick={this.openBloggerPage.bind(this, index)}
                        alt=""
                      />
                      <div className="blogger-name" onClick={this.openBloggerPage.bind(this, index)}>
                        {item.nickname}
                      </div>
                      <div className="blogger-info">
                        图片<span>{base.numberFormat(item.postNum)}</span>
                        <em></em>
                        粉丝<span>{base.numberFormat(item.fansNum)}</span>
                      </div>
                      {
                        !!item.recommendWord ?
                          <div className="blogger-recommend-word">{item.recommendWord}</div>
                          :
                          <ul className="blogger-tag-list">
                            {
                              item.tagList && item.tagList.map(item => (
                                <li className="blogger-tag-item">
                                  {item ? `#${item}` : null}
                                </li>
                              ))
                            }
                          </ul>
                      }
                      {
                        !item.followId ? (
                          <button className='blogger-follow' onClick={this.followBlogger.bind(this, index, item.id)}>
                            <Icon type='follow-blogger' />
                            订阅
                          </button>
                        ) : (
                          <button className='blogger-follow followed' onClick={this.followBlogger.bind(this, index)}>
                              已订阅
                          </button>
                          )
                      }

                    </div>
                  ))
                }
              </div>
              <div className="swiper-button-next" ref={el => this.insNext = el}>
              </div>
              <div className="swiper-button-prev" ref={el => this.insPrev = el}>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

// 瀑布流
class WaterFallQuery extends React.Component {
  constructor() {
    super()
    this.state = {
      category: '',
      style: '',
      url: '/v1/blog/hot'
    }
  }

  filterEvent() {
    let { category, style } = this.state
    base.eventCount.add('1036', {
      '筛选内容': `${category}-${style}`
    })
  }

  styleFilter(val) {
    let self = this
    let { category, style, url } = self.state
    for (let v = 0; v < styleRelevance.length; v++) {
      for (let key in styleRelevance[v]) {
        if (key !== val) {
          continue
        }
        style = key !== '0' ? styleRelevance[v][key] : ''
      }
    }

    console.log('style', style)
    // if (!category && !style) {
    //   return
    // }

    url = `/v1/blog/hot/search?clothingType=${category}&region=${style}`

    self.setState({ category, style, url }, () => {
      self.filterEvent()
    })
  }

  // 热门筛选男女装
  categoryFilter(val) {
    let self = this
    let { category, style, url } = self.state
    for (let v = 0; v < menuRelevance.length; v++) {
      for (let key in menuRelevance[v]) {
        if (key !== val) {
          continue
        }
        category = key !== '0' ? menuRelevance[v][key] : ''
      }
    }
    console.log(category, style)
    // if (!category && !style) {
    //   return
    // }

    url = `/v1/blog/hot/search?clothingType=${category}&region=${style}`

    self.setState({ category, style, url }, () => {
      self.filterEvent()
    })
  }

  render() {
    let { url, category, style } = this.state
    let recommendContent = {
      source_page: 'discover',
      recommend_type: 'picture'
    }
    let seeBlogger = {
      source_page: 'discover',
      source_type: 'recommended_pic_blogger'
    }
    if (category || style) {
      pointContent.tag = (`${category || ''} ${style || ''}`).trim()
    }
    return (
      <div>
        <div className="floor-header">
          <div className="floor-header-title">
            时尚好图
          </div>
        </div>
        <div className="water-fall-filter">
          <div className='selection-container'>
            <Select options={menuRelevance} value="0" onChange={this.categoryFilter.bind(this)} />
            <Select options={styleRelevance} value="0" onChange={this.styleFilter.bind(this)} />
          </div>
        </div>
        <div id="water-fall-panel">
          <WaterFall key="waterWall"
            wfType="index"
            dataUrl={url}
            pointContent={pointContent}
            recommendContent={recommendContent}
            seeBlogger={seeBlogger}
          />
        </div>
      </div>
    )
  }
}

// ReactDOM.render(<Banner />, document.querySelector('#index-banner'))
ReactDOM.render(<HotCollection />, document.querySelector('#hot-collection'))
ReactDOM.render(<InsBlogger />, document.querySelector('#ins-blogger'))
// ReactDOM.render(<WaterFallQuery />, document.querySelector('#waterfall-query'))