import React from 'react'
import { Row, Col, Select, Input, Button, message, Form } from 'antd'
import NavInside from '../../../common/nav-inside'
import { Toolbar } from '@wac/papaya-ui'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { queryDataBase, queryDbId, queryTableId, save, updataAppendCondition } from './quotaAdd'
import _ from 'lodash'
import QuotaTableForm from './component/quota-table'
const Option = Select.Option
const { TextArea } = Input

@Form.create()
@connect(
  state => ({
    list: state.getIn(['quotaAdd', 'list']),
    link: state.getIn(['quota', 'link'])
  }),
  dispatch => ({
    save: bindActionCreators(save, dispatch),
    queryDataBase: bindActionCreators(queryDataBase, dispatch),
    queryDbId: bindActionCreators(queryDbId, dispatch),
    queryTableId: bindActionCreators(queryTableId, dispatch),
    updataAppendCondition: bindActionCreators(updataAppendCondition, dispatch)
  })
)

export default class AddPage extends React.Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    queryDataBase: PropTypes.func.isRequired,
    queryDbId: PropTypes.func.isRequired,
    queryTableId: PropTypes.func.isRequired,
    list: PropTypes.object.isRequired,
    save: PropTypes.func.isRequired,
    updataAppendCondition: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
    // 所属业务线 business
    const business = this.GetQueryString('business')
    // 所属菜单 menu
    const menu = this.GetQueryString('menu')
    // 数据库 databaseName
    const databaseName = this.GetQueryString('databaseName') || ''
    // 数据表 dataTable
    const dataTable = this.GetQueryString('dataTable') || ''
    // 数据表id tableId
    const tableId = this.GetQueryString('tableId') || ''
    // 数据库id dbId
    const dbId = this.GetQueryString('dbId') || ''
    let isDisabled = false
    let databasePlaceholder = '请选择数据库'
    let dataTablePlaceholder = '请选择数据表'
    if (databaseName !== '') {
      isDisabled = true
      databasePlaceholder = databaseName
      dataTablePlaceholder = dataTable
    }
    this.state = {
      bizName: business,
      menu: menu,
      databaseName: databaseName,
      dataTable: dataTable,
      columnMetricMetaList: [],
      isDisabled: isDisabled,
      databasePlaceholder: databasePlaceholder,
      dataTablePlaceholder: dataTablePlaceholder,
      tableId: tableId,
      dbId: dbId,
      isShow: false
    }
  }

  componentWillMount () {
    // 获取基础信息
    this.props.queryDataBase()
    // 编辑信息时，进入页面就展示画像指标
    if (this.state.databaseName !== '') {
      const data = {
        tableId: this.state.tableId,
        bizName: this.state.bizName,
        menu: this.state.menu
      }
      this.props.queryTableId(data)
      this.setState({isShow: true})
    }
  }

  // 请求数据库dbId对应的数据表数据
  getTableData = value => {
    const { list } = this.props
    const { dataBaseList } = list.toJS()
    const dbId = _.at(dataBaseList, [value])
    this.setState({dbId: dbId[0]})
    this.props.queryDbId({ 'dbId': dbId[0] })
    this.setState({databaseName: value})
  }

  // 请求数据表tableId对应数据字段的数据
  getCommentData = (value) => {
    const tableName = _.split(value, '/')[1]
    const { list } = this.props
    const { dbIdList } = list.toJS()
    const TableList = _.find(dbIdList, { 'tableName': tableName })
    const data = {
      tableId: TableList.tableId,
      bizName: this.state.bizName,
      menu: this.state.menu
    }
    this.props.queryTableId(data)
    this.setState({
      isShow: true,
      tableId: TableList.tableId,
      dataTable: tableName
    })
  }

  // 获取url中的某个字段值
  GetQueryString = name => {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
    var r = decodeURIComponent(window.location.search).substr(1).match(reg)
    if (r != null) {
      return unescape(r[2])
    } else {
      return null
    }
  }
  render () {
    const { list } = this.props
    const { dataBaseList, dbIdList, tableIdList } = list.toJS()
    const { form } = this.props
    const { getFieldDecorator } = form
    // 数据库select数据源 dataBaseData
    const dataBaseData = []
    _.mapKeys(dataBaseList, function (value, key) {
      dataBaseData.push(<Option key={key}>{key}</Option>)
    })
    // 数据表select数据源 tableNameData
    const tableNameData = []
    _.mapKeys(dbIdList, function (value, key) {
      const name = `${value.tableId}/${value.tableName}`
      const showName = `${value.tableName}（${value.definition}）`
      tableNameData.push(<Option key={name} value={name}>{showName}</Option>)
    })
    const cancel = () => {
      window.location = '/missile/backend/filter/quota'
    }
    return (
      <div className='m-content backend-common'>
        <Row>
          <Col span={3}>
            <NavInside msg={[{'name': '画像指标集管理', 'url': '/backend/filter/quota'}, {'name': '动态比较值管理', 'url': '/backend/filter/compare'}, {'name': '输出系统管理', 'url': '/backend/filter/system'}]} select={1} />
          </Col>
          <Col span={21}>
            <Toolbar crumbs={['后台管理', '用户筛选管理', '画像指标集管理']} />
            <div className='s-content compare-add'>
              <div>
                <div className='u-form-title'>
                  <h2>基础信息</h2>
                  <p>画像指标集的基础信息，以及指标集的数据源</p>
                </div>
                <div className='base-message'>
                  <Row>
                    <Col span={4} className='text-style'>所属业务线：</Col>
                    <Col span={20}>{this.state.bizName}</Col>
                  </Row>
                  <Row className='base-message-p'>
                    <Col span={4} className='text-style'>所属菜单：</Col>
                    <Col span={20}>{this.state.menu}</Col>
                  </Row>
                  <Row className='base-message-p'>
                    <Col span={4} className='text-style text-style-line'>指标集数据源：</Col>
                    <Col span={20}>
                      <Select
                        showSearch
                        style={{ width: 150 }}
                        placeholder={this.state.databasePlaceholder}
                        onChange={this.getTableData}
                        disabled={this.state.isDisabled}
                        >
                        {dataBaseData}
                      </Select>
                      {tableNameData.length !== 0 || this.state.databaseName !== ''
                        ? <Select
                          showSearch
                          style={{ width: 380 }}
                          placeholder={this.state.dataTablePlaceholder}
                          disabled={this.state.isDisabled}
                          onChange={this.getCommentData}
                            >
                          {tableNameData}
                        </Select>
                      : null
                      }
                    </Col>
                  </Row>
                </div>
              </div>
              { this.state.isShow === true
                ? <div className='filter-content u-form-title'>
                  <h2>画像指标</h2>
                  <p>设置筛选画像可以使用的画像指标</p>
                  <div className='filter-list'>
                    <QuotaTableForm ref='form' state={this.state} inputOnChange={this.inputOnChange} />
                  </div>
                </div>
                : null
              }
              <div>
                <div className='u-form-title'>
                  <h2>数据过滤</h2>
                  <p>所有使用该画像指标集的指标，都会使用这个筛选逻辑</p>
                </div>
                <div className='textArea'>
                  <p>where ...</p>
                  <div>
                    <Form.Item>
                      {getFieldDecorator('appendCondition', {
                        initialValue: tableIdList.appendCondition
                      })(<TextArea rows={10} onChange={this.textAreaOnchange} />)}
                    </Form.Item>
                  </div>
                </div>
              </div>
              <div className='editable-btn'>
                <Button onClick={cancel} size='large'>取消</Button>
                <Button className='editable-save-btn' onClick={this.onSubmit} type='primary' size='large'>保存</Button>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    )
  }
  onSubmit = e => {
    if (this.state.databaseName === '' || this.state.dataTable === '') {
      message.error('请选择数据库或数据表')
    } else {
      const { list, save } = this.props
      const { tableIdList } = list.toJS()
      const columnIdList = []
      _.mapKeys(tableIdList, function (value, key) {
        const columnIdObj = _.pick(value, ['columnId'])
        _.mapKeys(columnIdObj, function (value, key) {
          columnIdList.push(value)
        })
      })
      const columnMetricMetaList = []
      this.refs.form.validateFields((errors, data) => {
        const dataList = []
        for (var x in data) {
          dataList.push(data[x])
        }
        const dataArry = _.chunk(dataList, 5)
        dataArry.forEach((value, index, array) => {
          function ColumnName () {
            this.columnName = value[0]
          }
          function ColumnChineseName () {
            this.columnChineseName = value[1]
          }
          function IsMetric () {
            if (value[2] === true || value[2] === 1) {
              this.isMetric = 1
            }
            if (value[2] === false || value[2] === 0) {
              this.isMetric = 0
            }
          }
          function IsCondition () {
            if (value[3] === true || value[3] === 1) {
              this.isCondition = 1
            }
            if (value[3] === false || value[3] === 0) {
              this.isCondition = 0
            }
          }
          function Comment () {
            this.comment = value[4]
          }
          _.assign({ 'columnName': 0 }, new ColumnName())
          columnMetricMetaList.push(_.assign({ 'columnName': 0 }, new ColumnName(), new ColumnChineseName(), new IsMetric(), new IsCondition(), new Comment()))
        })
      })
      const data = {
        bizName: this.state.bizName,
        menu: this.state.menu,
        dbId: this.state.dbId,
        databaseName: this.state.databaseName,
        tableId: this.state.tableId,
        dataTable: this.state.dataTable,
        columnMetricMetaList: columnMetricMetaList,
        appendCondition: tableIdList.appendCondition
      }
      save(data).then(() => {
        message.success(`保存成功！`)
        setTimeout(() => {
          window.location = '/missile/backend/filter/quota'
        }, 500)
      })
    }
  }

   // 数据过滤textArea
  textAreaOnchange = (e) => {
    const { updataAppendCondition } = this.props
    const value = e.target.value
    updataAppendCondition(value)
  }
}
