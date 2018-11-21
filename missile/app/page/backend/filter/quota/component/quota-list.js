import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Table, message, Button, Form, Popconfirm } from 'antd'
import { Section, Auth } from 'component'
import { showModal, query, remove, removeDataSource } from '../quota'
import _ from 'lodash'
import { Link } from 'react-router'

@Form.create()
@connect(
  state => ({ list: state.getIn(['quota', 'list']), link: state.getIn(['quota', 'link']) }),
  dispatch => ({
    remove: bindActionCreators(remove, dispatch),
    removeDataSource: bindActionCreators(removeDataSource, dispatch),
    showModal: bindActionCreators(showModal, dispatch),
    query: bindActionCreators(query, dispatch)
  })
)
export default class QuotaList extends React.Component {
  static propTypes = {
    list: PropTypes.object.isRequired,
    remove: PropTypes.func.isRequired,
    removeDataSource: PropTypes.func.isRequired,
    showModal: PropTypes.func.isRequired,
    query: PropTypes.func.isRequired

  }

  render () {
    const { list, query } = this.props
    const { loading, dataSource, params } = list.toJS()
    const total = dataSource.totalCount
    _.forEach(dataSource.result, function (value, key) {
      _.forEach(value.datasourceMetricNumList, function (value, key) {
        function Foo () {
          this.spreadDataSource = `${value.databaseName}.${value.dataTable}`
        }
        _.assign(value, new Foo())
      })
    })
    return (
      <Section toolContent={this.toolContent}>
        <Table
          className='components-table-demo-nested'
          rowKey='id'
          loading={loading}
          columns={this.columns}
          expandedRowRender={
              record => <Table
                className='tableIn'
                rowKey='spreadDataSource'
                loading={loading}
                columns={this.spreadColumn(record)}
                dataSource={record.datasourceMetricNumList}
                pagination={false}
            />
              }
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
      { dataIndex: 'bizName', title: '业务线' },
      { dataIndex: 'menu1', title: '一级菜单' },
      { dataIndex: 'menu2', title: '二级菜单' }
    ]

    if (Auth.verify('MISSILE_BACKEND_QUOTA_SAVE') || Auth.verify('MISSILE_BACKEND_QUOTA_REMOVE')) {
      columns.push({
        title: '操作',
        width: 200,
        render: (text, record) => {
          const url = `/backend/filter/quota/add?business=${record.bizName}&menu=${record.menu1}/${record.menu2}`
          return (
            <span className='m-action-group'>
              <Auth requires='MISSILE_BACKEND_QUOTA_SAVE'>
                <Link to={url}>添加指标</Link>
              </Auth>
              <Auth requires='MISSILE_BACKEND_QUOTA_SAVE'>
                <a onClick={() => showModal(record)}>编辑菜单</a>
              </Auth>
              <Auth requires='MISSILE_BACKEND_QUOTA_REMOVE'>
                <Popconfirm
                  placement='topRight'
                  title='确定要删除该项？'
                  onConfirm={() => this.remove(record)}
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
  spreadColumn (record) {
    const parentRecord = {
      'bizName': record.bizName,
      'menu1': record.menu1,
      'menu2': record.menu2,
      'datasourceMetricNumList': record.datasourceMetricNumList
    }
    const columns = [
      { dataIndex: 'spreadDataSource', title: '数据源' }
    ]

    let removeData = record => {
      const { removeDataSource } = this.props
      const data = {
        bizName: parentRecord.bizName,
        menu: `${parentRecord.menu1}/${parentRecord.menu2}`,
        dbId: record.dbId,
        tableId: record.tableId
      }
      removeDataSource(data).then(() => message.success('删除成功！'))
    }
    if (Auth.verify('MISSILE_BACKEND_QUOTA_SAVE') || Auth.verify('MISSILE_BACKEND_QUOTA_REMOVE')) {
      columns.push({
        title: '操作',
        width: 250,
        render: (text, record) => {
          const url = `/backend/filter/quota/add?business=${parentRecord.bizName}&menu=${parentRecord.menu1}/${parentRecord.menu2}&dbId=${record.dbId}&tableId=${record.tableId}&databaseName=${record.databaseName}&dataTable=${record.dataTable}`
          return (
            <span className='m-action-group'>
              <Auth requires='MISSILE_BACKEND_QUOTA_SAVE'>
                <Link to={url}>编辑</Link>
              </Auth>
              <Auth requires='MISSILE_BACKEND_QUOTA_REMOVE'>
                <Popconfirm
                  placement='topRight'
                  title='确定要删除数据源？'
                  onConfirm={() => removeData(record)}
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
      Auth.verify('MISSILE_BACKEND_QUOTA_SAVE') && (
        <Button type='primary' size='large' onClick={() => showModal({})}>
          新增
        </Button>
      )
    )
  }

  remove = record => {
    const { remove } = this.props
    const data = {
      bizName: record.bizName,
      menu1: record.menu1,
      menu2: record.menu2,
      id: record.id
    }
    remove(data).then(() => message.success('删除成功！'))
  }
}
