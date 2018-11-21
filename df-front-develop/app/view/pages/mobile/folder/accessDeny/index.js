import base from '../../../../mobile_common/baseModule'

base.downloadApp('')

let folder = {
  id: Number(window.location.search.split('=')[1]) || 1
}
$.ajax({
  'url': `${base.baseUrl}/mobile/folder/detail?folderId=${folder.id}`,
  'type': 'GET',
  'async': false,
  'success': (d) => {
    if (d.success) {
      folder = {...folder, ...d.result}
    }
  }
})
document.title = `精选集 ${folder.name}`
$('.info .name').html(folder.name)
$('.info .avatar div').css({
  'backgroundImage': `url(${base.ossImg(folder.creator.avatar, 22)})`
})

