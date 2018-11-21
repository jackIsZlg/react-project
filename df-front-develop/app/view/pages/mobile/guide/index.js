import base from '../../../mobile_common/baseModule'

let downloadBtn = $('.download-btn')

if (base.is_android()) {
  downloadBtn.text('打开APP')
}

downloadBtn.on('click', () => {
  let d = new Date()
  let t0 = d.getTime()
  if (base.is_android() && base.is_weixin()) {
    $('.guide-tip').css('opacity', 1)
  } else if (base.is_android() && !base.is_weixin()) {
    base.wakeUpApp('android', t0, '')
  } else if (base.is_iphone()) {
    window.location.href = 'https://itunes.apple.com/cn/app/deepfashion/id1239723393?l=zh&ls=1&mt=8'
  }
})

