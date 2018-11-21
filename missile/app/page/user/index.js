import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { Toolbar } from 'component'

import Search from './component/user-search'
import List from './component/user-list'
import Detail from './component/user-detail'
import axios from 'common/axios'
const QUERY = 'papaya/user/QUERY'

const query = params => (dispatch, getState) => {
  let newParams = Object.assign(
    getState()
      .user.getIn(['list', 'params'])
      .toJS(),
    params
  )

  dispatch({
    type: QUERY,
    payload: {
      promise: axios.get('/user/query', { params: newParams }),
      data: { params }
    }
  })
}
@connect(
  state => ({}),
  dispatch => ({
    query: bindActionCreators(query, dispatch)
  })
)
export default class UserPage extends React.Component {
  static propTypes = {
    query: PropTypes.func.isRequired
  }

  componentDidMount () {
    this.props.query()
  }

  render () {
    return (
      <div>
        <Toolbar crumbs={['示例系统', '用户管理（redux 模式）']} />

        <div className='m-content'>
          <Search />
          <List />
          <Detail />
        </div>
      </div>
    )
  }
}
