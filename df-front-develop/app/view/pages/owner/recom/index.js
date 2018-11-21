import classNames from 'classnames'
import base from '../../../common/baseModule'
import {Icon} from '../../../components/base/baseComponents'
import Pagination from '../../../components/Pagination/Pagination'
import WaterFall from '../../../components/WaterFall/WaterFall'
import {BloggerItemCol} from '../../../components/RecomBlogger/RecomBlogger'
// import { TwoLevelNavigation } from '../../../components/Navigation/SecondNavigation'
import {BloggerSearch} from '../../../components/SearchBar/index'
import {Loading} from '../../../components/WaterFall/WaterFallBase'

// ReactDOM.render(<TwoLevelNavigation channel={6}/>, document.getElementsByClassName('header-labs')[0])
// base.headerChange('white')
base.channel('ins')

/**
 * 服装筛选器
 * =============================================
 */
const cloth = ['style', 'clothingType', 'region', 'postType', 'identity']
const clothReference = {
  style: '风格',
  clothingType: '种类',
  region: '区域',
  postType: '类型',
  identity: '身份',
  birthPlace: '出生地'
}
const recommendReference = {
  hot: '热门标签',
  top: '人气TOP100',
}
let ajaxData = [] // 筛选数据
let prevFilterData = [] // 前一次筛选数据
let seeBlogger = {
  source_page: 'recommend_blogger',
  source_type: 'recommended_blogger'
}
let recommendContent = {
  source_page: 'recommend_blogger',
  recommend_type: 'blogger'
}

class ClothDataFilter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      style: {
        data: [],
        select: '',
        moreStatus: false,
        moreShow: false
      },
      clothingType: {
        data: [],
        select: '',
        moreStatus: false,
        moreShow: false
      },
      region: {
        data: [],
        select: '',
        moreStatus: false,
        moreShow: false
      },
      postType: {
        data: [],
        select: '',
        moreStatus: false,
        moreShow: false
      },
      identity: {
        data: [],
        select: '',
        moreStatus: false,
        moreShow: false
      },
    }
  }

  componentDidMount() {
    this.ajaxGetData()
  }

  // 获取数据
  ajaxGetData() {
    let self = this
    base.ajaxList.basic({
      type: 'GET',
      url: `${base.baseUrl}/owner/recom/tag/clothing`,
    }, (d) => {
      ajaxData = d.result
      prevFilterData = d.result
      self.filterDataFun()
    })
  }

  // 选择
  handleSelect(param, value) {
    console.log(param, value)
    this.state[param].select = value
    this.changeSearch()
    this.filterDataFun(prevFilterData)
  }

  // 取消选择
  handleCancelSelect(param) {
    console.log(param)
    this.state[param].select = ''
    this.changeSearch()
    this.filterDataFun()
  }

  changeSearch() {
    let query = cloth.map((param) => {
      return this.state[param].select ? `${param}=${this.state[param].select}` : ''
    })
    this.props.change(query.join('&'))
  }

  // 筛选数据
  filterDataFun(filterData = ajaxData) {
    let data = this.state
    let _filterData = []

    let startTime = new Date().getTime()
    // 清空原数据
    cloth.forEach((param) => {
      data[param].data = new Set()
    })

    // 遍历数据
    for (let i = 0, len_i = filterData.length; i < len_i; i++) {
      let item = filterData[i]
      let isHit = true

      // 筛选选择项
      for (let j = 0, len_j = cloth.length; j < len_j; j++) {
        let param = cloth[j]
        let stringTag = item[param]

        // 选择项为空
        if (!data[param].select) {
          continue
        }


        // 该条记录为空 OR 选择项有内容，该条记录未含有选择项
        let exp = new RegExp(data[param].select)
        if (!stringTag || !exp.test(stringTag)) {
          isHit = false
          break
        }
      }

      // 未命中，跳过这条数据
      if (!isHit) {
        continue
      }

      _filterData.push(item)

      // 命中选择项后，组装数据
      for (let j = 0, len_j = cloth.length; j < len_j; j++) {
        let param = cloth[j]
        let stringTag = item[param]
        if (!stringTag) {
          continue
        }

        let arrayTag = stringTag.split('#')
        // console.log(stringTag, arrayTag);
        arrayTag.forEach((tag) => {
          data[param].data.add(tag)
        })
      }
    }
    // 初始化更多按钮状态
    cloth.forEach((param) => {
      console.log(data[param].data)
      data[param].moreStatus = true
      // data[param].moreShow = [...data[param].data].length > 6;
      data[param].moreShow = false
    })

    let endTime = new Date().getTime()

    console.log('处理数量：', filterData.length, '耗时：', endTime - startTime)

    // 记录本次筛选后结果
    prevFilterData = _filterData

    this.setState(data)
  }


  handleMore(param, status) {
    let data = this.state
    data[param].moreStatus = status
    this.setState(data)
  }

  // 更多按钮
  renderBtnMore(param) {
    let status = this.state[param].moreStatus
    return (<button className="btn-more" onClick={this.handleMore.bind(this, param, !status)}>{status ? '更多' : '收起'}</button>)
  }

  renderBlock(param) {
    let key = `wrapper-${param}`

    // 已选择标签
    if (this.state[param].select) {
      return (
        <div key={key} className="filter-block">
          <div className="title">
            {clothReference[param]}
            <button className="select"
              onClick={this.handleCancelSelect.bind(this, param)}
            >
              <span>{this.state[param].select}</span>
              <Icon type="close-recom"/>
            </button>
          </div>
        </div>
      )
    }

    // 标签列表
    return (
      <div key={key} className="filter-block">
        <div className="title">{clothReference[param]}</div>
        {/* 渲染标签 */}
        <ul>
          {this.renderTagList(param)}
        </ul>
        {/* 渲染更多按钮 */}
        {this.state[param].moreShow && this.renderBtnMore(param)}
      </div>
    )
  }
  renderTagList(param) {
    let data = [...this.state[param].data]
    // 超出6项取前6项
    if (this.state[param].moreShow && this.state[param].moreStatus) {
      data = data.slice(0, 6)
    }

    return data.map((item, index) => this.renderTag(param, item, index))
  }

  renderTag(param, item, index) {
    let key = `${param}-${index}`
    return (<li key={key} className="tag" onClick={this.handleSelect.bind(this, param, item)} >{item}</li>)
  }

  render() {
    return (
      <div className="filter-panel">
        {cloth.map(param => this.renderBlock(param))}
      </div>
    )
  }
}

