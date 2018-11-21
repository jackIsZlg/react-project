import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Form, Row, Col, Input, Button, Select } from 'antd'
import _ from 'lodash'
import { query } from '../info'
const Option = Select.Option
@connect(
  state => ({ list: state.getIn(['info', 'list']), modal: state.getIn(['info', 'modal']) }),
  dispatch => ({
    query: bindActionCreators(query, dispatch)
  })
)
@Form.create({
  mapPropsToFields ({ list }) {
    const params = list.get('params').toJS()

    // 转为antd 需要格式
    const fields = _.mapValues(params, value => ({ value }))

    return fields
  }
})
export default class infoSearch extends React.Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    query: PropTypes.func.isRequired,
    list: PropTypes.object.isRequired,
    modal: PropTypes.object.isRequired
  }

  componentDidMount () {
    const { form, list } = this.props
    const defaultParams = list.get('defaultParams').toJS()
    form.setFieldsInitialValue(defaultParams)
  }

  render () {
    const { form, modal } = this.props
    const { getFieldDecorator } = form
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 }
    }
    // 获取select下拉选择器businessData数据
    const businessDataSource = modal.get('businessDataSource') || []
    const businessData = []
    businessDataSource.forEach((value, index, array) => {
      const bizName = value.getIn(['bizName'])
      const id = value.getIn(['id'])
      businessData.push(<Option key={id} value={bizName}>{bizName}</Option>)
    })
    return (
      <Form onSubmit={this.onSubmit}>
        <div className='search'>
          <Row gutter={8}>
            <Col span={6}>
              <Form.Item label='标签名称' {...formItemLayout}>
                {getFieldDecorator('keyword')(<Input />)}
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item {...formItemLayout} label='业务线'>
                {getFieldDecorator('bizName')(
                  <Select showSearch>
                    {businessData}
                  </Select>
                  )}
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label='状态' {...formItemLayout}>
                {getFieldDecorator('status')(
                  <Select size='large'>
                    <Option value='-1'>全部</Option>
                    <Option value='1'>已启用</Option>
                    <Option value='0'>禁用</Option>
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item wrapperCol={{ offset: 2 }}>
                <Button
                  htmlType='submit'
                  size='large'
                  >
                  搜索
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </div>
      </Form>

    )
  }

  // 提交查询
  onSubmit = e => {
    e.preventDefault()
    const { form, query } = this.props
    form.validateFields((errors, params) => {
      if (!errors) {
        query(params)
      }
    })
  }
}
