import classNames from 'classnames'
import base from '../../common/baseModule'
import {Icon} from '../../components/base/baseComponents'

const Letter = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '#']
class CommonFilter extends React.Component {
  constructor(props) {
    super(props)
    // 默认数据
    this.state = {
      tags: {
        mostPostBrands: [],
        mostOrderingBrands: [],
        editorCategory: [],
        mostOrderingSeasons: [],
        categorys: [],
        brands: [],
        seasons: []
      },
      newBrands: [],
      isCategoryDiy: false,
      isDesignDiy: false,
      DesignerModal: false,
      categoryModal: false,
      categoryTitle: '',
      designerName: '',
      orderType: 'time' // 默认最新排序
    }
  }
  
  componentWillMount() {
    base.ajaxList.basic({
      type: 'POST',
      url: `${base.baseUrl}${this.props.tagsUrl}`
    }, (d) => {
      this.setState({ tags: d.result }, () => this.dealBrands(d.result.brands))
    })
  }
  componentDidMount() {
    $(document).click((event) => {
      const isSeasonParent = this.isParent(event.target, $('.season-modal')[0])
      const isDesignParent = this.isParent(event.target, $('.design-modal')[0])
      if (isSeasonParent) {
        switch (event.target.id) {
          case 'cell-season-diy': this.setState({ categoryModal: false, DesignerModal: false }); break
          default: this.setState({ categoryModal: true })
        }
      }
      if (isDesignParent) {
        switch (event.target.id) {
          case 'cell-design-diy': this.setState({ categoryModal: false, DesignerModal: false }); break
          default: this.setState({ DesignerModal: true })
        }
      }
      if (!isDesignParent && !isSeasonParent) {
        switch (event.target.id) {
          case 'category-diy': this.setState({ categoryModal: this.state.categoryModal }); break
          case 'design-diy': this.setState({ DesignerModal: this.state.DesignerModal }); break
          default: this.setState({ DesignerModal: false, categoryModal: false})
        }
      }
    })
  }
  getElementLeft(element) {
    let actualLeft = element.offsetLeft
    let current = element.offsetParent
    
    while (current !== null) {
      actualLeft += current.offsetLeft
      current = current.offsetParent
    }
    
    return actualLeft
  }
  isParent(obj, parentObj) {
    while (obj !== undefined && obj != null && obj.tagName !== undefined && obj.tagName.toUpperCase() !== 'BODY') {
      if (obj === parentObj) {
        return true
      }
      obj = obj.parentNode
    }
    return false
  }
  // 修改品类
  changeCategoryTitle(categoryTitle, isCategoryDiy) {
    if (categoryTitle === '') {
      base.eventCount.add('6001')
    } else {
      base.eventCount.add('6002', {'品类标签ID': categoryTitle})
    }
    this.setState({ categoryTitle, isCategoryDiy, categoryModal: false}, () => this.filterChange())
  }

  showCategoryModal() {
    base.eventCount.add('6003')
    this.setState({ categoryModal: !this.state.categoryModal, DesignerModal: false })
  }
  // 修改季度
  changeSeasonTitle(seasonTitle, isSeasonDiy) {
    if (seasonTitle === '') {
      base.eventCount.add('5001')
    } else {
      base.eventCount.add('5002', {'季度标签ID': seasonTitle})
    }
    this.setState({ seasonTitle, isSeasonDiy}, () => this.filterChange())
  }
  // 修改品牌
  changeDesignerName(designerName, isDesignDiy) {
    if (designerName === '') {
      base.eventCount.add(this.props.source === 'market' ? '6006' : '5006')
    } else {
      base.eventCount.add(this.props.source === 'market' ? '6005' : '5005', { '品牌标签ID': designerName })
    }
    this.setState({ designerName, isDesignDiy, DesignerModal: false }, () => this.filterChange())
  }