// 推荐
class RecommendDataFilter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hotTag: '',
      hot: {
        data: [],
        select: '',
        moreStatus: false,
        moreShow: false
      },
      top: {},
    }
  }

  componentDidMount() {
    this.ajaxGetData()
    this.getPopList()
  }
  getPopList() {
    base.ajaxList.basic({
      type: 'GET',
      url: `${base.baseUrl}/owner/popularity-list?start=0&pageSize=15`,
    }, (d) => {
      this.setState({top: d.result.resultList})
    })
  }
  // 获取数据
  ajaxGetData() {
    base.ajaxList.basic({
      type: 'GET',
      url: `${base.baseUrl}/owner/recommond-tag`,
    }, (d) => {
      ajaxData = d.result
      const hot = {
        data: d.result,
        select: this.state.hot.select,
        moreStatus: this.state.hot.moreStatus,
        moreShow: this.state.hot.moreShow
      }
      this.setState({hot})
    })
  }

  // 选择
  handleSelect(param, value) {
    this.setState({hotTag: this.state.hotTag === value ? '' : value}, () => this.changeSearch())
  }

  changeSearch() {
    this.props.change(`tag=${this.state.hotTag}`)
  }

  openOwnerDetail(bloggerId, nickname, source = '') {
    if (source === '图片详情') {
      let code = '1010004'
      let content = {
        preEvent: '进入到博客',
        content: '图片详情页-根据兴趣推荐',
        type: '2',
        typeDesc: '图片详情页-根据兴趣推荐'
      }

      base.ajaxList.addPoint(code, content)
    }
    window.open(`${base.baseUrl}/owner/${bloggerId}`, nickname)
  }

  handleMore(param, status) {
    let data = this.state
    data[param].moreStatus = status
    this.setState(data)
  }

  // 更多按钮
  renderBtnMore(param) {
    let status = this.state[param].moreStatus
    return (<button className="btn-more" onClick={this.handleMore.bind(this, param, !status)}>{status ? '更多' : '收起'}</button>)
  }

  renderBlock(param) {
    let key = `wrapper-${param}`
    // 标签列表
    return (
      <div key={key} className="filter-block">
        <div className="title">{recommendReference[param]}</div>
        {/* 渲染标签 */}
        <ul>
          {this.renderTagList(param)}
        </ul>
        {/* 渲染更多按钮 */}
        {this.state[param].moreShow && this.renderBtnMore(param)}
      </div>
    )
  }
  renderTagList(param) {
    let data = [...this.state[param].data]
    // 超出6项取前6项
    if (this.state[param].moreShow && this.state[param].moreStatus) {
      data = data.slice(0, 6)
    }
    return data.map((item, index) => this.renderTag(param, item, index))
  }
  renderBlogerList() {
    return this.state.top.map((item, index) => {
      return (
        <div key={index}
          className='bloger-wrap'
          onClick={this.openOwnerDetail.bind(this, item.bloggerId, item.nickname, 4)}
        >
          <img src={item.headImg} alt='img' className='blogger-img' />
          <div className='blogger-name'>{item.nickname}</div>
        </div>
      )
    })
  }
  renderTag(param, item, index) {
    let key = `${param}-${index}`
    return (<li key={key} className={this.state.hotTag === item ? 'tag-active' : 'tag'} onClick={this.handleSelect.bind(this, param, item)} >{item}</li>)
  }

  render() {
    return (
      <div className="filter-panel">
        <div className={this.state.hotTag === '' ? 'all-tag-selected' : 'all-tag'} onClick={this.handleSelect.bind(this, {}, '')}>全部标签</div>
        <div className="filter-block">
          <div className="title">热门标签</div>
          {/* 渲染标签 */}
          <ul>
            {this.renderTagList('hot')}
          </ul>
        </div>
        <div className="filter-block">
          <div className="title" style={{marginBottom: '27px'}}>人气TOP100</div>
          {/* 渲染标签 */}
          <div className='bloggerlist-wrap'>
            {this.state.top.length && this.renderBlogerList()}
            <div className="more-blogger" onClick={this.props.moreBlogger}>查看更多</div>
          </div>
        </div>
      </div>
    )
  }
}
/**
 * 灵感、图案筛选器
 * =============================================
 */
