import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Modal, Form, Input, message } from 'antd'
import { save, hideModal, add } from '../compare'
@Form.create()
class CompareDetailForm extends React.Component {
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
        <Form.Item {...formItemLayout} label='一级菜单'>
          {getFieldDecorator('menu1', {
            initialValue: currentRecord.menu1,
            rules: [
                { required: true, message: '请填一级菜单' }
            ]
          })(<Input placeholder='请输入一级菜单' />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label='二级菜单'>
          {getFieldDecorator('menu2', {
            initialValue: currentRecord.menu2,
            rules: [
              { required: true, message: '请填二级菜单' }
            ]
          })(<Input placeholder='请输入二级菜单' />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label='三级菜单'>
          {getFieldDecorator('menu3', {
            initialValue: currentRecord.menu3,
            rules: [
              { required: true, message: '请填三级菜单' }
            ]
          })(<Input placeholder='请输入三级菜单' />)}
        </Form.Item>
      </Form>
    )
  }
}

@connect(
  state => ({ modal: state.getIn(['compare', 'modal']) }),
  dispatch => ({
    save: bindActionCreators(save, dispatch),
    add: bindActionCreators(add, dispatch),
    hideModal: bindActionCreators(hideModal, dispatch)
  })
)
export default class CompareDetail extends React.PureComponent {
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
            'menu1': data.menu1,
            'menu2': data.menu2,
            'menu3': data.menu3
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
        <CompareDetailForm ref='form' currentRecord={currentRecord} />
      </Modal>
    )
  }
}
