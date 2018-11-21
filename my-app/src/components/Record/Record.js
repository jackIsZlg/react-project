import React, {Component} from 'react';
import {connect} from 'react-redux';
import { waitRun, getLyricInfo } from "../../store/asyc/action";

class Record extends Component {
    componentDidMount() {
        //console.log(this.props)
        //console.log(this.props.match)
        console.log(123456);
        this.props.getLyricInfo();
    }
    goTo = () => {
        this.props.history.push('/')
    }
    render() {
        return (
            <div>
                <br/>
                <h3>当前是Record</h3>
                <button onClick={()=> this.goTo()}>回Home</button>
                <br />
                <div>
                    {this.props.status}
                </div>
                <button onClick={()=> this.props.waitRun()}>异步执行等待</button>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    //console.log(state)
    return {
      status: state.waitFun.status
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        waitRun: () => {
            dispatch(waitRun())
        },
        getLyricInfo: () => {
            dispatch(getLyricInfo())
        }

    }
};


export default connect(mapStateToProps, mapDispatchToProps)(Record);
