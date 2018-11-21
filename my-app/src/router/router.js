import React, {Component} from 'react';

import { Switch, Route, Redirect } from 'react-router-dom';
import Bundle from './Bundle'

// chunk包按需加载
const Home = (props) => (
    <Bundle load={() => import('../components/Home/Home')}>
        {(Home) => <Home {...props}/>}
    </Bundle>
);

const Inbox = (props) => (
    <Bundle load={() => import('../components/Inbox/Inbox')}>
        {(Inbox) => <Inbox {...props}/>}
    </Bundle>
);

const About = (props) => (
    <Bundle load={() => import('../components/About/About')}>
        {(About) => <About {...props}/>}
    </Bundle>
);

const Record = (props) => (
    <Bundle load={() => import('../components/Record/Record')}>
        {(Record) => <Record {...props}/>}
    </Bundle>
);

export default class Router extends Component{
    render(){
        return(
            <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/Record" component={Record} />
                <Route path="/Inbox" component={Inbox} />
                <Route path="/Inbox" render={()=> <div>111</div>}/>
                <Route path="/About" component={About} />
                <Redirect to="/" />
            </Switch>
        )
    }
}
