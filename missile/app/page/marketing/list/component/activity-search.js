/*
 * Author: linglan
 * Date: 2017-11-13 17:40:28
 * Email: linglan@wacai.com
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, Form, Input, DatePicker } from 'antd'
import InfoList from 'page/common/infolist'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getList } from '../../action'

const { RangePicker } = DatePicker

@connect(
  state => ({}),
  dispatch => ({
    getList: bindActionCreators(getList, dispatch)
  })
)
@Form.create()
export default class FilterSearch extends Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    getList: PropTypes.func.isRequired
  }
  handleSearch = e => {
    const { form, getList } = this.props
    form.validateFields((err, values) => {
      const [beginTime, endTime] = values.time || []
      if (!err) {
        const posts = {
          activityTheme: values.activityTheme,
          bizName: values.bizName,
          beginTime: beginTime && beginTime.startOf('day').valueOf(),
          endTime: endTime && endTime.endOf('day').valueOf()
        }
        getList(posts)
      }
    })
  }
  render () {
    const { getFieldDecorator } = this.props.form
    return (
      <div className='u-input-wrapper'>
        <Form layout='inline'>
          <Form.Item label='活动时间'>
            {
              getFieldDecorator('time', {
              })(<RangePicker size='large' />)
            }
          </Form.Item>
          <Form.Item label='活动名称'>
            {
              getFieldDecorator('activityTheme', {
              })(<Input size='large' />)
            }
          </Form.Item>
          <Form.Item label='所属业务线'>
            {
              getFieldDecorator('bizName', {
              })(
                <InfoList
                  type='biz'
                  valueKey='bizName'
                  selectProps={{
                    mode: 'single',
                    style: {
                      width: 150
                    },
                    size: 'large'
                  }} />
              )
            }
          </Form.Item>
          <Form.Item>
            <Button size='large' onClick={this.handleSearch}>搜索</Button>
          </Form.Item>
        </Form>
      </div>
    )
  }
}
