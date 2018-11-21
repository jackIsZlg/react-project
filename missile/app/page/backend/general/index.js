import React from 'react'
import { Row, Col } from 'antd'
import '../index.less'
import NavInside from '../common/nav-inside'
import { Toolbar } from '@wac/papaya-ui'
import List from './component/business-list'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import axios from 'common/axios'
// import { query } from './business'
import PropTypes from 'prop-types'
import Detail from './component/business-detail'
const QUERY = 'missile/business/QUERY'
const query = params => (dispatch, getState) => {
  let newParams = getState().getIn(['business', 'list', 'params']).merge(params).toJS()
  dispatch({
    type: QUERY,
    payload: {
      promise: axios.get('backend/business/businessQuery', { params: newParams }),
      data: { params }
    }
  })
}
@connect(
  state => ({business: state.business, user: state.user}),
  dispatch => ({
    query: bindActionCreators(query, dispatch)
  })
)

export default class GeneralPage extends React.Component {
  static propTypes = {
    query: PropTypes.func.isRequired
  }

  componentDidMount () {
    this.props.query()
  }
  render () {
    return (
      <div className='m-content backend-common'>
        <Row>
          <Col span={3}>
            <NavInside msg={[{'name': '业务线管理', 'url': '/backend/general'}]} select={1} />
          </Col>
          <Col span={21}>
            <Toolbar crumbs={['后台管理', '通用', '业务线管理']} />
            <div className='s-content search-style'>
              <List />
              <Detail />
            </div>
          </Col>
        </Row>
      </div>
    )
  }
}
