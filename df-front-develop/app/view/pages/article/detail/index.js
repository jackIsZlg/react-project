import base from '../../../common/baseModule'
// 精选集弹窗
import SelectPop from '../../../components/SelectPop/SelectPop'

base.headerChange('white')

window.addEventListener('message', (e) => {
  console.log('父节点', e.data)
  let {type, value} = e.data
  if (type === 'href') {
    window.open(`${value}`)
  }

  if (type === 'subscribe-ins') {
    followBlogger(value)
  }
  if (type === 'subscribe-show') {
    followShow(value)
  }
  if (type === 'favorite') {
    favoriteImg(value)
  }
}, false)

// 订阅-博主
function followBlogger(id) {
  base.ajaxList.getBloggerDetail(id, (d) => {
    let {headImg, nickname} = d.result
    base.ajaxList.followOwner(id, (d) => {
      df_alert({
        tipImg: base.ossImg(headImg, 36),
        mainText: '成功订阅博主',
        subText: nickname
      })
    })
  })
}

// 订阅-秀场
function followShow(id) {
  base.ajaxList.getBloggerDetail(id, (d) => {
    let {nickname} = d.result
    base.ajaxList.followOwner(id, (d) => {
      df_alert({
        mainText: '成功订阅秀场',
        subText: nickname
      })
    })
  })
}

// 精选
function favoriteImg(id) {
  let wrapperEl = document.getElementById('select-pop-wrapper')

  if (!!wrapperEl.innerHTML) {
    wrapperEl.innerHTML = ''
  }

  ReactDOM.render(<SelectPop blogId={id}
    wfType='wxArticle'
    outIndex={0}
    handleAddFolder={() => {
                               }}
    hidden={false}
  />, wrapperEl)
  base.eventCount.add(1017, {
    '来源页面': '微信文章',
    '图片Id': id
  })
  // base.ajaxList.getInsImgDetail(id, (d) => {
  //     let {mediaUrl, nickname} = d.result.post;
  //
  // });
}