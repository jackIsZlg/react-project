
import base from '../../common/baseModule'

class MessageContent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      content: props.content,
      type: props.type
    }
  }
  render() {
    const urlType = {
      1: '/owner/1', // '博主详情页',
      2: '/folder/public/1', // '精选集详情页',
      3: '/blog/detail/19533198', // 图片详情页
      4: '/show/designer/3306?showId=12540', // '秀场图集页',
      5: '外链',
      6: 'ordering/index?season=2019春夏&brand=BELSTAFF&category=', // '订货会图集页',
      7: '文章页',
    }
    const { content, type } = this.state
    const { title, onclickJson } = content
    let contentDom = title
    // 动态 // 通知
    console.log('type', type)
    if (type === 8 || type === 4) {
      if (onclickJson && onclickJson.length) {
        for (let i = onclickJson.length - 1; i >= 0; i--) {
          console.log('slice', onclickJson[i].response)
          if (onclickJson[i].response) {
            let href = ''
            if (onclickJson[i].userId || (onclickJson[i].userIdList && onclickJson[i].userIdList[0])) {
              href = `/users/folder/detail/${onclickJson[i].userId || onclickJson[i].userIdList[0]}`
            }
            if (onclickJson[i].bloggerId) {
              href = `/owner/${onclickJson[i].bloggerId}`
            }
            if (onclickJson[i].folderId) {
              href = `/folder/public/${onclickJson[i].folderId}`
            }
            contentDom = contentDom.replace(contentDom.slice(onclickJson[i].start, onclickJson[i].end), `<a key=${i} class='content-jump' target='_blank' href=${href}>${contentDom.slice(onclickJson[i].start, onclickJson[i].end)}</a>`)
          }
        }
      }
    }
    
    console.log('contentDom', contentDom)
    return (
      <div className='msg-content-item' dangerouslySetInnerHTML={{ __html: contentDom}}>
      </div>
    )
  }
}

export default MessageContent

