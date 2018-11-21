import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Table, Button, message, Popconfirm } from 'antd'

import { Section, Auth } from 'component'

import { showModal, remove, query } from '../user'

@connect(
  state => ({ list: state.user.get('list') }),
  dispatch => ({
    remove: bindActionCreators(remove, dispatch),
    showModal: bindActionCreators(showModal, dispatch),
    query: bindActionCreators(query, dispatch)
  })
)
export default class UserList extends React.Component {
  static propTypes = {
    list: PropTypes.object.isRequired,
    remove: PropTypes.func.isRequired,
    showModal: PropTypes.func.isRequired,
    query: PropTypes.func.isRequired
  }

  render () {
    const { list, query } = this.props

    const { loading, dataSource, params } = list.toJS()
    const total = dataSource.length

    return (
      <Section title='待处理列表' toolContent={this.toolContent}>
        <Table
          rowKey='id'
          loading={loading}
          columns={this.columns}
          dataSource={dataSource}
          pagination={{
            total,
            pageSize: params.pageSize,
            current: params.pageIndex,
            showQuickJumper: true,
            showTotal: total => `共 ${total} 条`,
            onChange: pageIndex => query({ pageIndex })
          }}
        />
      </Section>
    )
  }

  get columns () {
    const { showModal } = this.props

    const columns = [
      { dataIndex: 'id', title: '用户ID' },
      { dataIndex: 'nickname', title: '用户昵称' },
      { dataIndex: 'nicknameCn', title: '用户名' },
      { dataIndex: 'mobile', title: '手机号码' },
      {
        dataIndex: 'status',
        title: ' 状态',
        render (text) {
          return {
            1: '启用',
            2: '禁用'
          }[text]
        }
      }
    ]

    if (Auth.verify('PAPAYA_USER_SAVE') || Auth.verify('PAPAYA_USER_REMOVE')) {
      columns.push({
        title: '操作',
        width: 100,
        render: (text, record) => {
          return (
            <span className='m-action-group'>
              <Auth requires='PAPAYA_USER_SAVE'>
                <a onClick={() => showModal(record)}>编辑</a>
              </Auth>
              <Auth requires='PAPAYA_USER_REMOVE'>
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
      Auth.verify('PAPAYA_USER_SAVE') && (
        <Button size='small' type='primary' onClick={() => showModal({})}>
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