  showDesignModal() {
    base.eventCount.add(this.props.source === 'market' ? '6008' : '5008')
    this.setState({ DesignerModal: !this.state.DesignerModal, categoryModal: false })
  }
  // 修改order类型
  changeOrderType(orderType) {
    let eventId = ''
    const {source} = this.props
    switch (orderType) {
      case 'time': eventId = source === 'market' ? '6010' : '5010'; break
      default:
        eventId = source === 'market' ? '6011' : '5011'; break
    }
    base.eventCount.add(eventId)
    this.setState({ orderType }, () => this.filterChange())
  }

  dealBrands(brands) {
    let bb = {}
    let jinghao = []
    for (let i = 0; i < Letter.length; i++) {
      let letter1 = Letter[i]
      let todo = []
      if (letter1 === '#') { continue }
      for (let j = 0; j < brands.length; j++) {
        let category = brands[j].trim()
        if (!category) { continue }
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
    this.setState({newBrands: bb})
  }

  filterChange() {
    const { seasonTitle, designerName, categoryTitle, orderType } = this.state
    this.props.filterChange({season: seasonTitle, brand: designerName, category: categoryTitle, order: orderType})
  }

  movemodal(id, target, limitValue) {
    const leftValue = this.getElementLeft(document.getElementById(id))
    if (leftValue <= limitValue) {
      $(target).css({left: 160, right: ''})
    } else {
      $(target).css({left: '', right: window.innerWidth - leftValue - 286})
    }
  }
  resetCategory() {
    base.eventCount.add('6004')
    this.setState({ isCategoryDiy: false, categoryTitle: '' }, () => this.filterChange())
  }
  resetDesign() {
    base.eventCount.add(this.props.source === 'market' ? '6009' : '5009')
    this.setState({ isDesignDiy: false, designerName: '' }, () => this.filterChange())
  }

  renderSeasonCell(seasons) {
    if (!seasons.length) { return null }
    const { seasonTitle, isSeasonDiy } = this.state
    const newSeasons = seasons.length > 12 ? seasons.slice(0, 12) : seasons
    return newSeasons.map((season, index) => {
      let _key = `season_${index}`
      return (
        <span
          className='season-value-wrap'
          key={_key}
          onClick={this.changeSeasonTitle.bind(this, season, false)}
        >
          <span className={!isSeasonDiy && seasonTitle === season ? 'select-all-selected' : 'season-value'}>{season}</span>
        </span>)
    })
  }
 
  renderCategoryCell(categorys) {
    if (!categorys.length) { return null }
    if ($('#category-diy').length) {
      this.movemodal('category-diy', '.season-modal', 785)
    }
    const { categoryTitle, isCategoryDiy } = this.state
    return categorys.map((category, index) => {
      let _key = `season_${index}`
      return (
        <span
          className='season-value-wrap'
          key={_key}
          onClick={this.changeCategoryTitle.bind(this, category, false)}
        >
          <span id='cell-season-diy' className={!isCategoryDiy && categoryTitle === category ? 'select-all-selected' : 'season-value'}>{category}</span>
        </span>)
    })
  }
  renderDesignerCell(designers) {
    const { designerName, isDesignDiy } = this.state
    if (!designers.length) { return null }
    if ($('#design-diy').length) {
      this.movemodal('design-diy', '.design-modal', 1040)
    }
    const newDesigners = designers.length > 21 ? designers.slice(0, 21) : designers
    return newDesigners.map((designer, index) => {
      let _key = `designer_${index}`
      return (
        <span key={_key}
          id='cell-season-diy'
          className={!isDesignDiy && designerName === designer ? 'value-selected' : 'city-value'}
          onClick={this.changeDesignerName.bind(this, designer, false)}
        >{designer}
        </span>)
    })
  }
  renderSeason() {
    const { seasonTitle } = this.state
    const { seasons, mostOrderingSeasons } = this.state.tags
    return (
      <div className="new-select-panel select-season container">
        <div className="new-select-title">
          <span className='select-title'>季度</span>
          <span className={seasonTitle ? 'select-all' : 'select-all-selected'} onClick={this.changeSeasonTitle.bind(this, '', false)}>全部</span>
        </div>
        <div className="new-select-value">
          {this.renderSeasonCell(this.props.source === 'ordering' ? mostOrderingSeasons : seasons)}
        </div>
      </div>
    )
  }

  renderCategory() {
    const { isCategoryDiy, categoryTitle, categoryModal } = this.state
    const { editorCategory, categorys} = this.state.tags
    return (
      <div className="new-select-panel select-season container">
        <div className="new-select-title">
          <span className='select-title'>品类</span>
          <span className={categoryTitle ? 'select-all' : 'select-all-selected'} onClick={this.changeCategoryTitle.bind(this, '', false)}>全部</span>
        </div>
        <div className="new-select-value">
          {this.renderCategoryCell(editorCategory)}
          {
          isCategoryDiy
              ?
                <span className='season-value-wrap'>
                  <span className='select-all-selected'
                    onClick={this.resetCategory.bind(this)}
                  >{categoryTitle}
                    <Icon type='cancel-black' />
                  </span>
                </span>
            :
                <span className='season-value-wrap'>
                  <span
                    id='category-diy'
                    className='diy-value'
                    onClick={this.showCategoryModal.bind(this)}
                  >+更多
                  </span>
                </span>
        }
          {/* 自定义弹出 */}
          <div className={categoryModal ? 'pop-modal season-modal' : 'season-modal hide-modal'}>
            {categorys.map((category, index) => {
            return (
              <div key={index} className='cell-season-wrap'>
                <span className='season-year'>{category.categoryParent}</span>
                <div className='season-detail'>
                  {category.categoryChild.length && category.categoryChild.map((child, index) => {
                    return (
                      <span
                        id='cell-season-diy'
                        className={this.state.categoryTitle === child ? 'cell-season-selected' : 'cell-season-value'}
                        key={`detail${index}`}
                        onClick={this.changeCategoryTitle.bind(this, child, true)}
                      >{child}
                      </span>
                    )
                })}
                </div>
              </div>) 
          })}
          </div>
        </div>
      </div>
    )
  }
  renderDesigner() {
    const { newBrands, isDesignDiy, designerName, DesignerModal } = this.state
    const { mostOrderingBrands, mostPostBrands} = this.state.tags
    return (
      <div className="new-select-panel select-designers container">
        <div className="new-select-title">
          <span className='select-title'>品牌</span>
          <span className={designerName ? 'select-all' : 'select-all-selected'} onClick={this.changeDesignerName.bind(this, '', false)}>全部</span>
        </div>
        <div className="new-select-value">
          {this.renderDesignerCell(this.props.source === 'ordering' ? mostOrderingBrands : mostPostBrands)}
          {
          isDesignDiy
              ?
                <span className='value-selected' onClick={this.resetDesign.bind(this)}>
                  {designerName}
                  <Icon type='cancel-black' />
                </span>
            :
                <span
                  id='design-diy'
                  className='diy-value'
                  onClick={this.showDesignModal.bind(this)}
                >+更多
                </span>
        }
          {/* 自定义弹出 */}
          <div
            id='design-modal'
            className={DesignerModal ? 'pop-modal design-modal' : 'design-modal hide-modal'}
          >
            {newBrands.A && <WordFilter hidden={isDesignDiy} brands={newBrands} changeDesignerName={name => this.changeDesignerName(name, true)}/>}
          </div>
        </div>
      </div>
    )
  }
  renderFilterSort() {
    const { orderType } = this.state
    const orderObj = {
      time: '最新上线',
      views: '浏览最多',
      // week: '本周更新',
      // month: '本月更新',
    }
    return (
      <div className="filter-title-wrap">
        <div className="container">
          {
            Object.keys(orderObj).map((filter, index) => {
              return (
                <div key={index} onClick={this.changeOrderType.bind(this, filter)} className={orderType === filter ? 'latest-selected' : 'latest'}>{orderObj[filter]}</div>
              )
            })
          }
        </div>
      </div>
    )
  }
  render() {
    return (
      <div id="category-filter-panel">
        {this.props.source === 'market' ? this.renderCategory() : this.renderSeason() }
        <div className='line'></div>
        {this.renderDesigner()}
        <div className='height-line'></div>
        {this.renderFilterSort()}
      </div>)
  }
}
class WordFilter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      mockData: [],
      wordArray: props.brands,
    }
  }

  componentDidMount() {
    this.preDealData(this.props.brands)
  }
  // 检测数据
  _isDataNull() {
    return this.state.mockData.length === 0
  }

  // 预处理数据，#
  preDealData(data) {
    let obj = {}
    for (let i in data) {
      let _ascii = i.charCodeAt()
      if (_ascii > 64 && _ascii < 91) {
        obj[i] = data[i]
      } else {
        !obj.hasOwnProperty('#') && (obj['#'] = [])
        obj['#'] = obj['#'].concat(data[i])
      }
    }
    this.setState({mockData: obj})
  }

  // 输出A-Z  26个大写字母 加 #
  generateWord() {
    let obj = {}
    for (let i = 0; i < 26; i++) {
      obj[String.fromCharCode(65 + i)] = {
        effective: false
      }
    }
    obj['#'] = {
      effective: false
    }
    return obj
  }

  // 根据数据筛选有效数据
  generateEffectiveWord() {
    let obj = this.generateWord()
    for (let i in this.state.mockData) {
      obj[i].effective = true
    }
    return obj
  }

  // 首字母移动
  handleMove(word, event) {
    event.stopPropagation()
    if (!this.refs.hasOwnProperty(`word_${word}`)) {
      return
    }
    // jq缓动
    $(this.refs['word-content']).animate({'scrollTop': this.refs[`word_${word}`].offsetTop - 134}, 300)
  }

  // 跳转
  handleClick(name) {
    this.props.changeDesignerName(name)
  }

  // 渲染首字母列表
  _renderWord() {
    if (this._isDataNull()) { return null }
    let _array = []
    for (let i in this.state.wordArray) {
      if (this.state.wordArray[i].length) {
        _array.push(<li id='cell-word-diy' key={`word_${i}`} onClick={this.handleMove.bind(this, i)}>{i}</li>)
      } 
    }
    return _array
  }

  sliceArray(array) {
    const result = []
    const length = array.length
    for (let i = 0; i < length; i += 5) {
      result.push(array.slice(i, i + 5))
    }
    return result
  }

  //  渲染内容
  _renderWordContent() {
    if (this._isDataNull()) { return null }
    let _array = []
    for (let i in this.state.mockData) {
      if (this.state.mockData[i].length) {
        const result = this.sliceArray(this.state.mockData[i])
        let _key = `word_${i}` // 首字母
        let wordContent = result.map((son, index) => {
          const tmp = 5 - son.length
          if (tmp) {
            for (let i = 0; i < tmp; i++) { son.push('') }
          }
          return (
            <div className='li-wrap' key={index}>
              {
                son.map((item, index) => {
                  let _key = `word_${i}_${index}`
                  return item ? <li id='cell-design-diy' key={_key} onClick={this.handleClick.bind(this, item)}>{item}</li> : <li/>
                })
              }
            </div>
          )
        })
        _array.push(<li ref={_key} key={_key} className="word-content-item"> <div className="word-title">{i}</div> <ul>{wordContent}</ul> <div className="clearfix" /></li>)
      }
    }
    return _array
  }

  render() {
    let _wordContentHtml = this._renderWordContent()
    let _wordHtml = this._renderWord()
    return (
      <div id="word-filter-panel" className={classNames({'hidden': this.props.hidden || false})} >
        <ul className="word-list">{_wordHtml}</ul>
        <ul className="word-content scrollbar" ref="word-content">
          {_wordContentHtml}
        </ul>
      </div>)
  }
}
export { CommonFilter}