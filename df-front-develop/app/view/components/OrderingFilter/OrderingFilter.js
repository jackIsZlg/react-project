import classNames from 'classnames'
import base from '../../common/baseModule'
import {Icon} from '../base/baseComponents'

import {Quarter, Brand} from '../ScreenContent/ScreenContent'

const Letter = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

class OrderingFilter extends React.Component {
  constructor() {
    super()
    this.state = {
      quarterList: [], // 季度--返回数据
      brandsList: [], // 品牌--返回数据
      brandsPane: [], // 品牌下拉面板
      selectedBrands: 'A', // 品牌默认选择项
      params: {
        seasons: '',
        brand: '',
        category: '',
        order: 'time'
      } // 已选参数
    }
  }

  componentWillMount() {
    this.getQueryCondition()
  }

  // 获取标签数据
  getTaglist(param = '') {
    let self = this
    let {quarterList, brandsList, brandsPane, selectedBrands} = self.state

    base.ajaxList.basic({
      type: 'POST',
      url: `${base.baseUrl}/ordering/getOrderingFilterConditions?&fields=${param}`
    }, (data) => {
      if (data.success) {
        let category = data.result
        quarterList = category.seasons
        brandsList = self.dealBrands(category.brands)
        brandsPane = brandsList[selectedBrands]
        self.setState({quarterList, brandsList, brandsPane})
      }
    })
  }


  // 获取参数
  getQueryCondition() {
    let self = this
    let {params} = self.state
    params.seasons = base.queryString('season') || ''
    params.brand = decodeURIComponent(base.queryString('brand')) || ''

    self.setState({params}, () => {
      // self.getTaglist()
      self.filterResult()
    })
  }

  dealBrands(brands) {
    let bb = {}
    for (let i = 0; i < Letter.length; i++) {
      let letter1 = ''
      let todo = []
      letter1 = Letter[i]
      for (let j = 0; j < brands.length; j++) {
        if (brands[j].substr(0, 1) === Letter[i]) {
          todo.push(brands[j])
        }
      }
      bb[letter1] = todo
    }
    return bb
  }

 
  filterResult() {
    const {outFilterResult} = this.props
    let {params} = this.state
    let {seasons, brand, order} = params
    let backParams = {
      season: seasons,
      brand: encodeURIComponent(brand),
      order
    }
    outFilterResult && outFilterResult(backParams)
  }

  removeSlected(type) {
    let {params} = this.state
    params[type] = ''
    this.setState({params})
    this.filterResult()
  }

  // 判断有没有选中标签
  isSelected() {
    let {params} = this.state
    for (let i in params) {
      if (i !== 'order' && !!params[i]) {
        return true
      }
    }
    return false
  }

  chooseIdentical(choose) {
    let {brandsList, brandsPane, selectedBrands} = this.state
    selectedBrands = choose
    brandsPane = brandsList[choose]
    this.setState({brandsPane, selectedBrands})
  }

  chooseQuarter(tag, type) {
    let self = this
    let {params} = self.state
    params[type] = tag
    self.setState({params})
    this.filterResult()
    type === 'brand' && base.eventCount.add(1056, {
      '用户ID': base.LS().id,
      '品牌': tag
    })
  }

  orderSort(type) {
    let {params} = this.state
    if (type === 'new') {
      params.order = 'time'
      base.eventCount.add(1057)
    } else if (type === 'browse') {
      params.order = 'views'
      base.eventCount.add(1058)
    }
    this.setState({params})
    this.filterResult()
  }

  judgeCondition() {
    let {source} = this.props
    let {params} = this.state
    let {seasons, brand} = params
    if (source === 'orderMeeting') {
      document.querySelector('#content .fix-condition').style.marginTop = '85px'
    } else {
      document.querySelector('#content .fix-condition').style.marginTop = (!!seasons || !!brand) ? '240px' : '165px'
    }
  }

    
  // 渲染已选的标签
  renderSelected() {
    let {params} = this.state
    let {seasons, brand} = params
    // this.judgeCondition()
    if (!this.isSelected()) {
      return <div></div>
    }
    return (
      <div className='order-selected'>
        <div className='container'>
          <span>已选</span>
          <ul className='filter-category'>
            {seasons && <li className='order-selected-item' onClick={this.removeSlected.bind(this, 'seasons')}>{seasons}<Icon type='close-tag'/> </li>}
            {brand && <li className='order-selected-item' onClick={this.removeSlected.bind(this, 'brand')}>{brand}<Icon type='close-tag'/></li>}
          </ul>
        </div>
      </div>)
  }

  render() {
    let {params, quarterList, brandsPane, selectedBrands} = this.state
    let {seasons, brand, order} = params
    let {source} = this.props

    if (source === 'orderMeeting') {
      return (
        <div>
          {this.judgeCondition()}
          <div className='order-sort new-sort-order'>
            <div className="container">
              <span>排序</span>
              <div className="order-sort-wrapper">
                <div className={classNames('order-sort-mode new', {'high-light': order === 'time'})}
                  onClick={this.orderSort.bind(this, 'new')}
                >最新
                </div>
                <div className={classNames('order-sort-mode browse', {'high-light': order === 'views'})}
                  onClick={this.orderSort.bind(this, 'browse')}
                >浏览
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div>
        {this.renderSelected()}
        {(!seasons || !brand) &&
        <div className='order-selected'>
          <div className="container">
            <span>筛选</span>
            <div className='filter-category'>
              {!seasons && <Quarter quarter={quarterList} chooseQuarter={this.chooseQuarter.bind(this)}/>}
              {!brand && <Brand selectedBrands={selectedBrands}
                brandsPane={brandsPane}
                Letter={Letter}
                chooseQuarter={this.chooseQuarter.bind(this)}
                chooseIdentical={this.chooseIdentical.bind(this)}
              />}
            </div>
          </div>
        </div>
                }
        <div className='order-sort  new-sort-order'>
          <div className="container">
            <span>排序</span>
            <div className="order-sort-wrapper">
              <div className={classNames('order-sort-mode new', {'high-light': order === 'time'})}
                onClick={this.orderSort.bind(this, 'new')}
              >最新
              </div>
              <div className={classNames('order-sort-mode browse', {'high-light': order === 'views'})}
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

export default OrderingFilter