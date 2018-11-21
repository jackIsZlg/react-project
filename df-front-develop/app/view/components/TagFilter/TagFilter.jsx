import base from '../../common/baseModule'

class TagFilter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      tags: [],
      firstLevel: '',
      secondLevel: '',
      displayNameList: []
    }
  }
  componentWillMount() {
    this.filterChange()
    base.ajaxList.basic({
      url: `${base.baseUrl}/v1/gallery/tag`
    }, (d) => {
      this.setState({ tags: d.result})
    })
  }
    
  // 修改一级品类
  changefirstLevel(firstLevel, displayNameList) {
    this.setState({ firstLevel, displayNameList, secondLevel: ''}, () => this.filterChange())
  }
  // 修改二级品类
  changeSecondLevel(secondLevel) {
    this.setState({ secondLevel}, () => this.filterChange())
  }
    
  filterChange() {
    const { firstLevel, secondLevel} = this.state
    this.props.filterChange([`firstLevel=${firstLevel}`, `secondLevel=${secondLevel}`])
  }
  renderFirstLevelCell() {
    const {firstLevel, tags} = this.state
    return tags.map((tag, index) => {
      let _key = `season_${index}`
      return (
        <span
          className='season-value-wrap'
          key={_key}
          onClick={this.changefirstLevel.bind(this, tag.firstLevel, tag.displayNameList)}
        >
          <span className={firstLevel === tag.firstLevel ? 'select-all-selected' : 'season-value'}>{tag.firstLevel}</span>
        </span>)
    })
  }
  renderSecondLevelCell() {
    const {secondLevel, displayNameList} = this.state
    return displayNameList.map((tag, index) => {
      let _key = `season_${index}`
      return (
        <span
          className='season-value-wrap'
          key={_key}
          onClick={this.changeSecondLevel.bind(this, tag)}
        >
          <span className={secondLevel === tag ? 'select-all-selected' : 'season-value'}>{tag}</span>
        </span>)
    })
  }
  renderFirstLevel() {
    const { firstLevel } = this.state
    return (
      <div className="new-select-panel select-season container">
        <div className="new-select-title">
          <span className='select-title'>品类</span>
          <span className={firstLevel ? 'select-all' : 'select-all-selected'} onClick={this.changefirstLevel.bind(this, '', [])}>全部</span>
        </div>
        <div className="new-select-value">
          {this.renderFirstLevelCell()}
        </div>
      </div>
    )
  }
  renderSecondLevel() {
    const { secondLevel, displayNameList } = this.state
    if (!displayNameList.length) return null
    return (
      <div className="new-select-panel select-season container">
        <div className="new-select-title">
          <span className='select-title'>子类</span>
          <span className={secondLevel ? 'select-all' : 'select-all-selected'} onClick={this.changeSecondLevel.bind(this, '')}>全部</span>
        </div>
        <div className="new-select-value">
          {this.renderSecondLevelCell()}
        </div>
      </div>
    )
  }
  render() {
    const { displayNameList } = this.state
    return (
      <div id="gallery-filter-panel">
        { this.renderFirstLevel() }
        {displayNameList.length ? <div className='line'></div> : null}
        { this.renderSecondLevel() }
      </div>)
  }
}

export default TagFilter