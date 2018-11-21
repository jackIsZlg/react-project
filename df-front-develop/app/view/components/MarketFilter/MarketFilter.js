import classNames from 'classnames'
import base from '../../common/baseModule'
import {Icon} from '../base/baseComponents'

import {Quarter, Brand, Category} from '../ScreenContent/ScreenContent'

const Letter = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '#']

class MarketFilter extends React.Component {
  constructor() {
    super()
    this.state = {
      quarterList: [], // 季度--返回数据
      brandsList: [], // 品牌--返回数据
      categoryList: [],
      brandsPane: [], // 品牌下拉面板
      selectedBrands: 'A', // 品牌默认选择项
      params: {
        seasons: '',
        brand: '',
        categories: '',
        order: 'time'
      } // 已选参数
    }
  }

  componentWillMount() {
    // this.getTaglist()
    this.filterResult()
  }
  // 获取标签数据
  getTaglist(param = '') {
    let self = this
    let {quarterList, brandsList, categoryList, brandsPane, selectedBrands} = self.state
    let {source} = this.props
    let url = source === 'market' ? '/market/get-filter-conditions' : '/ordering/getOrderingFilterConditions'

    base.ajaxList.basic({
      type: 'POST',
      url: `${base.baseUrl + url}?fields=${param}`
    }, (data) => {
      if (data.success) {
        let tagList = data.result
        for (let i in tagList) {
          switch (i) {
            case 'seasons':
              quarterList = tagList[i]
              break
            case 'brand':
              brandsList = self.dealBrands(tagList[i])
              brandsPane = brandsList[selectedBrands]
              break
            case 'category':
              categoryList = tagList[i]
              break
            default:
              break
          }
        }
        self.setState({
          quarterList, brandsList, categoryList, brandsPane
        })
      }
    })
  }
  dealBrands(brands) {
    let bb = {}
    let jinghao = []
    for (let i = 0; i < Letter.length; i++) {
      let letter1 = Letter[i]
      let todo = []
      if (letter1 === '#') {
        continue
      }
      for (let j = 0; j < brands.length; j++) {
        let category = brands[j].trim()
        if (!category) {
          continue
        }

        if (!category.match(/[a-z]/i)) {
          jinghao.push(brands[j])
          continue
        }

        if (category.substr(0, 1).toLocaleUpperCase() === Letter[i]) {
          todo.push(category)
        }
      }
      bb[letter1] = todo
    }
    bb['#'] = jinghao
    return bb
  }


  filterResult() {
    const {outFilterResult} = this.props
    let {params} = this.state
    let {seasons, brand, categories, order} = params
    let backParams = {
      season: seasons || '',
      brand: encodeURIComponent(brand) || '',
      category: encodeURIComponent(categories) || '',
      order
    }
    let categoryFlag = !!categories
    console.log(backParams)
    outFilterResult && outFilterResult(base.objToSearch(backParams), categoryFlag)
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
  }

  orderSort(type) {
    let {params} = this.state
    if (type === 'new') {
      params.order = 'time'
    } else if (type === 'browse') {
      params.order = 'views'
    }
    this.setState({params})
    this.filterResult()
  }

  judgeCondition() {
    let {source} = this.props
    let {params} = this.state
    let {seasons, categories, brand} = params
    if (source === 'orderMeeting' || source === 'brandSelected') {
      document.querySelector('#content .fix-condition').style.marginTop = '85px'
    } else {
      document.querySelector('#content .fix-condition').style.marginTop = (!!seasons || !!brand || !!categories) ? '240px' : '165px'
    }
  }

  // 渲染已选的标签
  renderSelected() {
    let {params} = this.state
    let {seasons, brand, categories} = params

    // this.judgeCondition()


    if (!this.isSelected()) {
      return <div />
    }

    return (
      <div className='order-selected'>
        <div className='container'>
          <span>已选</span>
          <ul className='filter-category'>
            {seasons && <li className='order-selected-item' onClick={this.removeSlected.bind(this, 'seasons')} >{seasons}<Icon type='close-tag'/></li>}
            {brand && <li className='order-selected-item' onClick={this.removeSlected.bind(this, 'brand')} >{brand}<Icon type='close-tag'/></li>}
            {categories &&
            <li className='order-selected-item'
              onClick={this.removeSlected.bind(this, 'categories')}
            >{categories}<Icon type='close-tag'/>
            </li>}
          </ul>
        </div>
      </div>)
  }
  render() {
    let {params, quarterList, brandsList, categoryList, brandsPane, selectedBrands} = this.state
    let {seasons, brand, categories, order} = params
    let {source} = this.props

    if (source === 'orderMeeting') {
      return (
        <div>
          {this.judgeCondition()}
          <div className='order-sort'>
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
        {(!brand || !categories) &&
        <div className='order-selected'>
          <div className="container">
            <span>筛选</span>
            <div className='filter-category'>
              {!!quarterList.length && !seasons &&
              <Quarter quarter={quarterList} chooseQuarter={this.chooseQuarter.bind(this)}/>}
              {!!brandsList && !brand &&
              <Brand selectedBrands={selectedBrands}
                brandsPane={brandsPane}
                Letter={Letter}
                chooseQuarter={this.chooseQuarter.bind(this)}
                chooseIdentical={this.chooseIdentical.bind(this)}
              />}
              {!!categoryList.length && !categories &&
              <Category categoryList={categoryList}
                chooseQuarter={this.chooseQuarter.bind(this)}
              />}
            </div>
          </div>
        </div>}
        <div className='order-sort'>
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

export default MarketFilter