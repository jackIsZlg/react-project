/*
 * Author: linglan
 * Date: 2017-11-21 20:22:44
 * Email: linglan@wacai.com
 */

import './detail.less'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import moment from 'moment'
import { Row, Col, Tabs, Dropdown, Button, Menu, Icon, Popconfirm, Spin, message } from 'antd'
import DetailInfo from './component/activity-info'
import Welfare from './component/activity-welfare'

import * as action from '../action'
import { connect } from 'react-redux'

const TabPane = Tabs.TabPane

@connect(
  state => ({ detail: state.getIn(['activity', 'detail']) }),
  action
)
export default class ActivityDetail extends Component {
  static propTypes = {
    getDetail: PropTypes.func.isRequired,
    optDel: PropTypes.func.isRequired,
    detail: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired
  }
  componentDidMount () {
    this.props.getDetail({
      id: this.props.location.query.id
    })
  }
  handleRemoveActivity = () => {
    const { optDel, location, router } = this.props
    optDel({
      id: location.query.id
    })
    .then(() => message.success('删除成功', 1, () => {
      router.push('/marketing/list')
    }))
  }
  renderDropDown = () => {
    const menu = (
      <Menu>
        <Menu.Item key='edit-info'>
          <Link to={{
            pathname: '/marketing/edit',
            query: {
              id: this.props.location.query.id
            }
          }}>编辑活动信息</Link>
        </Menu.Item>
        <Menu.Item key='edit-people'>
          <Link to={{
            pathname: '/marketing/edit',
            query: {
              step: 2,
              id: this.props.location.query.id
            }
          }}>编辑活动人群</Link>
        </Menu.Item>
        <Menu.Item key='del'>
          <Popconfirm
            title='是否删除此活动信息？删除不会恢复！'
            okText='是'
            cancelText='否'
            onConfirm={this.handleRemoveActivity}>
            <a onClick={e => e.stopPropagation()}>删除活动</a>
          </Popconfirm>
        </Menu.Item>
      </Menu>
    )
    return (
      <Dropdown overlay={menu} trigger={['click']}>
        <Button
          size='large'
          type='primary'
          style={{
            margin: '0 0 0 auto',
            display: 'block'
          }}>
          操作 <Icon type='down' />
        </Button>
      </Dropdown>
    )
  }
  renderTop = () => {
    const { detail } = this.props
    const info = detail.get('data').get('activityBaseInfo')
    return (
      <Spin spinning={detail.get('loading')}>
        {
          info &&
          <div className='m-activity-detail-top s-content'>
            <Row>
              <Col span='20'><strong>{info.get('activityTheme')}</strong></Col>
              <Col span='4'>{this.renderDropDown()}</Col>
            </Row>
            <Row>
              <Col span='8'>负责人：{info.get('createdBy')}</Col>
              <Col span='8'>业务线：{info.get('bizName')}</Col>
            </Row>
            <Row>
              <Col span='8'>创建时间：{moment(info.get('createdTime')).format('YYYY-MM-DD HH:mm')}</Col>
              <Col span='8'>活动时间：{
                moment(info.get('beginTime')).format('YYYY-MM-DD HH:mm')
              } - {
                moment(info.get('endTime')).format('YYYY-MM-DD HH:mm')
              }</Col>
              <Col span='8'>评审时间：{moment(info.get('auditTime')).format('YYYY-MM-DD HH:mm')}</Col>
            </Row>
          </div>
        }
      </Spin>
    )
  }
  render () {
    return (
      <div className='l-p-0'>
        {
          this.renderTop()
        }
        <Tabs className='m-activity-tab'>
          <TabPane tab='活动详情' key='1'>
            <DetailInfo detail={this.props.detail} />
          </TabPane>
          <TabPane tab='福利信息' key='2'>
            <Welfare location={this.props.location} />
          </TabPane>
        </Tabs>
      </div>
    )
  }
}
