import base from '../../../common/baseModule'
import {ToTop} from '../../../components/WaterFall/WaterFallBase'

// header初始化
base.channel(3)

// 我的频道显示
document.querySelectorAll('[data-channel="1"]')[0].classList.add('current')
// $('[data-channel="1"]').addClass('current');

document.addEventListener('scroll', () => {
  let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
  if (scrollTop > 50) {
    base.headerChange('white')
  } else {
    base.headerChange()
  }
  // 视差,safari scrollTop可为负
  // (scrollTop <= 300 && scrollTop >= 0) && $('.banner').css('background-position', `center ${scrollTop / 1.5}px`);
})

function toTop() {
  document.documentElement.scrollTop = 0
  document.body.scrollTop = 0
}

// 置顶
function renderToTop() {
  let toTopEl = document.getElementById('btn-to-top')
  let parentEl = document.getElementById('df-side-wrapper')

  if (!parentEl) {
    // 无节点则创建
    parentEl = document.createElement('div')
    parentEl.id = 'df-side-wrapper'
    document.getElementById('content').appendChild(parentEl)
  }

  // 置顶按钮已存在则跳出
  if (toTopEl) {
    return
  }

  toTopEl = document.createElement('div')

  let firstEl = parentEl.getElementsByClassName('btn')[0]
  toTopEl.id = 'btn-to-top'
  // 置顶按钮插在第一位
  if (firstEl) {
    parentEl.insertBefore(toTopEl, firstEl)
  } else {
    parentEl.appendChild(toTopEl)
  }
  ReactDOM.render(
    <ToTop show={this.state.toTop} toTop={toTop()}/>,
    document.getElementById('btn-to-top')
  )
}

renderToTop()

// 模版信息与默认数据
let tpl = `<div class="file-item">
                    <a href="{url}" target="{name}" class="file-cover">
                        <div class="cover-0" style="background-image: url({cover_0})"></div>
                        <div class="cover-1" style="background-image: url({cover_1})"></div>
                        <div class="cover-2" style="background-image: url({cover_2})"></div>
                        <div class="cover-3" style="background-image: url({cover_3})"></div>
                    </a>
                    <div class="file-footer">
                        <button class="iconfont btn-effect btn-edit-name" data-id={id}>&#xe613;</button>
                        <div class="file-name">
                            <a href="{url}" target="{name}">{name}</a>
                            <input class="edit-file-name" type="text" value="{name}" placeholder="输入精选集名称(最多15个字符)" data-id="{id}"/>
                        </div>
                        <div class="file-item-num">共有{num}枚</div>
                        <div class="icon-pane">
                            
                        </div>
                        <div class="icon-share-folder {showShareIcon}"></div>
                    </div>
                </div>`
let defaultFolder = `<div class="file-item">
                    <a href="{url}" target="{name}" class="file-cover">
                        <div class="cover-0" style="background-image: url({cover_0})"></div>
                        <div class="cover-1" style="background-image: url({cover_1})"></div>
                        <div class="cover-2" style="background-image: url({cover_2})"></div>
                        <div class="cover-3" style="background-image: url({cover_3})"></div>
                    </a>
                    <div class="file-footer">
                        <div class="file-name">
                            <a href="{url}" target="{name}">{name}</a>
                        </div>
                        <div class="file-item-num">共有{num}枚</div>
                        <div class="icon-share-folder {showShareIcon}"></div>
                    </div>
                </div>`
let defaults = {
  id: '',
  name: '',
  num: 0,
  cover_0: '',
  cover_1: '',
  cover_2: '',
  cover_3: ''
}
let favoriteData = []

let $fileList = $('#file-list')

// 获取我的精选列表
let folderPage = 0
getFolderList()

function getFolderList() {
  base.request({
    type: 'GET',
    url: `${base.baseUrl}/favorite/list`,
    data: {
      start: 30 * (folderPage++),
      pageSize: 30
    }
  }).done((d) => {
    if (d.success) {
      if (d.result.resultList.length > 0) {
        renderList(preDealData(d.result.resultList))
        getFolderList()
      }
    }
  }).fail(() => {

  })
}

// 精选集url
function userType(item) {
  if (item.shared === 3) {
    return `/folder/work/${item.id}`
  }
  return `/users/favorite-content/${item.id}`
}

// 处理精选集数据
function preDealData(data) {
  let temp = []
  data.forEach((item) => {
    let _data = {
      id: item.id,
      url: userType(item),
      name: item.name,
      shared: item.shared,
      showShareIcon: item.shared === 1 ? 'hidden' : '',
      num: item.folderCount || 0
    }
    item.mediaUrls.forEach((url, i) => {
      _data[`cover_${i}`] = base.ossImg(url, 142)
    })
    temp.push(_data)
  })
  return temp
}

function renderList(data) {
  let html = ''
  data.forEach((item) => {
    html += renderItem(item)
  })
  $fileList.append(html)
}

function renderItem(data) {
  let _data = $.extend({}, defaults, data)
  favoriteData[_data.id] = _data
  if (_data.name === '默认精选集') {
    let el = $(defaultFolder.format(_data))
    el.addClass('file-item-default')
    _data.num !== 0 && $('.file-add').after(el)
    return ''
  }
  if (_data.shared === 3) {
    return defaultFolder.format(_data)
  }

  return tpl.format(_data)
}

