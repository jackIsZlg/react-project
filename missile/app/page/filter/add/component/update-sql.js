/*
 * Author: linglan
 * Date: 2017-11-06 11:32:16
 * Email: linglan@wacai.com
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Alert, Button, Form, Input, Select, message } from 'antd'
import { userInfo } from 'common/config'

import { connect } from 'react-redux'
import * as action from '../../action'

const { TextArea } = Input
const { Option } = Select

@connect(
  state => ({
    add: state.getIn(['filter', 'add']),
    detail: state.getIn(['filter', 'detail'])
  }),
  action
)
@Form.create()
export default class SqlForm extends Component {
  static propTypes = {
    router: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,
    add: PropTypes.object.isRequired,
    detail: PropTypes.object,

    optAdd: PropTypes.func.isRequired,
    optEdit: PropTypes.func.isRequired,
    optCheck: PropTypes.func.isRequired
  }
  handleSave = e => {
    const { form, optAdd, optEdit, optCheck, router } = this.props
    form.validateFields((err, values) => {
      if (!err) {
        const dataSource = {
          ...values
        }
        // 编辑时必传字段，此字段应由后端写死，前端临时添加
        if (values.id) dataSource.createType = 'SQL'
        optCheck(dataSource)
        .then(() => {
          values.id
          ? optEdit(dataSource)
            .then(() => {
              message.success(`编辑成功！`, 1, () => {
                router.push('/filter/list')
              })
            })
          : optAdd(dataSource)
            .then(() => {
              message.success(`新增成功！`, 1, () => {
                router.push('/filter/list')
              })
            })
        })
      }
    })
  }
  handleCancel = e => {
    this.props.router.push('/filter/list')
  }
  validTip = () => {
    const validating = this.props.add.get('validating')
    const validated = this.props.add.get('validated')
    let text = '请配置条件'
    let type = 'info'
    if (validating) {
      text = 'SQL语法开始检测'
    } else if (validating !== undefined) {
      text = validated ? 'SQL语法检测通过' : 'SQL语法检测异常'
      type = validated ? 'success' : 'error'
    }
    return {text, type}
  }
  render () {
    const { form, add, detail } = this.props
    const { getFieldDecorator } = form
    const formItemLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 7 }
    }
    const formSelectLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 3 }
    }
    const data = detail.get('data')
    const tip = this.validTip()

    return (
      <Form>
        <Alert message={tip.text} type={tip.type} showIcon />
        <div className='l-mtb-10'>
          <Button
            size='large'
            type='primary'
            className='l-mr-10'
            loading={add.get('loading') || add.get('validating')}
            onClick={this.handleSave}>保存</Button>
          <Button
            size='large'
            onClick={this.handleCancel}>取消</Button>
        </div>
        <div className='u-form-title'>
          <h2>基础信息</h2>
          <p>画像的基本信息</p>
          <div className='l-mtb-10 u-input-wrapper'>
            {
              getFieldDecorator('id', {
                initialValue: data.get('id')
              })(<Input className='f-hidden' />)
            }
            {
              getFieldDecorator('createdBy', {
                initialValue: data.get('createdBy') || userInfo.nickname
              })(<Input className='f-hidden' />)
            }
            {
              getFieldDecorator('status', {
                initialValue: data.get('status') !== null || data.get('status') !== undefined
                  ? data.get('status')
                  : 1
              })(<Input className='f-hidden' />)
            }
            <Form.Item {...formItemLayout} hasFeedback label='画像名称'>
              {
                getFieldDecorator('profileName', {
                  rules: [{ required: true, message: '请填写画像名称' }],
                  initialValue: data.get('profileName') ||
                    `${moment().format('YYYYMMDD')}未命名画像`
                })(<Input />)
              }
            </Form.Item>
            <Form.Item {...formSelectLayout} hasFeedback label='画像主体'>
              {
                getFieldDecorator('profilePoint', {
                  rules: [{ required: true, message: '请填写画像名称' }],
                  initialValue: data.get('profilePoint') || 'UID'
                })(
                  <Select>
                    <Option value='UID'>UID</Option>
                    <Option value='Phone'>Phone</Option>
                  </Select>
                )
              }
            </Form.Item>
          </div>
        </div>
        <div className='u-form-title'>
          <h2>SQL</h2>
          <p>请以 select distinct uid/phone from ... ... 的格式输入SQL</p>
          <div className='l-mtb-10 u-input-wrapper'>
            <Form.Item hasFeedback>
              {
                getFieldDecorator('userConditionSql', {
                  rules: [{ required: true, message: '请填写画像SQL' }],
                  initialValue: data.get('userConditionSql')
                })(<TextArea rows={10} />)
              }
            </Form.Item>
          </div>
        </div>
      </Form>
    )
  }
}
