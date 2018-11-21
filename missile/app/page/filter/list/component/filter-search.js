/*
 * Author: linglan
 * Date: 2017-11-06 16:09:10
 * Email: linglan@wacai.com
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, Form, Input, Select } from 'antd'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getList } from '../../action'

const { Option } = Select

@connect(
  state => ({ filter: state.filter }),
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
      if (!err) {
        getList(values)
      }
    })
  }
  render () {
    const { getFieldDecorator } = this.props.form
    return (
      <div className='u-input-wrapper'>
        <Form layout='inline'>
          <Form.Item label='画像名称'>
            {
              getFieldDecorator('profileName', {
              })(<Input size='large' />)
            }
          </Form.Item>
          <Form.Item label='创建人'>
            {
              getFieldDecorator('createdBy', {
              })(<Input size='large' />)
            }
          </Form.Item>
          <Form.Item label='状态'>
            {
              getFieldDecorator('status', {
                initialValue: '-1'
              })(
                <Select size='large'>
                  <Option value='-1'>全部</Option>
                  <Option value='0'>已停用</Option>
                  <Option value='1'>已启用</Option>
                </Select>
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
