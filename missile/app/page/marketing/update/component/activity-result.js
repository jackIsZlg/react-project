/*
 * Author: linglan
 * Date: 2017-11-14 15:33:27
 * Email: linglan@wacai.com
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Icon, Button } from 'antd'

export default class ActivityResult extends Component {
  static propTypes = {
    router: PropTypes.object.isRequired
  }
  handleJump = () => {
    this.props.router.push('/marketing/list')
  }
  render () {
    return (
      <div>
        <div className='m-content'>
          <div className='result'>
            <Icon type='check-circle' />
            <h2>提交成功</h2>
            <p>项目已经创建成功！等待 Campaign 评审，评审通过后点击启用</p>
            <div className='f-clearfix'>
              <span className='f-fr'>
                <Button size='large' type='primary' onClick={this.handleJump}>
                  返回列表
                </Button>
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
