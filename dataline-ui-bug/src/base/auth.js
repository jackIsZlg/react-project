/**
 * Created by gewangjie on 2018/3/7
 */
import React from 'react'
import {
    Route,
    Redirect
} from 'react-router-dom'
import request from '../base/request'

// React-Route 官方解决方案 -- 用户认证
const fakeAuth = {
    isAuthenticated: false,
    authenticate(cb) {
        this.isAuthenticated = true;
        setTimeout(cb, 100) // fake async
    },
    signOut(cb) {
        this.isAuthenticated = false;
        setTimeout(cb, 100)
    }
};

/**
 * 需认证路由，官方Route高阶组件
 * 已登录 => Component
 * 未登录 => 重定向到登录页
 */
class AuthRoute extends React.Component{
    constructor() {
        super()
        this.state = {
            status: 0
        }
    }

    componentDidMount() {
        this.getTower()
    }

    async getTower() {
        const hasPay = await request.basic('user/service/test')
        if (!hasPay) {
            this.setState({status: 1})
        } else {
            const info = await request.basic('account/info')
            console.log('info', info)
            this.setState({status: !info.haveSettings ? 2 : 3})
        }
    }

    render(){
        let {status} = this.state
        let {component: Component, ...rest} = this.props
        return <Route {...rest} render={props => {
            if (!fakeAuth.isAuthenticated) {
                return <Redirect to={{
                    pathname: '/index/login',
                    state: {from: props.location}
                }}/>
            }
            switch (status) {
                case 1:
                    return <Redirect to={{pathname: '/process/1', state: {from: props.location}}}/>
                case 2:
                    return <Redirect to={{pathname: '/process/2', state: {from: props.location}}}/>
                case 3:
                    return <Component {...props}/>
                default:
                    return null
            }
        }}/>
    }
}

export {fakeAuth, AuthRoute}