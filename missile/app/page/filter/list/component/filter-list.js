/*
 * Author: linglan
 * Date: 2017-11-06 16:15:03
 * Email: linglan@wacai.com
 */

import React, { Component } from 'react'
import { Link } from 'react-router'
import PropTypes from 'prop-types'
import moment from 'moment'
import { message, Table, Switch, Form, Button, Popconfirm, Modal } from 'antd'
import { Auth } from 'component'
import { userInfo } from 'common/config'
import * as action from '../../action'

import { connect } from 'react-redux'

const confirm = Modal.confirm

@Form.create()
@connect(
  state => ({ list: state.getIn(['filter', 'list']) }),
  action
)
export default class FilterList extends Component {
  static propTypes = {
    list: PropTypes.object.isRequired,
    getList: PropTypes.func.isRequired,
    optStatus: PropTypes.func.isRequired,
    optDel: PropTypes.func.isRequired,
    optCopy: PropTypes.func.isRequired
  }
  handleSwitchStatus = (v, record) => {
    if (v && record.userAmount === 0) {
      message.error('未完成筛选画像不能启用，请稍后再试！')
      return
    }
    this.props.optStatus({
      id: record.id,
      status: v ? 1 : 0
    })
      .then(() => message.success(`${v ? '启用' : '停用'}成功`))
  }
  handleCopy = record => {
    this.props.optCopy({
      ...record,
      copyBy: userInfo.nickname
    }).then(() => message.success('复制成功'))
  }
  handleDel = record => {
    return this.props.optDel({
      id: record.id
    }).then(() => message.success('删除成功'))
  }
  showDelConfirm = (record) => {
    confirm({
      title: `是否确认删除ID为${record.id}的${record.profileName}？`,
      content: '请注意：删除不可恢复',
      onOk: () => {
        return this.handleDel(record)
      }
    })
  }
  render () {
    const { list, getList } = this.props
    const { loading, dataSource, params } = list.toJS()

    return (
      <div>
        <Auth requires='MISSILE_USER_FILTER_ADD'>
          <div className='l-mtb-10'>
            <Link to='/filter/add'><Button size='large' type='primary'>新建</Button></Link>
          </div>
        </Auth>
        <Table
          rowKey='id'
          loading={loading}
          columns={this.columns}
          dataSource={dataSource.result}
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
              checked={status === 1}
              onChange={v => this.handleSwitchStatus(v, record)} />
          )
        }
      },
      { dataIndex: 'profileName', title: '筛选画像名称' },
      { dataIndex: 'userAmount', title: '预估人数' },
      { dataIndex: 'profilePoint', title: '画像主体' },
      { dataIndex: 'profileType', title: '画像类型' },
      { dataIndex: 'createType', title: '创建方式' },
      { dataIndex: 'createdBy', title: '创建人' },
      {
        dataIndex: 'updatedTime',
        title: '更新时间',
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
            <Auth requires='MISSILE_USER_FILTER_DETAIL'>
              <Link to={`/filter/detail?id=${record.id}&createType=${record.createType}`}>查看</Link>
            </Auth>
            <Auth requires='MISSILE_USER_FILTER_EDIT'>
              <Link to={`/filter/edit?id=${record.id}&createType=${record.createType}`}>编辑</Link>
            </Auth>
            <Auth requires='MISSILE_USER_FILTER_COPY'>
              <Popconfirm
                title='是否确认复制此画像？'
                onConfirm={() => this.handleCopy(record)}>
                <a>复制</a>
              </Popconfirm>
            </Auth>
            <Auth requires='MISSILE_USER_FILTER_DEL'>
              <a onClick={() => this.showDelConfirm(record)}>删除</a>
            </Auth>
          </span>
        )
      }
    })
    return columns
  }
}
