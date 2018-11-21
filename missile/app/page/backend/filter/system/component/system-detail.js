import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Modal, Form, Input, message, Select } from 'antd'
import { save, hideModal, add } from '../system'
const Option = Select.Option
@Form.create()
class SystemDetailForm extends React.Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    currentRecord: PropTypes.object.isRequired
  }

  render () {
    const { form, currentRecord } = this.props
    const { getFieldDecorator } = form
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 }
    }

    return (
      <Form>
        <Form.Item {...formItemLayout} label='系统代码'>
          {getFieldDecorator('sysCode', {
            initialValue: currentRecord.sysCode,
            rules: [
              { required: true, message: '请填系统代码' },
              {
                validator: (rule, value, callbackfn) => {
                  let message
                  if (!/^[0-9a-zA-Z_-]*$/.test(value)) {
                    message = '请输入由英文字母、数字组成的系统代码'
                  }
                  callbackfn(message)
                }
              }
            ]
          })(<Input placeholder='请输入系统代码' />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label='系统名称'>
          {getFieldDecorator('sysName', {
            initialValue: currentRecord.sysName,
            rules: [
              { required: true, message: '请填系统名称' }
            ]
          })(<Input placeholder='请输入系统名称' />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label='输出模式'>
          {getFieldDecorator('directType', {
            initialValue: currentRecord.directType,
            rules: [{ required: true, message: '请设置输出模式' }]
          })(
            <Select placeholder='请选择输出模式'>
              <Option value='push'>Push</Option>
              <Option value='get'>Get</Option>
            </Select>
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label='其他字段'>
          {getFieldDecorator('addition', {
            initialValue: currentRecord.addition,
            rules: [
              { required: true, message: '请填其他字段' }
            ]
          })(<Input placeholder='请输入其他字段' />)}
        </Form.Item>
      </Form>
    )
  }
}

@connect(
  state => ({ modal: state.getIn(['system', 'modal']) }),
  dispatch => ({
    save: bindActionCreators(save, dispatch),
    add: bindActionCreators(add, dispatch),
    hideModal: bindActionCreators(hideModal, dispatch)
  })
)
export default class SystemDetail extends React.PureComponent {
  static propTypes = {
    modal: PropTypes.object.isRequired,
    save: PropTypes.func.isRequired,
    add: PropTypes.func.isRequired,
    hideModal: PropTypes.func.isRequired
  }

  onSubmit = e => {
    const { save, modal, add } = this.props
    const { currentRecord } = modal.toJS()
    this.refs.form.validateFields((errors, data) => {
      if (!errors) {
        data.id = currentRecord.id || ''
        if (data.id) {
          save(data).then(() => {
            message.success(`修改成功！`)
          })
        } else {
          const dataSource = {
            'sysCode': data.sysCode,
            'sysName': data.sysName,
            'directType': data.directType,
            'addition': data.addition
          }
          add(dataSource).then(() => {
            message.success(`新增成功！`)
          })
        }
      }
    })
  }

  render () {
    const { hideModal, modal } = this.props
    const { currentRecord, loading, visible, key } = modal.toJS()
    return (
      <Modal
        title={currentRecord.id ? '修改输出系统' : '新增输出系统'}
        visible={visible}
        confirmLoading={loading}
        onOk={this.onSubmit}
        onCancel={hideModal}
        key={key}
        maskClosable={false}
      >
        <SystemDetailForm ref='form' currentRecord={currentRecord} />
      </Modal>
    )
  }
}
