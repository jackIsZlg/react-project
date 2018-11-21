/**
 * Created by gewangjie on 2017/12/15
 */
import base from '../../../common/baseModule'
import classNames from 'classnames'
import WaterFall from '../../../components/WaterFall/WaterFall'

const {Layout, Row, Col, DatePicker, AutoComplete, Icon, Button, message} = antd
const {Content} = Layout
const {RangePicker} = DatePicker

const multiTag = ['风格', '类型', '身份', '其他']
const hideTag = ['风格', '类型', '身份']


// 隐藏操作
let downD = false,
  downF = false

// 辅助函数
function disabledDate(current) {
  // Can not select days before today and today
  return current && current.valueOf() > Date.now()
}

function toFormData(data) {
  let searchParams = new URLSearchParams()
  for (let o in data) {
    searchParams.set(o, data[o])
  }
  return searchParams
}

// 筛选标签输入
class SearchInput extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      value: '',
      dataSource: [],
    }
  }

  handleInput(value) {
    this.setState({
      value
    })
  }

  // 选中
  handleSelect(value) {
    this.props.search('input', {
      q: value
    })
  }

  handleSearch() {
    this.handleSelect(this.state.value)
  }

  // 补全
  onSearch(value) {
    // this.setState({
    //     dataSource: [`搜索不到${value}`],
    // })
  }

  render() {
    const {loading} = this.props
    const {dataSource} = this.state
    return (
      <div className="search-input-pane">
        <div className="inner">
          <AutoComplete dataSource={dataSource}
            style={{width: 300}}
            onChange={this.handleInput.bind(this)}
            onSelect={this.handleSelect.bind(this)}
            onSearch={this.onSearch.bind(this)}
            onPressEnter={this.handleSearch.bind(this)}
            placeholder="填写搜索内容"
          />
          <Button type="primary"
            loading={loading}
            onClick={this.handleSearch.bind(this)}
          >
                        搜索
          </Button>
          <Button type="primary"
            onClick={() => {
                                location.href = '/search/custom/image'
                            }}
            style={{marginLeft: '10px'}}
          >
            <Icon type="camera"/>
          </Button>
        </div>
      </div>
    )
  }
}

