import base from '../../../../mobile_common/baseModule'

let count = document.querySelector('.show')
let time = count.innerHTML  
let interval = setInterval(() => {
  if (time <= 1) {
    clearInterval(interval)
    if (base.is_weixin()) {
      window.location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.ruhnn.deepfashion'
    } else {
      window.close()
    }
    return
  }
  count.innerHTML = --time
}, 1000)
