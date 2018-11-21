/**
 * Created by gewangjie on 2018/3/6
 */


const _ = require('lodash');
let util = {
    //格式化取出当前时间
    getnow: function (formatStr) {
        const date = new Date();
        let str = formatStr;
        let mon = 0;
        if (!str)
            return "";
        const Week = ['日', '一', '二', '三', '四', '五', '六'];

        str = str.replace(/yyyy|YYYY/, date.getFullYear());
        str = str.replace(/yy|YY/, (date.getYear() % 100) > 9 ? (date.getYear() % 100).toString() : '0' + (date.getYear() % 100));
        mon = date.getMonth() + 1;

        str = str.replace(/MM/, mon > 9 ? mon.toString() : '0' + mon);
        str = str.replace(/M/g, date.getMonth());

        str = str.replace(/w|W/g, Week[date.getDay()]);

        str = str.replace(/dd|DD/, date.getDate() > 9 ? date.getDate().toString() : '0' + date.getDate());
        str = str.replace(/d|D/g, date.getDate());

        str = str.replace(/hh|HH/, date.getHours() > 9 ? date.getHours().toString() : '0' + date.getHours());
        str = str.replace(/h|H/g, date.getHours());
        str = str.replace(/mm/, date.getMinutes() > 9 ? date.getMinutes().toString() : '0' + date.getMinutes());
        str = str.replace(/m/g, date.getMinutes());

        str = str.replace(/ss|SS/, date.getSeconds() > 9 ? date.getSeconds().toString() : '0' + date.getSeconds());
        str = str.replace(/s|S/g, date.getSeconds());

        return str;
    },

    //格式化转换日期对象
    formateDate: function (date, format) {
        let str = format;
        let mon = 0;
        if (!str || !date)
            return "";
        const Week = ['日', '一', '二', '三', '四', '五', '六'];

        str = str.replace(/yyyy|YYYY/, date.getFullYear());
        str = str.replace(/yy|YY/, (date.getYear() % 100) > 9 ? (date.getYear() % 100).toString() : '0' + (date.getYear() % 100));
        mon = date.getMonth() + 1;

        str = str.replace(/MM/, mon > 9 ? mon.toString() : '0' + mon);
        str = str.replace(/M/g, date.getMonth());

        str = str.replace(/w|W/g, Week[date.getDay()]);

        str = str.replace(/dd|DD/, date.getDate() > 9 ? date.getDate().toString() : '0' + date.getDate());
        str = str.replace(/d|D/g, date.getDate());

        str = str.replace(/hh|HH/, date.getHours() > 9 ? date.getHours().toString() : '0' + date.getHours());
        str = str.replace(/h|H/g, date.getHours());
        str = str.replace(/mm/, date.getMinutes() > 9 ? date.getMinutes().toString() : '0' + date.getMinutes());
        str = str.replace(/m/g, date.getMinutes());

        str = str.replace(/ss|SS/, date.getSeconds() > 9 ? date.getSeconds().toString() : '0' + date.getSeconds());
        str = str.replace(/s|S/g, date.getSeconds());

        return str;
    },
    //返回用空格拆分后的字符串等对象
    formateStringToNo_hms: function (dateString) {
        if (dateString) {
            // console.log("dateString", dateString)
            const key = _.split(dateString, ' ', 2);
            // console.log("key", key[0])
            return key[0]
        } else {
            return dateString
        }
    },

    getRealDate: function (date, formatStr) {
        date = new Date(date);
        let str = formatStr;
        let mon = 0;
        if (!str)
            return "";
        const Week = ['日', '一', '二', '三', '四', '五', '六'];

        str = str.replace(/yyyy|YYYY/, date.getFullYear());
        str = str.replace(/yy|YY/, (date.getYear() % 100) > 9 ? (date.getYear() % 100).toString() : '0' + (date.getYear() % 100));
        mon = date.getMonth() + 1;

        str = str.replace(/MM/, mon > 9 ? mon.toString() : '0' + mon);
        str = str.replace(/M/g, date.getMonth());

        str = str.replace(/w|W/g, Week[date.getDay()]);

        str = str.replace(/dd|DD/, date.getDate() > 9 ? date.getDate().toString() : '0' + date.getDate());
        str = str.replace(/d|D/g, date.getDate());

        str = str.replace(/hh|HH/, date.getHours() > 9 ? date.getHours().toString() : '0' + date.getHours());
        str = str.replace(/h|H/g, date.getHours());
        str = str.replace(/mm/, date.getMinutes() > 9 ? date.getMinutes().toString() : '0' + date.getMinutes());
        str = str.replace(/m/g, date.getMinutes());

        str = str.replace(/ss|SS/, date.getSeconds() > 9 ? date.getSeconds().toString() : '0' + date.getSeconds());
        str = str.replace(/s|S/g, date.getSeconds());

        return str;
    },
    //时间戳转换为时间
    getDateFromTimestamp: function (tm) {
        // console.log(tm)
        let date = new Date(tm);
        const Y = date.getFullYear() + '-';
        const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        const D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' ';
        const h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':';
        const m = date.getMinutes() < 10 ? '0' + date.getMinutes() + ':' : date.getMinutes() + ':';
        const s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
        // console.log(Y + M + D + h + m + s);
        return Y + M + D + h + m + s;
    },

    //根据日期获取周几
    getWeek: function (date) {
        date = new Date(date);
        const weekList = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
        const weekNum = date.getDay();
        // console.log(date, weekNum, weekList[weekNum]);
        return weekList[weekNum];
    },

    clearProperty: function (obj) {
        for (const key in obj) {
            if (obj[key] === undefined || obj[key] === null)
                delete obj[key]
        }
    },
    getRequest: function (url) {
        //获取url中"?"符后的字串
        const theRequest = {};
        if (url.indexOf("?") !== -1) {
            const str = url.substr(1);
            const strs = str.split("&");
            for (let i = 0; i < strs.length; i++) {
                theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
            }
        }
        return theRequest;
    },

    //传入数组则计算数组长度,如果传入对象则计算对象成员数,如果传入字符串则计算字符串的字数.其他类型返回false
    getAmount: function (obj) {
        const t = typeof obj;
        if (t === 'string') {
            return obj.length;
        } else if (t === 'object') {
            return Object.keys(obj).length;
        }
        return false;
    },
    /*
     *req:date1String yyyy-MM-dd date2String yyyy-MM-dd
     *res:1 -1 0
     */
    compareDate1WithDate2: function (date1String, date2String) {
        const date1 = new Date(date1String);
        const date2 = new Date(date2String);
        if (date1 > date2) {
            return 1
        } else if (date1 < date2) {
            return -1
        } else {

            return 0
        }

    },
    getNextDate: function (last_monitor_date) {
        const dd = new Date(last_monitor_date);
        dd.setDate(dd.getDate() + 1); //获取AddDayCount天后的日期
        const y = dd.getFullYear();
        const m = dd.getMonth() + 1 < 10 ? '0' + (dd.getMonth() + 1) : dd.getMonth() + 1;
        const d = dd.getDate() < 10 ? '0' + dd.getDate() : dd.getDate();
        return y + "-" + m + "-" + d
    },
    getAddDayCountDate: function (last_monitor_date, AddDayCount) {
        const dd = new Date(last_monitor_date);
        dd.setDate(dd.getDate() + AddDayCount); //获取AddDayCount天后的日期
        const y = dd.getFullYear();
        const m = dd.getMonth() + 1 < 10 ? '0' + (dd.getMonth() + 1) : dd.getMonth() + 1;
        const d = dd.getDate() < 10 ? '0' + dd.getDate() : dd.getDate();
        return y + "-" + m + "-" + d
    },

    countPastHowManyDays: function (dateEarlier, dateLate) {
        dateEarlier = dateEarlier.slice(0, 10);
        dateLate = dateLate.slice(0, 10);
        const time = new Date(dateLate).getTime() - new Date(dateEarlier).getTime();
        return parseInt(time / (1000 * 60 * 60 * 24), 10)
    },
    setCookie: function (c_name, value, expiredays) {
        const exdate = new Date();
        exdate.setDate(exdate.getDate() + expiredays);
        document.cookie = c_name + "=" + escape(value) +
            ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString())
    },
    getCookie: function (c_name) {
        if (document.cookie.length > 0) {
            let c_start = document.cookie.indexOf(c_name + "=");
            if (c_start !== -1) {
                c_start = c_start + c_name.length + 1
                let c_end = document.cookie.indexOf(";", c_start);
                if (c_end === -1) c_end = document.cookie.length
                return unescape(document.cookie.substring(c_start, c_end))
            }
        }
        return ""
    },
    //在数组中通过某一个属性值查找该属性所在的对象，返回一个object
    getObjectByFieldValue: (arr, field, val) => {
        const result = arr.filter((obj) => {
            return obj[field] === val
        })
        return result[0];
    },
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
};

export default util