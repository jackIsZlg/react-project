/**
 * Created by gewangjie on 2017/7/17.
 * 搜索页搜索栏
 */
import classNames from 'classnames'
import base from '../../common/baseModule'
import {Icon} from '../../components/base/baseComponents'
import {RBFromTag} from '../../components/RecomBlogger/RecomBlogger'
import HistoryArea from '../../components/HistoryArea/HistoryArea'

// 搜索时尚
class SearchInputFashion extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      ajaxRecommend: $.ajax(),
      textInput: this.props.q,
      textShow: this.props.q,
      textIndex: -1,
      recommendTextList: [],
      showList: false,
      isMounted: false,
      searchCache: {}
    }
  }

  componentDidMount() {
    let self = this
    console.log(self)
    this.state.isMounted = true
    document.getElementById('content').onclick = (e) => {
      if (e.target && self.contains(e.target)) {
        return
      }
      self.hideRecommendList()
    }
  }

  componentWillUnmount() {
    this.state.isMounted = false
  }

  contains(n) {
    let node = n,
      root = document.getElementsByClassName('search-input')[0]
    while (node) {
      if (node === root) {
        return true
      }
      // console.log(root, node);
      node = node.parentNode
    }
    return false
  }

  // 输入
  handleInput(e) {
    let val = e.target.value
    console.log('输入字段', val)
    this.setState({
      textInput: val,
      textShow: val,
      textIndex: -1,
    })
    this.queryRecommend(val)

    // 管理器内替换搜索字段
    this.props.updateQ(val)
  }

  // 上下切换
  handleKeyDown(e) {
    // 向上
    if (e.keyCode * 1 === 38) {
      this.textIndexMove(-1)
    }
    // 向下
    if (e.keyCode * 1 === 40) {
      this.textIndexMove(1)
    }

    // 回车确认
    if (e.keyCode * 1 === 13) {
      this.setState({
        textInput: this.state.textShow,
        textIndex: -1,
        showList: false
      }, this.query)
    }
    e.stopPropagation()
  }

  // 鼠标悬浮
  handleHover(index) {
    this.setState({
      textIndex: index
    })
  }

  // 鼠标离开选择框
  handleLeave() {
    this.setState({
      textIndex: -1
    })
  }

  // 鼠标选中
  handleClick(index) {
    let val = this.state.recommendTextList[index].content
    this.setState({
      textInput: val,
      textShow: val,
      textIndex: -1,
      showList: false
    }, this.query)
  }

  // 选中项上下切换
  textIndexMove(num) {
    let index = this.state.textIndex,
      len = this.state.recommendTextList.length

    // 推荐文本为空，跳出
    if (len === 0) {
      return
    }

    index += num

    // 边界处理
    if (index < -1) {
      index = len - 1
    }
    if (index > len - 1) {
      index = -1
    }

    // 显示原输入字段
    if (index === -1) {
      this.setState({
        textIndex: index,
        textShow: this.state.textInput
      })
      return
    }

    this.setState({
      textIndex: index,
      textShow: this.state.recommendTextList[index].content
    })
  }

  // 查询推荐字段
  queryRecommend(val) {
    let self = this
    // 取消前一次请求,清除计时器
    self.state.ajaxRecommend.abort()

    // 设计不合理，先移除
    // 缓存中存在该字段则命中缓存，跳出此次查询
    // if (val in self.state.searchCache) {
    //     let result = self.state.searchCache[val];
    //     self.setState({
    //         recommendTextList: result,
    //         showList: result.length > 0,
    //     });
    //     return;
    // }

    // 未命中缓存，ajax获取数据
    self.ajaxQueryRecommend(val)
  }

  // 查询定时器，限制查询频率
  ajaxTimeOut() {
    let self = this
    self.state.timeOutFinish = false
    setTimeout(() => {
      self.state.timeOutFinish = true
    }, 400)
  }

  // 查询推荐字段和历史记录
  ajaxQueryRecommend(val) {
    let self = this
    self.state.ajaxRecommend = $.ajax({
      url: `${base.baseUrl}/search/auto`,
      type: 'POST',
      data: {
        q: val
      }
    }).done((d) => {
      if (!d.success) {
        return
      }
      // 缓存本次查询结果,空字段不存储
      val && (self.state.searchCache[val] = d.result)
      self.setState({
        recommendTextList: d.result,
        showList: d.result.length > 0,
      })
    })
  }

  // 输入框选中
  handleFocus() {
    this.queryRecommend(this.state.textShow)
  }

  // 隐藏推荐列表
  hideRecommendList() {
    if (!this.state.isMounted) {
      return
    }
    console.log('隐藏推荐列表')

    this.state.showList && this.setState({
      textIndex: -1,
      recommendTextList: [],
      showList: false
    })
  }

  // 查询
  query() {
    console.log('查询字段', this.state.textShow)
    // 失去焦点
    this.refs.input.blur()
    // 取消当前查询推荐字段
    this.state.ajaxRecommend.abort()

    // 删除缓存中与查询字段相关的索引
    // this.delSearchCache(this.state.textShow);

    this.hideRecommendList()
    // this.sendHistory();
    this.props.query('blog', this.state.textShow)

    base.eventCount.add(1021, {
      '搜索字符': this.state.textShow
    })
  }

  // 删除缓存内相关字段
  delSearchCache(val) {
    let _cache = {}
    for (let key in this.state.searchCache) {
      // 匹配含有该字段的词
      let exq = new RegExp(key)
      if (!exq.test(val)) {
        _cache[key] = this.state.searchCache[key]
      }
    }
    this.state.searchCache = _cache
  }

  // 删除历史记录
  delHistory(id, index) {
    let self = this
    console.log('删除id', id)
    $.ajax({
      url: `${base.baseUrl}/search/history-remove?historyId=${id}`,
      type: 'GET'
    }).done((d) => {
      if (!d.success) {
        return
      }
      let array = self.state.recommendTextList
      array.splice(index, 1)
      self.setState({
        recommendTextList: array
      })
    })
  }

  renderRecommendItem() {
    return this.state.recommendTextList.map((item, index) => {
      return (<li className={classNames({
                'hover': index === this.state.textIndex,
                'history': item.id
            })}
        onClick={this.handleClick.bind(this, index)}
        onMouseOver={this.handleHover.bind(this, index)}
        key={index}
      >
        {item.content}
        {item.id && <div
          onClick={(e) => {
                        this.delHistory(item.id, index)
                        e.stopPropagation()
                    }}
          className="btn-del-history"
        >
          <Icon type="close-tag"/>
        </div>}
      </li>)
    })
  }

  render() {
    return (<div className="search-input fashion">
      <input type="text"
        ref="input"
        placeholder="搜索时尚"
        value={this.state.textShow}
        onKeyDown={this.handleKeyDown.bind(this)}
        onClick={(e) => {
                       console.log('选中输入框')
                       this.handleFocus()
                   }}
        onChange={this.handleInput.bind(this)}
      />
      <ul className={classNames('search-recommend-list', {'hidden': !this.state.showList})}
        onMouseLeave={this.handleLeave.bind(this)}
      >
        {this.renderRecommendItem()}
      </ul>
    </div>)
  }
}

