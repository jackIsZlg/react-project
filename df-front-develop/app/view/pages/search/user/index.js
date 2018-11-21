import base from '../../../common/baseModule'
import WaterFall from '../../../components/WaterFall/WaterFall'

base.headerChange('white')

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      value: '',
      newValue: ''
    }
    this.firstS = true // 用来记录当前页面是否是第一次查询
  }

  componentWillMount() {
    let self = this
    self.setState({
      value: decodeURIComponent(base.queryString('value'))
    })
  }

  componentDidMount() {
    this.searchResult()
  }

  componentWillUnmount() {
    // document.documentElement.removeEventListener('click');
  }

  getChangeValue() {
    if (this.inputEl.value.length <= 50) {
      let self = this
      self.setState({
        value: self.inputEl.value
      })
    }
    this.firstS = false
  }

  // getFocus() {
  //   this.setState({
  //     // value: ''
  //   })
  // }

  getEnter(e) {
    e.keyCode * 1 === 13 && this.searchResult()
  }

  searchResult() {
    let { value } = this.state
    this.setState({
      newValue: ''
    }, () => {
      this.setState({
        newValue: value
      })
    })
  }

  render() {
    let { value, newValue } = this.state
    let pointContent = {
      source_page: 'pic_search_result',
      source_type: 'search_result'
    }
    return (
      <div>
        <div className='search-header'>
          <input ref={el => this.inputEl = el}
            type="text"
            value={value}
            placeholder='搜索你想要找的图片'
            onKeyDown={this.getEnter.bind(this)}
            // onFocus={this.getFocus.bind(this)}
            onChange={this.getChangeValue.bind(this)}
          />
          <button className='search-btn' onClick={this.searchResult.bind(this)}>搜索</button>
        </div>
        <div className="container">
          <div id="water-fall-panel" ref={el => this.waterWrapper = el}>
            {
              !!newValue &&
              <WaterFall
                key="waterWall"
                wfType="blog"
                dataUrl={`/search/user/post?query=${newValue}`}
                pointContent={pointContent}
                seeBlogger={pointContent}
              />
            }
          </div>
        </div>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.querySelector('.search-page'))