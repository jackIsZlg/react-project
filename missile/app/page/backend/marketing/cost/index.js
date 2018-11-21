import React from 'react'
import { Row, Col } from 'antd'
import NavInside from '../../common/nav-inside'
import { Toolbar } from '@wac/papaya-ui'

import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Search from './component/cost-search'
import List from './component/cost-list'
import Detail from './component/cost-detail'

import { query } from './cost'

@connect(
  state => ({cost: state.cost, user: state.user}),
  dispatch => ({
    query: bindActionCreators(query, dispatch)
  })
)
export default class CostPage extends React.Component {
  static propTypes = {
    query: PropTypes.func.isRequired
  }

  componentDidMount () {
    this.props.query()
  }

  render () {
    return (
      <div className='m-content backend-common cost'>
        <Row>
          <Col span={3}>
            <NavInside msg={[{'name': '附加字段管理', 'url': '/backend/marketing/info'}, {'name': '费用部门管理', 'url': '/backend/marketing/cost'}]} select={2} />
          </Col>
          <Col span={21}>
            <Toolbar crumbs={['后台管理', '营销活动管理', '费用部门管理']} />
            <div className='s-content search-style'>
              <Search />
              <List />
              <Detail />
            </div>
          </Col>
        </Row>
      </div>
    )
  }
}
