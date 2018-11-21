import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Table, message, Switch, Form, Button } from 'antd'
import { Section, Auth } from 'component'
import { showModal, query, close } from '../info'

@Form.create()
@connect(
  state => ({ list: state.getIn(['info', 'list']) }),
  dispatch => ({
    close: bindActionCreators(close, dispatch),
    showModal: bindActionCreators(showModal, dispatch),
    query: bindActionCreators(query, dispatch)
  })
)
export default class InfoList extends React.Component {
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
      <Section toolContent={this.toolContent}>
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
      { dataIndex: 'id', title: 'ID' },
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
      { dataIndex: 'bizName', title: '业务线' },
      { dataIndex: 'isSingle', title: '单选/多选' },
      { dataIndex: 'isNeeded', title: '可选/必选' },
      { dataIndex: 'additionColumn', title: '附加字段' },
      { dataIndex: 'additionColumnValue', title: '附加字段值' },
      { dataIndex: 'createdBy', title: '创建人' }
    ]

    columns.push({
      title: '操作',
      width: 100,
      render: (text, record) => {
        return (
          <span className='m-action-group'>
            <Auth requires='MISSILE_BACKEND_INFO_SAVE'>
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
      id: record.id,
      status: record.status
    }
    const { close } = this.props
    close(currentRecord).then(() => {
      message.success(`修改成功！`)
    })
  }

  get toolContent () {
    const { showModal } = this.props
    return (
      Auth.verify('MISSILE_BACKEND_INFO_SAVE') && (
        <Button type='primary' size='large' onClick={() => showModal({})}>
          新增
        </Button>
      )
    )
  }
}
