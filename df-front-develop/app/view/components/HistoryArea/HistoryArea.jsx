import base from '../../common/baseModule'

class HistoryArea extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isShow: false,
      historyList: [],
      historyIndex: 0,
      searchType: props.searchType || 1,
      requestUrl: {
        get: props.get || '/search/history-list',
        add: props.add || '/search/history-add',
        clear: props.clear || '/search/history-clear-all'
      }
    }
  }
  
  // 获取历史记录
  getHistoryData() {
    let {requestUrl, searchType} = this.state
    base.ajaxList.basic({
      type: 'GET',
      url: `${base.baseUrl}${requestUrl.get}?searchType=${searchType}`,
      // data: {}
    }, (data) => {
      if (data.success) {
        this.setState({
          historyList: [...data.result]
        })
      }
    })
  }

  changeHistoryStatus(type = 'down') {
    if (type === 'up') {
      this.setState({
        isShow: false
      })
      return
    }
    this.setState({
      isShow: true
    })
    this.getHistoryData()
  }

  // 历史记录-动画
  judgStyle() {
    let resulObj = {}
    const { isShow, historyList } = this.state
    if (isShow) {
      if (historyList.length > 0) {
        resulObj.maxHeight = `${historyList.length * 50 + 50}px`
      } else {
        resulObj.maxHeight = `${historyList.length * 50 + 50}px`
      }
    } else {
      resulObj.maxHeight = '0'
      resulObj.visibility = 'hidden'
    }
    return resulObj
  }

  choose(type) {
    let { historyIndex, historyList } = this.state
    let newIndex = 0
    let valueHis = '' // 输入框标题
    if (type === 'down') {
      if (historyIndex === historyList.length) {
        newIndex = 0
      } else {
        newIndex = historyIndex + 1
      }
    } else if (type === 'up') {
      if (historyIndex === 0) {
        newIndex = historyList.length
      } else {
        newIndex = historyIndex - 1
      }
    }
    if (newIndex) {
      valueHis = historyList[newIndex - 1].content
    }
    this.setState({
      historyIndex: newIndex,
      isShow: true,
    })
    this.props.changeInputValue && this.props.changeInputValue(valueHis)
  }

  // 点击历史
  handleWhenClickHis(item) {
    const value = item.content
    this.props.changeInputValue && this.props.changeInputValue(value, true)
  }

  // 保存历史记录
  saveHistoryData(value) {
    let {requestUrl, searchType, historyIndex} = this.state
    const params = {}
    params.q = value
    params.searchType = searchType
    base.ajaxList.basic({
      type: 'GET',
      url: `${base.baseUrl}${requestUrl.add}`,
      data: params
    }, () => {
      !!historyIndex && this.setState({
        historyIndex: 0
      })
    })
  }

  // 清除全部历史记录
  clearAllHistory() {
    let {requestUrl, searchType} = this.state
    base.ajaxList.basic({
      type: 'GET',
      url: `${base.baseUrl}${requestUrl.clear}?searchType=${searchType}`,
    }, () => {
      this.setState({
        historyList: []
      })
      this.props.changeInputValue && this.props.changeInputValue()
    })
  }

  // 历史记录-返回历史记录html
  renderClearArea() {
    const { historyList, historyIndex } = this.state
    const result = []
    for (let i = 0; i < historyList.length; i++) {
      let obj = ''
      if (historyIndex !== 0 && historyIndex === (i + 1)) {
        obj = (
          <div
            id={historyList[i].id}
            className="history-item his-bak"
            onClick={() => this.handleWhenClickHis(historyList[i])}
          >
            {historyList[i].content}
          </div>
        )
      } else {
        obj = (
          <div
            id={historyList[i].id}
            className="history-item"
            onClick={() => this.handleWhenClickHis(historyList[i])}
          >
            {historyList[i].content}
          </div>
        )
      }
      result.push(obj)
    }
    let clearDiv = ''
    if (historyList.length > 0) {
      clearDiv = (
        <div className="clear-history">
          <span
            className="clear"
            onClick={() => this.clearAllHistory()}
          >
            清除历史记录
          </span>
        </div>
      )
    }
    result.push(clearDiv)
    return result
  }
  render() {
    return (
      <div className="limit-container">
        <div className="historyArea" style={this.judgStyle()}>
          {this.renderClearArea()}
        </div>
      </div>
    )
  }
}

export default HistoryArea