import classNames from 'classnames'
import base from '../../common/baseModule'
import {Icon} from '../../components/base/baseComponents'

class CategoryFilter extends React.Component {
  constructor(props) {
    super(props)
    // 默认数据
    this.state = {
      tags: {
        citys: {},
        designers: [],
        seasonTitles: []
      },
      isSeasonDiy: false,
      isDesignDiy: false,
      allTags: {},
      DesignerModal: false,
      seasonModal: false,
      seasonTitle: '',
      city: '',
      designerName: '',
      orderType: ''
    }
  }
  
  componentWillMount() {
    base.ajaxList.basic({
      type: 'GET',
      url: `${base.baseUrl}/show/query-tag`
    }, (d) => {
      this.setState({ tags: d.result})
    })
  }
  componentDidMount() {
    $(document).click((event) => {
      const isSeasonParent = this.isParent(event.target, $('.season-modal')[0])
      const isDesignParent = this.isParent(event.target, $('.design-modal')[0])
      console.log(isSeasonParent, isDesignParent)
      if (isSeasonParent) {
        switch (event.target.id) {
          case 'cell-season-diy': this.setState({ seasonModal: false, DesignerModal: false }); break
          default: this.setState({ seasonModal: true })
        }
      }
      if (isDesignParent) {
        switch (event.target.id) {
          case 'cell-design-diy': this.setState({ seasonModal: false, DesignerModal: false }); break
          default: this.setState({ DesignerModal: true })
        }
      }
      if (!isDesignParent && !isSeasonParent) {
        switch (event.target.id) {
          case 'season-diy': this.setState({ seasonModal: this.state.seasonModal }); break
          case 'design-diy': this.setState({ DesignerModal: this.state.DesignerModal }); break
          default: this.setState({ seasonModal: false, DesignerModal: false})
        }
      }
    })
    base.ajaxList.basic({
      type: 'GET',
      url: `${base.baseUrl}/show/slide-content`
    }, (d) => {
      this.setState({ allTags: d.result})
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


  movemodal(id, target, limitValue) {
    const leftValue = this.getElementLeft(document.getElementById(id))
    if (leftValue <= limitValue) {
      $(target).css({left: 160, right: ''})
    } else {
      $(target).css({left: '', right: window.innerWidth - leftValue - 286})
    }
  }
  // 修改季度
  changeSeasonTitle(seasonTitle, isSeasonDiy) {
    if (seasonTitle === '') {
      // 全部标签点击埋点
      base.eventCount.add('4002')
    } else {
      // 标签点击埋点
      base.eventCount.add('4003', {'标签ID': seasonTitle})
    }
    this.setState({ seasonTitle, isSeasonDiy, seasonModal: false}, () => this.filterChange())
  }
  // 弹出季度modal
  showSeasonModal() {
    base.eventCount.add('4004')
    this.setState({ seasonModal: !this.state.seasonModal, DesignerModal: false})
  }
  // 修改城市
  changeCity(city) {
    if (city === '') {
      // 全部城市
      base.eventCount.add('4006')
    } else {
      base.eventCount.add('4007', {'地区标签ID': city})
    }
    this.setState({ city }, () => this.filterChange())
  }
  // 修改品牌
  changeDesignerName(designerName, isDesignDiy) {
    if (designerName === '') {
      base.eventCount.add('4011')
    } else {
      base.eventCount.add('4012', {'品牌标签ID': designerName})
    }
    this.setState({ designerName, isDesignDiy, DesignerModal: false }, () => this.filterChange())
  }

  // 弹出品牌modal
  showDesignModal() {
    base.eventCount.add('4013')
    this.setState({ seasonModal: !this.state.seasonModal, DesignerModal: false})
  }

  changeOrderType(orderType) {
    // 埋点
    let eventId = '4015'
    switch (orderType) {
      case 0: eventId = '4015'; break
      case 1: eventId = '4016'; break
      case 2: eventId = '4017'; break
      default:
        eventId = '4018'
    }
    base.eventCount.add(eventId)
    this.setState({ orderType }, () => this.filterChange())
  }
  filterChange() {
    const { seasonTitle, city, designerName, orderType } = this.state
    this.props.filterChange({seasonTitle, city, designerName, orderType})
  }
  resetSeason() {
    // 清除自定义标签埋点
    base.eventCount.add('4005')
    this.setState({ isSeasonDiy: false, seasonTitle: '' }, () => this.filterChange())
  }
  resetDesign() {
    // 清除自定义标签埋点
    base.eventCount.add('4014')
    this.setState({ isDesignDiy: false, designerName: '' }, () => this.filterChange())
  }
  _renderSeason(seasons) {
    if (!seasons.length) { return null }
    if ($('#season-diy').length) {
      this.movemodal('season-diy', '.season-modal', 785)
    }
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
  
  _renderCity(citys) {
    return Object.keys(citys).map((city, index) => {
      let _key = `city_${index}`
      return (
        <span key={_key}
          className={this.state.city === city ? 'value-selected' : 'city-value'}
          onClick={this.changeCity.bind(this, city, false)}
        >{citys[city]}
        </span>)
    })
  }
  
  _renderDesigner(designers) {
    const { designerName, isDesignDiy } = this.state
    if (!designers.length) { return null }
    if ($('#design-diy').length) {
      this.movemodal('design-diy', '.design-modal', 785)
    }
    return designers.map((designer, index) => {
      let _key = `designer_${index}`
      return (
        <span key={_key}
          className={!isDesignDiy && designerName === designer ? 'value-selected' : 'city-value'}
          onClick={this.changeDesignerName.bind(this, designer, false)}
        >{designer}
        </span>)
    })
  }
  render() {
    const { isSeasonDiy, isDesignDiy, seasonTitle, city, designerName, orderType, seasonModal, DesignerModal, allTags } = this.state
    const { citys, designers, seasonTitles } = this.state.tags
    return (
      <div id="category-filter-panel">
        <div className='line'></div>
        <div className="new-select-panel select-season container">
          <div className="new-select-title">
            <span className='select-title'>季度</span>
            <span className={seasonTitle ? 'select-all' : 'select-all-selected'} onClick={this.changeSeasonTitle.bind(this, '', false)}>全部</span>
          </div>
          <div className="new-select-value">
            {this._renderSeason(seasonTitles)}
            {
              isSeasonDiy
                ?
                  <span className='season-value-wrap'>
                    <span className='select-all-selected'
                      onClick={this.resetSeason.bind(this)}
                    >{seasonTitle}
                      <Icon type='cancel-white'/>
                    </span>
                  </span>
                :
                  <span className='season-value-wrap'>
                    <span
                      id='season-diy'
                      className='diy-value'
                      onClick={this.showSeasonModal.bind(this)}
                    >+更多
                    </span>
                  </span>
            }
            {/* 自定义弹出 */}
            <div
              id='season-modal'
              className={seasonModal ? 'pop-modal season-modal' : 'season-modal hide-modal'}
            >
              {Object.keys(allTags).reverse().map((key, index) => {
                return (
                  <div key={index} className='cell-season-wrap'>
                    <span className='season-year'>{key}</span>
                    <div className='season-detail'>
                      {allTags[key].map((detail, index) => {
                        return (
                          <span
                            id='cell-season-diy'
                            className={this.state.seasonTitle === detail.season ? 'cell-season-selected' : 'cell-season-value'}
                            key={`detail${index}`}
                            onClick={this.changeSeasonTitle.bind(this, detail.season, true)}
                          >{detail.season}
                          </span>
                        )
                    })}
                    </div>
                  </div>) 
              })}
            </div>
          </div>
        </div>
        <div className='line'></div>
        <div className="new-select-panel select-city container">
          <div className="new-select-title">
            <span className='select-title'>城市</span>
            <span className={city ? 'select-all' : 'select-all-selected'} onClick={this.changeCity.bind(this, '')}>全部</span>
          </div>
          <div className="new-select-value">
            {this._renderCity(citys)}
          </div>
        </div>
        <div className='line'></div>
        <div className="new-select-panel select-designers container">
          <div className="new-select-title">
            <span className='select-title'>品牌</span>
            <span className={designerName ? 'select-all' : 'select-all-selected'} onClick={this.changeDesignerName.bind(this, '', false)}>全部</span>
          </div>
          <div className="new-select-value">
            {this._renderDesigner(designers)}
            {
              isDesignDiy
                ?
                  <span className='value-selected'
                    onClick={this.resetDesign.bind(this)}
                  >
                    {designerName}
                    <Icon type='cancel-white'/>
                  </span>
                :
                  <span
                    id='design-diy'
                    className='diy-value'
                    onClick={() => this.setState({ DesignerModal: !DesignerModal, seasonModal: false})}
                  >+更多
                  </span>
            }
            {/* 自定义弹出 */}
            <div
              id='design-modal'
              className={DesignerModal ? 'pop-modal design-modal' : 'design-modal hide-modal'}
            >
              <WordFilter hidden={isDesignDiy} changeDesignerName={name => this.changeDesignerName(name, true)}/>
            </div>
          </div>
        </div>
        <div className='line'></div>
        <div className="filter-title-wrap">
          <div className="container">
            <div onClick={this.changeOrderType.bind(this, 0)} className={orderType ? 'latest' : 'latest-selected'}>最新上线</div>
            <div onClick={this.changeOrderType.bind(this, 1)} className={orderType === 1 ? 'latest-selected' : 'latest'}>浏览最多</div>
            {/* <div onClick={this.changeOrderType.bind(this, 2)} className={orderType === 2 ? 'latest-selected' : 'latest'}>本周更新</div> */}
            <div onClick={this.changeOrderType.bind(this, 3)} className={orderType === 3 ? 'latest-selected' : 'latest'}>本月更新</div>
          </div>
        </div>
      </div>)
  }
}
class WordFilter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      mockData: [],
      wordArray: [],
    }
  }

  componentWillMount() {
    let self = this
    base.request({
      type: 'GET',
      url: `${base.baseUrl}/show/all-shows`
    }).done((d) => {
      if (d.success) {
        self.state.mockData = self.preDealData(d.result)

        self.setState({
          wordArray: self.generateEffectiveWord()
        })
      } else {
        console.log(d.errorDesc)
      }
    }).fail(() => {
    })
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
    return obj
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

  sliceArray(array) {
    const result = []
    const length = array.length
    for (let i = 0; i < length; i += 5) {
      result.push(array.slice(i, i + 5))
    }
    return result
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
  handleClick(id, name) {
    this.props.changeDesignerName(name)
  }

  // 渲染首字母列表
  _renderWord() {
    if (this._isDataNull()) {
      return null
    }

    let _array = []
    for (let i in this.state.wordArray) {
      let _key = `word_${i}`
      if (this.state.wordArray[i].effective) {
        _array.push(<li id='cell-word-diy' key={_key} onClick={this.handleMove.bind(this, i)}>{i}</li>)
      } else {
        _array.push(<li id='cell-word-diy' key={_key} className="gray">{i}</li>)
      }
    }
    return _array
  }

  // 渲染内容
  _renderWordContent() {
    if (this._isDataNull()) { return null }
    let _array = []
    for (let i in this.state.mockData) {
      const result = this.sliceArray(this.state.mockData[i])
      let _key = `word_${i}` // 首字母
      let wordContent = result.map((son, index) => {
        const tmp = 5 - son.length
        if (tmp) {
          for (let i = 0; i < tmp; i++) { son.push('') }
        }
        return (
          <div className="li-wrap" key={index}>
            {
              son.map((item, index) => {
                let _key = `word_${i}_${index}`
                return item.name ? <li id='cell-design-diy' key={_key} onClick={this.handleClick.bind(this, item.id, item.name)}>{item.name}</li> : <li/>
              })
            }
          </div>
        )
      })
      _array.push(<li ref={_key} key={_key} className="word-content-item"> <div className="word-title">{i}</div> <ul>{wordContent}</ul> <div className="clearfix" /></li>)
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

export {WordFilter, CategoryFilter}