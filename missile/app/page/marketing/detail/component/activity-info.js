/*
 * Author: linglan
 * Date: 2017-11-21 21:10:01
 * Email: linglan@wacai.com
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Toolbar } from '@wac/papaya-ui'
import { Row, Col, Table, Spin } from 'antd'

export default class ActivityInfo extends Component {
  static propTypes = {
    detail: PropTypes.object.isRequired
  }
  render () {
    const { detail } = this.props
    const info = detail.get('data').get('activityBaseInfo')
    const userGroup = detail.get('data').get('userGroupInfoList')
    return (
      <Spin spinning={detail.get('loading')}>
        <div className='m-activity-detail m-second-page'>
          <Toolbar crumbs={['营销活动列表', '活动详情']} />
          <div className='m-content'>
            <div className='s-content'>
              <h2>详细信息</h2>
              {
                info &&
                <div className='u-input-wrapper'>
                  <Row>
                    <Col span='12'>费用部门：{info.get('costCenter')}</Col>
                    <Col span='12'>活动预算：{info.get('costBudget')}</Col>
                  </Row>
                  <Row><Col>活动背景：{info.get('activityBackground')}</Col></Row>
                  <Row><Col>活动目的：{info.get('activityGoal')}</Col></Row>
                  <Row><Col>关联活动：{info.get('relatedActivity')}</Col></Row>
                </div>
              }
              <h2>用户组信息</h2>
              {
                userGroup &&
                <Table
                  rowKey='userGroupId'
                  loading={false}
                  columns={this.columns}
                  dataSource={userGroup.toJS()}
                  pagination={false}
                />
              }
            </div>
          </div>
        </div>
      </Spin>
    )
  }
  get columns () {
    const columns = [
      { dataIndex: 'userGroupId', title: 'CP_GID' },
      { dataIndex: 'userGroupName', title: '用户组名称' },
      { dataIndex: 'profileOrRuleName', title: '筛选画像 / 跟踪规则 名称' },
      { dataIndex: 'filterType', title: '筛选方法' },
      { dataIndex: 'percentage', title: '人数占比' },
      { dataIndex: 'predictAmount', title: '预估人数' },
      { dataIndex: 'userAmount', title: '实际人数' },
      {
        dataIndex: 'updatedTime',
        title: '更新时间',
        render: (text, record) => {
          return moment(text).format('YYYY-MM-DD HH:mm')
        }
      }
    ]
    return columns
  }
}
