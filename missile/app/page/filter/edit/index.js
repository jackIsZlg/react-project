/*
 * Author: linglan
 * Date: 2017-11-07 18:33:56
 * Email: linglan@wacai.com
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Tabs } from 'antd'
import { Toolbar } from '@wac/papaya-ui'
import Sql from '../add/component/update-sql'
import FileUpload from '../add/component/update-upload'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getItem, getUploadItem } from '../action'

const TabPane = Tabs.TabPane

@connect(
  state => ({}),
  dispatch => ({
    getItem: bindActionCreators(getItem, dispatch),
    getUploadItem: bindActionCreators(getUploadItem, dispatch)
  })
)

export default class FilterEdit extends Component {
  static propTypes = {
    getItem: PropTypes.func,
    getUploadItem: PropTypes.func,
    location: PropTypes.object
  }
  componentWillMount () {
    const { location } = this.props
    const createType = location.query.createType
    const creationMethod = (createType === 'SQL创建') ? 'SQL' : 'UPLOAD'
    // 不同创建方式，请求数据接口不同
    if (creationMethod === 'SQL') {
      this.props.getItem({
        id: this.props.location.query.id
      })
    }
    if (creationMethod === 'UPLOAD') {
      this.props.getUploadItem({
        id: this.props.location.query.id
      })
    }
  }
  render () {
    const createType = this.props.location.query.createType
    let creationMethod = 'SQL'
    if (createType !== 'SQL创建') {
      creationMethod = 'UPLOAD'
    }
    return (
      <div className='m-second-page'>
        <Toolbar crumbs={['用户筛选', '修改筛选画像']} />
        <div className='m-content'>
          <div className='s-content'>
            {
              creationMethod === 'SQL'
              ? <Tabs
                defaultActiveKey={creationMethod}>
                <TabPane tab='SQL' key='SQL'>
                  <Sql {...this.props} />
                </TabPane>
                <TabPane tab='文件上传' key='UPLOAD' disabled>
                文件上传
                </TabPane>
              </Tabs>
            : <Tabs
              defaultActiveKey={creationMethod}>
              <TabPane tab='SQL' key='SQL' disabled>
              SQL语句
              </TabPane>
              <TabPane tab='文件上传' key='UPLOAD'>
                <FileUpload {...this.props} />
              </TabPane>
            </Tabs>
          }
          </div>
        </div>
      </div>
    )
  }
}
