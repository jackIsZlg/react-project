/*
 * Author: linglan
 * Date: 2017-11-21 23:16:47
 * Email: linglan@wacai.com
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Modal, Form, Input, Select, message, Spin } from 'antd'
import InfoList from 'page/common/infolist'

import * as action from '../../action'
import { connect } from 'react-redux'

const Option = Select.Option

@Form.create()
class WelfareEdit extends React.Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    currentRecord: PropTypes.object.isRequired,
    getAdditionByBiz: PropTypes.func.isRequired,
    addition: PropTypes.object.isRequired
  }
  componentWillMount () {
    const { currentRecord, getAdditionByBiz } = this.props
    getAdditionByBiz({
      bizName: currentRecord.get('bizName'),
      status: 1
    })
  }
  render () {
    const { form, currentRecord, addition } = this.props
    const { getFieldDecorator } = form
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 }
    }

    return (
      <Form>
        {
          getFieldDecorator('activityCostId', {
            initialValue: currentRecord.get('id')
          })(
            <Input className='f-hidden' />
          )
        }
        <Form.Item {...formItemLayout} label='费用承担部门'>
          {
            getFieldDecorator('costCenter', {
              rules: [{ required: true, message: '请选择费用承担部门' }],
              getValueFromEvent: (value) => {
                const obj = JSON.parse(value)
                return {
                  code: obj.costCenterCode,
                  name: obj.costCenterName
                }
              }
            })(
              <InfoList
                type='costCenter'
                valueType='object'
                selectProps={{
                  mode: 'single',
                  dropdownMatchSelectWidth: false
                }}
              />
            )
          }
        </Form.Item>
        <Form.Item {...formItemLayout} label='活动所属业务线'>
          {
            currentRecord.get('bizName')
          }
        </Form.Item>
        {
          addition && addition.map((item, index) => {
            const label = item.get('additionLabelName')
            return <Form.Item
              {...formItemLayout}
              key={index}
              label={label}>
              {
                getFieldDecorator(`addition_${label}`, {
                  rules: [{
                    required: true,
                    message: `请选择${label}`
                  }]
                })(
                  <Select>
                    {
                      item.get('additionLabelValue').split(',').map(value => (
                        <Option key={value} value={value}>{value}</Option>
                      ))
                    }
                  </Select>
                )
              }
            </Form.Item>
          })
        }
      </Form>
    )
  }
}

@connect(
  state => ({ modal: state.getIn(['activity', 'welfare', 'modal']) }),
  action
)
export default class ActivityWelfareEdit extends Component {
  static propTypes = {
    modal: PropTypes.object.isRequired,
    saveWelfareModal: PropTypes.func.isRequired,
    hideWelfareModal: PropTypes.func.isRequired,
    getAdditionByBiz: PropTypes.func.isRequired
  }
  getAdditionList = (obj) => {
    const symbol = 'addition_'
    return Object.keys(obj).reduce((result, key, index) => {
      if (key.includes(symbol)) {
        result.push({
          additionLabelName: key.replace(symbol, ''),
          additionLabelValue: Object.values(obj)[index]
        })
      }
      return result
    }, [])
  }
  onSubmit = e => {
    const { saveWelfareModal } = this.props
    this.refs.form.validateFields((errors, values) => {
      if (!errors) {
        const postData = {
          activityCostId: values.activityCostId,
          costCenterName: values.costCenter.name,
          costCenterCode: values.costCenter.code,
          additionLabelColumnList: this.getAdditionList(values)
        }
        saveWelfareModal(postData).then(() => {
          message.success(`更新成功！`)
        })
      }
    })
  }
  render () {
    const { hideWelfareModal, modal, getAdditionByBiz } = this.props
    return (
      <Modal
        title={'信息补全'}
        visible={modal.get('visible')}
        confirmLoading={modal.get('loading')}
        onOk={this.onSubmit}
        onCancel={hideWelfareModal}
        key={modal.get('key')}
        maskClosable={false}>
        <Spin spinning={modal.get('fetching')}>
          <WelfareEdit
            ref='form'
            currentRecord={modal.get('currentRecord')}
            getAdditionByBiz={getAdditionByBiz}
            addition={modal.get('addition')} />
        </Spin>
      </Modal>
    )
  }
}