// 搜索博主
class SearchInputBlogger extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      textInput: this.props.q
    }
  }

  componentDidMount() {
    document.addEventListener('click', (e) => {
      const tarObj = e.target
      if (tarObj && tarObj.matches('input#search-tab')) {
        return
      }
      if (tarObj.matches('div.search-input')) {
        return
      }
      this.history.changeHistoryStatus('up')
    })
  }

  getFocus() {
    this.history.changeHistoryStatus()
  }

  // 上下切换
  handleKeyDown(e) {
    // 回车确认
    if (e.keyCode * 1 === 13) {
      this.query()
    } else if (e.keyCode * 1 === 38) { // 上键
      this.history.choose('up')
    } else if (e.keyCode * 1 === 40) { // 下键
      this.history.choose('down')
    }
    e.stopPropagation()
  }

  // 输入
  handleInput(e) {
    let val = e.target.value
    console.log('输入字段', val)
    this.setState({
      textInput: val,
    })

    // 管理器内替换搜索字段
    this.props.updateQ(val)
  }

  // 查询
  query() {
    console.log('查询字段', this.state.textInput)
    this.history.saveHistoryData(this.state.textInput)
    this.input.blur()
    if (this.props.isJump) {
      window.location.href = `/search-view#/=&searchType=owner&searchValue=${this.state.textInput}`
      return
    }
    this.props.query('owner', this.state.textInput)
    this.history.changeHistoryStatus('up')
    base.eventCount.add(1014, {
      '搜索字符': this.state.textInput
    })
  }

  changeInputValue(value = '', isJump = false) {
    this.setState({
      textInput: value
    }, () => {
      isJump && this.query()
    })
    !value && this.input.focus()
  }

  render() {
    return (
      <div className="search-input owner">
        <input type="text"
          ref={el => this.input = el}
          id='search-tab'
          placeholder="搜索博主"
          value={this.state.textInput}
          onKeyDown={this.handleKeyDown.bind(this)}
          onChange={this.handleInput.bind(this)}
          onFocus={this.getFocus.bind(this)}
        />
        <HistoryArea searchType={2} ref={el => this.history = el} changeInputValue={this.changeInputValue.bind(this)}/>
      </div>
    )
  }
}

