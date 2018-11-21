import React from 'react'
import { Row, Col } from 'antd'
import NavInside from '../../common/nav-inside'
import { Toolbar } from '@wac/papaya-ui'

import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Search from './component/quota-search'
import List from './component/quota-list'
import Detail from './component/quota-detail'

import { query, queryBusiness } from './quota'

@connect(
  state => ({cost: state.cost, user: state.user}),
  dispatch => ({
    query: bindActionCreators(query, dispatch),
    queryBusiness: bindActionCreators(queryBusiness, dispatch)
  })
)
export default class SystemPage extends React.Component {
  static propTypes = {
    query: PropTypes.func.isRequired,
    queryBusiness: PropTypes.func.isRequired,
    children: PropTypes.object
  }
  componentDidMount () {
    this.props.query()
    this.props.queryBusiness()
  }

  render () {
    return (
      this.props.children || (
      <div className='m-content backend-common'>
        <Row>
          <Col span={3}>
            <NavInside msg={[{'name': '画像指标集管理', 'url': '/backend/filter/quota'}, {'name': '动态比较值管理', 'url': '/backend/filter/compare'}, {'name': '输出系统管理', 'url': '/backend/filter/system'}]} select={1} />
          </Col>
          <Col span={21}>
            <Toolbar crumbs={['后台管理', '用户筛选管理', '画像指标集管理']} />
            <div className='s-content quota-table search-style'>
              <Search />
              <List />
              <Detail />
            </div>
          </Col>
        </Row>
      </div>
    ))
  }
}
