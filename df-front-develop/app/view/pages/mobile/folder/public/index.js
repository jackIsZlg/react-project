
import base from '../../../../mobile_common/baseModule'

const PAGE_SIZE = 10
let start = 0
let folder = {
  id: folderId
}
let imgWidth = Math.floor(($('.image-list').width() - 15) / 2)
let folderImg = []
let $folderName = $('.folder-info .name')
let $folderIntro = $('.folder-info .intro')
let $folderNum = $('.folder-info .num')
// let $folderTag = $('.folder-info .tag')
let $folderAvatar = $('.folder-info .avatar')
let $creatorName = $('.folder-info .creator-name')
let $folderButton = $('.collect-btn')
let $loading = $('#loading')
let leftHeight = 0
let rightHeight = 0
let loading = false

// 获取精选集详情
$.ajax({
  url: `${base.baseUrl}/mobile/folder/detail?folderId=${folder.id}`,
  type: 'GET',
  async: false,
  success(d) {
    if (!d.success) {
      return
    }
    folder = { ...folder, ...d.result }
    renderInfo()
    loadData()
  }
})

function renderInfo() {
  // document.title = `精选集 ${folder.name}`
  $folderName.html(folder.name)
  !!folder.comment && $folderIntro.html(`<p>${folder.comment.replace(/\n/g, '').replace(/\s/g, '&nbsp;')}</p>`)
  $folderNum.html(`${base.numberFormat(folder.postCount)}张图片`)
  $folderAvatar.css({
    backgroundImage: `url(${base.ossImg(folder.creator.avatar, 46)})`
  })
  $creatorName.html(folder.creator.creatorName)
  // $folderTag.html(folder.tagArray && folder.tagArray.length && folder.tagArray.map((tag) => {
  //   return `<li># ${tag}</li>`
  // }).join(''))
}

$folderButton.on('click', () => {
  window.location.href = base.appLink()
})

/**
 * 加载图片数据
 * @param {Number} start 起始数量
 * @param {Number} size 页面尺寸
 */
function loadData() {
  loading = true
  $loading.show()
  $.ajax({
    url: `${base.baseUrl}/blog/folder/${folder.id}?start=${start}&pageSize=${PAGE_SIZE}`,
    type: 'GET',
    success(d) {
      if (!d.success) {
        return
      }
      if (d.result === null) {
        $loading.html('没有更多了！')
        return 
      }
      $loading.hide()
      start += PAGE_SIZE
      renderImg(d.result.resultList)
      shareContent(d.result.resultList)
      loading = false
    }
  })
}
window.addEventListener('scroll', () => {
  console.log(loading)
  if (document.documentElement.scrollHeight - document.documentElement.clientHeight
     <= (document.body.scrollTop + 10) && !loading) {
    loadData()
  }
}, false)
function renderImg(folderImg) {
  let leftHtml = ''
  let rightHtml = ''
  folderImg.forEach((item) => {
    let { mediaUrl, id, width, height } = item
    let _scale = imgWidth / width
    let _height = height * _scale
    let _html = `<div class="item">
                  <a class="img" href="/mobile/blog/share/${id}">
                    <img src="${base.ossImg(mediaUrl, imgWidth)}" height="${_height}"/>
                  </a>
                </div>`
    if (leftHeight <= rightHeight) {
      leftHtml += _html
      leftHeight += _height
    } else {
      rightHtml += _html
      rightHeight += _height
    }
  })

  $('.left-pane').append(leftHtml)
  $('.right-pane').append(rightHtml)
}

// 配置下载app
base.downloadApp(`folderId=${folder.id}`)

// 配置app内打开
// if (base.is_iphone()) {
//   $folderShare.append(`<div class="open-app">
//                             <a class="new-download-btn btn-blue" href="javascript:;">打开App,查看更多精选集</a>
//                         </div>`)

// base.oppenApp(`folderId=${folder.id}`)
// }

function shareContent(folderImg) {
  let creatorName = folder.creator.creatorName.length > 7 ? `${folder.creator.creatorName.slice(0, 7)}...` : folder.creator.creatorName
  let folderName = folder.name.length > 20 ? `${folder.name.slice(0, 20)}...` : folder.name
  let title = `${creatorName}的精选集：${folderName}`
  // 配置微信分享
  base.wechatConfig([], () => {
    base.shareConfig({
      title, // 分享标题
      desc: folder.intro || 'DeepFashion-每天都想刷的时尚', // 分享描述
      link: window.location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
      imgUrl: base.ossImg((folder.mediaUrls.length && folder.mediaUrls[0]) || (folderImg.length && folderImg[0].mediaUrl), 100), // 分享图标
      success() {
      // 用户确认分享后执行的回调函数
      },
      cancel() {
      // 用户取消分享后执行的回调函数
      }
    })
  })
}