class OtherDateFilter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      select: ''
    }
  }

  componentDidMount() {
    this.ajaxGetData()
  }

  // 获取数据
  ajaxGetData() {
    let self = this
    base.ajaxList.basic({
      type: 'GET',
      url: `${base.baseUrl}/owner/recom/tag/${self.props.type}`,
    }, (d) => {
      self.setState({
        data: self.filterData(d.result)
      })
    })
  }

  filterData(data) {
    let arrayTag = data.filter(tag => tag).join('#').split('#')
    let setTag = new Set(arrayTag.map(tag => tag.trim()))
    return [...setTag]
  }

  // 选择
  handleSelect(value) {
    this.state.select = value
    let search = value && `${this.props.type}=${value}`
    this.props.change(search)
  }

  renderBlock() {
    // 已选择标签
    if (this.state.select) {
      return (
        <div className="filter-block">
          <div className="title">
            {this.props.title}
            <button className="select"
              onClick={this.handleSelect.bind(this, '')}
            >
              <span>{this.state.select}</span>
              <Icon type="close-recom"/>
            </button>
          </div>
        </div>
      )
    }

    // 标签列表
    return (
      <div className="filter-block">
        <div className="title">{this.props.title}</div>
        <ul>
          {this.renderTagList()}
        </ul>
      </div>
    )
  }

  renderTagList() {
    return this.state.data.map((item, index) => this.renderTag(item, index))
  }

  renderTag(item, index) {
    let key = `tag-${index}`
    return (<li key={key} className="tag" onClick={this.handleSelect.bind(this, item)} > {item} </li>)
  }

  render() {
    return (
      <div className="filter-panel">
        {this.renderBlock()}
      </div>
    )
  }
}
/**
 * TOP列表
 * =============================================
 */
class TopBloggerList extends React.Component {
  render() {
    const { region, selectType } = this.props
    return (
      <div>
        <WaterFall key="waterWall"
          wfType="popularity"
          pageSize={24}
          dataUrl={selectType !== 7 ? `/owner/recommond-list?region=${region}` : '/owner/popularity-list'}
          seeBlogger={seeBlogger}
          followBlogger={seeBlogger}
          recommendContent={recommendContent}
        />
      </div>
    )
  }
}

/**
 * 推荐博主列表
 * =============================================
 */
