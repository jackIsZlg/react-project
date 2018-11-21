/*
 * Author: linglan
 * Date: 2017-11-07 15:53:24
 * Email: linglan@wacai.com
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Tabs, Icon, Table } from 'antd'
import { Toolbar } from '@wac/papaya-ui'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getItem, getUploadItem } from '../action'

const TabPane = Tabs.TabPane

@connect(
  state => ({ detail: state.getIn(['filter', 'detail']) }),
  dispatch => ({
    getItem: bindActionCreators(getItem, dispatch),
    getUploadItem: bindActionCreators(getUploadItem, dispatch)
  })
)

export default class FilterAdd extends Component {
  static propTypes = {
    getItem: PropTypes.func.isRequired,
    detail: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    getUploadItem: PropTypes.func.isRequired
  }
  componentWillMount () {
    const { getItem, getUploadItem, location } = this.props
    const id = location.query.id
    const creationMethod = (location.query.createType === 'SQL创建') ? 'SQL' : 'UPLOAD'
    // 不同创建方式，请求数据接口不同
    if (creationMethod === 'SQL') getItem({ id: id })
    if (creationMethod === 'UPLOAD') getUploadItem({ id: id })
  }

  render () {
    const { location, detail } = this.props
    const data = this.props.detail.get('data')
    const { loading } = detail.toJS()
    const creationMethod = (location.query.createType === 'SQL创建') ? 'SQL' : 'UPLOAD'
    const rowId = data.toJS().title ? data.toJS().title[0].dataIndex : undefined
    return (
      <div className='m-second-page'>
        <Toolbar crumbs={['用户筛选', '筛选画像列表']} />
        <div className='m-content'>
          <div className='s-content'>
            <div className='m-filter-header'>
              <Icon type='picture' />
              <h2>{data.get('profileName')}</h2>
              <p>
                {`${data.get('createdBy')}
                  ${data.get('profileType')}
                  更新时间：
                  ${moment(data.get('updatedTime')).format('YYYY-MM-DD HH:mm')}
                `}
              </p>
            </div>
            <Tabs
              defaultActiveKey={creationMethod}>
              {
                creationMethod === 'SQL'
                ? <TabPane tab='SQL' key='SQL'>
                  <header className='u-form-title'>
                    <h2>SQL</h2>
                    <p>用于筛选用户的 SQL</p>
                  </header>
                  <div className='l-mtb-10 u-input-wrapper'>
                    {data.get('userConditionSql')}
                  </div>
                </TabPane>
                : <TabPane tab='文件上传' key='UPLOAD'>
                  <header className='u-form-title'>
                    <h2>文件上传</h2>
                    <p>通过上传文件构成画像</p>
                  </header>
                  <div className='l-mtb-10'>
                    {
                      rowId
                      ? <Table
                        rowKey={rowId}
                        loading={loading}
                        columns={data.toJS().title}
                        dataSource={data.toJS().result}
                        pagination={false}
                      />
                      : null
                    }
                  </div>
                </TabPane>
              }
            </Tabs>
          </div>
        </div>
      </div>
    )
  }
}
