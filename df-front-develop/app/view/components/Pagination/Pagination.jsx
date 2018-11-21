import classNames from 'classnames'
import { Icon } from '../../components/base/baseComponents'

// bootstrap 分页
class Pagination extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      pageNo: Math.max(this.props.pageNo * 1 || 0, 0),
      totalPage: this.props.totalPage * 1 || 0,
      jumpPageNo: null
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.pageNo !== this.state.pageNo
      || nextProps.totalPage !== this.state.totalPage) {
      this.setState({
        pageNo: nextProps.pageNo,
        totalPage: nextProps.totalPage
      })
    }
  }
  onJumpTxtInput(e) {
    if (e.target.value === '') {
      this.setState({
        jumpPageNo: ''
      })
    } else if (!isNaN(e.target.value)) {
      this.setState({
        jumpPageNo: Math.max(1, Math.min(e.target.value, this.state.totalPage))
      })
    } else {
      this.setState({
        jumpPageNo: this.state.jumpPageNo
      })
    }
  }

  onJumpPageClick() {
    if (this.state.jumpPageNo > 0) {
      let pageIndex = this.state.jumpPageNo - 1
      this.setPageNo(pageIndex)
    }
  }
  setPageNo(pageNo) {
    this.setState({
      pageNo
    })
    this.props.reset(pageNo)
  }

  prevPage() {
    if (this.state.pageNo === 0) {
      return
    }
    this.setPageNo(this.state.pageNo - 1)
  }

  nextPage() {
    if (this.state.pageNo === this.state.totalPage - 1) {
      return
    }
    this.setPageNo(this.state.pageNo + 1)
  }

  renderPagination() {
    let pageHtml = []
    let { totalPage, pageNo } = this.state

    pageHtml.push(this.renderPageItem(0))

    // 计算页码显示区间
    let start = Math.max(1, pageNo - 2)
    let end = Math.min(totalPage - 2, start + 4)

    // 补足5个
    if (end - start < 4) {
      start = Math.max(1, end - 4)
    }

    // 前部省略号,页码3开始显示
    if (start > 1) {
      pageHtml.push(<li key='page_prev_point'>...</li>)
      start++
    }

    // 中间页码
    for (; start <= end; start++) {
      pageHtml.push(this.renderPageItem(start))
    }

    // 尾部省略号，页码total-2结束显示
    if (end < totalPage - 2) {
      pageHtml.push(<li key='page_next_point'>...</li>)
    }

    pageHtml.push(this.renderPageItem(totalPage - 1))

    return pageHtml
  }


  renderPageItem(pageNo) {
    let key = `page_${pageNo}`
    return (
      <li className={classNames({ 'active': pageNo === this.state.pageNo })}
        key={key}
        onClick={this.setPageNo.bind(this, pageNo)}
      ><a>{pageNo + 1}</a>
      </li>)
  }

  render() {
    if (this.state.totalPage <= 1) {
      return null
    }

    return (
      <ul className="pagination">
        <li className={classNames({
          'disabled': this.state.pageNo === 0,
        })}
          key='page_prev'
          onClick={this.prevPage.bind(this)}
        >
          <a><Icon type="pagination-prev" /></a>
        </li>
        {this.renderPagination()}
        <li className={classNames({
          'disabled': this.state.pageNo === this.state.totalPage - 1,
        })}
          key='page_next'
          onClick={this.nextPage.bind(this)}
        >
          <a><Icon type="pagination-next" /></a>
        </li>
        <li className="jump">
          <input onInput={this.onJumpTxtInput.bind(this)} value={this.state.jumpPageNo} className="jump-txt" />
        </li>
        <li className="jump-btn" onClick={this.onJumpPageClick.bind(this)} >跳转</li>
      </ul>)
  }
}

export default Pagination