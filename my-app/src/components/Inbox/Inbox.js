import React, {Component} from 'react';
import Server from '../../config/axios'

export default class Inbox extends Component {
    state = {
        item: []
    }

    componentDidMount() {
        // Server.axios('GET','/get').then(res => {
        //     this.setState({item: res.data})
        // },err => {
        //     console.log(err)
        // })
        Server.axios('POST','/123/post',{
            page: 1,
            value:10
            //showError: false, // 是否统一处理错误
        }).then(res => {
            this.setState({item: res.data})
        },err => {
            console.log(err)
        })
    }
    render() {
        const { item } = this.state
        return (
            <div>
                inbox
                <br/>
                {
                    item.map((i,l)=> (
                        <ul style={{float:'left'}} key={l}>
                            <li>name: {i.name}</li>
                            <li>sex: {i.sex}</li>
                        </ul>
                    ))
                }
            </div>
        )
    }
}
