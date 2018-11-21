/*
 * Author: linglan
 * Date: 2017-11-06 10:23:43
 * Email: linglan@wacai.com
 */

import React, { Component } from 'react'
import { Tabs } from 'antd'
import { Toolbar } from '@wac/papaya-ui'
import Sql from './component/update-sql'
import FileUpload from './component/update-upload'
const TabPane = Tabs.TabPane

export default class FilterAdd extends Component {
  render () {
    return (
      <div className='m-second-page'>
        <Toolbar crumbs={['用户筛选', '新建筛选画像']} />
        <div className='m-content'>
          <div className='s-content'>
            <Tabs
              defaultActiveKey='SQL'>
              <TabPane tab='SQL' key='SQL'>
                <Sql {...this.props} />
              </TabPane>
              <TabPane tab='文件上传' key='UPLOAD'>
                <FileUpload {...this.props} />
              </TabPane>
            </Tabs>
          </div>
        </div>
      </div>
    )
  }
}
