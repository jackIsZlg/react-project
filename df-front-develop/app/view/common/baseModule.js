import base from './module/baseModule'
import DFAlert from './module/alertModule'
import DFConfirm from './module/confirmModule'
import HeaderMenu from '../components/HeaderMenu/HeaderMenu'
import UserReportPop from '../components/UserReportPop/UserReportPop'


// 全局事件
$(() => {

})

let indexRouter = ''
let eventId = ''

$('#channel').on('click', (e) => {
  if (!e.target.className) {
    return
  }
  switch (`${e.target.className.split(' ')[0].split('-')[1]}`) {
    case '0':
      indexRouter = '/index'
      eventId = '1068'
      break
    case '2':
      indexRouter = '/owner/follow/postView'
      eventId = '1067'
      break
    case '4':
      indexRouter = '/show/runway'
      eventId = '1069'
      break
    case 'trend':
    case '5':
      indexRouter = '/ordering/collections'
      eventId = '1070'
      break
    case '6':
      indexRouter = '/market/collections'
      eventId = '1071'
      break
    case '9':
      indexRouter = '/folder/public/index'
      eventId = '1072'
      break
    case '10':
      indexRouter = '/discover'
      eventId = '1073'
      break
    case 'download':
    case 'code':
      return
    case 'ins':
      indexRouter = '/owner/recom/home'
      break
    default:
      break
  }
  eventId && base.eventCount.add(eventId, {
    '登陆状态': !base.LS().userId ? '未登陆' : '已登陆',
    '来源页面': window.location.href
  })
  window.location.href = indexRouter
})

$('#logo').on('click', () => {
  window.location.href = '/index'
  base.eventCount.add('1076', {
    '登陆状态': !base.LS().userId ? '未登陆' : '已登陆',
  })
})

// 进度条动画
let progressEl = document.getElementById('progress')
if (progressEl) {
  window.onload = function () {
    progressEl.classList.remove('start')
    progressEl.classList.add('end')
    setTimeout(() => {
      progressEl.parentNode.removeChild(progressEl)
    }, 2500)
  }
}

// 全局管理body是否可滚动,所有浮层组件增加参数closeBody，根据初始状态设置组件是否能够修改body滚动属性
window.isBodyScroll = true

// 检测浏览器是否支持WebP
window.isSupportWebP = false

/* (function () {
    let WebP = new Image();
    WebP.onload = WebP.onerror = function () {
        // window.isSupportWebP = (WebP.height === 2);
    };
    WebP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
})(); */

// 字符串format，不使用，可用ES6模版字符串，精选集管理使用
String.prototype.format = function (args) {
  // 非数组或对象
  let obj = (typeof args !== 'object') ? arguments : args
  return this.replace(/\{(.+?)\}/g, (match, number) => {
    return typeof obj[number] !== 'undefined' ? obj[number] : match
  })
}

// 字符串去多个空格
String.prototype.removeNBSP = function () {
  return this.replace(/\s{2,}/g, ' ')
}

// 首字母大写
String.prototype.firstUpperCase = function () {
  return this.replace(/^\S/, (s) => {
    return s.toUpperCase()
  })
}

// 浏览器关闭向后端push用户事件
// window.onbeforeunload = function () {
//     obj.eventCount.send();
// };

// alert事件
window.df_alert = (options) => {
  new DFAlert(options)
}

// df_confirm
window.df_confirm = (options) => {
  new DFConfirm(options)
}

// rAF兼容
window.requestAnimationFrame = window.requestAnimationFrame
  || window.mozRequestAnimationFrame
  || window.webkitRequestAnimationFrame
  || window.msRequestAnimationFrame


let loginEl = document.getElementById('login')
// 登录模块与个人设置
loginEl && ReactDOM.render(<HeaderMenu />, loginEl)

// 添加用户反馈按钮
let reportEl = document.createElement('div')
let sideWrapperEl = document.getElementById('df-side-wrapper')
reportEl.classList.add('btn', 'btn-to-report')
reportEl.innerHTML = `<div class='move-pane'>
            <div class='white-text'>反馈</div>
            <div class='red-text'>反馈</div>
            </div> `
reportEl.addEventListener('click', () => {
  ReactDOM.render(<UserReportPop hidden={false} />, document.getElementById('user-report-pop-wrapper'))
})

if (!sideWrapperEl) {
  sideWrapperEl = document.createElement('div')
  sideWrapperEl.id = 'df-side-wrapper'
  document.getElementById('content')
    && document.getElementById('content').appendChild(sideWrapperEl)
}
sideWrapperEl.appendChild(reportEl)

// let uploadWrapper = document.getElementById('upload-img')
// !!uploadWrapper && ReactDOM.render(<UploadImageButton/>, uploadWrapper)

export default base