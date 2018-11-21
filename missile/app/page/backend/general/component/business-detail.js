import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Modal, Form, Input, message } from 'antd'

import { save, hideModal, add } from '../business'

@Form.create()
class BusinessDetailForm extends React.Component {
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
        <Form.Item {...formItemLayout} label='业务线'>
          {getFieldDecorator('bizName', {
            initialValue: currentRecord.bizName,
            rules: [{ required: true, message: '请填写业务线' }]
          })(<Input placeholder='请输入业务线名称' />)}
        </Form.Item>
      </Form>
    )
  }
}

@connect(
  state => ({ modal: state.getIn(['business', 'modal']) }),
  dispatch => ({
    save: bindActionCreators(save, dispatch),
    add: bindActionCreators(add, dispatch),
    hideModal: bindActionCreators(hideModal, dispatch)
  })
)
export default class BusinessDetail extends React.PureComponent {
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
            'bizName': data.bizName
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
        title={currentRecord.id ? '修改业务线' : '新增业务线'}
        visible={visible}
        confirmLoading={loading}
        onOk={this.onSubmit}
        onCancel={hideModal}
        key={key}
        maskClosable={false}
      >
        <BusinessDetailForm ref='form' currentRecord={currentRecord} />
      </Modal>
    )
  }
}
