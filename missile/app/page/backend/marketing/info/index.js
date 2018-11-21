import React from 'react'
import { Row, Col } from 'antd'
import NavInside from '../../common/nav-inside'
import { Toolbar } from '@wac/papaya-ui'

import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Search from './component/info-search'
import List from './component/info-list'
import Detail from './component/info-detail'

import { query, queryBusiness } from './info'

@connect(
  state => ({info: state.info, user: state.user}),
  dispatch => ({
    query: bindActionCreators(query, dispatch),
    queryBusiness: bindActionCreators(queryBusiness, dispatch)
  })
)
export default class InfoPage extends React.Component {
  static propTypes = {
    query: PropTypes.func.isRequired,
    queryBusiness: PropTypes.func.isRequired
  }

  componentDidMount () {
    this.props.query()
    this.props.queryBusiness()
  }

  render () {
    return (
      <div className='m-content backend-common'>
        <Row>
          <Col span={3}>
            <NavInside msg={[{'name': '附加字段管理', 'url': '/backend/marketing/info'}, {'name': '费用部门管理', 'url': '/backend/marketing/cost'}]} select={1} />
          </Col>
          <Col span={21}>
            <Toolbar crumbs={['后台管理', '营销活动管理', '附加字段管理']} />
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
