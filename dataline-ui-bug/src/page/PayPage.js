import React, {Component} from 'react'
import request from '../base/request'

class PayPage extends Component {

    componentWillMount() {
        let orderId = this.queryString('orderId');
        this.requestPayPage(orderId);
    }

    queryString(key) {
        let result = window.location.search.match(new RegExp("[\\?\\&]" + key + "=([^\\&]+)", "i"));
        if (result === null || result.length < 1) {
            return "";
        }
        return result[1];
    }

    requestPayPage(orderId) {
        let self = this;
        request.basic('pay/alipay-form?orderId=' + orderId)
            .then(data => {
                data = data.split('<script>')[0];
                self.pay.innerHTML = data;
                // 手动触发提交表单
                document.querySelector('form').submit();
                // document.forms['alipaysubmit'].submit();
            }, data => {
                console.log(data)
            })
    }

    render() {
        return (
            <div ref={el => this.pay = el} style={{width: '100%', height: '100%'}}>
            </div>
        )
    }
}

export default PayPage