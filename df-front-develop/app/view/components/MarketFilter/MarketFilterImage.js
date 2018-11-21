import classNames from 'classnames'
import base from '../../common/baseModule'

class MarketFilterImage extends React.Component {
  constructor() {
    super()
    this.state = {
      params: {
        brand: '',
        seasons: '',
        category: '',
        order: 'time'
      }
    }
  }

  componentWillMount() {
    let self = this
    let { params } = this.state
    params.seasons = base.queryString('season') || ''
    params.brand = base.queryString('brand') || ''
    params.category = base.queryString('category') || ''

    self.setState({ params }, () => {
      self.filterResult()
      self.getBrandCategory()
    })
  }

  componentDidMount() {
    // document.querySelector('#content .fix-condition').style.marginTop = '165px'
  }
  getBrandCategory() {
    let self = this
    let { params } = this.state
    base.ajaxList.basic({
      type: 'GET',
      url: `${base.baseUrl}/market/get-categories-by-brand?${base.objToSearch(params)}`
    }, (data) => {
      if (data.success) {
        self.setState({
          categoryList: data.result.category
        })
      }
    })
  }
  filterResult() {
    const { outFilterResult } = this.props
    let { params } = this.state
    let { seasons, brand, category, order } = params
    let backParams = {
      season: seasons,
      brand,
      category,
      order
    }
    outFilterResult && outFilterResult(backParams)
  }

  orderSort(type) {
    let { params } = this.state
    if (type === 'new') {
      params.order = 'time'
    } else if (type === 'browse') {
      params.order = 'views'
    }
    this.setState({ params }, () => {
      this.filterResult()
    })
  }

  handleChoose(category, type) {
    let { params } = this.state
    params[type] = category
    this.setState({ params }, () => {
      this.filterResult()
    })
  }

  render() {
    let { params } = this.state
    let { order } = params
    return (
      <div>
        <div className="container">
          <div className="title">{decodeURIComponent(params.brand)}</div>
        </div>
        <div className='order-sort new-sort-order'>
          <div className="container">
            <span>排序</span>
            <div className="order-sort-wrapper">
              <div className={classNames('order-sort-mode new', { 'high-light': order === 'time' })}
                onClick={this.orderSort.bind(this, 'new')}
              >最新
              </div>
              <div className={classNames('order-sort-mode browse', { 'high-light': order === 'views' })}
                onClick={this.orderSort.bind(this, 'browse')}
              >浏览
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default MarketFilterImage