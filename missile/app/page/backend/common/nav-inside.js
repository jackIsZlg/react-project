/**
 * 后台管理模块 三级导航栏组件
 */

import React, {
  Component
} from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'

const propTypes = {
  msg: PropTypes.array,
  select: PropTypes.number
}

class NavInside extends Component {
  static propTypes = propTypes

  render () {
    const { msg, select } = this.props
    var nav = msg.map((item, index) => {
      if (select === index + 1) {
        return (
          <div className='nav-inside-name nav-inside-chosed' key={index}>
            <Link to={item.url}>{item.name}</Link>
          </div>
        )
      } else {
        return (
          <div className='nav-inside-name' key={index}>
            <Link to={item.url}>{item.name}</Link>
          </div>
        )
      }
    })
    return (
      <div className='nav-inside'>
        {nav}
      </div>
    )
  }
}

export default NavInside
