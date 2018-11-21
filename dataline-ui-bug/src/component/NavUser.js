/**
 * Created by gewangjie on 2018/3/6
 */
import React, { Component } from 'react'
import {
  Avatar,
  Button,
  Popover
} from 'antd'
import request from '../base/request'

const logout = () => {
  Promise.all([
    request.basic('auth/sso-logout'),
    request.basic(request.ssoUrl + 'logout')
  ]).then(() => {
    localStorage.clear()
    window.location.href = '/page'
  })
}
class NavUser extends Component {
  constructor(props) {
    super(props)
    this.state = {
      avatar: localStorage.avatar ? JSON.parse(localStorage.avatar) : '',
      name: localStorage.name ? JSON.parse(localStorage.name) : '',
      id: localStorage.id ? JSON.parse(localStorage.id) : 0,
      serviceList: localStorage.serviceList ? JSON.parse(localStorage.serviceList) : []
    }
    this.dataline = {}
    // this.hotsale = {}
  }
  async componentWillMount() {
    const account = await request.get('/api/account/info')
    if (account.logoUrl) {
      this.setState({
        avatar: account.logoUrl,
        name: account.shopName
      })
    }
  }
  componentDidMount() {
    let { serviceList } = this.state
    let serviceListItem
    let dataline = []
    let timeOrderfun = (property) => {
      return (a, b) => {
        let v1 = a[property],
          v2 = b[property]
        return v2 - v1
      }
    }
    if (serviceList && !!serviceList.length) {
      for (let i = 0; i < serviceList.length; i++) {
        serviceListItem = serviceList[i]
        serviceListItem.endTime = new Date(serviceListItem.serviceEndTime).getTime()
        serviceListItem.serviceEndTime = serviceListItem.serviceEndTime.split(' ')[0]
        switch (serviceListItem.serviceId) {
          case 100:
            dataline.push(serviceListItem)
            break
          // case 102:
          //   hotsale.push(serviceListItem)
          //   break
          default:
            break
        }
      }

      dataline.sort(timeOrderfun('endTime'))
      // hotsale.sort(timeOrderfun('endTime'))
      this.dataline = dataline[0]
      // this.hotsale = hotsale[0]
    }
  }

  // componentWillReceiveProps (nextProps) {
  //   let { serviceList } = nextProps.userInfo,
  //     serviceListItem,
  //     dataline = [],
  //     hotsale = [],
  //     timeOrderfun = (property) => {
  //       return (a, b) => {
  //         let v1 = a[property],
  //           v2 = b[property]
  //         return v2 - v1
  //       }
  //     }
  //   if (serviceList && !!serviceList.length) {
  //     for (let i = 0; i < serviceList.length; i++) {
  //       serviceListItem = serviceList[i]
  //       serviceListItem.endTime = new Date(serviceListItem.serviceEndTime).getTime()
  //       serviceListItem.serviceEndTime = serviceListItem.serviceEndTime.split(' ')[0]
  //       switch (serviceListItem.serviceId) {
  //         case 100:
  //           dataline.push(serviceListItem)
  //           break
  //         case 102:
  //           hotsale.push(serviceListItem)
  //           break
  //         default:
  //       }
  //     }

  //     dataline.sort(timeOrderfun('endTime'))
  //     hotsale.sort(timeOrderfun('endTime'))
  //     this.dataline = dataline[0]
  //     this.hotsale = hotsale[0]
  //   }
  //   this.setState(nextProps.userInfo)
  // }

  render() {
    let { avatar, name, id } = this.state,
      datalineInfo = this.dataline,
      // hotsaleInfo = this.hotsale,
      content = (<div className='user-info-wrap'>
        <div className='logout' onClick={() => this.props.history.push('/dataline/setting')}> 账号设置 </div>
        <div className='logout' onClick={() => this.props.history.push('/dataline/collection')}> 我的收藏 </div>
        <div className='logout' onClick={logout.bind(null, this)}>  退出登录 </div>
      </div>),
      title = (
        <div className='user-info-title'>
          <div className='user-name'> {name} </div>
          {
            (!!datalineInfo && JSON.stringify(datalineInfo) !== '{}') &&
            <div className='validity-time'>
              {datalineInfo.serviceName}有效期至:{datalineInfo.serviceEndTime}
            </div>
          }
          {/* {
          (!!hotsaleInfo && JSON.stringify(hotsaleInfo) !== '{}') &&
          <div
            className={classNames({ 'validity-time hotsale': !!datalineInfo && JSON.stringify(datalineInfo) !== '{}' })}>
            {hotsaleInfo.serviceName}有效期至:{hotsaleInfo.serviceEndTime}
          </div>
        } */}
        </div>)
    // 已登录，下拉菜单
    if (name) {
      return (
        <div className="user-info" style={{
         
        }}>
          <Popover className="popover-style" placement="bottomRight" title={title} content={content} trigger="hover">
            <div className="user-avatar">
              <Avatar src={avatar} />
              <span className="user-name">
                {name}
              </span>
            </div>
          </Popover>
        </div>
      )
    }

    // 未登录，登录按钮
    return (
      <div className='user-info'>
        <Button icon='login' value='small'>登录</Button>
      </div>
    )
  }
}

export default NavUser
