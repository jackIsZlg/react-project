import className from 'classnames'
import base from '../../common/module/baseModule'
import { Icon } from '../base/baseComponents'
import HistoryArea from '../HistoryArea/HistoryArea'

class Search extends React.Component {
  constructor() {
    super()
    this.state = {
      displayInput: false,
      searchValue: ''
    }
    this.firstS = true // 用来记录当前页面是否是第一次查询
  }

  componentDidMount() {
    document.body.addEventListener('click', (e) => {
      const tarObj = e.target
      console.log('tarObj', tarObj)
      if (tarObj && tarObj.matches('input#search-tab')) {
        return
      }
      if (tarObj.matches('div.history-item') || tarObj.matches('div.clear-history') || tarObj.matches('span.clear')) {
        return
      }
      if (tarObj.matches('div.btn-search') || tarObj.matches('i.icon-search')) {
        return
      }
      this.eliminateCursor()
    })
  }
  componentWillUnmount() {
    document.body.removeEventListener('click')
  }

  getInputFocus() {
    this.setState({
      displayInput: true
    })
    this.inputValue.focus()
    this.history.changeHistoryStatus()
  }

  getFocus() {
    let self = this
    let { searchValue } = self.state
    if (!searchValue) {
      if ($('.search-pane').hasClass('ishover')) {
        this.history.changeHistoryStatus()
      }
      return
    }
    this.inputValue.blur()
    this.setState({
      displayInput: false,
      // isShow: false,
      searchValue: '',
    })

    this.inputValue.value = ''
    this.history.changeHistoryStatus('up')
    // window.open(`/search/user/image?value=${encodeURIComponent(searchValue)}`)
    window.open(`/search/pinterest?value=${encodeURIComponent(searchValue)}`)
  }


  getSearchValue() {
    let self = this
    self.setState({
      searchValue: self.inputValue.value
    })
    this.firstS = false // 值改变了，不再是第一次查询
  }

  // 搜索框-输入内容后，按下enter键/上键/下键时触发
  pressEnter(e) {
    if (e.keyCode * 1 === 13) { // enter键
      this.getFocus()
    } else if (e.keyCode * 1 === 38) { // 上键
      this.history.choose('up')
    } else if (e.keyCode * 1 === 40) { // 下键
      this.history.choose('down')
    }
  }
  // 点击其他地方时隐藏
  eliminateCursor() {
    let self = this
    self.setState({
      displayInput: false,
      searchValue: '',
    }, () => {
      self.inputValue.value = ''
    })
    this.history.changeHistoryStatus('up')
  }

  changeInputValue(value = '', isJump = false) {
    this.setState({
      searchValue: value
    }, () => {
      isJump && this.getFocus()
    })
    !value && this.inputValue.focus()
  }

  render() {
    let { displayInput, searchValue } = this.state
    const hasHover = $('.search-pane').hasClass('ishover')
    return (
      <div className={className('search-pane', {
        'hover': displayInput,
        'ishover': hasHover
      })}
      >
        <input ref={el => this.inputValue = el}
          id="search-tab"
          value={searchValue}
          autoComplete="off"
          type="search"
          placeholder="搜索图片"
          onKeyDown={this.pressEnter.bind(this)}
          onChange={this.getSearchValue.bind(this)}
          onFocus={this.getFocus.bind(this)}
        />
        <div className="btn-search">
          <span id="do-search" onClick={this.getInputFocus.bind(this)}><Icon type='search' title='搜索' /></span>
        </div>

        <HistoryArea ref={el => this.history = el} changeInputValue={this.changeInputValue.bind(this)}/>

      </div>
    )
  }
}

export default Search