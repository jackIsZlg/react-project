/*
 * Author: linglan
 * Date: 2017-11-14 15:49:15
 * Email: linglan@wacai.com
 */

import './update.less'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Steps, Icon } from 'antd'
import Info from './activity-info'
import People from './activity-people'
import Result from './activity-result'

export default class ActivityStep extends Component {
  static propTypes = {
    step: PropTypes.number.isRequired,
    location: PropTypes.object.isRequired
  }
  render () {
    const location = this.props.location
    const isEdit = location.pathname.includes('edit')
    const steps = isEdit ? [{
      title: '活动信息',
      content: Info,
      icon: 'file-text'
    },
    {
      title: '活动人群',
      content: People,
      icon: 'team'
    }]
    : [{
      title: '活动信息',
      content: Info
    },
    {
      title: '活动人群',
      content: People
    },
    {
      title: '提交成功',
      content: Result
    }]
    const current = this.props.step - 1
    const Content = steps[current].content
    return (
      <div className='m-step-wrapper'>
        {
          isEdit
          ? <div className='u-stepbar only-edit'>
            <Icon type={steps[current].icon} />
            <span>编辑{steps[current].title}</span>
          </div>
          : <Steps className='u-stepbar' current={current}>
            {steps.map(item => <Steps.Step key={item.title} title={item.title} />)}
          </Steps>
        }
        <div className='m-step-content u-form-title'>
          {
            <Content isEdit={isEdit} {...this.props} />
          }
        </div>
      </div>
    )
  }
}
