/*
 * Author: daoya
 * Date: 2017-12-19
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Alert, Button, Form, Input, Select, message, Upload, Table, Spin } from 'antd'
import { userInfo } from 'common/config'

import { connect } from 'react-redux'
import * as action from '../../action'
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
    getList: PropTypes.func.isRequired,
    fileAdd: PropTypes.func.isRequired,
    optEdit: PropTypes.func.isRequired
  }
  constructor (props) {
    super(props)
    this.state = {
      tableData: [],
      title: [],
      userConditionSql: '',
      fileTitle: null,
      fileList: [],
      loading: false,
      uploadData: {}
    }
  }

  handleSave = e => {
    const { form, fileAdd, optEdit, router, detail } = this.props
    const data = detail.get('data')
    form.validateFields((err, values) => {
      if (!err) {
        const dataSource = {
          createType: 'FILE', // 文件上传类型为FILE
          createdBy: values.createdBy,
          id: values.id,
          profileName: values.profileName,
          profilePoint: values.profilePoint,
          profileType: values.profileType,
          status: values.status,
          userConditionSql: this.state.userConditionSql || data.get('userConditionSql')
        }
        // userConditionSql为空，不允许保存
        if (!dataSource.userConditionSql) {
          values.id
          ? message.error('文件正在解析，请稍后保存！')
          : message.error('请上传文件')
        } else {
          values.id
          ? optEdit(dataSource)
            .then(() => {
              message.success(`编辑成功！`, 1, () => {
                router.push('/filter/list')
              })
            })
          : fileAdd(dataSource)
            .then(() => {
              message.success(`新增成功！`, 1, () => {
                router.push('/filter/list')
              })
            })
        }
      }
    })
  }
  handleCancel = e => {
    this.props.router.push('/filter/list')
  }
  validTip = () => {
    let text = '请配置条件'
    let type = 'info'
    return {text, type}
  }

  normFile = (e) => {
    if (Array.isArray(e)) {
      return e
    }
    return e && e.fileList
  }
  onChange = (info) => {
    // 文件上传过程中显示loading状态
    if (info.file.status === 'uploading') {
      this.setState({loading: true})
    }
    if (info.file.status === 'done') {
      // 返回为0，上传成功
      if (info.file.response.code === 0) {
        message.success(`${info.file.name} 文件上传成功`)
        const data = info.file.response.data
        const tableData = data.result
        const title = data.title
        const userConditionSql = data.userConditionSql
        this.setState({
          tableData: tableData,
          title: title,
          userConditionSql: userConditionSql,
          fileTitle: info.file.name,
          fileList: info.fileList,
          loading: false
        })
      } else {
        message.error(`${info.file.response.error}`)
        this.setState({
          loading: false
        })
      }
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 文件上传失败`)
      this.setState({
        loading: false
      })
    }
  }

  // 上传文件校验，只允许传txt、csv文件
  beforeUpload = (file) => {
    const isTrueFormat = file.type === 'text/plain' || file.type === 'text/csv'
    if (!isTrueFormat) {
      message.error('请上传txt或者csv格式的文件')
    }
    return isTrueFormat
  }
  componentDidMount () {
    const { form } = this.props
    const uploadData = {
      'profileName': form.getFieldValue('profileName'),
      'profilePoint': form.getFieldValue('profilePoint'),
      'profileType': form.getFieldValue('profileType')
    }
    this.setState({uploadData: uploadData})
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
    const uploadData = {
      'profileName': form.getFieldValue('profileName'),
      'profilePoint': form.getFieldValue('profilePoint'),
      'profileType': form.getFieldValue('profileType')
    }
    const header = {authorization: 'application/x-www-form-urlencoded'}
    const columns = this.state.title.length > 0 ? this.state.title : data.toJS().title
    const tableData = this.state.tableData.length > 0 ? this.state.tableData : data.toJS().result
    let rowId = this.state.title.length > 0 ? this.state.title[0].dataIndex : undefined
    if (!rowId && data.toJS().title) {
      rowId = data.toJS().title[0].dataIndex
    }
    return (
      <Form>
        <Alert message={tip.text} type={tip.type} showIcon />
        <div className='l-mtb-10'>
          <Button
            size='large'
            type='primary'
            className='l-mr-10'
            loading={add.get('loading')}
            onClick={this.handleSave}>保存</Button>
          <Button
            size='large'
            onClick={this.handleCancel}>取消</Button>
        </div>
        <div className='u-form-title'>
          <h2>基础信息</h2>
          <p>文件的基本信息</p>
          <div className='l-mtb-10 u-input-wrapper'>
            {
              getFieldDecorator('id', {
                initialValue: data.get('id')
              })(<Input className='f-hidden' />)
            }
            {
              getFieldDecorator('createdBy', {
                initialValue: data.get('createdBy') || userInfo.nicknameCn
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
                    `${moment().format('YYYYMMDD')}的新建画像${userInfo.nicknameCn}`
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
            <Form.Item {...formSelectLayout} hasFeedback label='画像类型'>
              {
                getFieldDecorator('profileType', {
                  rules: [{ required: true, message: '请填写画像类型' }],
                  initialValue: data.get('profileType') || '0'
                })(
                  <Select>
                    <Option value='0'>无参数画像</Option>
                    <Option value='1'>有参数画像</Option>
                  </Select>
                )
              }
            </Form.Item>
          </div>
        </div>
        <div className='u-form-title'>
          <h2>文件上传</h2>
          <div>在数据平台文件上传之后，获取到的表名称</div>
          <Form.Item {...formItemLayout} hasFeedback label='文件表名'>
            {
              getFieldDecorator('userConditionSql', {
                rules: [{ required: true, message: '请填写文件表名' }],
                initialValue: data.get('userConditionSql')
              })(<Input />)
            }
          </Form.Item>
          <div><a>点击上传文件</a></div>
          {/* <div>
            <Form.Item
              {...formItemLayout}
            >
              {getFieldDecorator('upload', {
                valuePropName: 'fileList',
                getValueFromEvent: this.normFile
              })(
                <Upload name='file'
                  action='/missile/api/user-filter/filterUploadTable'
                  data={uploadData || this.state.uploadData}
                  headers={header}
                  beforeUpload={this.beforeUpload}
                  onChange={this.onChange}
                  showUploadList={false}
                >
                  <Button className='fileButton'>
                   浏 览
                  </Button>
                </Upload>
              )}
            </Form.Item>
          </div> */}
          {
            rowId
            ? <Table
              rowKey={rowId}
              columns={columns}
              loading={this.state.loading}
              dataSource={tableData}
              pagination={false}
            />
            : <Spin spinning={this.state.loading} />
          }
          {/* <Table
              rowKey={rowId}
              columns={columns}
              loading={this.state.loading}
              dataSource={tableData}
              pagination={false}
            /> */}
        </div>
      </Form>
    )
  }
}
