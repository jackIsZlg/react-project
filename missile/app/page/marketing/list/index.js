/*
 * Author: linglan
 * Date: 2017-11-10 19:14:59
 * Email: linglan@wacai.com
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Toolbar } from '@wac/papaya-ui'
import Search from './component/activity-search'
import List from './component/activity-list'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getList } from '../action'

@connect(
  state => ({}),
  dispatch => ({
    getList: bindActionCreators(getList, dispatch)
  })
)
export default class Activity extends Component {
  static propTypes = {
    getList: PropTypes.func.isRequired
  }
  componentDidMount () {
    this.props.getList()
  }
  render () {
    return (
      <div className='m-second-page'>
        <Toolbar crumbs={['营销活动', '营销活动列表']} />
        <div className='m-content'>
          <div className='s-content'>
            <Search />
            <List />
          </div>
        </div>
      </div>
    )
  }
}
