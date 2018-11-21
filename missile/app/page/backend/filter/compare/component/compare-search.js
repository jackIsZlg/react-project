import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Form, Row, Col, Input, Button } from 'antd'
import _ from 'lodash'
import { query } from '../compare'

@connect(
  state => ({ list: state.getIn(['compare', 'list']) }),
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
export default class CompareSearch extends React.Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    query: PropTypes.func.isRequired,
    list: PropTypes.object.isRequired
  }

  componentDidMount () {
    const { form, list } = this.props
    const defaultParams = list.get('defaultParams').toJS()

    form.setFieldsInitialValue(defaultParams)
  }

  render () {
    const { form } = this.props
    const { getFieldDecorator } = form
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 }
    }

    return (
      <Form onSubmit={this.onSubmit}>
        <Row gutter={8}>
          <Col span={12}>
            <Form.Item label='关键词' {...formItemLayout}>
              {getFieldDecorator('keyword')(<Input />)}
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item wrapperCol={{ offset: 2 }}>
              <Button
                size='large'
                htmlType='submit'
                >
                搜索
              </Button>
            </Form.Item>
          </Col>
        </Row>
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
