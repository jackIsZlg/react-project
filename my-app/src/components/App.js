import React, { Component } from 'react';
import './App.css';
import Router  from '../router/router'
import {HashRouter, NavLink} from 'react-router-dom';
import {connect} from 'react-redux';
import {requestClear} from '../store/asyc/action'

class A extends Component{
    render() {
        return (
            <div>
                {this.props.children}
            </div>
        )
    }
}

class App extends Component {
    shouldComponentUpdate (nextProps,nextState) {
        if(nextProps.isLoading) { //正在加载的状态不更新
            return false
        }else if(nextProps.message && nextProps.code != 0) {
            if(nextProps.showError) { // 在这里统一处理错误
                nextProps.requestClear();  // 每次成功以后要把信息清空，方便重新渲染
                //在这里做其他的一些操作
                alert(nextProps.message)
            }
            return false;
        }else if(nextProps.message == 'clear') { // 清空的状态不刷新组件
            return false;
        }
        return true;
    }
    componentWillUpdate (nextProps,nextState) {

    }
    componentDidUpdate (prevProps,prevState) {

    }
    componentDidMount(){

    }
    render() {
        return (
            <HashRouter>
               <div>
                    <A>
                        <li> 11 </li>
                        <li> 22 </li>
                        <li>当前计数：{this.props.count}</li>
                        <div>{this.props.message}</div>
                        <NavLink to='/About' exact activeClassName="active" className='link'>去About</NavLink>
                        <NavLink to='/Home' activeClassName="active" className='link'>去Home</NavLink>
                    </A>
                    <br/>
                    <Router />
               </div>
            </HashRouter>
        );
  }
}

const mapStateToProps = (state) => {
    console.log(state)
    return {
        count: state.reducer.count,
        showError:state.getAjaxInfo.showError,
        isLoading: state.getAjaxInfo.isLoading,
        code: state.getAjaxInfo.code,
        message: state.getAjaxInfo.errorMsg
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        requestClear: () => {
            dispatch(requestClear())
        }
    }
};

export default connect(mapStateToProps,mapDispatchToProps)(App);
