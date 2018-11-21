import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Table, message, Button, Form, Popconfirm } from 'antd'
import { Section, Auth } from 'component'
import { showModal, query, remove } from '../system'

@Form.create()
@connect(
  state => ({ list: state.getIn(['system', 'list']) }),
  dispatch => ({
    remove: bindActionCreators(remove, dispatch),
    showModal: bindActionCreators(showModal, dispatch),
    query: bindActionCreators(query, dispatch)
  })
)
export default class SystemList extends React.Component {
  static propTypes = {
    list: PropTypes.object.isRequired,
    remove: PropTypes.func.isRequired,
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
      { dataIndex: 'sysCode', title: '系统代码' },
      { dataIndex: 'sysName', title: '输出系统名称' },
      { dataIndex: 'directType', title: '输出模式' },
      { dataIndex: 'addition', title: '其他字段' }
    ]

    if (Auth.verify('MISSILE_BACKEND_SYSTEM_SAVE') || Auth.verify('MISSILE_BACKEND_SYSTEM_REMOVE')) {
      columns.push({
        title: '操作',
        width: 100,
        render: (text, record) => {
          return (
            <span className='m-action-group'>
              <Auth requires='MISSILE_BACKEND_SYSTEM_SAVE'>
                <a onClick={() => showModal(record)}>编辑</a>
              </Auth>
              <Auth requires='MISSILE_BACKEND_SYSTEM_REMOVE'>
                <Popconfirm
                  placement='topRight'
                  title='确定要删除该项？'
                  onConfirm={() => this.remove(record.id)}
                >
                  <a>删除</a>
                </Popconfirm>
              </Auth>
            </span>
          )
        }
      })
    }
    return columns
  }

  get toolContent () {
    const { showModal } = this.props
    return (
      Auth.verify('MISSILE_BACKEND_SYSTEM_SAVE') && (
        <Button type='primary' size='large' onClick={() => showModal({})}>
          新增
        </Button>
      )
    )
  }

  remove = id => {
    const { remove } = this.props
    remove(id).then(() => message.success('删除成功！'))
  }
}
