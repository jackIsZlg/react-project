import React from 'react'
import { Row, Col } from 'antd'
import NavInside from '../../../common/nav-inside'
import { Toolbar } from '@wac/papaya-ui'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { query } from './add'

import EditableTable from './component/add-list'
@connect(
  state => ({ list: state.getIn(['add', 'list']) }),
  dispatch => ({
    query: bindActionCreators(query, dispatch)
  })
)
export default class AddPage extends React.Component {
  static propTypes = {
    query: PropTypes.func.isRequired,
    list: PropTypes.object.isRequired
  }

  componentWillMount () {
    const url = decodeURIComponent(window.location.search)
    const menu = url.substring(6)
    this.props.query({menu: menu})
  }
  render () {
    const { list } = this.props
    const { dataSource } = list.toJS()
    const replaceStrArry = 'value'
    const url = decodeURIComponent(window.location.search)
    // 所属菜单
    var menu = url.substring(6)

    return (
      <div className='m-content backend-common'>
        <Row>
          <Col span={3}>
            <NavInside msg={[{'name': '画像指标集管理', 'url': '/backend/filter/quota'}, {'name': '动态比较值管理', 'url': '/backend/filter/compare'}, {'name': '输出系统管理', 'url': '/backend/filter/system'}]} select={2} />
          </Col>
          <Col span={21}>
            <Toolbar crumbs={['后台管理', '用户筛选管理', '动态比较值管理']} />
            <div className='s-content compare-add'>
              <div>
                <div className='u-form-title'>
                  <h2>基础信息</h2>
                  <p>筛选指标集的基础信息，以及指标集的数据源</p>
                </div>
                <div className='base-message'>
                  <Row>
                    <Col span={4} className='text-style'>所属菜单：</Col>
                    <Col span={20}>{ menu }</Col>
                  </Row>
                  <Row className='base-message-p'>
                    <Col span={4} className='text-style'>替代符：</Col>
                    <Col span={20}>{ replaceStrArry }</Col>
                  </Row>
                </div>
              </div>
              <div className='filter-content'>
                <div className='u-form-title'>
                  <h2>筛选指标</h2>
                  <p>设置筛选画像可以使用的筛选指标</p>
                </div>
                <div className='filter-list'>
                  <EditableTable dataSource={dataSource} menu={menu} replaceStrArry={replaceStrArry} />
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    )
  }
}
