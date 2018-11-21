import base from '../../common/baseModule'
import { SearchInputWrapper } from '../SearchInput/SearchInput'
import HistoryArea from '../HistoryArea/HistoryArea'

// 搜索时尚
class Pinterestsearch extends React.Component {
  constructor() {
    super()
    this.state = {
      value: ''
    }
  }

  componentDidMount() {
    $('#btn-search').css('display', 'none')
    document.body.addEventListener('click', (e) => {
      const tarObj = e.target
      if (tarObj && tarObj.matches('input#pinterest_id')) {
        return
      }
      if (tarObj.matches('div.history-item') || tarObj.matches('div.clear-history') || tarObj.matches('span.clear')) {
        return
      }
      this.history.changeHistoryStatus('up')
    })
  }

  componentWillUnmount() {
    document.body.removeEventListener('click')
  }

  // 搜索框改变时触发
  getChangeValue() {
    if (this.inputEl.value.length > 50) {
      return
    }
    this.setState({
      value: this.inputEl.value
    })
  }

  // 搜索框聚焦时触发
  getFocus() {
    this.history.changeHistoryStatus()
  }
  getEnter(e) {
    if (e.keyCode * 1 === 13) { // enter键
      this.searchResult()
    } else if (e.keyCode * 1 === 38) { // 上键
      this.history.choose('up')
    } else if (e.keyCode * 1 === 40) { // 下键
      this.history.choose('down')
    } 
  }

  // 开始进行操作
  searchResult() {
    let { value } = this.state
    if (!value) {
      this.inputEl.focus()
      return
    }
    this.inputEl.blur()
    this.history.saveHistoryData(value)
    this.setState({
      value: '',
      // isShow: false
    })
    this.history.changeHistoryStatus('up')
    window.open(`/search/pinterest?value=${encodeURIComponent(value)}`)
  }

  changeInputValue(value = '', isJump = false) {
    this.setState({
      value
    }, () => {
      isJump && this.searchResult()
    })
    !value && this.inputEl.focus()
  }

  render() {
    const { value } = this.state
    return (
      <div className='search-header'>
        <input
          id="pinterest_id"
          ref={el => this.inputEl = el}
          type="text"
          value={value}
          placeholder='搜索想找的图片'
          onKeyDown={this.getEnter.bind(this)}
          onChange={this.getChangeValue.bind(this)}
          onFocus={this.getFocus.bind(this)}
        />
        <span className='search-btn' onClick={this.searchResult.bind(this)}>
          <i className="iconfont icon-search" title="搜索" />
        </span>
        <HistoryArea ref={el => this.history = el} changeInputValue={this.changeInputValue.bind(this)}/>
      </div>
    )
  }
}
class BloggerSearch extends React.Component {
  // componentDidMount() {
  //   $('#btn-search').css('display', 'none')
  // }
  render() {
    return (
      <div id='search-wrapper'>
        <SearchInputWrapper type={0} isJump={true}/>
      </div>
    )
  }
}
document.addEventListener('scroll', () => {
  let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
  // if (scrollTop > 110) {
  //   base.headerChange('white')
  //   $('.header-lab-lists').addClass('fixed-lab-list')
  //   $('.index-wrapper').addClass('padding-index-wrapper')
  // } else
  if (scrollTop > 77) {
    base.headerChange('white')
    if ($('.search-header').length) {
      $('#btn-search').css('display', 'block')
      $('.search-pane').addClass('ishover')
    }

    // $('.header-lab-lists').removeClass('fixed-lab-list')
    // $('.index-wrapper').removeClass('padding-index-wrapper')
    // $('#do-search').click()
  } else {
    base.headerChange()
    if ($('.search-header').length) {
      $('#btn-search').css('display', 'none')
      $('.search-pane').removeClass('ishover')
    }
    // $('.header-lab-lists').removeClass('fixed-lab-list')
    // $('.index-wrapper').removeClass('padding-index-wrapper')
  }
})
export {Pinterestsearch, BloggerSearch}
