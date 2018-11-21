import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Modal, Form, Input, message, Select } from 'antd'
import { save, hideModal, add } from '../quota'
const Option = Select.Option
@Form.create()
class QuotaDetailForm extends React.Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    businessDataSource: PropTypes.array,
    currentRecord: PropTypes.object.isRequired
  }

  render () {
    const { form, currentRecord, businessDataSource } = this.props
    const { getFieldDecorator } = form
    // isShow  业务线input是否被禁用
    let isShow = false
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 }
    }
    const businessData = []
    for (var i = 0; i < businessDataSource.length; i++) {
      businessData.push(<Option key={i} value={businessDataSource[i].bizName}>{businessDataSource[i].bizName}</Option>)
    }

    return (
      <Form>
        <Form.Item {...formItemLayout} label='业务线'>
          {getFieldDecorator('bizName', {
            initialValue: currentRecord.bizName,
            rules: [{ required: true, message: '请选择业务线' }]
          })(
            <Select showSearch disabled={isShow} placeholder='请选择业务线（单选）'>
              {businessData}
            </Select>
          )}
        </Form.Item>
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
      </Form>
    )
  }
}

@connect(
  state => ({ modal: state.getIn(['quota', 'modal']) }),
  dispatch => ({
    save: bindActionCreators(save, dispatch),
    add: bindActionCreators(add, dispatch),
    hideModal: bindActionCreators(hideModal, dispatch)
  })
)
export default class QuotaDetail extends React.PureComponent {
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
            'bizName': data.bizName,
            'menu1': data.menu1,
            'menu2': data.menu2
          }
          add(dataSource).then(() => {
            message.success('新增成功！')
          })
          .catch((err) => {
            if (err.code === 501) {
              message.error('该一级菜单下，已存在相同的二级菜单')
            } else {
              message.error(err.errMessage)
            }
          })
        }
      }
    })
  }

  render () {
    const { hideModal, modal } = this.props
    const { currentRecord, loading, visible, key, businessDataSource } = modal.toJS()
    return (
      <Modal
        title={currentRecord.id ? '修改菜单' : '新增菜单'}
        visible={visible}
        confirmLoading={loading}
        onOk={this.onSubmit}
        onCancel={hideModal}
        key={key}
        maskClosable={false}
      >
        <QuotaDetailForm ref='form' currentRecord={currentRecord} businessDataSource={businessDataSource} />
      </Modal>
    )
  }
}
