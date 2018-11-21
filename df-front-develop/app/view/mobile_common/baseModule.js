const APP_DOWANLOAD_URL = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.ruhnn.deepfashion'
const obj = {
  baseUrl: window.location.origin ||
    (`${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}`),

  // 处理图片，chrome浏览器优先使用webP，图片适配Retina屏幕
  ossImg(src, w) {
    let _w = w ? `/resize,w_${Math.floor(w * 1 * (window.devicePixelRatio || 1))}` : ''
    return `${src}?x-oss-process=image${_w}`
  },

  // 微信环境jssdk配置
  wechatConfig(jsApiList, ready, error) {
    // 非微信环境跳出
    if (!this.is_weixin()) {
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
    let ua = navigator.userAgent
    return /iphone/i.test(ua)
  },
  is_android() {
    let ua = navigator.userAgent
    return /android/i.test(ua)
  },
  is_mobile() {
    let ua = navigator.userAgent

    let ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
      isIphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
      isAndroid = ua.match(/(Android)\s+([\d.]+)/),
      isMobile = isIphone || isAndroid
    return isMobile
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

  // 点击APP内查看后做的反应
  wakeUpApp(type, t0, agreement) {
    if (this.openApp(`deepfashion://${agreement}`)) {
      this.openApp(`deepfashion://${agreement}`)
    } else {
      // 由于打开需要1～2秒，利用这个时间差来处理－－打开app后，返回h5页面会出现页面变成app下载页面，影响用户体验
      let delay = setInterval(() => {
        let d = new Date()
        let t1 = d.getTime()
        if (t1 - t0 < 3000 && t1 - t0 > 2000) {
          let url = ''
          if (type === 'ios') {
            url = 'https://itunes.apple.com/cn/app/deepfashion/id1239723393?l=zh&ls=1&mt=8'
          } else if (type === 'android') {
            alert('请下载APP')
            url = 'http://df-gray.zhiyitech.cn/android/version/v1/info'
          }
          window.location.href = APP_DOWANLOAD_URL
        }
        if (t1 - t0 >= 3000) {
          clearInterval(delay)
        }
      }, 1000)
    }
  },

  // <a class="new-download-btn btn-download-app" href="${this.appLink()}?${params}">APP内查看</a>
  // 添加下载app板块 "deepfashion://${params}"
  downloadApp(params) {
    // 非微信或者iphone环境跳出
    if (!this.is_weixin()) {
      return
    }
    let downloadEl = document.createElement('div')
    downloadEl.id = 'download-app'
    downloadEl.innerHTML = `
                <img src="https://zhiyi-web.oss-cn-hangzhou.aliyuncs.com/static-web/mobile-df-logo-1.1.png">
                <div class="text-tip">
                    <div>DEEP FASHION</div>
                    <div>每天都想刷的时尚</div>
                </div>
                <a class="new-download-btn btn-download-app" 
                   href="javascript:;">下载APP</a>`
    document.body.appendChild(downloadEl)

    $('.new-download-btn').on('click', () => {
      this.oppenApp(params)
    })
  },

  oppenApp(params) {
    // $('.new-download-btn').on('click', () => {
    let type = ''
    let d = new Date()
    let t0 = d.getTime()

    if (this.is_weixin()) {
      window.location.href = APP_DOWANLOAD_URL
    } else {
      if (this.is_iphone()) {
        type = 'ios'
        // window.location.href = `deepfashion://${params}`;
      } else if (this.is_android()) {
        type = 'android'
      }
      this.wakeUpApp(type, t0, params)
    }
    // })
  },

  // app跳转链接
  appLink() {
    return APP_DOWANLOAD_URL
  },

  // 添加小程序板块
  wxApp(color = '') {
    // 非微信或者iphone环境跳出
    if (!this.is_weixin()) {
      return
    }

    let wxApppEl = document.createElement('div')
    wxApppEl.classList.add('wx-app')
    color && wxApppEl.classList.add(color)

    wxApppEl.innerHTML = `
                <div class="wx-app-tip">
                   <div>使用小程序</div>
                   <div class="big">DF精选</div>
                </div>
                <div class="wx-app-fun">
                    <div>
                        <div class="title">方法一：识别小程序二维码</div>
                        <img src="https://zhiyi-web.oss-cn-hangzhou.aliyuncs.com/static-web/qrcode-wxapp.jpeg">
                    </div>
                    <div>
                        <div class="title">方法二：搜索小程序名</div>
                        <div class="fun-2">
                            在小程序搜索栏中<br/>输入DF精选<br/>点击搜索，即可进入小程序
                        </div>
                    </div>
                </div>`
    document.body.appendChild(wxApppEl)
  },

  openApp(src) {
    // 通过iframe的方式试图打开APP，如果能正常打开，会直接切换到APP，并自动阻止a标签的默认行为
    // 否则打开a标签的href链接
    console.log(src)
    let ifr = document.createElement('iframe')
    ifr.src = src
    ifr.style.display = 'none'
    document.body.appendChild(ifr)
    window.setTimeout(() => {
      document.body.removeChild(ifr)
    }, 2000)
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
  }
}

// 本地调试修改域名指向
obj.baseUrl === 'http://127.0.0.1:8008' && (obj.baseUrl = 'http://df-dev.zhiyitech.cn')
obj.baseUrl === 'http://192.168.10.214:8008' && (obj.baseUrl = 'http://df-dev.zhiyitech.cn')
obj.baseUrl === 'http://192.168.1.103:8008' && (obj.baseUrl = 'http://df-dev.zhiyitech.cn')
obj.baseUrl === 'http://local.deepfashion.cn:8008' && (obj.baseUrl = 'http://df-dev.zhiyitech.cn')


export default obj