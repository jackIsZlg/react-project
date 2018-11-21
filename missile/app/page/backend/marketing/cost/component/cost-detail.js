import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Modal, Form, Input, message } from 'antd'

import { save, hideModal } from '../cost'

@Form.create()
class CostDetailForm extends React.Component {
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
        <Form.Item {...formItemLayout} label='一级费用部门'>
          {getFieldDecorator('costCenter1', {
            initialValue: currentRecord.costCenter1,
            rules: [{ required: true, message: '请填写一级费用部门' }]
          })(<Input placeholder='请输入一级费用部门' />)}
        </Form.Item>

        <Form.Item {...formItemLayout} label='二级费用部门'>
          {getFieldDecorator('costCenter2', {
            initialValue: currentRecord.costCenter2,
            rules: [{ required: true, message: '请填写二级费用部门' }]
          })(<Input placeholder='请输入二级费用部门' />)}
        </Form.Item>
      </Form>
    )
  }
}

@connect(
  state => ({ modal: state.getIn(['cost', 'modal']) }),
  dispatch => ({
    save: bindActionCreators(save, dispatch),
    hideModal: bindActionCreators(hideModal, dispatch)
  })
)
export default class CostDetail extends React.PureComponent {
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
        const dataSource = {
          'costCenterCode': currentRecord.costCenterCode,
          'costCenter1': data.costCenter1,
          'costCenter2': data.costCenter2,
          'costCenterName': currentRecord.costCenterName,
          'status': currentRecord.status

        }
        data.id = currentRecord.id || ''
        save(dataSource).then(() => {
          message.success(`修改成功！`)
        })
      }
    })
  }

  render () {
    const { hideModal, modal } = this.props
    const { currentRecord, loading, visible, key } = modal.toJS()

    return (
      <Modal
        title={'修改'}
        visible={visible}
        confirmLoading={loading}
        onOk={this.onSubmit}
        onCancel={hideModal}
        key={key}
        maskClosable={false}
      >
        <CostDetailForm ref='form' currentRecord={currentRecord} />
      </Modal>
    )
  }
}
