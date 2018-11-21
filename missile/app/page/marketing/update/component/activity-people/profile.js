/*
 * Author: linglan
 * Date: 2017-11-16 23:07:31
 * Email: linglan@wacai.com
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Table, Form, Spin, Alert,
  Button, Input, InputNumber, DatePicker, Radio, message } from 'antd'
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
    props.changeProfileFields(props.order, changedFields)
  },
  mapPropsToFields (props) {
    return {
      ...props.reducer.get('fields').toJS()
    }
  }
})
export default class ActivityProfile extends Component {
  static propTypes = {
    router: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,
    optAddProfile: PropTypes.func.isRequired,
    optEditProfile: PropTypes.func.isRequired,
    optAddProfileGroup: PropTypes.func.isRequired,
    optDelProfileGroup: PropTypes.func.isRequired,
    setDefaultProfileGroup: PropTypes.func.isRequired,
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
    const { form, optAddProfile, optEditProfile, order, id, reducer } = this.props
    const amount = reducer.getIn(['fields', 'profile', 'value', 'userAmount']) || 0
    form.validateFields((err, values) => {
      const { profile, updateType, updateProfileTime } = values
      if (!err) {
        let dataSource = {
          activityId: id,
          profileId: profile.profileId,
          profileName: profile.profileName,
          updateType: updateType,
          updateProfileTime: updateProfileTime && updateProfileTime.format('YYYY-MM-DD')
        }
        let userGroup = []
        let userAmount = 0
        let percentage = 0
        Object.keys(values).forEach(item => {
          const arr = item.split('_')
          const prefix = arr[0] === 'userGroup' ? arr[0] : undefined
          if (prefix) {
            const index = Number(arr[1])
            const key = arr[2]
            // 如果是输出字段，分解为两个字段
            if (key !== 'system') {
              userGroup[index] = {
                ...userGroup[index],
                [key]: values[item]
              }
            } else {
              userGroup[index] = {
                ...userGroup[index],
                sysCode: values[item].sysCode,
                sysName: values[item].sysName
              }
            }
            // 如果是百分比字段，累计所有百分比
            if (key === 'percentage') percentage += Number(values[item])
            if (key === 'predictAmount') userAmount += Number(values[item])
          }
        })
        if (percentage !== 100) {
          message.error(`筛选画像${order}: ` + '用户组不能为空且比例之和必须为100')
          return
        }
        if (amount !== userAmount) {
          message.error(`筛选画像${order}: ` + '用户组预估人数之和应等于总计')
          return
        }
        let isRepeat = false
        userGroup.reduce((prev, group) => {
          if (prev.userGroupName === group.userGroupName) isRepeat = true
        })
        if (isRepeat) {
          message.error(`筛选画像${order}: ` + '用户组名称不能重复')
          return
        }
        dataSource.profileUserGroupBaseInfoList = [...userGroup]
        !reducer.get('added')
        ? optAddProfile(order, dataSource)
          .then(() => {
            message.success(`新增筛选画像${order}成功！`)
          })
        : optEditProfile(order, dataSource)
          .then(() => {
            message.success(`编辑筛选画像${order}成功！`)
          })
      }
    })
  }
  handleAddGroup = () => {
    const { optAddProfileGroup, order } = this.props
    optAddProfileGroup(order)
  }
  handleDelGroup = (key) => {
    const { optDelProfileGroup, order } = this.props
    optDelProfileGroup(order, key)
  }
  changePercent = (value, key) => {
    const { form, reducer } = this.props
    const amount = reducer.getIn(['fields', 'profile', 'value', 'userAmount']) || 0
    form.setFieldsValue({
      [`userGroup_${key}_predictAmount`]: parseInt(Number(value) / 100 * amount)
    })
  }
  disabledDate = current => {
    return current && current.valueOf() < Date.now()
  }
  convertProfile = (data) => {
    return JSON.stringify({
      id: data.get('profileId'),
      profileName: data.get('profileName'),
      userAmount: data.get('userAmount')
    })
  }
  convertSystem = (data) => {
    // 转换出的键值顺序需要与 jsonKeys 中的一致
    return JSON.stringify({
      sysCode: data.get('sysCode'),
      sysName: data.get('sysName')
    })
  }
  renderProfile = () => {
    const { form, reducer, setDefaultProfileGroup, order } = this.props
    const { getFieldDecorator } = form
    const fields = reducer.get('fields')
    const profile = fields.getIn(['profile', 'value'])
    return (
      <div>
        <h2>筛选画像</h2>
        <p>通过【筛选画像】筛选出满足条件的用户群。可以用于批量福利发放，批量消息发放等批量操作。</p>
        <div className='l-mtb-10 u-input-wrapper'>
          <Item label='筛选画像'>
            {
              getFieldDecorator('profile', {
                rules: [{ required: true, message: '请选择筛选画像' }],
                getValueFromEvent: (value) => {
                  const obj = JSON.parse(value)
                  return {
                    profileId: obj.id,
                    profileName: obj.profileName,
                    userAmount: obj.userAmount
                  }
                }
              })(
                <InfoList
                  type='profile'
                  valueType='object'
                  selectProps={{
                    mode: 'single',
                    dropdownMatchSelectWidth: false,
                    value: profile && this.convertProfile(profile),
                    style: { width: 200 }
                  }}
                  jsonKeys={['id', 'profileName', 'userAmount']}
                  onChange={value => {
                    const obj = JSON.parse(value)
                    setDefaultProfileGroup(order, obj.profileName, obj.userAmount)
                  }}
                  fetchParam={{
                    status: 1
                  }}
                />
              )
            }
          </Item>
          <Item label='更新频率'>
            {
              getFieldDecorator('updateType', {
                rules: [{ required: true, message: '请选择更新频率' }],
                initialValue: 0
              })(
                <Radio.Group>
                  <Radio value={0}>立即更新</Radio>
                  <Radio value={1}>
                    定时更新
                    {
                      fields.get('updateType') && fields.get('updateType').get('value') === 1
                      ? <Item>
                        {
                          getFieldDecorator('updateProfileTime', {
                            rules: [{ required: true, message: '请选择定时更新时间' }]
                          })(
                            <DatePicker
                              className='l-ml-10'
                              disabledDate={this.disabledDate}
                              showToday={false} />
                          )
                        }
                      </Item>
                      : null
                    }
                  </Radio>
                  <Radio value={2}>每日更新</Radio>
                </Radio.Group>
              )
            }
          </Item>
        </div>
      </div>
    )
  }
  renderUser = () => {
    const reducer = this.props.reducer
    const amount = reducer.getIn(['fields', 'profile', 'value', 'userAmount']) || 0
    return (
      <div>
        <h2>设置用户组</h2>
        <p>可以对用户群，按照比例，随机切分成多个用户组。对不同的用户组，进行不同的批量操作，从而实现 A/B TEST。</p>
        <Alert
          className='l-mt-10'
          message={`总计：${amount}人`}
          type='info'
          showIcon />
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
      },
      {
        dataIndex: 'percentage',
        title: '用户组比例',
        render: (text, record) => (
          <Item {...tableItemLayout}>
            {
              getFieldDecorator(`userGroup_${record.key}_percentage`, {
                rules: [{ required: true, message: ' ' }]
              })(
                <InputNumber
                  min={1}
                  max={100}
                  precision={0}
                  className='l-full-width'
                  placeholder='请输入1-100'
                  onBlur={e => this.changePercent(e.target.value, record.key)} />
              )
            }
          </Item>
          )
      },
      {
        dataIndex: 'predictAmount',
        title: '预估人数',
        render: (text, record) => (
          <Item {...tableItemLayout}>
            {
              getFieldDecorator(`userGroup_${record.key}_predictAmount`, {
                rules: [{ required: true, message: ' ' }]
              })(
                <Input />
              )
            }
          </Item>
        )
      },
      {
        dataIndex: 'system',
        title: '输出系统',
        render: (text, record) => {
          const fieldName = `userGroup_${record.key}_system`
          const value = fields.getIn([fieldName, 'value'])
          return (
            <Item {...tableItemLayout}>
              {
                getFieldDecorator(fieldName, {
                  rules: [{ required: true, message: ' ' }],
                  getValueFromEvent: (value) => {
                    const obj = JSON.parse(value)
                    return {
                      sysName: obj.sysName,
                      sysCode: obj.sysCode
                    }
                  }
                })(
                  <InfoList
                    type='system'
                    valueType='object'
                    selectProps={{
                      mode: 'single',
                      dropdownMatchSelectWidth: false,
                      value: value && this.convertSystem(value),
                      style: { width: 200 }
                    }}
                    jsonKeys={['sysCode', 'sysName']}
                  />
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
            this.renderProfile()
          }
          {
            this.renderUser()
          }
        </Form>
      </Spin>
    )
  }
}
