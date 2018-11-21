import base from '../../../mobile_common/baseModule'

let bodyWidth = document.documentElement.clientWidth,
  $showImage = $('.show-image')

// 配置小程序
base.wxApp('black')

// 配置下载app
base.downloadApp(`showImgId=${blogId}`)

// 配置微信分享
base.wechatConfig([], () => {
  base.shareConfig({
    title: document.title, // 分享标题
    desc: 'DeepFashion-每天都想刷的时尚', // 分享描述
    link: location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
    imgUrl: base.ossImg(mediaUrl, 100), // 分享图标
    success() {
      // 用户确认分享后执行的回调函数
    },
    cancel() {
      // 用户取消分享后执行的回调函数
    }
  })

  $showImage.click(() => {
    wx.previewImage({
      current: mediaUrl, // 当前显示图片的http链接
      urls: [mediaUrl] // 需要预览的图片http链接列表
    })
  })
})

$showImage.html(`<img id="show-image" src="${base.ossImg(mediaUrl, bodyWidth - 30)}"/>`)

