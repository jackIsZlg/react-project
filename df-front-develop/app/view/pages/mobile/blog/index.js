import base from '../../../mobile_common/baseModule'

let bodyWidth = document.documentElement.clientWidth,
  $blogImage = $('.blog-image'),
  $userIntro = $('.user-intro'),
  $nickname = $('.nickname'),
  $avatarImage = $('.avatar'),
  $postTime = $('.post-time'),
  $blogTag = $('.blog-tag'),
  blogInfo = {}

function getBlogInfo() {
  $.ajax({
    type: 'GET',
    async: false,
    url: `${base.baseUrl}/mobile/blog/detail/${blogId}`,
    success: (d) => {
      if (!d.success) {
        return
      }
      blogInfo = d.result
    }
  })
}

getBlogInfo()

let {mediaUrl, headImg, postTime, nickname, tagList, bloggerId} = blogInfo

document.title = `${nickname}的时尚图片`

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

  $blogImage.click(() => {
    wx.previewImage({
      current: mediaUrl, // 当前显示图片的http链接
      urls: [mediaUrl] // 需要预览的图片http链接列表
    })
  })
})

// 配置订阅按钮
if (base.is_mobile()) {
  $userIntro.append(`<a class="btn-subscribe"  href="${base.appLink()}">精选</a>`)
}

// 配置小程序
base.wxApp()

// 配置下载app
base.downloadApp(`blogId=${blogId}`)

$('.blog-user-info').attr('href', `/mobile/owner/share/${bloggerId}-${blogId}`)

$nickname.html(nickname)
$blogImage.html(`<img id="blog-image" src="${base.ossImg(mediaUrl, bodyWidth - 30)}"/>`)
$avatarImage.html(`<img id="blog-image" src="${base.ossImg(headImg, 36)}"/>`)
$postTime.html(postTime.split(' ')[0])
if (tagList.length > 0) {
  let html = tagList.map((tag) => {
    return `<li># ${tag.content}</li>`
  })
  $blogTag.html(html)
}

