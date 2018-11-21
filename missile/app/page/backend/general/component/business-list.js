import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Table, Form, Button } from 'antd'
import { Section, Auth } from 'component'
import { showModal, query } from '../business'
import moment from 'moment'
import _ from 'lodash'

@Form.create()
@connect(
  state => ({ list: state.getIn(['business', 'list']) }),
  dispatch => ({
    showModal: bindActionCreators(showModal, dispatch),
    query: bindActionCreators(query, dispatch)
  })
)
export default class BusinessList extends React.Component {
  static propTypes = {
    list: PropTypes.object.isRequired,
    showModal: PropTypes.func.isRequired,
    query: PropTypes.func.isRequired

  }

  render () {
    const { list, query } = this.props
    const { loading, dataSource, params } = list.toJS()
    // 将时间转成所需格式
    _.forEach(dataSource, function (value, key) {
      function Time () {
        this.time = moment(value.updatedTime).format('YYYY-MM-DD HH:mm:ss')
      }
      _.assign(value, new Time())
    })
    const total = dataSource.totalCount
    return (
      <Section toolContent={this.toolContent}>
        <Table
          rowKey='id'
          loading={loading}
          columns={this.columns}
          dataSource={dataSource}
          bordered={false}
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
      { dataIndex: 'bizName', title: '业务线' },
      { dataIndex: 'time', title: '更新时间', width: 300 }
    ]

    columns.push({
      title: '操作',
      width: 100,
      render: (text, record) => {
        return (
          <span className='m-action-group'>
            <Auth requires='MISSILE_BACKEND_BUSINESS_SAVE'>
              <a onClick={() => showModal(record)}>编辑</a>
            </Auth>
          </span>
        )
      }
    })
    return columns
  }

  get toolContent () {
    const { showModal } = this.props
    return (
      Auth.verify('MISSILE_BACKEND_BUSINESS_SAVE') && (
        <Button type='primary' onClick={() => showModal({})}>
          新增
        </Button>
      )
    )
  }
}
