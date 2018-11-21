import React from 'react'
import { Row, Col } from 'antd'
import NavInside from '../../common/nav-inside'
import { Toolbar } from '@wac/papaya-ui'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Search from './component/compare-search'
import List from './component/compare-list'
import Detail from './component/compare-detail'

import { query } from './compare'

@connect(
  state => ({cost: state.cost, user: state.user}),
  dispatch => ({
    query: bindActionCreators(query, dispatch)
  })
)
export default class ComparePage extends React.Component {
  static propTypes = {
    query: PropTypes.func.isRequired,
    children: PropTypes.object
  }
  componentDidMount () {
    this.props.query()
  }

  render () {
    return (
      this.props.children || (
      <div className='m-content backend-common'>
        <Row>
          <Col span={3}>
            <NavInside msg={[{'name': '画像指标集管理', 'url': '/backend/filter/quota'}, {'name': '动态比较值管理', 'url': '/backend/filter/compare'}, {'name': '输出系统管理', 'url': '/backend/filter/system'}]} select={2} />
          </Col>
          <Col span={21}>
            <Toolbar crumbs={['后台管理', '用户筛选管理', '动态比较值管理']} />
            <div className='s-content search-style'>
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
