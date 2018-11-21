import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Modal, Form, Input, message, Select, Radio, Icon, Table } from 'antd'
import _ from 'lodash'
import { userInfo } from 'common/config'
import { save, hideModal, add, inputUpdata } from '../info'
const Option = Select.Option
class EditableCell extends React.Component {
  static propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func
  }
  state = {
    value: this.props.value
  }
  handleChange = (e) => {
    const value = e.target.value
    this.setState({ value })
  }
  onBlur = () => {
    this.setState({ editable: false })
    if (this.props.onChange) {
      this.props.onChange(this.state.value)
    }
  }
  render () {
    const { value } = this.state
    return (
      <div className='editable-cell'>
        <div className='editable-cell-input-wrapper'>
          <Input
            value={value}
            onChange={this.handleChange}
            onPressEnter={this.check}
            onBlur={this.onBlur}
          />
        </div>
      </div>
    )
  }
}

@connect(
  state => ({ modal: state.getIn(['info', 'modal']), list: state.getIn(['info', 'list']) }),
  dispatch => ({
    inputUpdata: bindActionCreators(inputUpdata, dispatch)
  })
)
@Form.create()
class InputList extends React.Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    additionColumnValueData: PropTypes.array.isRequired,
    modal: PropTypes.object.isRequired,
    inputUpdata: PropTypes.func.isRequired
  }
  constructor (props) {
    super(props)
    const {additionColumnValueData} = this.props
    // 获取附加字段值并处理成所需格式 dataSource
    const dataSource = []
    _.forEach(additionColumnValueData, function (value, key) {
      function Key () {
        this.key = key
      }
      function AdditionColumnName () {
        this.additionColumnName = value
      }
      dataSource.push(_.assign({key: 0}, new Key(), new AdditionColumnName()))
    })
    this.state = {
      dataSource: dataSource,
      key: dataSource.length
    }
  }
  componentDidUpdate () {
    const { inputUpdata, modal } = this.props
    const { currentRecord } = modal.toJS()
    const {additionColumnValueData} = this.props
    const additionColumnName = _.map(this.state.dataSource, 'additionColumnName')
    const additionColumnValue = additionColumnName.toString()
    const dataSource = {
      'bizName': currentRecord.bizName,
      'isSingle': currentRecord.isSingle,
      'isNeeded': currentRecord.isNeeded,
      'additionColumn': currentRecord.additionColumn,
      'additionColumnValue': additionColumnValue,
      'id': currentRecord.id,
      'createdBy': currentRecord.createdBy
    }
    // 附加字段值修改后更新Reducer
    if (additionColumnName.length !== additionColumnValueData.length) {
      inputUpdata(dataSource)
    } else {
      let indexon
      for (var j = 0; j < additionColumnName.length; j++) {
        indexon = 1
        if (additionColumnName[j] !== additionColumnValueData[j]) {
          indexon = 0
          break
        }
      }
      // 当additionColumnName和additionColumnValueData两个数组不相等时更新数据
      if (indexon === 0) {
        inputUpdata(dataSource)
      }
    }
  }
  // 新增附加字段值
  handleAdd = () => {
    const dataSource = this.state.dataSource
    const newData = {
      key: this.state.key + 1,
      additionColumnName: ''
    }
    this.setState({
      key: this.state.key + 1,
      dataSource: [...dataSource, newData]
    })
  }
  // 删除附加字段值
  onDelete = (key) => {
    const dataSource = [...this.state.dataSource]
    this.setState({ dataSource: dataSource.filter(item => item.key !== key) })
  }
  render () {
    const { form } = this.props
    const { getFieldDecorator } = form
    return (
      <div className='ant-row ant-form-item info-detail-input'>
        <div className='ant-col-6 ant-form-item-label'>
          <lebel className='ant-form-item-required'> 附加字段值：</lebel>
        </div>
        <div className='ant-col-16 input-table info-style'>
          <Form.Item>
            {getFieldDecorator('data')(
              <Table
                showHeader={false}
                dataSource={this.state.dataSource}
                columns={this.columns}
                pagination={false}
              />
              )}
          </Form.Item>
        </div>
        <Icon className='addIcon' type='plus-circle' onClick={this.handleAdd} style={{ fontSize: 16, color: '#00CC00' }} />
      </div>
    )
  }

  onCellChange = (key, dataIndex) => {
    return (value) => {
      const dataSource = [...this.state.dataSource]
      const target = dataSource.find(item => item.key === key)
      if (target) {
        target[dataIndex] = value
        this.setState({ dataSource })
      }
    }
  }
  get columns () {
    const columns = [
      {
        dataIndex: 'additionColumnName',
        width: '90%',
        render: (text, record) => (
          <EditableCell
            value={text}
            onChange={this.onCellChange(record.key, `additionColumnName`)}
      />
        )
      },
      {
        title: '操作',
        width: '10%',
        dataIndex: 'operation',
        render: (text, record) => {
          return (
            this.state.dataSource.length > 1
            ? (<Icon type='minus-circle' style={{ fontSize: 16 }} onClick={() => this.onDelete(record.key)} />
            ) : null
          )
        }
      }
    ]
    return columns
  }
}