// 筛选器
class Filter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      blogger: [],
      category: [],
      other: [],
      startTime: 0,
      endTime: 0,
      hideTag: true
    }
  }

  componentWillMount() {
    this.getBloggerData()
    this.getBloggerCategory()
    this.getBloggerOther()
    this.handleKeyDown()
  }

  // 监听隐藏安好
  handleKeyDown() {
    let self = this
    window.addEventListener('keydown', this.DFKeyDown.bind(this))
    window.addEventListener('keyup', this.DFKeyUp.bind(this))
  }

  DFKeyDown(e) {
    if (!this.state.hideTag) {
      return
    }
    if (e.keyCode === 68) {
      downD = true
    }
    if (e.keyCode === 70) {
      downF = true
    }
    if (downD && downF) {
      console.log('触发')
      this.setState({
        hideTag: false
      })
      window.removeEventListener('keydown', this.DFKeyDown.bind(this))
      window.removeEventListener('keyup', this.DFKeyUp.bind(this))
    }
  }

  DFKeyUp(e) {
    if (e.keyCode === 68) {
      downD = false
    }
    if (e.keyCode === 70) {
      downF = false
    }
  }

  // 获取博主标签数据
  getBloggerData() {
    let self = this
    base.ajaxList.basicFetch(`${base.baseUrl}/tag/search/blogger`, {
      credentials: 'include'
    }).then((d) => {
      self.setState({
        blogger: d
      })
    })
  }

  // 获取品类标签数据
  getBloggerCategory() {
    let self = this
    base.ajaxList.basicFetch(`${base.baseUrl}/tag/search/category`, {
      credentials: 'include'
    }).then((d) => {
      self.setState({
        category: d
      })
    })
  }

  // 获取其他标签数据
  getBloggerOther() {
    let self = this
    base.ajaxList.basicFetch(`${base.baseUrl}/tag/search/other`, {
      credentials: 'include'
    }).then((d) => {
      self.setState({
        other: d
      })
    })
  }

  // 选择标签
  selectTag(param, listIndex, tagIndex) {
    let tagList = this.state[param][listIndex].childList,
      tagListName = this.state[param][listIndex].content,
      tag = tagList[tagIndex],
      status = tag.select || false

    if (!multiTag.includes(tagListName)) {
      // 全部置false
      tagList = tagList.map(tag => tag.select = false)
    }

    // console.log(tag);

    // 取反
    tag.select = !status
    this.setState(this.state, this.getSelectTag)
  }

  // 过滤已选标签
  getSelectTag() {
    let {blogger, category, other, startTime, endTime} = this.state,
      bloggerTags = [],
      featureTags = [],
      otherTags = []

    blogger.forEach((tagList) => {
      tagList.childList.forEach((tag) => {
        tag.select && bloggerTags.push(tag.content)
      })
    })
    category.forEach((tagList) => {
      tagList.childList.forEach((tag) => {
        tag.select && featureTags.push(tag.content)
      })
    })
    other.forEach((tagList) => {
      tagList.childList.forEach((tag) => {
        tag.select && otherTags.push(tag.content)
      })
    })


    this.props.search('filter', {
      bloggerTags: bloggerTags.join(' '),
      featureTags: featureTags.join(' '),
      otherTags: otherTags.join(' '),
      startTime,
      endTime
    })
  }

  // 修改时间
  handleChangeTime(dates, dateStrings) {
    let startTime = new Date(dateStrings[0]).getTime(),
      endTime = new Date(dateStrings[1]).getTime() + 24 * 60 * 60 * 1000

    // console.log(startTime, endTime);
    this.setState({
      startTime, endTime
    }, this.getSelectTag)
  }

  // 渲染标签列表
  renderTagList(data, param, listIndex) {
    // 隐藏部分标签
    if (this.state.hideTag && hideTag.includes(data.content)) {
      return null
    }

    return (
      <Row className="tag-block">
        <Col span={2}>
          {data.content}{multiTag.includes(data.showValue) && '(可多选)'}:
        </Col>
        <Col span={22} className="tag-list">
          <ul>
            {data.childList.map((tag, tagIndex) => {
                            return (<li className={classNames('tag', {select: tag.select})}
                              onClick={this.selectTag.bind(this, param, listIndex, tagIndex)}
                            >
                              {tag.showValue}
                                    </li>)
                        })}
          </ul>
        </Col>
      </Row>
    )
  }

  render() {
    let {blogger, category, other} = this.state
    return (
      <div>
        <div className="card">
          <div className="tab">博主标签</div>
          <div className="content">
            {blogger.map((tagList, listIndex) => {
                            return this.renderTagList(tagList, 'blogger', listIndex)
                        })}
          </div>
        </div>
        <div className="card">
          <div className="tab">品类标签</div>
          <div className="content">
            {category.map((tagList, listIndex) => {
                            return this.renderTagList(tagList, 'category', listIndex)
                        })}
          </div>
        </div>
        <div className="card">
          <div className="tab">为你推荐</div>
          <div className="content">
            {other.map((tagList, listIndex) => {
                            return this.renderTagList(tagList, 'other', listIndex)
                        })}
          </div>
        </div>
        <div className="card">
          <div className="content">
            <Row>
              <Col span={2}>时间：</Col>
              <Col span={22}>
                <RangePicker format="YYYY-MM-DD"
                  onChange={this.handleChangeTime.bind(this)}
                  disabledDate={disabledDate}
                />
              </Col>
            </Row>
          </div>
        </div>
      </div>
    )
  }
}

// 结构
class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      diffTime: 0,
      total: 0,
      search: {
        filter: {},
        input: {}
      }
    }
  }

  componentDidMount() {
    // this.search();
  }

  getSearch(param, result) {
    let {search} = this.state
    search[param] = result
    this.setState({
      search
    })
  }

  getDataSuccess(state) {
    this.setState({
      total: state.resultCount,
      diffTime: state.searchTime || 0
    })
  }

  render() {
    const {loading, search, diffTime, total} = this.state,
      query = {
        ...search.filter,
        ...search.input
      },
      url = `/search/custom/post?${toFormData(query)}`
    return (
      <Layout>
        <Content>
          <SearchInput loading={loading} search={this.getSearch.bind(this)}/>
          <Filter search={this.getSearch.bind(this)}/>
          <Row>
            <Col span={18}>
              {diffTime && <span>搜索时间：{diffTime}ms<br/></span>}
              {total && <span>搜索结果：{total}项</span>}
            </Col>
            <Col span={6} style={{textAlign: 'right'}}>
              <a href='/users/favorite-view'>查看精选集>></a>
            </Col>
          </Row>

          <div className="container">
            <div id="water-fall-panel">
              <WaterFall key="waterWall"
                wfType="customSearch"
                noResultTip="查询无数据"
                getDataSuccess={this.getDataSuccess.bind(this)}
                dataUrl={url}
              />
            </div>
          </div>
        </Content>
      </Layout>
    )
  }
}

ReactDOM.render(<App/>, document.getElementById('df-search-wrapper'))