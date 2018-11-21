/*
 * Author: linglan
 * Date: 2017-11-14 15:33:27
 * Email: linglan@wacai.com
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Row, Col, Form, Spin, Popconfirm,
  Button, Input, DatePicker, Checkbox, Radio, InputNumber, message } from 'antd'
import InfoList from 'page/common/infolist'
import { userInfo } from 'common/config'

import { connect } from 'react-redux'
import * as action from '../../action'

const { RangePicker } = DatePicker
const { Item } = Form

const halfItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 14 }
}
const checkboxLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 }
}
const formItemLayout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 19 }
}

@connect(
  state => ({
    addInfo: state.getIn(['activity', 'addInfo']),
    editInfo: state.getIn(['activity', 'editInfo'])
  }),
  action
)
@Form.create({
  onFieldsChange (props, changedFields) {
    const changeFields = props.isEdit ? props.changeEditInfoFields : props.changeAddInfoFields
    changeFields(changedFields)
  },
  mapPropsToFields (props) {
    return {
      ...props.fields
    }
  }
})
export default class ActivityInfo extends Component {
  static propTypes = {
    router: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,
    optAddInfo: PropTypes.func.isRequired,
    optEditInfo: PropTypes.func.isRequired,
    getInfo: PropTypes.func.isRequired,
    addInfo: PropTypes.object.isRequired,
    editInfo: PropTypes.object.isRequired,
    isEdit: PropTypes.bool.isRequired,
    location: PropTypes.object.isRequired
  }
  componentWillMount () {
    this.props.isEdit && this.props.getInfo({
      id: this.props.location.query.id
    })
  }
  jumpToNext = (id) => {
    const { router } = this.props
    router.push({
      pathname: location.pathname.replace('/missile', ''),
      query: {
        step: 2,
        id
      }
    })
  }
  handleSave = e => {
    const { form, optAddInfo, optEditInfo, isEdit, router } = this.props
    form.validateFields((err, values) => {
      if (!err) {
        const dataSource = {
          id: isEdit ? parseInt(this.props.location.query.id) : -1,
          createdBy: values.createdBy,
          activityTheme: values.theme,
          beginTime: values.time[0].format('YYYY-MM-DD'),
          endTime: values.time[1].format('YYYY-MM-DD'),
          isAlways: values.isAlways ? 1 : 0,
          bizName: values.bizName,
          auditTime: values.auditTime && values.auditTime.format('YYYY-MM-DD'),
          isAudit: values.isAudit ? 1 : 0,
          activityType: values.type,
          costCenter: values.costCenter.map(item => item.value || item).toString(),
          costBudget: values.costBudget,
          activityBackground: values.background,
          activityGoal: values.goal,
          relatedActivity: values.related && values.related.toString(),
          status: 1
        }
        isEdit
        ? optEditInfo(dataSource)
          .then(() => {
            message.success(`编辑成功！`, 1, () => {
              router.push('/marketing/list')
            })
          })
        : optAddInfo(dataSource)
          .then((result) => {
            message.success(`新增成功！`, 1, () => {
              this.jumpToNext(result.value.id)
            })
          })
      }
    })
  }
  handleExit = e => {
    const { router } = this.props
    router.push({
      pathname: '/marketing/list'
    })
  }
  convertCostCenter = (data) => {
    return data && data.map(item => {
      let value
      try {
        value = item.get('all')
      } catch (e) {
        const values = item.split('_')
        value = JSON.stringify({
          costCenter1: values[0],
          costCenter2: values[1]
        })
      }
      return value
    }).toJS()
  }
  renderBaseInfo = () => {
    const { form, addInfo, editInfo, isEdit } = this.props
    const { getFieldDecorator } = form
    const info = isEdit ? editInfo : addInfo
    const fields = info.get('fields')
    const isAlways = fields.getIn(['isAlways', 'value'])
    const isAudit = fields.getIn(['isAudit', 'value'])
    const bizName = fields.getIn(['bizName', 'value'])
    const auditData = info.getIn(['data', 'auditTime'])

    return (
      <div>
        <h2>基础信息</h2>
        <p>活动的基础信息</p>
        <Row className='l-mtb-10 u-input-wrapper'>
          <Col span='12'>
            {
              getFieldDecorator('createdBy', {
                initialValue: info.get('createdBy') || userInfo.nickname
              })(<Input className='f-hidden' />)
            }
            <Item {...halfItemLayout} hasFeedback label='活动主题'>
              {
                getFieldDecorator('theme', {
                  rules: [{ required: true, message: '请填写活动主题' }],
                  initialValue: isEdit ? info.getIn(['data', 'activityTheme']) : ''
                })(<Input maxLength='32' placeholder='最大长度 32 字符' />)
              }
            </Item>
            <Item {...checkboxLayout} label='活动时间'>
              <Col span='17'>
                <Item hasFeedback>
                  {
                    getFieldDecorator('time', {
                      rules: [{ required: !isAlways, message: '请填写活动时间' }],
                      initialValue: isEdit
                      ? [
                        moment(info.getIn(['data', 'beginTime'])),
                        moment(info.getIn(['data', 'endTime']))
                      ]
                      : [moment(), moment().add(1, 'week')]
                    })(
                      <RangePicker
                        allowClear={false}
                        disabled={isAlways}
                        style={{width: '100%'}} />)
                  }
                </Item>
              </Col>
              <Col offset='1' span='6'>
                <Item>
                  {
                    getFieldDecorator('isAlways', {
                      initialValue: isEdit ? info.getIn(['data', 'isAlways']) : false
                    })(<Checkbox>永久</Checkbox>)
                  }
                </Item>
              </Col>
            </Item>
          </Col>
          <Col span='12'>
            <Item {...halfItemLayout} hasFeedback label='所属业务线'>
              {
                getFieldDecorator('bizName', {
                  rules: [{ required: true, message: '请选择所属业务线' }],
                  initialValue: isEdit ? bizName : []
                })(
                  <InfoList
                    type='biz'
                    valueKey='bizName'
                    selectProps={{
                      value: bizName,
                      mode: 'single',
                      size: 'default',
                      dropdownMatchSelectWidth: false
                    }} />
                )
              }
            </Item>
            <Item {...checkboxLayout} label='评审时间'>
              <Col span='17'>
                <Item hasFeedback>
                  {
                    getFieldDecorator('auditTime', {
                      rules: [{ required: isAudit, message: '请填写评审时间' }],
                      initialValue: isEdit
                      ? auditData ? moment(auditData) : moment()
                      : moment()
                    })(
                      <DatePicker
                        allowClear={false}
                        disabled={isAudit === false}
                        style={{width: '100%'}} />)
                  }
                </Item>
              </Col>
              <Col offset='1' span='6'>
                <Item>
                  {
                    getFieldDecorator('isAudit', {
                      initialValue: isEdit ? info.getIn(['data', 'isAudit']) : true
                    })(<Checkbox defaultChecked>评审</Checkbox>)
                  }
                </Item>
              </Col>
            </Item>
          </Col>
        </Row>
      </div>
    )
  }
  renderMoreInfo = () => {
    const { form, addInfo, editInfo, isEdit } = this.props
    const { getFieldDecorator } = form
    const info = isEdit ? editInfo : addInfo
    const fields = info.get('fields')
    const costCenter = fields.getIn(['costCenter', 'value'])
    const related = fields.getIn(['related', 'value'])
    return (
      <div>
        <h2>更多信息</h2>
        <p>活动的详细信息</p>
        <div className='l-mtb-10 u-input-wrapper'>
          <Row className='l-mtb-20'>
            <Col span='12'>
              <Item {...halfItemLayout} label='活动性质'>
                {
                  getFieldDecorator('type', {
                    rules: [{ required: true, message: '请填写活动性质' }],
                    initialValue: isEdit ? info.getIn(['data', 'activityType']) : 1
                  })(
                    <Radio.Group>
                      <Radio value={1}>正式</Radio>
                      <Radio value={2}>测试</Radio>
                    </Radio.Group>
                  )
                }
              </Item>
            </Col>
          </Row>
          <Row className='l-mtb-20'>
            <Col span='12'>
              <Item {...halfItemLayout} label='费用部门'>
                {
                  getFieldDecorator('costCenter', {
                    rules: [{ required: true, message: '请填写费用部门' }],
                    initialValue: isEdit ? costCenter && costCenter.toJS() : [],
                    getValueFromEvent: (value) => {
                      const newValue = value.map((item) => {
                        const obj = JSON.parse(item)
                        return {
                          value: obj.costCenter1 + '_' + obj.costCenter2,
                          all: item
                        }
                      })
                      return newValue
                    }
                  })(
                    <InfoList
                      type='costCenter'
                      valueType='object'
                      formatter={item => `
                        ${item.get('costCenter1')}_
                        ${item.get('costCenter2')}
                      `}
                      jsonKeys={['costCenter1', 'costCenter2']}
                      selectProps={{
                        value: this.convertCostCenter(costCenter),
                        dropdownMatchSelectWidth: false
                      }}
                    />
                  )
                }
              </Item>
            </Col>
            <Col span='12'>
              <Item {...halfItemLayout} label='活动预算'>
                {
                  getFieldDecorator('costBudget', {
                    rules: [{ required: true, message: '请填写活动预算' }],
                    initialValue: isEdit ? info.getIn(['data', 'costBudget']) : 0
                  })(<InputNumber min={0} placeholder='≥ 0' />)
                }
              </Item>
            </Col>
          </Row>
          <Item {...formItemLayout} label='活动背景'>
            {
              getFieldDecorator('background', {
                initialValue: isEdit ? info.getIn(['data', 'activityBackground']) : ''
              })(<Input />)
            }
          </Item>
          <Item {...formItemLayout} label='活动目的'>
            {
              getFieldDecorator('goal', {
                initialValue: isEdit ? info.getIn(['data', 'activityGoal']) : ''
              })(<Input />)
            }
          </Item>
          <Item {...formItemLayout} label='关联活动'>
            {
              getFieldDecorator('related', {
                initialValue: isEdit ? related && related.toJS() : []
              })(
                <InfoList
                  type='activity'
                  valueKey='activityTheme'
                  selectProps={{
                    value: related && related.toJS(),
                    dropdownMatchSelectWidth: false
                  }}
                />
              )
            }
          </Item>
        </div>
      </div>
    )
  }
  render () {
    const { addInfo, editInfo, isEdit } = this.props
    const info = isEdit ? editInfo : addInfo
    return (
      <Spin spinning={info.get('fetching')}>
        <Form>
          {
            this.renderBaseInfo()
          }
          {
            this.renderMoreInfo()
          }
          <div className='f-clearfix'>
            <span className='f-fl'>
              <Popconfirm
                title={'是否退出，退出将丢失当前内容！'}
                onConfirm={this.handleExit}>
                <Button size='large' type='danger'>退出{isEdit ? '编辑' : '新建'}</Button>
              </Popconfirm>
            </span>
            <span className='f-fr'>
              <Button size='large' type='primary' onClick={this.handleSave} loading={info.get('loading')}>
                { isEdit ? '保存修改' : '保存并下一步' }
              </Button>
            </span>
          </div>
        </Form>
      </Spin>
    )
  }
}
