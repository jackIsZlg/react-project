import base from "../../common/baseModule"

base.headerChange('white')
base.channel(-1)

let timeEl = document.getElementsByClassName('error-time-count')[0]
let count = 5
let _time = () => {
  setTimeout(() => {
    timeEl.innerHTML = `${count--} 秒`
    count === 0 ? window.location.href = '/' : (_time())
  }, 1000)
}

_time()