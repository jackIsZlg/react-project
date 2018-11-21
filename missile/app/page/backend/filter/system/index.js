import React from 'react'
import { Row, Col } from 'antd'
import NavInside from '../../common/nav-inside'
import { Toolbar } from '@wac/papaya-ui'

import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Search from './component/system-search'
import List from './component/system-list'
import Detail from './component/system-detail'

import { query } from './system'

@connect(
  state => ({cost: state.cost, user: state.user}),
  dispatch => ({
    query: bindActionCreators(query, dispatch)
  })
)
export default class SystemPage extends React.Component {
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
            <NavInside msg={[{'name': '画像指标集管理', 'url': '/backend/filter/quota'}, {'name': '动态比较值管理', 'url': '/backend/filter/compare'}, {'name': '输出系统管理', 'url': '/backend/filter/system'}]} select={3} />
          </Col>
          <Col span={21}>
            <Toolbar crumbs={['后台管理', '用户筛选管理', '输出系统管理']} />
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