@Form.create()
class InfoDetailForm extends React.Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    businessDataSource: PropTypes.array.isRequired,
    currentRecord: PropTypes.object.isRequired
  }

  render () {
    const { form, currentRecord, businessDataSource } = this.props
    const { getFieldDecorator } = form
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 }
    }
    // 业务线select选择器数据 businessData
    const businessData = []
    for (var i = 0; i < businessDataSource.length; i++) {
      businessData.push(<Option key={i} value={businessDataSource[i].bizName}>{businessDataSource[i].bizName}</Option>)
    }
    const additionColumnValue = currentRecord.additionColumnValue
    const additionColumnValueData = _.split(additionColumnValue, ',')
    let isShow = false
    if (currentRecord.id) {
      isShow = true
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
        <Form.Item {...formItemLayout} label='单选/多选'>
          {getFieldDecorator('isSingle', {
            initialValue: currentRecord.isSingle,
            rules: [{ required: true, message: '请选择单选/多选状态' }]
          })(
            <Radio.Group>
              <Radio value='单选'>单选</Radio>
              <Radio value='多选'>多选</Radio>
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label='可选/必选'>
          {getFieldDecorator('isNeeded', {
            initialValue: currentRecord.isNeeded,
            rules: [{ required: true, message: '请选择可选/必选状态' }]
          })(
            <Radio.Group>
              <Radio value='可选'>可选</Radio>
              <Radio value='必选'>必选</Radio>
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label='附加字段名称'>
          {getFieldDecorator('additionColumn', {
            initialValue: currentRecord.additionColumn,
            rules: [{ required: true, message: '请填写附加字段名称' }]
          })(<Input placeholder='请输入附加字段名称' />)}
        </Form.Item>
        <InputList additionColumnValueData={additionColumnValueData} />
      </Form>
    )
  }
}

@connect(
  state => ({ modal: state.getIn(['info', 'modal']), list: state.getIn(['info', 'list']) }),
  dispatch => ({
    save: bindActionCreators(save, dispatch),
    add: bindActionCreators(add, dispatch),
    hideModal: bindActionCreators(hideModal, dispatch)
  })
)
export default class InfoDetail extends React.PureComponent {
  static propTypes = {
    modal: PropTypes.object.isRequired,
    save: PropTypes.func.isRequired,
    add: PropTypes.func.isRequired,
    hideModal: PropTypes.func.isRequired
  }

  // 提交表单
  onSubmit = e => {
    const { save, modal, add } = this.props
    const { currentRecord } = modal.toJS()
    const additionColumnValueList = _.split(currentRecord.additionColumnValue, ',')
    // 去重
    const newAdditionColumnValueList = _.uniq(additionColumnValueList)
    if (newAdditionColumnValueList.length !== additionColumnValueList.length) {
      message.error('附加字段值重复')
      return
    }
    let isNull = false
    _.forEach(additionColumnValueList, function (value, key) {
      if (value === '') {
        isNull = true
      }
    })
    if (isNull) {
      message.error('附加字段值不能为空')
      return
    }
    this.refs.form.validateFields((errors, data) => {
      if (!errors) {
        data.id = currentRecord.id || ''
        if (data.id) {
          const dataSource = {
            'bizName': data.bizName,
            'isSingle': data.isSingle,
            'isNeeded': data.isNeeded,
            'additionColumn': data.additionColumn,
            'additionColumnValueList': additionColumnValueList,
            'id': currentRecord.id,
            'createdBy': currentRecord.createdBy
          }
          save(dataSource).then(() => {
            message.success(`修改成功！`)
          })
        } else {
          const addDataSource = {
            'bizName': data.bizName,
            'isSingle': data.isSingle,
            'isNeeded': data.isNeeded,
            'additionColumn': data.additionColumn,
            'additionColumnValueList': additionColumnValueList,
            'createdBy': userInfo.nickname
          }
          add(addDataSource).then(() => {
            message.success(`新增成功！`)
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
        title={currentRecord.id ? '修改附加字段' : '新增附加字段'}
        visible={visible}
        confirmLoading={loading}
        onOk={this.onSubmit}
        onCancel={hideModal}
        key={key}
        maskClosable={false}
      >
        <InfoDetailForm ref='form' currentRecord={currentRecord} businessDataSource={businessDataSource} />
      </Modal>
    )
  }
}
