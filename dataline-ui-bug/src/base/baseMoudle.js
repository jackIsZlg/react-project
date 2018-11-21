/**
 * Created by gewangjie on 2017/9/20
 */

import React from 'react'
import ReactDOM from 'react-dom'
import {Payment} from '../component/common/CommonComponent'
import ajaxRequest from './request'
import eventData from './zhugeIOMoudle'

let obj = {

    // 事件统计管理
    eventCount: {
        // 添加
        add: function (eventId, options = {}) {
            if (!eventData[eventId]) {
                return;
            }

            window.zhuge && window.zhuge.track(eventData[eventId], options);

            options.time = new Date().getTime();

            let imgData = {
                "eventId": eventId,
                "eventDescription": JSON.stringify(options)
            };

            // 发送图片请求
            this.sendImg(imgData);

            // console.log('imgData',imgData);
        },

        sendImg(params) {
            let a = new Image(),
                args = '';
            for (let i in params) {
                if (args !== '') {
                    args += '&';
                }
                args += i + '=' + encodeURIComponent(params[i]);
            }
            a.src = `${ajaxRequest.baseUrl}/users/v1/event-observe?${args}`;
        },

        // 发送
        // send: function () {
        //     let self = this;
        //     self.data.length > 0 && $.ajax({
        //         type: 'POST',
        //         url: obj.baseUrl + '/users/event-observe',
        //         async: false,
        //         data: {
        //             eventJson: JSON.stringify(self.data)
        //         }
        //     }).done((d) => {
        //         console.log(d);
        //         if (d.success) {
        //             window.localStorage.removeItem('eventCount');
        //         }
        //     });
        // }
    },

    // 获取随机颜色
    getRandomColor() {
        let defaultColor = ['#DDC4C4', '#C1BE88', '#D58D8D', '#A2C3AA', '#BAC4D6', '#A9A6D4'];
        return defaultColor[Math.round(Math.random() * 5)];
    },

    // 瀑布流单元translate设置
    setDivStyle(data) {
        if (!data.hasOwnProperty('translateX')) {
            return {
                'opacity': 0
            }
        }
        let x = data.translateX || 0,
            y = data.translateY || 0;

        return {
            'opacity': 1,
            'transform': `translateX(${x}px) translateY(${y}px) translateZ(0)`,
            'WebkitTransform': `translateX(${x}px) translateY(${y}px) translateZ(0)`
        }
    },

    // 获取单元的translateX,Y值
    getDivTranslate(el) {
        let _transform = window.getComputedStyle(el).transform.replace(/[^0-9|\\.\-,]/g, '').split(','),
            x = _transform[4] * 1,
            y = _transform[5] * 1;
        return {x, y}
    },

    ossImg(src, w) {
        // 无src，直接跳出
        if (!src || src === null) {
            return;
        }

        let _w = w ? `/resize,w_${Math.floor(w * 1 * (window.devicePixelRatio || 1))}` : '',
            _c = '/format,jpg/interlace,1';
        return `${src}?x-oss-process=image${_w}${_c}`;
    },

    // 获取随机Id
    getRandomId() {
        return `${new Date().getTime()}${Math.random().toString().substr(2, 6)}`
    },

    // 数组转对象
    getUniqueFromArray: (arr) => {
        var res = [];
        var json = {};
        for (var i = 0; i < arr.length; i++) {
            if (!json[arr[i]]) {
                res.push(arr[i]);
                json[arr[i]] = 1;
            }
        }
        return res;
    },

    // body是否开启滚动，防止浮层滚动对body的影响
    bodyScroll(flag = true) {
        window.isBodyScroll = flag;
        document.body.style.overflowY = (flag ? 'auto' : 'hidden');
    },

    // 检测该用户是否可以开启试用服务
    buyCommodity(serviceId) {
        let element = document.querySelector('#package');
        if (!!element) {
            return
        }
        let el = document.createElement('div');
        el.id = 'package';
        document.body.appendChild(el);
        ReactDOM.render(<Payment serviceId={serviceId}/>, el);
    },

    // 数组转字符串
    dealListData(arr) {
        let str = '';
        for (let i = 0; i < arr.length; i++) {
            if (i < (arr.length - 1)) {
                str += arr[i] + ',';
                continue
            }
            str += arr[i]
        }
        return str
    },

    // 字符串操作
    queryString(key) {
        let result = window.location.search.match(new RegExp("[\\?\\&]" + key + "=([^\\&]+)", "i"));
        if (result == null || result.length < 1) {
            return "";
        }
        return result[1];
    },

    getUrlStringId(index = '-1') {
        let pathnameArr = window.location.pathname.split('/');
        return pathnameArr[index === '-1' ? pathnameArr.length - 1 : index];
    },

    // obj->string
    objToSearch(obj) {
        let search = [];
        for (let key in obj) {
            search.push(`${key}=${obj[key]}`);
        }
        return search.join('&');
    },

    // 是否支付
    isPay() {
        ajaxRequest.basic('user/service/test')
    }

};

export default obj;