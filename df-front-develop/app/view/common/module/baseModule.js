import Login from '../../components/Login/Login'
import { eventData } from './zhugeIOModule'
import { toBase64, base64decode } from './base64Module'
import ajaxList from './ajaxModule'
import WarningTip from './warningTipModule'
import store from './LSModule'
import Notification from '../../components/Notication/Notication'
import UploadImageButton from '../../components/UploadImageButton/UploadImageButton'
import { ToTop } from '../../components/WaterFall/WaterFallBase'

// 收集回调
class Callback {
  constructor() {
    this.doneList = []
    this.failList = []
  }

  done(func) {
    this.doneList.push(func)
    return this
  }

  fail(func) {
    this.failList.push(func)
    return this
  }

  clear() {
    this.doneList = []
    this.failList = []
    return this
  }
}

// 公共方法集
const obj = {
  version: 'v-1.9.0',
  baseUrl: window.location.origin ||
    (`${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}`),

  // ajax列表
  ajaxList,

  isLogin: false,

  // header状态变化
  headerChange(classname) {
    let headerEl = document.getElementById('header')
    let footerEl = document.getElementsByTagName('footer')[0]

    if (classname) {
      headerEl && headerEl.classList.add(classname)
      footerEl && footerEl.classList.add(classname)
    } else {
      headerEl && (headerEl.className = '')
      footerEl && (footerEl.className = '')
    }
  },

  // 指向当前页面
  channel(index) {
    /**
     * params
     * -1 清除channel选中状态
     * 0 热门
     * 1 分类
     * 2 订阅
     * 3 我的
     * 4 秀场
     */
    if (index === -1) {
      return
    }
    let el = document.querySelectorAll(`.channel-${index}`)[0]
    el && el.classList.add('current')
  },

  // 登陆判断请求
  request(option) {
    if (typeof option !== 'object') return

    let originSuccess = option.success
    let originError = option.error
    let callback = new Callback()

    option.success = (response) => {
      // 未登陆 回调
      if (!response.success && response.errorCode === 'L09') {
        obj.isLogin = false
        // 登陆后 执行回调
        obj.login(() => {
          obj.isLogin = true
          // 请求重发
          option.success = originSuccess
          let requestor = obj.request(option)
          // 将原先done fail 的的回调 绑定到新请求
          callback.doneList.forEach((item) => {
            requestor.done(item)
          })

          callback.failList.forEach((item) => {
            requestor.fail(item)
          })
        })
        return callback
      }

      obj.isLogin = true
      // 登陆过 执行原先成功回调
      originSuccess && originSuccess.call(this, response)
      callback.doneList.forEach((item) => {
        item(response)
      })
    }

    option.error = (e) => {
      originError && originError.call(this, e)
      callback.failList.forEach((item) => {
        item(e)
      })
    }

    $.ajax(option)

    return callback
  },

  // 获取指定项数组索引
  getIndex(item, list) {
    if (!$.isArray(list)) return -1

    for (let i = 0, len = list.length; i < len; i++) {
      if (list[i] === item) return i
    }
    return -1
  },

  // 登陆
  login(callback, closable = false) {
    ReactDOM.render(<Login closable={closable} callback={callback} />, document.getElementById('login-pop-wrapper'))
  },

  // 字符串操作
  queryString(key) {
    let result = window.location.search.match(new RegExp(`[\?\&]${key}=([^\&]+)`, 'i'))
    if (result == null || result.length < 1) {
      return ''
    }
    return result[1]
  },

  getUrlStringId(index = '-1') {
    let pathnameArr = window.location.pathname.split('/')
    return pathnameArr[index === '-1' ? pathnameArr.length - 1 : index]
  },

  // 锚点管理
  hashManage: {
    _obj: {},
    status: false, // 锚点数据编辑状态
    _getStatus() { // 比对hash
      if (!this.status) {
        let _obj = this._getHash()
        if (JSON.stringify(_obj) !== JSON.stringify(this._obj)) {
          this.status = true
          return this.status
        }
        this.status = false
      }
      return this.status
    },
    _getHash() {
      let obj = {}
      let hash = window.location.hash.replace('#/', '')
      let hashList = hash.split('&')
      hashList.forEach((item) => {
        let _t = item.split('=')
        obj[_t[0]] = _t[1] ? decodeURIComponent(_t[1]) : ''
      })
      return obj
    },
    _get() {
      this._obj = this._getHash()
      this.status = false
      return this._obj
    },
    _set() {
      window.location.hash = this.toStringHash(this._obj)
    },
    _edit(key, value) {
      this._obj[key] = value
      this.status = true
      this._set()
    },
    toStringHash(obj) {
      let _hash = '/'
      for (let i in obj) {
        typeof obj[i] !== 'undefined' && (_hash += `${i}=${obj[i]}&`)
      }
      return _hash.substring(0, _hash.length - 1)
    }
  },

  // 事件统计管理
  eventCount: {
    // 添加
    add(eventId, options = {}) {
      if (!eventData[eventId]) {
        return
      }

      options['用户ID或IP'] = store().userId || window.returnCitySN.cip
      window.zhuge && zhuge.track(eventData[eventId], options)
      options.time = new Date().getTime()

      let imgData = {
        eventId,
        eventDescription: JSON.stringify(options)
      }

      // 发送图片请求
      this.sendImg(imgData)

      // console.log('imgData', imgData)
    },

    sendImg(params) {
      let a = new Image()
      let args = ''
      for (let i in params) {
        if (args !== '') {
          args += '&'
        }
        args += `${i}=${encodeURIComponent(params[i])}`
      }
      a.src = `${obj.baseUrl}/users/v1/event-observe?${args}`
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

  // base64编码
  toBase64,

  // base64解码
  base64decode,

  // 时间截取，--年--月--日
  dealTime(time) {
    return time.split(' ')[0].replace(/(\d{4})-(\d{2})-(\d{2})/, '$1年$2月$3日')
  },

  // 图片源改https
  httpToHttps(src = '') {
    return src.replace(/http(s?):\/\/deepfashion.oss-cn-hangzhou.aliyuncs.com\//, 'https://deepfashion.oss-cn-hangzhou.aliyuncs.com/')
  },

  // 处理图片，chrome浏览器优先使用webP，图片适配Retina屏幕
  ossImg(src, w) {
    // 无src，直接跳出
    if (!src || src === null) {
      return this.defaultGrayImg
    }

    let _w = w ? `/resize,w_${Math.floor(w * 1 * (window.devicePixelRatio || 1))}` : ''
    let _isC = window.isSupportWebP ? '/format,webp' : '/format,jpg/interlace,1'
    return `${obj.httpToHttps(src)}?x-oss-process=image${_w}${_isC}`
  },

  ossImgJpeg(src) {
    if (!src || src === null) {
      src = this.defaultGrayImg
    }

    return `${obj.httpToHttps(src)}?x-oss-process=image/format,jpg/interlace,1`
  },

  // 头像自适应
  avatarStyle(src, w) {
    return {
      backgroundImage: `url(${this.ossImg(src, w)})`
    }
  },

  // 获取ins端图片
  insHeadImg(img) {
    return `${obj.baseUrl}/owner/image?url=${img}`
  },

  // 按钮动画（包括按钮禁用）
  animationBtn(el) {
    if (el instanceof jQuery && el[0].nodeType === 1) {
      el = el[0]
    }
    // el.classList.add('btn-animation');
    this.text = el.innerHTML
    this.cancel = () => {
      let self = this
      el.classList.remove('loading')
      el.innerHTML = self.text
      el.disabled = false
    }
    this.loading = () => {
      el.classList.add('loading')
      // el.classList.remove('success');
      el.innerHTML = '<i class="iconfont">&#xe634;</i>'
      el.disabled = true
    }
    this.success = (cb) => {
      let self = this
      el.classList.remove('loading')
      el.classList.add('success')
      el.innerHTML = '<i class="iconfont">&#xe68a;</i>'
      setTimeout(() => {
        el.classList.remove('success')
        el.innerHTML = self.text
        cb && cb()
        el.disabled = false
      }, 2300)
    }
    return this
  },

  // body是否开启滚动，防止浮层滚动对body的影响
  bodyScroll(flag = true) {
    window.isBodyScroll = flag
    document.body.style.overflowY = (flag ? 'auto' : 'hidden')
  },

  // 时间比对，足迹专用
  isMonth(today, time2) {
    let diff = (today - new Date(time2).getTime()) / 1000
    return diff >= 2592000
  },

  // 提示窗(目前注册登陆模块使用)
  warningTip: WarningTip,

  // 标签数据
  tagConfig: ['西服', '夹克', '卫衣', '大衣', '棉衣羽绒', '风衣', '衬衫', '针织衫', '无袖外套', '皮衣', '皮草', 'Polo衫',
    '小衫', 'T恤', '打底', '裤装', '连体裤', '连衣裙', '半身裙', '礼服', '皮鞋', '运动鞋', '凉拖', '包', '帽子'],

  // 生成随机数
  renderRandomNum(start, end, count) {
    let originalArray = []
    let randomArray = []
    // 给原数组originalArray赋值
    for (let i = 0; i < (end - start); i++) {
      originalArray[i] = start + i
    }

    // 打乱排序
    originalArray.sort(() => {
      return 0.5 - Math.random()
    })

    for (let i = 0; i < count; i++) {
      randomArray.push(originalArray[i])
    }
    return randomArray
  },

  // 生成随机颜色
  getRandomColor() {
    let defaultColor = ['#DDC4C4', '#C1BE88', '#D58D8D', '#A2C3AA', '#BAC4D6', '#A9A6D4']
    return defaultColor[Math.round(Math.random() * 5)]
  },

  // 秀场名字首字母大写
  getRunwayName(name) {
    return name.replace(/\s/g, '').substr(0, 2).toLowerCase()
  },

  // 瀑布流单元translate设置
  setDivStyle(data) {
    if (!data.hasOwnProperty('translateX')) {
      return {
        opacity: 0
      }
    }
    let x = data.translateX || 0
    let y = data.translateY || 0

    return {
      opacity: 1,
      transform: `translateX(${x}px) translateY(${y}px) translateZ(0)`,
      WebkitTransform: `translateX(${x}px) translateY(${y}px) translateZ(0)`
    }
  },

  // 获取单元的translateX,Y值
  getDivTranslate(el) {
    let _transform = window.getComputedStyle(el).transform.replace(/[^0-9|\.\-,]/g, '').split(',')
    let x = _transform[4] * 1
    let y = _transform[5] * 1
    return { x, y }
  },

  // 判断手机号
  regExpPhone(phone) {
    return (/^1[34578]\d{9}$/.test(phone))
  },

  // 获取随机Id
  getRandomId() {
    return `${new Date().getTime()}${Math.random().toString().substr(2, 6)}`
  },

  // 转义换行
  changeEnter(string) {
    return string.replace(/\n/g, '').replace(/\s/g, '&nbsp;').replace(/↵/g, '')
  },

  // obj->string
  objToSearch(obj) {
    let search = []
    for (let key in obj) {
      search.push(`${key}=${obj[key]}`)
    }
    return search.join('&')
  },

  // 灰色底图
  defaultGrayImg: 'https://zhiyi-web.oss-cn-hangzhou.aliyuncs.com/static-web/e5e5e5.jpg',

  // 本地存储管理
  LS: store,

  // 微信环境jssdk配置
  wechatConfig(jsApiList, ready, error) {
    // 非微信环境跳出
    if (!obj.is_weixin()) {
      return
    }

    $.ajax({
      type: 'GET',
      url: `${this.baseUrl}/wechat-sign`,
      success: (d) => {
        if (d.success) {
          wx.config({
            // debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: d.result.appId, // 必填，公众号的唯一标识
            timestamp: d.result.timestamp, // 必填，生成签名的时间戳
            nonceStr: d.result.nonceStr, // 必填，生成签名的随机串
            signature: d.result.signature, // 必填，签名，见附录1
            jsApiList: ['previewImage', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareQZone'].concat(jsApiList) // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
          })

          wx.ready(() => {
            console.log('配置成功')
            ready && ready()
            // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
          })
          wx.error((res) => {
            error && error(res)
            console.log('wechat jssdk 调用失败')
            // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
          })
        }
      }
    })
  },

  // 环境判定
  is_weixin() {
    let ua = navigator.userAgent.toLowerCase()
    return (/micromessenger/i).test(ua)
  },
  is_iphone() {
    let ua = navigator.userAgent.toLowerCase()
    return (/iphone/i).test(ua)
  },

  // 微信分享配置
  shareConfig(options) {
    let defaults = {
      title: '', // 分享标题
      desc: '', // 分享描述
      link: '', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
      imgUrl: '', // 分享图标
      type: '', // 分享类型,music、video或link，不填默认为link
      dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
      success() {
        // 用户确认分享后执行的回调函数
      },
      cancel() {
        // 用户取消分享后执行的回调函数
      }
    }
    for (let i in options) {
      defaults[i] = options[i]
    }

    // 朋友圈
    wx.onMenuShareTimeline(defaults)

    // 朋友
    wx.onMenuShareAppMessage(defaults)

    // qq消息
    wx.onMenuShareQQ(defaults)

    // qq空间
    wx.onMenuShareQZone(defaults)
  },

  // 登陆后渲染右上角内容
  loadFunctionColumn() {
    let wrapperEl = document.getElementById('notice-pop')
    let uploadWrapper = document.getElementById('upload-img')
    // let searchWrapper = document.getElementById('btn-search')
    let connectionUrl = `${this.baseUrl}/v4/user/notify/unread-num`

    !!wrapperEl && ReactDOM.render(<Notification connectionUrl={connectionUrl} />, wrapperEl)
    !!uploadWrapper && ReactDOM.render(<UploadImageButton />, uploadWrapper)
  },

  // 渲染置顶按钮
  renderToTopButton(flag, callback) {
    let toTopEl = document.getElementById('btn-to-top')
    let parentEl = document.getElementById('df-side-wrapper')

    if (!parentEl) {
      // 无节点则创建
      parentEl = document.createElement('div')
      parentEl.id = 'df-side-wrapper'
      document.getElementById('content').appendChild(parentEl)
    }

    // 置顶按钮已存在则跳出
    if (toTopEl) {
      return
    }

    // 置顶按钮消隐
    obj.toTopShowHide(flag, callback)

    toTopEl = document.createElement('div')

    let firstEl = parentEl.getElementsByClassName('btn')[0]
    toTopEl.id = 'btn-to-top'
    // 置顶按钮插在第一位
    if (firstEl) {
      parentEl.insertBefore(toTopEl, firstEl)
    } else {
      parentEl.appendChild(toTopEl)
    }

    ReactDOM.render(
      <ToTop show={flag} callback={callback} />,
      document.getElementById('btn-to-top')
    )
  },

  // 置顶按钮消隐
  toTopShowHide(flag, callback) {
    document.addEventListener('scroll', () => {
      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      // 置顶按钮消隐
      scrollTop > 300 !== flag && (flag = (scrollTop > 300))
      ReactDOM.render(<ToTop show={flag} callback={callback} />, document.getElementById('btn-to-top'))
    })
  },

  // 上万数字统一格式
  numberFormat(num) {
    if ((typeof num).toLocaleLowerCase() !== 'number') {
      return ''
    }
    if (num * 1 < 10000) {
      return num
    }
    return `${(num * 1 / 10000).toFixed(1)}万`
  },

  changeDifferences(success, fail) {
    // 获取用户信息
    this.ajaxList.getUserInfo((d) => {
      this.LS.set({
        ...d.result,
        timeStamp: new Date().getTime() / 1000,
        version: this.version
      })

      // 接口字段差异
      success && success(d.result)
    }, (d) => {
      fail && fail(d)
    })
  }
}

// 本地调试修改域名指向
// obj.baseUrl === 'http://127.0.0.1:8008' && (obj.baseUrl = 'http://192.168.18.32:8080');
// obj.baseUrl === 'http://127.0.0.1:8008' && (obj.baseUrl = 'http://df-gray.zhiyitech.cn')
// obj.baseUrl === 'http://192.168.1.103:8008' && (obj.baseUrl = 'http://df-dev.zhiyitech.cn')
// obj.baseUrl === 'http://local.deepfashion.cn:8008' && (obj.baseUrl = 'http://df-dev.zhiyitech.cn')
// obj.baseUrl === 'http://localhost:7001' && (obj.baseUrl = 'http://df-gray.zhiyitech.cn')
// obj.baseUrl === 'http://127.0.0.1:7001' && (obj.baseUrl = 'http://df-gray.zhiyitech.cn')

export default obj