import React, {Component} from 'react';
import { NavLink } from 'react-router-dom';
import './Home.less'
import {
    addCount, addExact, delCount, delExact, addItem, showTrue
}  from '../../store/sync/action';
import {connect} from 'react-redux';

class Home extends Component {
    componentDidMount() {
        console.log(this.props)
        console.log(this.props.match)
    }
    goTo = () => {
        this.props.history.push('/About')
    }
    render() {
        const { items } = this.props;
        return (
            <div>
                <br/>
                <h3>当前是home</h3>
                <NavLink to='/Inbox' activeClassName="active" className='link'>去Inbox</NavLink>
                <NavLink to='/About' activeClassName="active" className='link'>去About</NavLink>
                <NavLink to='/Record' activeClassName="active" className='link'>去Record</NavLink>
                <button onClick={()=> this.goTo()}>去往About</button>
                <br/>
                <div>{this.props.count}</div>
                <button onClick={()=> this.props.addCount()}>增加+1</button>
                <button onClick={()=> this.props.addExact(5)}>增加+5</button>
                <button onClick={()=> this.props.delCount()}>减少-1</button>
                <button onClick={()=> this.props.delExact(5)}>减少-5</button>
                <br/>
                <div>
                    {items.map((i)=>(
                        <li>{i.text}</li>
                    ))}
                </div>
                <button onClick={()=> this.props.addItem('isZlg')}>添加表行</button>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    console.log(state)
    return {
        count: state.reducer.count,
        items: state.todos
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        addCount: () => {
            dispatch(addCount())
        },
        addExact: (parmas) => {
            dispatch(addExact(parmas))
        },
        delCount: () => {
            dispatch(delCount())
        },
        delExact: (parmas) => {
            dispatch(delExact(parmas))
        },
        addItem: (text) => {
            dispatch(addItem(text))
        },
        showTrue: () => {
            dispatch(delExact())
        },

    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
