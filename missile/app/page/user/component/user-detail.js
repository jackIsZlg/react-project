import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Modal, Form, Input, Radio, message } from 'antd'

import { save, hideModal } from '../user'

@Form.create()
class UserDetailForm extends React.Component {
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

    const isEdit = !!currentRecord.id
    return (
      <Form>
        <Form.Item {...formItemLayout} label='用户昵称'>
          {getFieldDecorator('nickname', {
            initialValue: currentRecord.nickname,
            rules: [
              { required: true, message: '请填写用户昵称' },
              {
                validator: (rule, value, callbackfn) => {
                  let message
                  if (!/^[_\-0-9A-Za-z]{4,25}$/.test(value)) {
                    message = '请输入4~25个字母和数字组成的用户昵称'
                  }
                  callbackfn(message)
                }
              }
            ]
          })(<Input placeholder='请输入用户昵称' disabled={isEdit} />)}
        </Form.Item>

        <Form.Item {...formItemLayout} label='中文昵称'>
          {getFieldDecorator('nicknameCn', {
            initialValue: currentRecord.nicknameCn,
            rules: [{ required: true, message: '请填写用户名称' }]
          })(<Input disabled={isEdit} placeholder='请输入用户名称' />)}
        </Form.Item>

        <Form.Item {...formItemLayout} label='联系电话'>
          {getFieldDecorator('mobile', {
            initialValue: currentRecord.mobile,
            rules: [{ required: true, message: '请输入联系电话' }]
          })(<Input placeholder='请输入联系电话' />)}
        </Form.Item>

        <Form.Item {...formItemLayout} label='状态'>
          {getFieldDecorator('status', {
            initialValue: +currentRecord.status,
            rules: [{ required: true, message: '请设置启用状态', type: 'number' }]
          })(
            <Radio.Group>
              <Radio value={1}>启用</Radio>
              <Radio value={2}>禁用</Radio>
            </Radio.Group>
          )}
        </Form.Item>
      </Form>
    )
  }
}

@connect(
  state => ({ modal: state.user.get('modal') }),
  dispatch => ({
    save: bindActionCreators(save, dispatch),
    hideModal: bindActionCreators(hideModal, dispatch)
  })
)
export default class UserDetail extends React.PureComponent {
  static propTypes = {
    modal: PropTypes.object.isRequired,
    save: PropTypes.func.isRequired,
    hideModal: PropTypes.func.isRequired
  }

  onSubmit = e => {
    const { save, modal } = this.props
    const { currentRecord } = modal.toJS()

    this.refs.form.validateFields((errors, data) => {
      if (!errors) {
        data.id = currentRecord.id || ''
        save(data).then(() => {
          message.success(`${data.id ? '修改' : '新增'}成功！`)
        })
      }
    })
  }

  render () {
    const { hideModal, modal } = this.props
    const { currentRecord, loading, visible, key } = modal.toJS()

    return (
      <Modal
        title={currentRecord.id ? '修改' : '新增'}
        visible={visible}
        confirmLoading={loading}
        onOk={this.onSubmit}
        onCancel={hideModal}
        key={key}
        maskClosable={false}
      >
        <UserDetailForm ref='form' currentRecord={currentRecord} />
      </Modal>
    )
  }
}
