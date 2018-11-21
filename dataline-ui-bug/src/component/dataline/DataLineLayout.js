/**
 * Created by gewangjie on 2018/3/7
 */
import React, { Component } from "react";
import { connect } from 'react-redux'
import { editUserInfo } from '../../redux/action';
//Route
import { Switch, Link } from 'react-router-dom';
import { AuthRoute } from "../../base/auth";
import dataLineRouter from "../../router/dataline";

// Ant Design 组件
import { Layout, Menu, Row } from 'antd';

// Component
import NavUser from '../NavUser'
import request from '../../base/request'
import '../../style/dataline/index.less'
import logo from '../../image/newlogo.png'
import message from '../../base/message'
const { Header, Content } = Layout;

class DataLine extends Component {
  state = {
    compareCount: 0,
    routers: dataLineRouter
  }

  componentDidMount() {
    this.changeCompareCount()
    message.sub('compare', async () => {
      const count = await request.get('/api/account/compare-count')
      this.refs.compareCount.innerHTML = count
    })
  }
  componentWillReceiveProps() {
    console.log(123)
  }
  async changeCompareCount() {
    const count = await request.get('/api/account/compare-count')
    this.setState({
      compareCount: count
    })
  }
  render() {
    return (
      <Layout>
        <Header className="header">
          <div className="logo">
            <Link to='/dataline'>
              <img alt='logo' src={logo} style={{ width: ' 155px', height: '27px' }} />
            </Link>
          </div>
          <Menu

            mode="horizontal"
            selectedKeys={[window.location.pathname.replace('/page', '')]}
            style={{ height: '100%', borderRight: 0, backgroundColor: '#fff', color: '#000' }}
          >
            <Menu.Item key="/dataline/shopwatch">
              <Link to="/dataline/shopwatch">监控店铺</Link>
            </Menu.Item>
            <Menu.Item key="/dataline/dataexpress">
              <Link to="/dataline/dataexpress">上新日报</Link>
            </Menu.Item>
            <Menu.Item key="/dataline/recommend">
              <Link to="/dataline/recommend">爆款排行</Link>
            </Menu.Item>
            <Menu.Item key="/dataline/storedata">
              <Link to="/dataline/storedata">店铺排行</Link>
            </Menu.Item>
          </Menu>
          <div className='info-wrap'>
            <Row id='title' style={{ color: '#333', fontSize: '18px', paddingLeft: '24px' }}>
            </Row>
            <div style={{ display: 'flex' }}>
              <div className="diff-wrap">
                <Link
                  className={`menu-compare ${/\/dataline\/compare/.test(window.location.href) ? "active " : ''}`}
                  to={'/dataline/compare/goods'}>对比清单（<span ref="compareCount">{this.state.compareCount}</span>）
                </Link>
              </div>
              <div className="concat-wrap contact">联系我们
              <div className='login-list-content'>
                  {/* <div className="login-list-hot-line line">
                  <div className="hot-line-header">咨询热线</div>
                  <div className="hot-line-text"><span>400-853-9999</span>咨询高峰期请耐心等待</div>
                </div> */}
                  <div className="login-list-hot-line">
                    <div className="hot-line-header">微信客服咨询</div>
                    <div className="hot-line-text">请使用微信扫一扫，扫码即可人工咨询服务</div>
                    <div className="login-footer-code"></div>
                  </div>
                </div>
              </div>
              <NavUser history={this.props.history} />
            </div>
          </div>
        </Header>
        <Layout>
          <Layout>
            <Content style={{ background: '#fff', padding: '80px 35px 0', margin: 0 }}>
              <Switch>
                {this.state.routers.map((route, index) => (
                  <AuthRoute key={index}
                    path={`${route.path}`}
                    exact={route.exact}
                    component={route.main} />
                ))}
              </Switch>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    )
  }
}

const mapStateToProps = state => {
  return {
    userInfo: state.userInfo
  }
};
const mapDispatchToProps = dispatch => {
  return {
    editUserInfo: info => {
      dispatch(editUserInfo(info))
    }
  }
};

DataLine = connect(
  mapStateToProps,
  mapDispatchToProps
)(DataLine);

export default DataLine