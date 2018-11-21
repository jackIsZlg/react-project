/*
 * Author: linglan
 * Date: 2017-11-16 23:07:08
 * Email: linglan@wacai.com
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Table, Form, Spin, Button, Input, message } from 'antd'
import InfoList from 'page/common/infolist'

import { connect } from 'react-redux'
import * as action from '../../../action'

const { Item } = Form

@connect(
  state => ({}),
  action
)
@Form.create({
  onFieldsChange (props, changedFields) {
    props.changeTagFields(props.order, changedFields)
  },
  mapPropsToFields (props) {
    return {
      ...props.reducer.get('fields').toJS()
    }
  }
})
export default class ActivityTag extends Component {
  static propTypes = {
    router: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,
    optAddTag: PropTypes.func.isRequired,
    optEditTag: PropTypes.func.isRequired,
    optAddTagGroup: PropTypes.func.isRequired,
    optDelTagGroup: PropTypes.func.isRequired,
    setDefaultTagGroup: PropTypes.func.isRequired,
    isEdit: PropTypes.bool.isRequired,
    order: PropTypes.string.isRequired,
    reducer: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    onSave: PropTypes.func.isRequired
  }
  componentDidMount () {
    this.props.onSave(() => this.handleSave())
  }
  handleSave = e => {
    const { form, optAddTag, optEditTag, order, id, reducer } = this.props
    form.validateFields((err, values) => {
      if (!err) {
        let dataSource = {
          activityId: id,
          ruleId: values.rule.ruleId,
          ruleName: values.rule.ruleName,
          createdTime: new Date().getTime()
        }
        let userGroup = []
        Object.keys(values).forEach(item => {
          const arr = item.split('_')
          const prefix = arr[0] === 'userGroup' ? arr[0] : undefined
          if (prefix) {
            const index = Number(arr[1])
            const key = arr[2]
            // 如果是规则状态字段，分解为两个字段
            if (key !== 'tagStatus') {
              userGroup[index] = {
                ...userGroup[index],
                [key]: values[item]
              }
            } else {
              userGroup[index] = {
                ...userGroup[index],
                tagId: values[item].tagId,
                tagName: values[item].tagName,
                appStatusId: values[item].appStatusId,
                appStatusName: values[item].appStatusName,
                percentage: 100,
                sysCode: 0,
                sysName: ''
              }
            }
          }
        })
        if (userGroup.length === 0) {
          message.error(`跟踪规则${order}: ` + '用户组不能为空！')
          return
        }
        let isRepeat = false
        userGroup.reduce((prev, group) => {
          if (
            prev.userGroupName === group.userGroupName ||
            prev.tagName + prev.appStatusName === group.tagName + group.appStatusName
          ) isRepeat = true
        })
        if (isRepeat) {
          message.error(`跟踪规则${order}: ` + '用户组名称和规则状态不能重复')
          return
        }
        dataSource.ruleUserGroupBaseInfoList = [...userGroup]
        !reducer.get('added')
        ? optAddTag(order, dataSource)
          .then(() => {
            message.success(`新增跟踪规则${order}成功！`)
          })
        : optEditTag(order, dataSource)
          .then(() => {
            message.success(`编辑跟踪规则${order}成功！`)
          })
      }
    })
  }
  handleAddGroup = () => {
    const { optAddTagGroup, order } = this.props
    optAddTagGroup(order)
  }
  handleDelGroup = (key) => {
    const { optDelTagGroup, order } = this.props
    optDelTagGroup(order, key)
  }
  convertRule = (data) => {
    return JSON.stringify({
      id: data.get('ruleId'),
      ruleName: data.get('ruleName')
    })
  }
  convertTagStatus = (data) => {
    return JSON.stringify({
      id: data.get('tagId'),
      tagName: data.get('tagName'),
      appStatusId: data.get('appStatusId'),
      appStatusName: data.get('appStatusName')
    })
  }
  renderTag = () => {
    const { form, setDefaultTagGroup, order, reducer } = this.props
    const { getFieldDecorator } = form
    const fields = reducer.get('fields')
    const rule = fields.getIn(['rule', 'value'])
    return (
      <div>
        <h2>跟踪规则</h2>
        <p>筛选出满足条件的用户群。可以用于批量福利发放，批量消息发放等批量操作。</p>
        <div className='l-mtb-10 u-input-wrapper'>
          <Item label='跟踪规则'>
            {
              getFieldDecorator('rule', {
                rules: [{ required: true, message: '请选择跟踪规则' }],
                getValueFromEvent: (value) => {
                  const obj = JSON.parse(value)
                  return {
                    ruleId: obj.id,
                    ruleName: obj.ruleName
                  }
                }
              })(
                <InfoList
                  type='rule'
                  valueType='object'
                  selectProps={{
                    mode: 'single',
                    dropdownMatchSelectWidth: false,
                    value: rule && this.convertRule(rule),
                    style: { width: 200 }
                  }}
                  jsonKeys={['id', 'ruleName']}
                  onChange={value => {
                    const obj = JSON.parse(value)
                    setDefaultTagGroup(order, obj.ruleName)
                  }}
                />
              )
            }
          </Item>
        </div>
      </div>
    )
  }
  renderUser = () => {
    const reducer = this.props.reducer
    return (
      <div>
        <h2>设置用户组</h2>
        <p>当用户达到以下状态时，会将用户写入用户组。业务系统可以对不同的用户组，进行不同的批量操作，从而实现 A/B TEST。</p>
        <Table
          className='l-mtb-10'
          columns={this.columns}
          dataSource={reducer.get('userGroup').toJS()}
          pagination={false}
        />
        <div className='f-clearfix l-mtb-10'>
          <Button className='f-fl' onClick={this.handleAddGroup}>新增</Button>
          <Button
            disabled={reducer.get('saved')}
            type='primary'
            onClick={this.handleSave}
            loading={reducer.get('loading')}
            className='f-fr'>{reducer.get('added') ? '保存变更' : '保存'}</Button>
        </div>
      </div>
    )
  }
  get columns () {
    const { form, reducer } = this.props
    const { getFieldDecorator } = form
    const fields = reducer.get('fields')
    const tableItemLayout = {
      labelCol: { span: 0 },
      wrapperCol: { span: 24 },
      style: { width: '100%' }
    }
    const columns = [
      {
        dataIndex: 'realtimeTag',
        title: '规则状态',
        render: (text, record) => {
          const fieldName = `userGroup_${record.key}_tagStatus`
          const value = fields.getIn([fieldName, 'value'])
          return (
            <Item {...tableItemLayout}>
              {
                getFieldDecorator(fieldName, {
                  rules: [{ required: true, message: ' ' }],
                  getValueFromEvent: (value) => {
                    const obj = JSON.parse(value)
                    return {
                      tagId: obj.id,
                      tagName: obj.tagName,
                      appStatusId: obj.appStatusId,
                      appStatusName: obj.appStatusName
                    }
                  }
                })(
                  <InfoList
                    type='ruleStatus'
                    valueType='object'
                    selectProps={{
                      mode: 'single',
                      dropdownMatchSelectWidth: false,
                      value: value && this.convertTagStatus(value)
                    }}
                    jsonKeys={[
                      'id',
                      {
                        combineKey: 'tagName',
                        sourseKey: ['moment', 'unit']
                      },
                      'appStatusId',
                      'appStatusName'
                    ]}
                  />
                )
              }
            </Item>
          )
        }
      },
      {
        dataIndex: 'userGroupName',
        title: '用户组名称',
        render: (text, record) => {
          const fieldName = `userGroup_${record.key}_userGroupName`
          return (
            <Item {...tableItemLayout}>
              {
                getFieldDecorator(fieldName, {
                  rules: [{ required: true, message: ' ' }]
                })(
                  <Input />
                )
              }
            </Item>
          )
        }
      }
    ]
    columns.push({
      title: '操作',
      width: 100,
      render: (text, record) => {
        return (
          <span className='m-action-group'>
            <a onClick={() => this.handleDelGroup(record.key)}>删除</a>
          </span>
        )
      }
    })
    return columns
  }
  render () {
    return (
      <Spin spinning={false}>
        <Form layout='inline'>
          {
            this.renderTag()
          }
          {
            this.renderUser()
          }
        </Form>
      </Spin>
    )
  }
}