// 搜索容器
class SearchInputWrapper extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      type: this.props.type || 0, // 默认只有博主
      q: this.props.q || '',
      typeList: ['博主']// ['时尚', '博主']
    }
  }

  changeType(type) {
    console.log('切换', type)

    this.setState({
      type
    })

    // 博主搜索，默认显示推荐
    this.props.query(type === 1 ? 'owner' : 'blog', '')
  }

  updateQ(q) {
    this.setState({
      q
    })
  }

  renderTypeList() {
    // 临时修改只显示博主
    return <li className='current'>博主</li>

    let self = this
    return self.state.typeList.map((item, index) => {
      let key = `search-type-${index}`
      return (<li key={key}
        className={classNames({'current': index === self.state.type})}
        onClick={self.changeType.bind(self, index)}
      >{item}
              </li>)
    })
  }

  render() {
    return (<div>
      {/* <ul className="search-type-list clearfix">
        {this.renderTypeList()}
      </ul> */}
      <SearchInputBlogger q={this.state.q}
        updateQ={this.updateQ.bind(this)}
        query={this.props.query}
        isJump={this.props.isJump}
      />
      {/* {this.state.type === 0 ? */}
      {/* <SearchInputFashion q={this.state.q} */}
      {/* updateQ={this.updateQ.bind(this)} */}
      {/* query={this.props.query}/> : */}
      {/* <SearchInputBlogger q={this.state.q} */}
      {/* updateQ={this.updateQ.bind(this)} */}
      {/* query={this.props.query}/>} */}
    </div>)
  }
}

