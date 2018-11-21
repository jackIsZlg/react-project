/*
 * Author: linglan
 * Date: 2017-11-21 21:12:11
 * Email: linglan@wacai.com
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Toolbar } from '@wac/papaya-ui'
import { Table, Alert } from 'antd'
import { Auth } from 'component'
import Modal from './activity-welfare-edit'
import * as action from '../../action'
import { connect } from 'react-redux'

@connect(
  state => ({
    welfare: state.getIn(['activity', 'welfare']),
    detail: state.getIn(['activity', 'detail'])
  }),
  action
)
export default class ActivityDetail extends Component {
  static propTypes = {
    getWelfare: PropTypes.func.isRequired,
    showWelfareModal: PropTypes.func.isRequired,
    welfare: PropTypes.object.isRequired,
    detail: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired
  }
  componentWillMount () {
    this.props.getWelfare({
      activityId: this.props.location.query.id
    })
  }
  render () {
    const { welfare, getWelfare } = this.props
    const { loading, dataSource, params } = welfare.toJS()

    return (
      <div className='m-activity-detail m-second-page'>
        <Toolbar crumbs={['营销活动列表', '福利信息']} />
        <div className='m-content'>
          <div className='s-content'>
            <Alert
              className='l-mtb-10'
              showIcon
              message='这里会同步【统一福利中心】的福利信息。仅有补全信息后，才能计算成本' />
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
                onChange: pageNum => getWelfare({ pageNum })
              }}
              scroll={{ x: 1000 }} />
            <Modal />
          </div>
        </div>
      </div>
    )
  }
  get columns () {
    const addition = this.props.welfare
      .getIn(['dataSource', 'result', 0, 'additionLabelColumnList'])
    const columns = [
      { dataIndex: 'userGroupName', title: '用户组名称', width: 100, fixed: 'left' },
      { dataIndex: 'welfareType', title: '福利类型', width: 100, fixed: 'left' },
      { dataIndex: 'welfareName', title: '福利名称', width: 100, fixed: 'left' },
      { dataIndex: 'welfareCode', title: '福利编号' },
      { dataIndex: 'welfareCost', title: '福利成本' },
      { dataIndex: 'costCenterName', title: '费用部门' }
    ]
    addition && addition.forEach(item => columns.push({
      title: item.get('additionLabelName'),
      render: () => item.get('additionLabelValue')
    }))
    columns.push({
      title: '操作',
      width: 100,
      fixed: 'right',
      render: (text, record) => {
        return (
          <span className='m-action-group'>
            <Auth requires='MISSILE_MARKETING_WELFARE'>
              <a onClick={() => this.props.showWelfareModal({
                ...record,
                bizName: this.props.detail.getIn(['data', 'activityBaseInfo', 'bizName'])
              })}>信息补全</a>
            </Auth>
          </span>
        )
      }
    })
    return columns
  }
}
