import base from '../../../mobile_common/baseModule'

let config = {}

$('.invite-code').on('click', () => {
  // $('input').select()
  // document.execCommand('Copy')
  let clipboard = new ClipboardJS('.invite-code')
  clipboard.on('success', () => {
    $('.copy-btn-h5').html('已复制')
  })
  // base.eventCount.add(1044, {
  //     '用户ID': base.LS().id
  // })
})
$.ajax({
  url: `${base.baseUrl}/wechat/invite/getCode?inviteCode=${inviteCode}`,
  type: 'GET',
  async: false,
  success(d) {
    if (!d.success) {
      return
    }
    $('.invite-code').val(d.result.code).attr('data-clipboard-text', d.result.code)
    $('#username').text(d.result.userName)
    $('#useravator').attr({src: base.ossImg(d.result.userAvator || 'https://zhiyi-web.oss-cn-hangzhou.aliyuncs.com/deepfashion/default-avatar.png', 200)})
    config = {
      title: `${d.result.userName}邀请您加入DEEPFASHION`,
      desc: '最新最时尚的大牌订货会图片可以免费看啦！', // 分享描述
      link: window.location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
      imgUrl: base.ossImg('https://zhiyi-web.oss-cn-hangzhou.aliyuncs.com/static-web/df-share-logo.png', 100) // 分享图标
    }
  }
})

$('.other-down').on('click', () => {
  let url = base.is_iphone() ? 'https://itunes.apple.com/cn/app/deepfashion/id1239723393?l=zh&ls=1&mt=8' : 'http://df-gray.zhiyitech.cn/android/version/v1/info'
  window.location.href = url
  // window.location.href = base.appLink()
})

// 配置微信分享
base.wechatConfig([], () => {
  base.shareConfig(config)
  // base.eventCount.add(1043);
})