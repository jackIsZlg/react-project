import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Table, message, Switch, Form } from 'antd'
import { Section, Auth } from 'component'
import { showModal, query, close } from '../cost'

@Form.create()
@connect(
  state => ({ list: state.getIn(['cost', 'list']) }),
  dispatch => ({
    close: bindActionCreators(close, dispatch),
    showModal: bindActionCreators(showModal, dispatch),
    query: bindActionCreators(query, dispatch)
  })
)
export default class CostList extends React.Component {
  state = {
    filteredInfo: null,
    sortedInfo: null
  }
  static propTypes = {
    list: PropTypes.object.isRequired,
    close: PropTypes.func.isRequired,
    showModal: PropTypes.func.isRequired,
    query: PropTypes.func.isRequired

  }

  render () {
    const { list, query } = this.props
    const { loading, dataSource, params } = list.toJS()
    const total = dataSource.totalCount
    return (
      <Section>
        <Table
          rowKey='id'
          loading={loading}
          columns={this.columns}
          dataSource={dataSource.result}
          pagination={{
            total,
            pageSize: params.pageSize,
            current: params.pageNum,
            showQuickJumper: true,
            showTotal: total => `共 ${total} 条`,
            onChange: pageNum => query({ pageNum })
          }}
        />
      </Section>
    )
  }

  get columns () {
    const { showModal } = this.props
    const columns = [
      { dataIndex: 'costCenterCode', title: '费用部门代码' },
      {
        title: '是否启用',
        width: 100,
        render: (record, status) => {
          if (record.status === 1) {
            status = true
          } else {
            status = false
          }
          return (
            <Switch defaultChecked={status} onClick={() => this.close(record)} />
          )
        }
      },
      { dataIndex: 'costCenter1', title: '一级费用部门' },
      { dataIndex: 'costCenter2', title: '二级费用部门' },
      { dataIndex: 'costCenterName', title: '费用部门全称' }
    ]

    columns.push({
      title: '操作',
      width: 100,
      render: (text, record) => {
        return (
          <span className='m-action-group'>
            <Auth requires='MISSILE_BACKEND_COST_SAVE'>
              <a onClick={() => showModal(record)}>编辑</a>
            </Auth>
          </span>
        )
      }
    })
    return columns
  }

  // 开启、禁用功能
  close = record => {
    if (record.status === 0) {
      record.status = 1
    } else {
      record.status = 0
    }
    const currentRecord = {
      costCenterCode: record.costCenterCode,
      costCenter1: record.costCenter1,
      costCenter2: record.costCenter2,
      costCenterName: record.costCenterName,
      status: record.status
    }
    const { close } = this.props
    close(currentRecord).then(() => {
      message.success(`修改成功！`)
    })
  }
}
