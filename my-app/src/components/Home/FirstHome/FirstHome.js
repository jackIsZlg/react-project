import React, {Component} from 'react';

export default class FirstHome extends Component {
    componentDidMount() {
        console.log(this.props)
        console.log(this.props.match)
    }
    goTo = () => {
        console.log(111);
        this.props.history.push('/About')
    }
    render() {
        return (
            <div>
                 第一个Home
            </div>
        )
    }
}
