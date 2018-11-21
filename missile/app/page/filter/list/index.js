/*
 * Author: linglan
 * Date: 2017-11-06 15:35:18
 * Email: linglan@wacai.com
 */

import '../index.less'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Toolbar } from '@wac/papaya-ui'
import Search from './component/filter-search'
import List from './component/filter-list'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getList } from '../action'

@connect(
  state => ({}),
  dispatch => ({
    getList: bindActionCreators(getList, dispatch)
  })
)
export default class Filter extends Component {
  static propTypes = {
    getList: PropTypes.func.isRequired
  }
  componentDidMount () {
    this.props.getList()
  }
  render () {
    return (
      <div className='m-second-page'>
        <Toolbar crumbs={['用户筛选', '筛选画像列表']} />
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
