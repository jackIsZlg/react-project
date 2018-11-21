import React, {Component} from 'react';

export default class Message extends Component {
    state = {
        userId: this.props.match.params.userId
    }
    componentDidMount() {
        console.log(2);
        console.log(this.props.match)
    }
    render() {
        return (
            <div>
                <br/>
                <h3>当前是Abort-Message</h3>
                messageId 是{this.state.userId}
            </div>
        )
    }
}
