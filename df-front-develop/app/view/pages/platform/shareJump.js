/**
 * Created by gewangjie on 2017/5/17.
 *
 *  url: '', // 网址
 *  source: '', // 来源
 *  title: '', // 标题
 *  description: '', // 描述
 *  image: '', // 图片
 */

import base from '../../common/baseModule'

base.headerChange('white')

let {
    id,
    url,
    image,
    site,
    title,
    description
  } = base.hashManage._get(),
  weiboKey = 'liblin001',
  templates = {
    qzone: `http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=${url}&title=${title}&pics=${image}&desc=${description}&summary=${description}&site=DeepFashion`,
    qq: `http://connect.qq.com/widget/shareqq/index.html?url=${url}&title=${title}&source=DeepFashion&desc=${description}&pics=${image}`,
    tencent: `http://share.v.t.qq.com/index.php?c=share&a=index&title=${title}&url=${url}&pic=${image}`,
    weibo: `http://service.weibo.com/share/share.php?url=${url}&title=${title}&pic=${image}&appkey=${weiboKey}`,
    wechat: 'javascript:',
    douban: `http://shuo.douban.com/!service/share?href=${url}&name=${title}&text=${description}&image=${image}&starid=0&aid=0&style=11`,
    diandian: `http://www.diandian.com/share?lo=${url}&ti=${title}&type=link`,
    linkedin: `http://www.linkedin.com/shareArticle?mini=true&ro=true&title=${title}&url=${url}&summary=${description}&source=DeepFashion&armin=armin`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    twitter: `https://twitter.com/intent/tweet?text=${title}&url=${url}&via=DeepFashion`,
    google: `https://plus.google.com/share?url=${url}`
  }

console.log(id, url, image, site, title)


jump()

function jump() {
  if (!site) {
    alert('异常错误')
    return
  }
  if (site !== 'wechat') {
    window.location.href = templates[site]
    return
  }

  document.getElementsByClassName('share-image')[0].style.backgroundImage
    = `url(${base.ossImg(image, 140)})`
  document.getElementById('qr-code').appendChild(new AraleQRCode({
    size: 120,
    text: url,
    correctLevel: 2
  }))
  document.getElementsByClassName('wrapper')[0].classList.remove('hidden')
}

