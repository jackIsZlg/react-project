import classNames from 'classnames'
import base from '../../../common/baseModule'
import WaterFall from '../../../components/WaterFall/WaterFall'
import HistoryArea from '../../../components/HistoryArea/HistoryArea'

base.headerChange('white')

const recommendContent = {
  source_page: 'pic_search_result',
  search_type: 'picture'
}

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      value: '',
      newValue: '',

      tagsList: [], // 标签部分——标签集
      // tagIndex: '', // 标签部分——标签索引

      mlShow: false, // 左移是否显示
      mrShow: true, // 右移是否显示
      mrJudging: false, // 右边按钮是否在判读中

      loading: false, // 是否在加载
      progressLength: 15, // 进度条长度
    }
    this.firstS = true // 用来记录当前页面是否是第一次查询

    this.cusData = {
      moveLength: 0, // 已移动距离

      interNum: '', // 定时器记录
      loadingType: 0, // 加载类型
    }
  }

  componentWillMount() {
    // document.oncontextmenu = () => { return false }
    let self = this
    self.setState({
      value: decodeURIComponent(base.queryString('value')) // 获取url中传递过来的参数
    })

    // this.getHistoryData()
  }
  componentDidMount() {
    document.body.addEventListener('click', (e) => {
      const tarObj = e.target
      console.log('tarObj', tarObj)
      if (tarObj && tarObj.matches('input#pinterest_id')) {
        return
      }
      if (tarObj.matches('div.history-item') || tarObj.matches('div.clear-history') || tarObj.matches('span.clear')) {
        return
      }
      this.history.changeHistoryStatus('up')
    })
    this.searchResult()
  }
  componentWillUnmount() {
    document.body.removeEventListener('click')
  }
  onDataLoadError() {
    this.setState({
      loading: false
    })
  }

  // 搜索框-改变时触发
  getChangeValue() {
    let self = this
    if (this.inputEl.value.length <= 50) {
      self.setState({
        value: self.inputEl.value
      })
    }
  }

  // 搜索框-聚焦时触发
  getFocus() {
    this.history.changeHistoryStatus()
  }
  // 搜索框-输入内容后，按下enter键时触发
  getEnter(e) {
    if (e.keyCode * 1 === 13) { // enter键
      this.searchResult()
    } else if (e.keyCode * 1 === 38) { // 上键
      this.history.choose('up')
    } else if (e.keyCode * 1 === 40) { // 下键
      this.history.choose('down')
    }
  }

  // 搜索框-开始搜索内容
  searchResult() {
    let { value } = this.state
    this.inputEl.blur()
    if (value) { // 不为空时才进行搜索
      this.setState({
        newValue: encodeURIComponent(value),
        mlShow: false,
        mrShow: true
      })
      let content = {
        search_key_words: value,
      }
      for (let key in recommendContent) {
        content[key] = recommendContent[key]
      }
      base.ajaxList.addPoint(3100001, content)

      this.history.saveHistoryData(value)
    }
    this.history.changeHistoryStatus('up')
    $('.tags-list').css('transform', 'translateX(0px)')
    this.cusData.moveLength = 0
    window.history.pushState({}, document.title, `/search/pinterest?value=${value}`)
  }

  // 生成随机数
  RandomNumBoth(Min, Max) {
    let Range = Max - Min
    let Rand = Math.random()
    let num = Min + Math.round(Rand * Range) // 四舍五入
    return num
  }
  // 标签部分——点击标签
  handleWhenClickTags(item) {
    this.setState({
      // tagIndex: item,
      value: !!this.state.value ? `${this.state.value} ${item}` : item,
    }, () => {
      this.searchResult()
    })
  }
  // 标签部分—判断显示状态
  judgMoveShowStatus() {
    const ulLength = $('.tags-list').width() // 标签栏宽度
    const conLength = $('.tag-area').width() // 容器栏宽度
    if (ulLength > conLength) {
      this.setState({
        mrShow: true
      })
    }
  }
  // 标签部分-点击移动
  moveTag(type) {
    const ulLength = $('.tags-list').width() // 标签栏宽度
    const conLength = $('.tag-area').width() // 容器栏宽度
    let moveLength = this.cusData.moveLength // 当前已移动的距离
    let onceMoveL = Math.floor(conLength / 3) // 一次移动的距离

    if (ulLength > conLength) {
      if (type === 'next') { // 从右往左移
        if (moveLength + ulLength - onceMoveL < conLength) {
          moveLength = conLength - ulLength
          this.setState({
            mrShow: false
          })
        } else {
          moveLength -= onceMoveL
          this.setState({
            mlShow: true
          })
        }
      }

      if (type === 'pre') { // 从左往右移
        if (moveLength + ulLength + onceMoveL > ulLength) {
          moveLength = 0
          this.setState({
            mlShow: false
          })
        } else {
          moveLength += onceMoveL
          this.setState({
            mrShow: true
          })
        }
      }

      $('.tags-list').css('transform', `translateX(${moveLength}px)`)
      this.cusData.moveLength = moveLength
    }
  }

  // 瀑布流交互—获取瀑布流返回的数据
  dealDataOfWaterFall(data) {
    const self = this
    if (data.result.param && data.result.param.recommend) {
      self.setState({
        tagsList: [...data.result.param.recommend]
      })
    }
  }
  // 瀑布流交互-请求标识
  startRequest(type, data) {
    if (type === 'start') {
      if (data === 0) { // 第一次加载或者新加载时遮罩层才出现
        this.cusData.loadingType = data
        this.setState({
          loading: true
        })
        const interNum = window.setInterval(() => this.progressMove('continue'), 90)
        this.cusData.interNum = interNum
      }
    } else if (type === 'end') {
      window.clearInterval(this.cusData.interNum)
      this.progressMove('end')
    }
  }

  // 进度条动画
  progressMove(type) {
    const { progressLength } = this.state
    let result = 0
    const addLength = this.RandomNumBoth(10, 40)
    if (type === 'continue') {
      if (progressLength + addLength > 379) {
        result = 370
      } else {
        result = progressLength + addLength
      }
      this.setState({
        progressLength: result
      })
    } else {
      this.setState({
        progressLength: 399,
      })
      window.setTimeout(() => {
        this.setState({
          progressLength: 15,
          loading: false,
        })
      }, 1000)
    }
  }
  // 加载动画
  loadingCover() {
    const { loading, progressLength } = this.state
    // let loading = true

    if (loading) {
      // $('body').css('overflow', 'hidden')
      $('body').addClass('cusMaskHide')
      return (
        <div className="loading-img">
          {
            !this.cusData.loadingType &&
            <div className="img-shap">
            </div>
          }
          <div className="loading-area">
            <div className="moveObj" style={{ marginLeft: `${progressLength - 12}px` }}>
              <div className="percent">{Math.floor(progressLength / 399 * 100)}%</div>
              <div className="blackb">
                <div className="whiteb"></div>
              </div>
            </div>
            <div className="loading-pro">
              <div className="loading-pro" style={{ width: `${progressLength}px` }}>
              </div>
            </div>
            <div className="loading-text">精彩时尚即将呈现 ...</div>
          </div>
        </div>
      )
    }
    // $('body').css('overflow', '')
    $('body').removeClass('cusMaskHide')
    return null
  }

  changeInputValue(value = '', isJump = false) {
    this.setState({
      value
    }, () => {
      isJump && this.searchResult()
    })
    !value && this.inputEl.focus()
  }
  // 标签部分——返回精选集头部
  renderHead() {
    const bgObj = {
      1: 'bg-a',
      2: 'bg-b',
      3: 'bg-c',
      4: 'bg-d',
      5: 'bg-e',
      6: 'bg-f',
    }
    const { tagsList } = this.state
    let i = 0

    //
    window.setTimeout(() => {
      const ulLength = $('.tags-list').width() // 标签栏宽度
      const conLength = $('.tag-area').width() // 容器栏宽度
      if (ulLength <= conLength) {
        this.setState({
          mlShow: false,
          mrShow: false,
          mrJudging: false,
        })
      } else {
        this.setState({
          mrJudging: false,
        })
      }
    }, 100)
    return tagsList.map((item) => {
      // if (i > 20) {
      //   return null
      // }
      i += 1
      // const num = this.RandomNumBoth(1, 6)
      const num = i % 6
      return (
        <li
          key={item}
          className={
            classNames(`tag-con ${bgObj[num]}`, {
              'active': false // tagIndex === item && true
            })}
          onClick={() => { this.handleWhenClickTags(item) }}
        >
          {item}
        </li>
      )
    })
  }

  render() {
    let { value, newValue } = this.state
    return (
      <div className="pinterest-search-page">
        <div className='search-header-wrap'>
          <div className='search-header'>
            <input
              id="pinterest_id"
              ref={el => this.inputEl = el}
              type="text"
              value={value}
              placeholder='搜索想找的图片'
              onKeyDown={this.getEnter.bind(this)}
              onFocus={this.getFocus.bind(this)}
              onChange={this.getChangeValue.bind(this)}
            />
            <span className='search-btn' onClick={this.searchResult.bind(this)}>
              <i className="iconfont icon-search" title="搜索" />
            </span>
            <HistoryArea ref={el => this.history = el} changeInputValue={this.changeInputValue.bind(this)}/>
          </div>
          {/* <div className='search-wrap'>
            <div className='search-img-wrap'>没找到想要的图片？试试
              <span className='search-img-title'>找图助理
              </span>
              <div className='search-img'>
                <img src='/public/resource/qrcode.png' alt='' />
                <div>微信扫一扫</div>
                <div>告诉我们你要找的图片</div>
              </div>
            </div>
          </div> */}
        </div>
        {/* <div className="tag-mid">
        {
            tagsList.length > 0 && mlShow && !loading &&
            <div className="left-move" onClick={() => this.moveTag('pre')}>
              <i className="iconfont icon-pre" title="" />
            </div>
          }
          {
            tagsList.length > 0 && mrShow && !loading && !mrJudging &&
            <div className="right-move" onClick={() => this.moveTag('next')}>
              <i className="iconfont icon-next" title="" />
            </div>
          }
          {
            tagsList.length > 0 && !loading &&
            <div className="tag-area">
              <ul className="tags-list">
                {this.renderHead()}
              </ul>
            </div>
          }
        </div> */}
        <div className="container pinterest">
          <div id="water-fall-panel" ref={el => this.waterWrapper = el}>
            {
              !!newValue &&
              <WaterFall key="waterWall"
                wfType="pinterest"
                dataUrl={`/search/user/post?query=${newValue}`}
                noResultTip='抱歉，没有搜索到相关内容'
                bloggerSearchContent={recommendContent}
                pointContent={recommendContent}
                // onDataLoadError={this.onDataLoadError.bind(this)}
                // dealDataOfWaterFall={this.dealDataOfWaterFall.bind(this)}
                // startRequest={this.startRequest.bind(this)}
              />
            }
          </div>
        </div>

        {this.loadingCover()}
      </div>
    )
  }
}
ReactDOM.render(<App />, document.querySelector('.search-page'))