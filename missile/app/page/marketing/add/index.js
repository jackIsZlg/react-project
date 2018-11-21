/*
 * Author: linglan
 * Date: 2017-11-14 15:17:23
 * Email: linglan@wacai.com
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Step from '../update/component/activity-step'

export default class ActivityAdd extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired
  }
  render () {
    const query = this.props.location.query
    const step = query.step ? parseInt(query.step) : 1
    return (
      <div>
        <div className='m-content'>
          <Step step={step} {...this.props} />
        </div>
      </div>
    )
  }
}