// 编辑项处理
function editReset() {
  let $t = $fileList.find('.edit input').eq(0)
  if ($t.length === 0) {
    return
  }

  let $all = $fileList.find('.file-item'),
    $loading = $fileList.find('.edit .icon-pane').eq(0),
    $cover = $fileList.find('.edit .file-cover').eq(0),
    ani = base.animationBtn($loading),
    val = $t.val().removeNBSP().trim()
  if (val.length > 15) {
    // $t.val(val.substr(0, 15));
    warning.move($t).show('long')
    return
  }
  // 防止重复点击
  if ($t.attr('readonly') === 'readonly') {
    return
  }
  if ($t.hasClass('edit-file-name')) {
    // 取出旧值
    let id = $t.data('id'),
      oldText = favoriteData[id].name

    // 编辑,val为空或者等于旧值，跳出
    if (!val || oldText === val) {
      $all.removeClass('edit')
      return
    }

    ani.loading()
    $t.attr('readonly', true)
    editFavorite($t, (d) => {
      if (d.success) {
        favoriteData[id].name = val
        $t.prev().html(val)
        ani.success(() => {
          $t.attr('readonly', false)
          $all.removeClass('edit')
          df_alert({
            tipImg: $cover.clone(),
            mainText: '成功修改精选集名称为',
            subText: val
          })
        })
      } else {
        ani.cancel()
        $t.attr('readonly', false)
        if (d.errorCode === 'D03') {
          warning.move($t).show('repeat')
          return
        }
        df_alert({
          type: 'warning',
          tipImg: $cover.clone(),
          mainText: '未能修改精选集名称为',
          subText: name
        })
      }
    }, () => {
      $t.attr('readonly', false)
    })
  } else {
    // 新增,val为空跳出
    if (!val) {
      $t.val('')
      $all.removeClass('edit')
      return
    }
    ani.loading()
    $t.attr('readonly', true)
    newFavorite($t, (d) => {
      if (d.success) {
        ani.success(() => {
          let html = renderItem({
            id: d.result,
            name: val,
            url: `/users/favorite-content/${d.result}`,
            shared: 1,
            showShareIcon: 'hidden',
          })
          $t.val('')
          // 选择新建精选集插入位置
          let $el = $('.file-item-default').length > 0 ? $('.file-item-default') : $('.file-add')
          $el.after(html)

          // 修改数量
          let $folderNum = $('.folder-num')
          let oldNum = $folderNum.html()
          $folderNum.html(Number(oldNum) + 1)
          df_alert({
            tipImg: $(html).find('.file-cover').eq(0).clone(0),
            mainText: '成功创建精选集',
            subText: val
          })
          $t.attr('readonly', false)
          $all.removeClass('edit')
        })
      } else {
        $t.attr('readonly', false)
        ani.cancel()
        if (d.errorCode === 'D03') {
          warning.move($t).show('repeat')
          return
        }
        df_alert({
          type: 'warning',
          mainText: '未能加入精选集',
          subText: name
        })
      }
    }, () => {
      $t.attr('readonly', false)
    })
  }
}

// 编辑项还原
function resetInput() {
  let $t = $fileList.find('.edit input').eq(0),
    $all = $fileList.find('.file-item')
  $t.val('')
  $all.removeClass('edit')
}

// 精选集编辑操作
$fileList.on('click', '.btn-edit-name', function (e) {
  resetInput()// 还原所有input
  let $btn = $(this),
    $item = $btn.parents('.file-item'),
    $input = $item.find('.edit-file-name').eq(0),
    id = $btn.data('id'),
    val = favoriteData[id].name
  $item.addClass('edit')
  $input.val(val).select().focus()
  e.stopPropagation()
  return false
}).on('keydown', 'input', (e) => {
  if (e.keyCode === 13) {
    editReset()
  }
})

$('body').on('click', (e) => {
  editReset()
}).on('click', 'a:not(.btn-logout), input,.file-cover', (e) => {
  e.stopPropagation()
})

function editFavorite($el, cb, error) {
  base.request({
    type: 'POST',
    data: {
      name: $el.val(),
      id: $el.data('id')
    },
    url: `${base.baseUrl}/folder/modify`
  }).done((d) => {
    cb && cb(d)
  }).fail(() => {
    error && error()
  })
}

// 添加精选集
$('.file-add').on('click', '.file-cover,.file-name a', function (e) {
  if ($(this).parents('.file-add').hasClass('edit')) return
  resetInput()// 还原所有input
  let $input = $('.new-file-name')
  let $item = $input.parents('.file-item')
  $item.addClass('edit')
  $input.select().focus()
  e.stopPropagation()
})

$fileList.on('click', '.file-item.file-cover-new', () => {
  console.log(121212)
})

function newFavorite($el, cb, error) {
  base.request({
    type: 'POST',
    data: {name: $el.val()},
    url: `${base.baseUrl}/favorite/create`
  }).done((d) => {
    cb && cb(d)
  }).fail(() => {
    error && error()
  })
}

// input tip
let warning = {
  $el: $('.tip-warning'),
  nameRepeat: '名称重复，请重新输入',
  nameTooLong: '不能超过15个字符',
  lock: false,
  show(type) {
    let self = this
    self.lock = true
    type === 'long' && self.$el.html(self.nameTooLong).addClass('show')
    type === 'repeat' && self.$el.html(self.nameRepeat).addClass('show')
    setTimeout(() => {
      self.lock = false
      self.hide()
    }, 2000)
  },
  hide() {
    this.$el.removeClass('show')
  },
  move(el) {
    let self = this
    this.preEvent(() => {
      self.$el.appendTo(el.parent())
      el.focus()
    })
    return self
  },
  preEvent(callback) {
    !this.lock && callback()
  }
}

// 事件监控
$fileList.on('click', '.file-cover', (e) => {
  e.stopPropagation()
})
