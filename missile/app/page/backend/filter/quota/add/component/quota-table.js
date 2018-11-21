import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import _ from 'lodash'
import { Table, Input, Form, Switch } from 'antd'
import { updataTableList } from '../quotaAdd'

@Form.create()
@connect(
    state => ({ list: state.getIn(['quotaAdd', 'list']), link: state.getIn(['quota', 'link']) }),
    dispatch => ({updataTableList: bindActionCreators(updataTableList, dispatch)
    })
  )
export default class QuotaTableForm extends React.Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    tableArry: PropTypes.array,
    state: PropTypes.object,
    list: PropTypes.object.isRequired,
    updataTableList: PropTypes.func.isRequired
  }
  constructor (props) {
    super(props)
    const columnMetricMetaList = this.props.tableArry
    this.state = this.props.state
    this.state.columnMetricMetaList = columnMetricMetaList
  }

  render () {
    const { list } = this.props
    const { tableIdList } = list.toJS()
    return (
      <Form ref='formTable'>
        <div>
          <Table
            dataSource={tableIdList.dataColumnMetaList}
            columns={this.columns}
            pagination={false}
            rowKey='columnId'
            />
        </div>
      </Form>
    )
  }
  get columns () {
    const { form } = this.props
    const { getFieldDecorator } = form
    const columns = [
      {
        title: '字段名',
        dataIndex: 'columnName',
        width: '15%',
        render: (text, record) => (
          <Form.Item>
            {getFieldDecorator(`columnName_${record.columnId}`, {
              initialValue: record.columnName
            })(<div><Input className='dis' /><span>{record.columnName}</span></div>)}
          </Form.Item>
        )
      },
      {
        title: '字段中文名',
        dataIndex: 'columnChineseName',
        width: '25%',
        render: (text, record) => (
          <Form.Item>
            {getFieldDecorator(`columnChineseName_${record.columnId}`, {
              initialValue: record.columnChineseName
            })(<Input />)}
          </Form.Item>
        )
      },
      {
        title: '指标',
        dataIndex: 'isMetric',
        width: '10%',
        render: (status, record) => {
          return (
            <Form.Item>
              {getFieldDecorator(`isMetric_${record.columnId}`, {
                initialValue: record.isMetric
              })(
                <Switch defaultChecked={!!record.isMetric} onClick={() => this.onClickChange(record)} />
            )}
            </Form.Item>
          )
        }
      },
      {
        title: '前提',
        width: '10%',
        dataIndex: 'isCondition',
        render: (status, record) => {
          return (
            <Form.Item>
              {getFieldDecorator(`isCondition_${record.columnId}`, {
                initialValue: record.isCondition
              })(
                <Switch defaultChecked={!!record.isCondition} onClick={() => this.onClickChangeIsCondition(record)} />
          )}
            </Form.Item>
          )
        }
      },
      {
        title: '备注',
        dataIndex: 'comment',
        width: '40%',
        render: (text, record) => (
          <Form.Item>
            {getFieldDecorator(`comment_${record.columnId}`, {
              initialValue: record.comment
            })(<Input />)}
          </Form.Item>
        )
      }
    ]
    return columns
  }

  onClickChange = record => {
    const { list, updataTableList } = this.props
    const { tableIdList } = list.toJS()
    _.forEach(tableIdList.dataColumnMetaList, function (value, key) {
      if (record.columnId === value.columnId) {
        value.isMetric = !value.isMetric
        if (value.isMetric === true) {
          value.isMetric = 1
        } else {
          value.isMetric = 0
        }
      }
    })
    const tableIdListData = {
      tableIdList
    }
    updataTableList(tableIdListData.tableIdList.dataColumnMetaList)
  }
  onClickChangeIsCondition = record => {
    const { list, updataTableList } = this.props
    const { tableIdList } = list.toJS()
    _.forEach(tableIdList.dataColumnMetaList, function (value, key) {
      if (record.columnId === value.columnId) {
        value.isCondition = !value.isCondition
        if (value.isCondition === true) {
          value.isCondition = 1
        } else {
          value.isCondition = 0
        }
      }
    })
    const tableIdListData = {
      tableIdList
    }
    updataTableList(tableIdListData.tableIdList.dataColumnMetaList)
  }
}
