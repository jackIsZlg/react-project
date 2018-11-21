import base from '../../../mobile_common/baseModule'

let imgWidth = Math.floor((document.documentElement.clientWidth - 45) / 2),
  bloggerInfo = {},
  $ownerInfo = $('.owner-info'),
  $avatarimage = $('.avatar'),
  $nickname = $('.nickname'),
  $ownerShare = $('#owner-share')

$.ajax({
  url: `${base.baseUrl}/mobile/owner/share-data/${bloggerId}-${blogId || ''}`,
  type: 'GET',
  async: false,
  success(d) {
    if (!d.success) {
      return
    }
    bloggerInfo = d.result
  }
})

let {blogList: imageList, headImg, nickname} = bloggerInfo
$ownerInfo.css('background-image', `url(${headImg}?x-oss-process=image/resize,w_30)`)
$avatarimage.html(`<img src="${base.ossImg(headImg, 62)}"/>`)
$nickname.html(nickname)

render()

document.title = `博主 ${nickname}`

// 配置微信分享
base.wechatConfig([], () => {
  base.shareConfig({
    title: document.title, // 分享标题
    desc: 'DeepFashion-每天都想刷的时尚', // 分享描述
    link: location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
    imgUrl: base.ossImg(headImg, 100), // 分享图标
    success() {
      // 用户确认分享后执行的回调函数
    },
    cancel() {
      // 用户取消分享后执行的回调函数
    }
  })
})

// 配置小程序
// base.wxApp();

// 配置下载app
base.downloadApp(`bloggerId=${bloggerId}`)


// 配置app内打开
if (base.is_iphone()) {
  $ownerInfo.append(`<a class="btn-sub btn-blue" href="${base.appLink()}?bloggerId=${bloggerId}">订阅</a>`)
  $ownerShare.append(`<div class="open-app">
                            <a class="new-download-btn btn-blue" href="javascript:;">打开App,查看更多内容</a>
                        </div>`)
  $('.new-download-btn').on('click', () => {
    base.oppenApp(`bloggerId=${bloggerId}`)
  })
}

function render() {
  let leftHtml = '',
    leftHeight = 0,
    rightHtml = '',
    rightHeight = 0
  imageList.forEach((item) => {
    let _scale = imgWidth / item.width,
      _height = item.height * _scale,
      _html = `<a href="/mobile/blog/share/${item.id}">
                        <img src="${base.ossImg(item.mediaUrl, imgWidth)}" height="${_height}"/>
                     </a>`
    console.log(imgWidth)
    if (leftHeight <= rightHeight) {
      leftHtml += _html
      leftHeight += _height
    } else {
      rightHtml += _html
      rightHeight += _height
    }
  })

  $('.left-pane').html(leftHtml)
  $('.right-pane').html(rightHtml)
}