class BloggerList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isSuccess: true,
      data: [],
      pageNo: 0,
      totalPage: 0
    }
  }
 
  componentDidMount() {
    this.ajaxGetData(1)
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.search !== this.props.search) {
      this.setState({
        pageNo: 0,
        totalPage: 0
      }, this.ajaxGetData)
    }
  }
    
  // 翻页
  setPageNo(page) {
    console.log('翻页', page + 1)
    base.ajaxList.addPoint(3200002, {recommend_type: 'blogger'})
    this.ajaxGetData(page + 1)
  }

  // 获取数据
  ajaxGetData(page = 1) {
    let url = ''
    let self = this
    if (this.props.selectType > 3) {
      url = this.props.selectType !== 7 ? '/owner/recommond-list?' : '/owner/popularity-list?'
    } else {
      url = this.props.selectType !== 0 ? '/owner/recom/list?' : '/owner/recommond-list?'
    }
    base.ajaxList.basic({
      type: 'GET',
      url: `${base.baseUrl + url}${this.props.search || ''}`,
      data: {
        pageNo: page
      }
    }, (d) => {
      let {
        resultList: data,
        totalPageCount: totalPage
      } = d.result
      let idList = []
      let content = {
        recommend_type: 'blogger'
      }
      this.setPageNo
      data.forEach(item => idList.push(item.bloggerId))
      content.recommend_result = idList.join(',')
      for (let key in seeBlogger) {
        content[key] = seeBlogger[key]
      }
      base.ajaxList.addPoint(3200001, content)
      self.setState({
        data,
        page: page++,
        totalPage,
        isSuccess: d.success
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
    let content = seeBlogger

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
        '来源页面': '推荐博主-推荐页',
        '博主Id': id
      })
    })

    content.blogger_id = id
    base.ajaxList.addPoint(2300002, content)
  }


  render() {
    const { data, page, totalPage, isSuccess } = this.state
    if (!data.length) {
      return <Loading />
    }
    if (!isSuccess) {
      return <Loading title='出错啦，请稍后重试' />
    }
    return (
      <div className="recom-blogger-list home">
        {data.map((item, index) => {
        let key = `blogger-${item.id}`
          return (
            <BloggerItemCol
              selectedType={this.props.selectType}
              data={item}
              key={key}
              followBlogger={this.followBlogger.bind(this, index)}
              seeBlogger={seeBlogger}
            />
          )
        })
        }
        <Pagination pageNo={page - 1}
          totalPage={totalPage}
          reset={this.setPageNo.bind(this)}
        />
      </div>
    )
  }
}

/**
 * App
 * =============================================
 */
class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      type: ['推荐', '服装', '图片素材', '灵感', '日系', '韩系', '欧美', '人气TOP100'],
      selectType: Number(base.queryString('type')) || 0,
      search: ['', '', '']
    }
  }

  changeType(index) {
    this.setState({selectType: index})
  }

  changeSearch(search) {
    let _search = this.state.search
    _search[this.state.selectType] = search
    this.setState({search: _search})
  }
  renderTop(selectType) {
    let { type } = this.state  
    return (
      // <TopBloggerList selectType={selectType} region={type[selectType]}/>
      <div className='blogger-col'>
        <BloggerList selectType={selectType} search={`region=${type[selectType]}`}/>
      </div>
    )
  }
  renderContent() {
    let { search, selectType } = this.state
    return (
      <div id="recom-blogger-page">
        {
        selectType <= 3 && 
        <div className="left-pane">
          <div className={classNames({'hidden': selectType !== 0})}>
            <RecommendDataFilter
              change={this.changeSearch.bind(this)}
              moreBlogger={this.changeType.bind(this, 7)}
            />
          </div>
          <div className={classNames({'hidden': selectType !== 1})}>
            <ClothDataFilter change={this.changeSearch.bind(this)}/>
          </div>
          <div className={classNames({'hidden': selectType !== 2})}>
            <OtherDateFilter type='material'
              title='图片素材'
              change={this.changeSearch.bind(this)}
            />
          </div>
          <div className={classNames({'hidden': selectType !== 3})}>
            <OtherDateFilter type='inspiration'
              title='灵感源'
              change={this.changeSearch.bind(this)}
            />
          </div>
        </div>
      }
        <div className={classNames('right-pane', {'no-filter': selectType > 3})}>
          <BloggerList selectType={selectType} search={search[selectType] || `parentType=${selectType * 1}`}/>
        </div>
      </div>
    )
  }
  render() {
    let {selectType, type} = this.state
    seeBlogger.tag = type[selectType]
    recommendContent.tag = type[selectType]
    return (
      <div className="container">
        <div id="recom-blogger-header">
          <ul>
            {this.state.type.map((item, index) => {
            let key = `title-type-${index}`
            return (
              <li key={key}
                onClick={this.changeType.bind(this, index)}
                className={classNames({ 'current': index === selectType})}
              >{item}
              </li>) 
            })}
          </ul>
        </div>
        {(selectType > 3) ? this.renderTop(selectType) : this.renderContent()}
      </div>
    )
  }
}
ReactDOM.render(<BloggerSearch />, document.querySelector('.search-banner'))
ReactDOM.render(<App/>, document.getElementById('recom-wrapper'))
