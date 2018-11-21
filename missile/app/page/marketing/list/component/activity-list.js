/*
 * Author: linglan
 * Date: 2017-11-10 19:15:45
 * Email: linglan@wacai.com
 */

import React, { Component } from 'react'
import { Link } from 'react-router'
import PropTypes from 'prop-types'
import moment from 'moment'
import { message, Table, Switch, Form, Button, Modal } from 'antd'
import { Auth } from 'component'
import * as action from '../../action'

import { connect } from 'react-redux'

const confirm = Modal.confirm

@Form.create()
@connect(
  state => ({ list: state.getIn(['activity', 'list']) }),
  action
)
export default class FilterList extends Component {
  static propTypes = {
    list: PropTypes.object.isRequired,
    getList: PropTypes.func.isRequired,
    optStatus: PropTypes.func,
    optDel: PropTypes.func
  }
  handleSwitchStatus = (v, record) => {
    this.props.optStatus({
      id: record.id,
      status: v ? 1 : 0
    })
    .then(() => message.success(`${v ? '启用' : '停用'}成功`))
  }
  handleDel = record => {
    return this.props.optDel({
      id: record.id
    }).then(() => message.success('删除成功'))
  }
  showDelConfirm = (record) => {
    confirm({
      title: `是否确认删除ID为${record.id}的${record.activityTheme}？`,
      content: '请注意：删除不可恢复',
      onOk: () => {
        return this.handleDel(record)
      }
    })
  }
  expandedRowRender = (record) => {
    const columns = [
      { dataIndex: 'userGroupName', title: '用户组' },
      { dataIndex: 'filterType', title: '筛选方式' },
      { dataIndex: 'updateType', title: '更新频率' },
      { dataIndex: 'predictAmount', title: '预估人数' },
      { dataIndex: 'userAmount', title: '实际人数' },
      {
        dataIndex: 'updateTime',
        title: '更新时间',
        render: (text, record) => {
          return moment(text).format('YYYY-MM-DD HH:mm')
        }
      }
    ]
    let data = record.userGroupInfoList.map(item => ({
      ...item,
      key: item.userGroupId
    }))
    return (
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
      />
    )
  }
  render () {
    const { list, getList } = this.props
    const { loading, dataSource, params } = list.toJS()
    const activity = (dataSource.result &&
      dataSource.result.map(item => ({
        ...item.activityBaseInfo,
        userGroupInfoList: item.userGroupInfoList
      }))) || []

    return (
      <div>
        <Auth requires='MISSILE_MARKETING_ADD'>
          <div className='l-mtb-10'>
            <Link to='/marketing/add'><Button size='large' type='primary'>新建</Button></Link>
          </div>
        </Auth>
        <Table
          rowKey='id'
          loading={loading}
          columns={this.columns}
          dataSource={activity}
          expandedRowRender={this.expandedRowRender}
          pagination={{
            total: dataSource.totalCount,
            pageSize: params.pageSize,
            current: params.pageNum,
            showQuickJumper: true,
            showTotal: total => `共 ${total} 条`,
            onChange: pageNum => getList({ pageNum })
          }} />
      </div>
    )
  }
  get columns () {
    const columns = [
      { dataIndex: 'id', title: 'ID' },
      {
        dataIndex: 'status',
        title: '启用',
        render: (status, record) => {
          return (
            <Switch
              defaultChecked={status === 1}
              onClick={v => this.handleSwitchStatus(v, record)} />
          )
        }
      },
      { dataIndex: 'activityTheme', title: '营销活动名称' },
      { dataIndex: 'bizName', title: '所属业务线' },
      {
        dataIndex: 'activityType',
        title: '活动性质',
        render: type => {
          return type === 1 ? '正式' : '测试'
        }
      },
      { dataIndex: 'createdBy', title: '创建人' },
      {
        dataIndex: 'beginTime',
        title: '开始时间',
        render: (text, record) => {
          return moment(text).format('YYYY-MM-DD HH:mm')
        }
      }
    ]
    columns.push({
      title: '操作',
      width: 100,
      render: (text, record) => {
        return (
          <span className='m-action-group'>
            <Auth requires='MISSILE_MARKETING_DETAIL'>
              <Link to={`/marketing/detail?id=${record.id}`}>详情</Link>
            </Auth>
            <Auth requires='MISSILE_MARKETING_DEL'>
              <a onClick={() => this.showDelConfirm(record)}>删除</a>
            </Auth>
          </span>
        )
      }
    })
    return columns
  }
}
