import React, {Component} from 'react';
import { Link,Switch,Route,NavLink } from 'react-router-dom';
import './About.less'
import Bundle from "../../router/Bundle";

const Message = (props) => (
    <Bundle load={() => import('./Message/Message')}>
        {(Message) => <Message {...props}/>}
    </Bundle>
);

export default class About extends Component {
    componentDidMount() {
        console.log(1);
        // console.log(this.props.match)
    }
    render() {
        return (
            <div>
                <br/>
                <h3>当前是Abort</h3>
                <Link to={{
                    pathname: '/Home',
                    search: '?sort=name',
                    hash: '#the-hash',
                    params: {id:3},
                    state: { fromDashboard: true }
                }}>返回home</Link>
                <NavLink to='/About' exact activeClassName="active" className='link'>本地</NavLink>
                <NavLink to='/About/Message/12' activeClassName="active" className='link'>信息</NavLink>

                <Switch>
                    <Route path="/About" exact render={()=><div>this is About</div> }/>
                    {/*<Route path="/About/Message/:userId" component={Message} />*/}
                    <Route path={`${this.props.match.path}/Message/:userId`} component={Message} />
                </Switch>

            </div>
        )
    }
}