// 搜索博主，字段为空，推荐模式
class SearchBloggerInputNull_old extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      getDataIng: true,
      next: true,
      blogger: [],
      hoverImg: false,
      hoverImgDetail: false,
      showImgPos: 'bottom',
      showImgTop: 120,
      showBlogger: [],
      time: setTimeout(() => {
      }, 0)
    }
  }

  componentDidMount() {
    this.getRecommendBlogger()
  }

  getRecommendBlogger() {
    let self = this
    self.state.getDataIng = true
    $.ajax({
      url: `${base.baseUrl}/recommend/search/blogger-list`,
      type: 'GET',
    }).done((d) => {
      if (!d.success) {
        return
      }
      // 缓存本次查询结果,空字段不存储

      self.setState({
        blogger: d.result,
        getDataIng: false
      })
    })
  }

  // 鼠标hover，预览博主图片
  handleMouseEnter(index) {
    let el = this.refs[`blogger-${index}`],
      _bottom = document.body.clientHeight - el.getBoundingClientRect().bottom

    console.log('bottom', _bottom)
    clearTimeout(this.state.time)

    let data = this.state.blogger[index].postList || [],
      pos = _bottom < 310 ? 'top' : 'bottom',
      row = Math.ceil((index + 1) / 4),
      top = 122 * row + (row - 1) * 30 - (pos === 'top' ? 122 : 0)

    console.log(top, top - 400)
    this.setState({
      hoverImg: true,
      showBlogger: data,
      showImgPos: pos,
      showImgTop: top
    }, () => {
      pos === 'top' && (this.refs['blogger-img-list'].style.top = `${top - 300 - 30}px`)
    })
  }

  // 鼠标动作
  handleMouseLeave() {
    let self = this
    self.state.time = setTimeout(() => {
      self.setState({
        hoverImg: false
      })
    }, 100)
  }

  // 鼠标hover,展开列表
  handleMouseEnterDetail() {
    this.setState({
      hoverImgDetail: true
    })
  }

  handleMouseLeaveDetail() {
    this.setState({
      hoverImgDetail: false
    })
  }

  // 订阅博主
  followOwner(index) {
    let self = this,
      bloggerList = self.state.blogger,
      blogger = bloggerList[index]
    // 取关
    if (blogger.followId) {
      base.ajaxList.unFollowOwner(blogger.followId, () => {
        blogger.followId = null
        self.setState({
          blogger: bloggerList
        })
      })
      return
    }

    // 订阅
    base.ajaxList.followOwner(blogger.bloggerId, (d) => {
      blogger.followId = d.result
      base.eventCount.add(1010, {
        '来源页面': '推荐博主',
        '博主Id': blogger.bloggerId
      })
      self.setState({
        blogger: bloggerList
      })
    })
  }

  // 渲染博主标签
  renderTag(blogger) {
    if (!blogger.tagArray) {
      return null
    }

    return blogger.tagArray.split('/').map((tag, index) => {
      let key = `tag-${blogger.id}-${index}`
      return <li key={key}>{tag}</li>
    })
  }

  // 渲染博主列表
  renderBlogger() {
    return this.state.blogger.map((blogger, index) => {
      let key = `blogger-${index}`,
        avatarBg = {
          'backgroundImage': `url(${blogger.headImg})`
        }
      return (<li className="blogger-item"
        key={key}
        ref={key}
        onMouseEnter={this.handleMouseEnter.bind(this, index)}
        onMouseLeave={this.handleMouseLeave.bind(this)}
      >
        <div className="avatar"
          style={avatarBg}
          onClick={this.openOwnerDetail.bind(this, blogger.bloggerId)}
        />
        <div className="blogger-info">
          <div className="uname one-line"
            onClick={this.openOwnerDetail.bind(this, blogger.bloggerId)}
          >
            {blogger.nickname}
          </div>
          <ul className="tag-list">
            {this.renderTag(blogger)}
          </ul>
          {
                        blogger.followId ?
                          <button className="btn btn-round btn-follow follow"
                            onClick={this.followOwner.bind(this, index)}
                          >已订阅
                          </button>
                            : <button className="btn btn-round btn-follow"
                              onClick={this.followOwner.bind(this, index)}
                            >订阅
                            </button>
                    }
        </div>
              </li>)
    })
  }

  // 打开图片详情页
  openImgDetail(id) {
    window.open(`${base.baseUrl}/blog/detail/${id}`)
  }

  // 打开博主主页
  openOwnerDetail(id) {
    window.open(`${base.baseUrl}/owner/${id}`)
  }

  render() {
    // 数据请求过程
    if (this.state.getDataIng) {
      return null
    }

    // 推荐博主为空
    if (this.state.blogger.length === 0) {
      return (<div className="container search-null-tip">
        <span>DEEPFASHION</span>
        <span>搜索最时尚博主!</span>
              </div>)
    }

    return (<div className="search-recommend-panel">
      <div className="search-recommend-panel-header">
                为您推荐以下博主
        {this.state.next && <button className='btn btn-round btn-default btn-next float-r'
          onClick={this.getRecommendBlogger.bind(this)}
        >换一批
        </button>}
      </div>
      <div className="recommend-list">
        <ul className="blogger-panel">
          {this.renderBlogger()}
        </ul>
        <ul ref="blogger-img-list"
          style={{'top': `${this.state.showImgTop}px`}}
          className={classNames(
'blogger-img-list',
                        {'show': this.state.hoverImg || this.state.hoverImgDetail}
                    )}
          onMouseEnter={this.handleMouseEnterDetail.bind(this)}
          onMouseLeave={this.handleMouseLeaveDetail.bind(this)}
        >
          {this.state.showBlogger.map((img, index) => {
                        let bgStyle = {
                                'backgroundImage': `url(${base.ossImg(img.mediaUrl, 300)})`
                            },
                            key = `img-${index}`
                        return (<li style={bgStyle}
                          key={key}
                          onClick={this.openImgDetail.bind(this, img.id)}
                        />)
                    })}
        </ul>
      </div>
      <div className="blogger-more">
        <a href="/owner/recom/home">查看更多推荐博主</a>
      </div>
    </div>)
  }
}

class SearchBloggerInputNull extends React.Component {
  render() {
    return <RBFromTag source="搜索博主" seeBlogger={this.props.seeBlogger} followBlogger={this.props.followBlogger} recommendContent={this.props.recommendContent}/>
  }
}

// 搜索时尚，字段为空
class SearchFashionInputNull extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (<div className="container search-null-tip">
      <span>DEEPFASHION</span>
      <span>发现你的灵感!</span>
    </div>)
  }
}


export {
  SearchInputFashion,
  SearchInputBlogger,
  SearchInputWrapper,
  SearchBloggerInputNull,
  SearchFashionInputNull
}
