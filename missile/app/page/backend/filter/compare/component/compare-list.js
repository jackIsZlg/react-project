import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Table, message, Button, Form, Popconfirm } from 'antd'
import { Section, Auth } from 'component'
import { showModal, query, remove } from '../compare'
import { Link } from 'react-router'

@Form.create()
@connect(
  state => ({ list: state.getIn(['compare', 'list']) }),
  dispatch => ({
    remove: bindActionCreators(remove, dispatch),
    showModal: bindActionCreators(showModal, dispatch),
    query: bindActionCreators(query, dispatch)
  })
)
export default class CompareList extends React.Component {
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
      { dataIndex: 'menu1', title: '一级菜单' },
      { dataIndex: 'menu2', title: '二级菜单' },
      { dataIndex: 'menu3', title: '三级菜单' }
    ]

    if (Auth.verify('MISSILE_BACKEND_COMPARE_SAVE') || Auth.verify('MISSILE_BACKEND_COMPARE_REMOVE')) {
      columns.push({
        title: '操作',
        width: 250,
        render: (record) => {
          const url = `/backend/filter/compare/add?menu=${record.menu1}/${record.menu2}/${record.menu3}`
          return (
            <span className='m-action-group'>
              <Auth requires='MISSILE_BACKEND_COMPARE_SAVE'>
                <Link to={url}>比较值管理</Link>
              </Auth>
              <Auth requires='MISSILE_BACKEND_COMPARE_SAVE'>
                <a onClick={() => showModal(record)}>编辑菜单</a>
              </Auth>
              <Auth requires='MISSILE_BACKEND_COMPARE_REMOVE'>
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
      Auth.verify('MISSILE_BACKEND_COMPARE_SAVE') && (
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
