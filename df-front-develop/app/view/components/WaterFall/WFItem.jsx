import classNames from 'classnames'
import LoadImage from '../base/LoadImage'
import base from '../../common/baseModule'
import {Icon} from '../../components/base/baseComponents'

let showCancelBtn = function (data) {
  if (!this.props.isCancelFolder) {
    return false
  }

  if (this.props.wfType === 'folderShare' && data.shared === 1) {
    return true
  }

  if (this.props.wfType === 'folder' && data.favoriteId !== 0) {
    return true
  }

  return false
}
let handleCancelFolder = function () { // 取消精选
  let self = this
  window.df_confirm({
    header: '取消精选',
    content: '确定要取消精选这张时尚图片？',
    success: () => {
      base.request({
        type: 'POST',
        url: `${base.baseUrl}/favorite/cancel`,
        data: {
          favoriteId: self.props.data.favoriteId,
          folderId: self.props.folderId,
        }
      }).done((d) => {
        if (d.success) {
          self.props.handleCancelFolder()
          df_alert({
            tipImg: self.props.data.mediaUrl,
            mainText: '成功取消精选',
          })
        } else {
          df_alert({
            type: 'warning',
            tipImg: self.props.data.mediaUrl,
            mainText: '未能取消精选',
          })
        }
      })
    }
  })
}

let handleToOwner = function () {
  const {props} = this
  const {wfType, outIndex, seeBlogger} = props
  const {id, bloggerId, nickname, wfItemType} = props.data
  let content = {}
  switch (wfType) {
    case 'recommendBlog':
      base.eventCount.add('1040', {
        '来源页面': '单图推荐',
        '博主Id': bloggerId,
        '图片位置': outIndex
      })
      break
    case 'index':
      base.eventCount.add('1086', {
        '登录状态': !base.LS().userId ? '未登陆' : '已登陆',
        '图片ID': id,
        '博主ID': bloggerId
      })
      break
    default:
      break
  }

  if (wfItemType === 'ins') {
    content.blogger_id = bloggerId
    for (let key in seeBlogger) {
      content[key] = seeBlogger[key]
    }
    base.ajaxList.addPoint(2300001, content)
    window.open(`${base.baseUrl}/owner/${bloggerId}`, nickname)
  }

  wfItemType === 'runway' && window.open(`${base.baseUrl}/show/designer/${bloggerId}`, nickname)
}

// 精选按钮
class BtnFollow extends React.Component {
  render() {
    return (
      <button className="add-folder btn-effect btn-red btn-round"
        onClick={this.props.handleSelectPop}
      >
        <Icon type="follow-blog"/>精选
      </button>
    )
  }
}

// 默认
class WFItemIns extends React.Component {
  constructor(props) {
    super(props)
    // 默认数据
    this.state = {
      isEditor: base.LS().isEditor
    }
  }
  componentDidMount() {
    if (this.props.wfType === 'classify') {
      if (base.LS().isEditor === undefined || base.LS().editor === 'undefined') {
        base.request({
          'type': 'GET',
          'url': `${base.baseUrl}/v1/gallery/editor-auth-check`
        }).done((d) => {
          base.LS.set({ isEditor: d.result })
          this.setState({ isEditor: d.result })
        }).fail()
      }
    }
  }
  cancelClassify(postId, e) {
    e.stopPropagation()
    window.df_confirm({
      header: '隐藏图片',
      content: '确定要隐藏这张图片？',
      success: () => {
        base.request({
          type: 'POST',
          url: `${base.baseUrl}/v1/gallery/editor-del-post`,
          data: { postId }
        }).done((d) => {
          if (d.success) {
            this.props.cancelClassify(postId)
            df_alert({
              tipImg: this.props.data.mediaUrl,
              mainText: '成功隐藏图片',
            })
          } else {
            df_alert({
              type: 'warning',
              tipImg: this.props.data.mediaUrl,
              mainText: '隐藏图片失败',
            })
          }
        })
      }
    })
  }
  render() {
    const {props} = this
    const { data } = props
    const _wfItemStyle = base.setDivStyle(data)
    data._link = `/owner/${data.bloggerId}`
    return (
      <div className='water-fall-item ins shadow'
        style={_wfItemStyle}
        key={`wf-blog-${data.id}`}
        ref={`wf-blog-${data.id}`}
      >
        <div onClick={props.handleClickImg} className="water-fall-item-img">
          <LoadImage src={data.mediaUrl}
            bgColor={data.averageHue}
            width={data.width}
            height={data.height}
            aliWidth={props.columnWidth}
          />
          {props.wfType === 'classify' && this.state.isEditor ? <div className='cancel-btn' onClick={this.cancelClassify.bind(this, data.id)}>纠错</div> : null}
        </div>
        {props.isFolderBtn && <BtnFollow handleSelectPop={props.handleSelectPop}/>}
        <div className="water-fall-item-footer">
          <div className="user-info" onClick={handleToOwner.bind(this)}>
            <div className="avatar">
              <LoadImage src={data.headImg} aliWidth={26} width={26} height={26}/>
            </div>
            <div className="name">{data.nickname}</div>
          </div>
        </div>
      </div>
    )
  }
}

// 订货会分类
class WFItemOrderFolder extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      ratio: 144 / 194,
      picInfo: props.data
    }
  }

  openOrderSingle() {
    let {wfType} = this.props
    let {picInfo} = this.state
    let {brand, season, category, id} = picInfo
    let param = {
      season: !season ? '' : encodeURIComponent(season),
      brand: !brand ? '' : encodeURIComponent(brand),
      category: !category ? '' : encodeURIComponent(category)
    }
    console.log('picInfo', picInfo)
    let url = wfType === 'brandSelected' ? '/market/index?' : '/ordering/index?'
    if (wfType === 'orderFolder') {
      base.eventCount.add(5015, {'品牌ID': id})
    }
    if (wfType === 'brandSelected') {
      base.eventCount.add(6015, {'品牌ID': id})
    }
    window.open(url + base.objToSearch(param)) 
  }

  render() {
    const {picInfo} = this.state
    let {id, time, count, mediaUrl, season, brand, category} = picInfo
    const _wfItemStyle = base.setDivStyle(picInfo)
    return (
      <div className='water-fall-item ins shadow order'
        style={_wfItemStyle}
        key={`wf-blog-${id}`}
        ref={`wf-blog-${id}`}
      >
        <div onClick={this.openOrderSingle.bind(this)}
          className={classNames('water-fall-item-img', 'order')}
        >
          <div className="water-fall-img-mask">
            <div className="water-fall-time">
              <div className="time">{time.split(' ')[0]}</div>
              <div className="file-item-num">
                <Icon type='tupian1'/>
                {base.numberFormat(count)}枚
              </div>
            </div>
          </div>
          <div className="water-fall-img-scale">
            <img className={classNames({
              // 'image-display': actualRatio > 1
            })}
              src={base.ossImg(mediaUrl, 288)}
              alt=""
            />
            {
              // actualRatio <= 1 &&
              <img className='rotate-img' src={base.ossImg(mediaUrl, 288)} alt=""/>
            }
          </div>
          {/* <LoadImage wfType={this.props.wfType} */}
          {/* src={data.mediaUrl} */}
          {/* bgColor={data.averageHue} */}
          {/* width={data.width} height={data.height} aliWidth={props.columnWidth}/> */}
        </div>
        <div className="water-fall-item-footer">
          <ul className='water-fall-item-footer-tag order-folder'>
            {season && <li>{season}</li>}
            {brand && <li>{brand}</li>}
            {category && <li>{category}</li>}
          </ul>
        </div>
      </div>
    )
  }
}

// 订货会单图
class WFItemOrderMeeting extends React.Component {
  render() {
    const {props} = this
    const {data} = props
    const _wfItemStyle = base.setDivStyle(data)
    data._link = `/owner/${data.bloggerId}`

    return (
      <div className='water-fall-item ins shadow order item'
        style={_wfItemStyle}
        key={`wf-blog-${data.id}`}
        ref={`wf-blog-${data.id}`}
      >
        <div onClick={props.handleClickImg}
          className={classNames('water-fall-item-img', 'order', 'item')}
        >
          <div className="water-fall-img-mask">
            <div className="water-fall-time">
              {data.time.split(' ')[0]}
            </div>
          </div>
          <LoadImage wfType={this.props.wfType}
            src={data.mediaUrl}
            bgColor={data.averageHue}
            width={data.width}
            height={data.height}
            aliWidth={props.columnWidth}
          />
        </div>
        {props.isFolderBtn && <BtnFollow handleSelectPop={props.handleSelectPop}/>}
        <div className="water-fall-item-footer">
          <ul className='water-fall-item-footer-tag order-meeting'>
            {data.season && <li>{data.season}</li>}
            {data.brand && <li>{data.brand}</li>}
            {data.category && <li>{data.category}</li>}
          </ul>
        </div>
      </div>
    )
  }
}

// 精选集内部-ins
class WFItemInsFolder extends React.Component {
  userCount(dataLink, bloggerId) {
    let {pointContent} = this.props
    if (this.props.userCount) {
      this.props.userCount('1010004', {
        preEvent: '搜索页面',
        content: '点击进入图片博主',
        type: '4',
        typeDesc: '搜索页面'
      })
    }
    let content = {
      blogger_id: bloggerId
    }
    for (let key in pointContent) {
      content[key] = pointContent[key]
    }
    content.source_type = 'main_pic_blogger'
    base.ajaxList.addPoint(2300001, content)
    window.location.href = dataLink
  }

  render() {
    const {props} = this
    const {data} = props
    const _wfItemStyle = base.setDivStyle(data)

    let handleImgClick
    if (props.wfType === 'folderSelect') {
      handleImgClick = props.handleClickSelect
      data._link = ''
    } else {
      handleImgClick = props.handleClickImg
      let url = data.userId === base.LS().userId ? '/users/favorite-view' : `/users/folder/detail/${data.userId}`
      data._link = (data.platformId === 5 || data.platformId === 6) ? url : `/owner/${data.bloggerId}`
    }
    return (
      <div className={classNames('water-fall-item ins folder shadow', {
                'folder-select': props.wfType === 'folderSelect',
            })}
        style={_wfItemStyle}
        key={`wf-blog-${data.id}`}
        ref={`wf-blog-${data.id}`}
      >
        <div onClick={handleImgClick} className="water-fall-item-img">
          <LoadImage src={data.mediaUrl}
            bgColor={data.averageHue}
            width={data.width}
            height={data.height}
            aliWidth={props.columnWidth}
          />
          {props.wfType === 'folderSelect' &&
          <div className={classNames('iconfont select-area', {'select': data.select || false})}/>}
        </div>

        {props.isFolderBtn && <BtnFollow handleSelectPop={props.handleSelectPop}/>}

        {showCancelBtn.call(this, data) &&
        <button className="cancel-folder btn-effect btn-black btn-round"
          ref={`btn-${data.bloggerId}`}
          onClick={handleCancelFolder.bind(this)}
        >取消精选
        </button>}
        <div className="water-fall-item-footer">
          <div className="user-info">
            {
              data._link ?
                <a onClick={this.userCount.bind(this, data._link, data.bloggerId)} target={data.nickname} className="avatar">
                  <LoadImage src={data.headImg} aliWidth={26} width={26} height={26}/>
                </a> 
                : 
                <a className="avatar">
                  <LoadImage src={data.headImg} aliWidth={26} width={26} height={26}/>
                </a>
            }
            {
              data._link ?
                <a href={data._link} target={data.nickname} className="name">
                  {data.nickname}
                </a>
                  : 
                <a className="name">
                  {data.nickname}
                </a>
            }
          </div>
        </div>
      </div>
    )
  }
}

// 首页新排序，喜欢or不喜欢
class WFItemInsLike extends React.Component {
  handleDislike() {
    let self = this
    let item = self.props.data

    // 不喜欢状态，跳出
    if (item.hasOwnProperty('dislike') || item.dislike) {
      return
    }
    let el = self.refs['btn-dislike']
    let ani = base.animationBtn(el)

    ani.loading()
    base.request({
      type: 'GET',
      url: `${base.baseUrl}/blog/interest`,
      data: {
        postId: item.id,
        ret: 'NO'
      }
    }).done((d) => {
      if (d.success) {
        ani.success(() => {
          item.dislike = true

          // 通知外层瀑布流管理修改数据
          self.props.handleDislike()
          df_alert({
            tipImg: base.ossImg(item.mediaUrl, self.props.columnWidth),
            mainText: '反馈已提交',
          })
        })
      } else {
        df_alert({
          type: 'warning',
          mainText: '操作失败',
        })
        ani.cancel()
      }
    }).fail(() => {
      ani.cancel()
    })
  }

  render() {
    const {props} = this
    const {data} = props
    const _wfItemStyle = base.setDivStyle(data)

    return (
      <div className='water-fall-item ins shadow'
        key={`wf-blog-${data.id}`}
        ref={`wf-blog-${data.id}`}
        style={_wfItemStyle}
      >
        <div onClick={props.handleClickImg} className="water-fall-item-img">
          <LoadImage src={data.mediaUrl}
            bgColor={data.averageHue}
            width={data.width}
            height={data.height}
            aliWidth={props.columnWidth}
          />
        </div>
        {props.isFolderBtn && <BtnFollow handleSelectPop={props.handleSelectPop}/>}
        <div className="water-fall-item-footer">
          <div className="user-info" onClick={handleToOwner.bind(this)}>
            <div className="avatar">
              <LoadImage src={data.headImg} aliWidth={26} width={26} height={26}/>
            </div>
            <div className="name">{data.nickname}</div>
            {/* <button className={ */}
            {/* classNames('btn-dislike-img btn-animation btn-round', {'isBtn': data.dislike || false}) */}
            {/* } ref="btn-dislike" onClick={this.handleDislike.bind(this)}> */}
            {/* <i className="iconfont">&#xe655;</i> */}
            {/* 不喜欢 */}
            {/* </button> */}
          </div>
        </div>
      </div>
    )
  }
}

class WFItemCollectLike extends React.Component {
  handleDislike() {
    let self = this
    let item = self.props.data

    // 不喜欢状态，跳出
    if (item.hasOwnProperty('dislike') || item.dislike) {
      return
    }
    let el = self.refs['btn-dislike']
    let ani = base.animationBtn(el)

    ani.loading()
    base.request({
      type: 'GET',
      url: `${base.baseUrl}/blog/interest`,
      data: {
        postId: item.id,
        ret: 'NO'
      }
    }).done((d) => {
      if (d.success) {
        ani.success(() => {
          item.dislike = true

          // 通知外层瀑布流管理修改数据
          self.props.handleDislike()
          df_alert({
            tipImg: base.ossImg(item.mediaUrl, self.props.columnWidth),
            mainText: '反馈已提交',
          })
        })
      } else {
        df_alert({
          type: 'warning',
          mainText: '操作失败',
        })
        ani.cancel()
      }
    }).fail(() => {
      ani.cancel()
    })
  }

  render() {
    const {props} = this
    const {data, pageType} = props
    const _wfItemStyle = base.setDivStyle(data)

    return (
      <div className='water-fall-item ins shadow'
        key={`wf-blog-${data.id}`}
        ref={`wf-blog-${data.id}`}
        style={_wfItemStyle}
      >
        <div onClick={props.handleClickImg} className="water-fall-item-img">
          <LoadImage src={data.mediaUrl}
            bgColor={data.averageHue}
            width={data.width}
            height={data.height}
            aliWidth={props.columnWidth}
          />
        </div>
        {props.isFolderBtn && <BtnFollow handleSelectPop={props.handleSelectPop}/>}
        <div className="water-fall-item-footer collect">
          {
            data.folderName && (
              <div className="user-info">
                来自精选集 <a className="folder-name" href={pageType ? `/folder/public/${data.folderId}` : `/users/favorite-content/${data.folderId}`}>{data.folderName}</a>
              </div>
            )
          }
          {/* <div className="user-info" onClick={handleToOwner.bind(this)}>
            <div className="avatar">
              <LoadImage src={data.headImg} aliWidth={26} width={26} height={26}/>
            </div>
            <div className="name">{data.nickname}</div>
          </div> */}
        </div>
      </div>
    )
  }
}

// 博主首页
class WFItemIns2 extends React.Component {
  render() {
    const {props} = this
    const {data} = props
    const _wfItemStyle = base.setDivStyle(data)

    return (
      <div className="water-fall-item ins detail shadow"
        style={_wfItemStyle}
      >
        <div onClick={props.handleClickImg} className="water-fall-item-img">
          <LoadImage src={data.mediaUrl}
            aliWidth={props.columnWidth}
            bgColor={data.averageHue}
            width={data.width}
            height={data.height}
          />
        </div>
        {props.isFolderBtn && <BtnFollow handleSelectPop={props.handleSelectPop}/>}
      </div>
    )
  }
}

// 足迹-ins
class WFItemInsHistory extends React.Component {
  render() {
    const {props} = this
    const {data} = props
    const _wfItemStyle = base.setDivStyle(data)

    return (
      <div className='water-fall-item ins history'
        style={_wfItemStyle}
      >
        <div onClick={props.handleClickImg} className="water-fall-item-img">
          <LoadImage src={data.mediaUrl}
            aliWidth={props.columnWidth}
            bgColor={data.averageHue}
            width={data.width}
            height={data.height}
          />
        </div>
        {props.isFolderBtn && <BtnFollow handleSelectPop={props.handleSelectPop}/>}

        <a onClick={handleToOwner.bind(this)} className="name">{data.nickname}</a>
      </div>
    )
  }
}

// 足迹-秀场
class WFItemRunwayHistory extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const {props} = this
    const {data} = props
    const _wfItemStyle = base.setDivStyle(data)

    return (
      <div className='water-fall-item runway history'
        style={_wfItemStyle}
      >
        <div onClick={this.props.handleClickImg} className="water-fall-item-img">
          <LoadImage src={data.mediaUrl}
            aliWidth={props.columnWidth}
            bgColor={data.averageHue}
            width={data.width}
            height={data.height}
          />
        </div>
        {props.isFolderBtn && <BtnFollow handleSelectPop={props.handleSelectPop}/>}

        <a onClick={handleToOwner.bind(this)} className="name">{data.nickname}</a>
      </div>
    )
  }
}

// 秀场首页
class WFItemRunwayHome extends React.Component {
  zhugeIo() {
    base.eventCount.add(4020, {
      '品牌ID': this.props.data.designerId,
      '秀场ID': this.props.data.showId
    })
  }

  enterRunway(id) {
    let content = {
      source_page: 'runway_index',
      source_type: 'recommended',
      show_id: id
    }
    base.ajaxList.addPoint(2310001, content)
  }

  render() {
    const {props} = this
    const {data} = props
    const _wfItemStyle = base.setDivStyle(data)

    return (
      <div className="water-fall-item home-runway detail" style={_wfItemStyle} onClick={this.zhugeIo.bind(this)}>
        <a href={`/show/designer/${data.designerId}?showId=${data.showId}`}
          rel="noopener noreferrer"
          target='_blank'
          className="water-fall-item-img"
          onClick={this.enterRunway.bind(this, data.showId)}
        >
          <LoadImage src={data.mediaUrl}
            aliWidth={props.columnWidth}
            bgColor={data.averageHue}
            width={data.width}
            height={data.height}
          />
          <div className="banner-img-footer">
            <span className="designer">{data.designer}</span>
            <span className="city hidden">{data.city},</span>
            <span className="time">{data.runwayTime && data.runwayTime.substr(0, 10)},</span>
            <span className="season">{data.season}</span>
          </div>
        </a>
      </div>
    )
  }
}

// 品牌详情
class WFItemBrand extends React.Component {
  zhugeIo() {
    base.eventCount.add(4029, {
      '秀场ID': this.props.data.showId
    })
  }
  enterRunway(id) {
    let content = {
      source_page: 'show_brand_detail',
      source_type: 'recommended',
      show_id: id
    }
    base.ajaxList.addPoint(2310001, content)
  }
  render() {
    const {props} = this
    const {data} = props
    const _wfItemStyle = base.setDivStyle(data)

    return (
      <div onClick={this.zhugeIo.bind(this)} className="water-fall-item home-runway detail" style={_wfItemStyle} >
        <a href={`/show/designer/${data.designerId}?showId=${data.showId}`} className="water-fall-item-img" onClick={this.enterRunway.bind(this, data.showId)}>
          <LoadImage src={data.mediaUrl}
            aliWidth={props.columnWidth}
            bgColor={data.averageHue}
            width={data.width}
            height={data.height}
          />
          <div className="brand-img-footer">
            <span className="season">{data.season}</span>
          </div>
        </a>
      </div>
    )
  }
}
// 秀场详情页
class WFItemRunway extends React.Component {
  render() {
    const {props} = this
    const {data} = props
    const _wfItemStyle = base.setDivStyle(data)

    let handleImgClick

    if (props.wfType === 'runwaySelect') {
      handleImgClick = props.handleClickSelect
    } else {
      handleImgClick = props.handleClickImg
    }

    return (
      <div className={classNames('water-fall-item runway detail shadow', {
        'folder-select': props.wfType === 'runwaySelect',
      })}
        style={_wfItemStyle}
      >
        <div className="water-fall-item-img"
          onClick={handleImgClick}
        >
          <LoadImage src={data.mediaUrl}
            aliWidth={props.columnWidth}
            bgColor={data.averageHue}
            width={data.width}
            height={data.height}
          />
          {props.wfType === 'runwaySelect' &&
          <div className={classNames('iconfont select-area', {'select': data.select || false})}/>}
        </div>
        {props.isFolderBtn && <BtnFollow handleSelectPop={props.handleSelectPop}/>}
      </div>
    )
  }
}

// 精选集内部-秀场
class WFItemRunwayFolder extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      avatarBg: base.getRandomColor()
    }
  }

  render() {
    const {props, state} = this
    const {data} = props
    const _wfItemStyle = base.setDivStyle(data)

    let _style = {background: state.avatarBg}
    let handleImgClick
    if (props.wfType === 'folderSelect') {
      handleImgClick = props.handleClickSelect
      data._link = ''
    } else {
      handleImgClick = props.handleClickImg
      data._link = `/show/designer/${data.bloggerId}?showId=${data.showId}`
    }
    return (
      <div className={classNames('water-fall-item runway folder shadow', {
      'folder-select': props.wfType === 'folderSelect',
    })}
        key={`wf-runway-${data.id}`}
        ref={`wf-runway-${data.id}`}
        style={_wfItemStyle}
      >
        <div onClick={handleImgClick} className="water-fall-item-img">
          <LoadImage src={data.mediaUrl}
            aliWidth={props.columnWidth}
            bgColor={data.averageHue}
            width={data.width}
            height={data.height}
          />
          {props.wfType === 'folderSelect' &&
          <div className={classNames('iconfont select-area', {select: data.select || false})}/>}
        </div>

        {props.isFolderBtn && <BtnFollow handleSelectPop={props.handleSelectPop}/>}

        {showCancelBtn.call(this, data) &&
        <button className="cancel-folder btn-effect btn-black btn-round"
          ref={`btn-${data.bloggerId}`}
          onClick={handleCancelFolder.bind(this)}
        >取消精选
        </button>}

        <div className="water-fall-item-footer">
          <div className="user-info">
            {
            data._link ?
              <a href={data._link} target={data.nickname} style={_style} className="avatar runway-avatar">
                {base.getRunwayName(data.nickname)}
              </a>
              : 
              <a className="avatar runway-avatar" style={_style} > {base.getRunwayName(data.nickname)} </a>
          }
            { data._link ? <a href={data._link} target={data.nickname} className="name" > {data.nickname}</a> : <a className="name"> {data.nickname} </a> }
          </div>
        </div>
      </div>
    )
  }
}

// 定制搜索页面
class WFItemCustomSearch extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      more: false
    }
  }

  handleMouseLeave() {
    this.setState({
      more: false
    })
  }

  handleMore() {
    this.setState({
      more: true
    })
  }

  // 单图点击，进入单图推荐页面
  handleImg() {
    const {id} = this.props.data
    window.open(`/post/recom/${id}`, `recom-${id}`)
  }

  render() {
    const {props} = this
    const {data} = props
    const _wfItemStyle = base.setDivStyle(data)

    const {postTime, bloggerTags, featureTags, textContent} = data

    data._link = `/owner/${data.bloggerId}`

    return (
      <div className="water-fall-item ins custom-search shadow"
        style={_wfItemStyle}
        key={`wf-blog-${data.id}`}
        ref={`wf-blog-${data.id}`}
      >
        <div onClick={this.handleImg.bind(this)} className="water-fall-item-img">
          <LoadImage src={data.mediaUrl}
            bgColor={data.averageHue}
            width={data.width}
            height={data.height}
            aliWidth={props.columnWidth}
          />
        </div>
        {props.isFolderBtn && <BtnFollow handleSelectPop={props.handleSelectPop}/>}

        <div className="water-fall-item-footer">
          <div className="user-info">
            <a href={data._link} target={data.nickname} className="avatar">
              <LoadImage src={data.headImg} aliWidth={26} width={26} height={26}/>
            </a>
            <a href={data._link} target={data.nickname} className="name">{data.nickname}</a>
            <div className="more" onClick={this.handleMore.bind(this)}>more</div>
          </div>
          <ul className={classNames('more-info', {hidden: !this.state.more})}
            onMouseLeave={this.handleMouseLeave.bind(this)}
          >
            <li>
              <span className="title">PostId：</span>{data.id}
            </li>
            <li>
              <span className="title">博主标签：</span>
              {bloggerTags.map((tag, index) => {
                let key = `blogger-tag-${index}`
                return <span className="tag" key={key}>{tag}</span>
              })}

            </li>
            <li>
              <span className="title">识别标签：</span>
              {featureTags.map((tag, index) => {
                let key = `feature-tag-${index}`
                return <span className="tag" key={key}>{tag}</span>
              })}
            </li>
            <li>
              <span className="title">textContent：</span>
              {textContent}
            </li>
            <li>
              <span className="title">发布时间：</span>
              {postTime}
            </li>
          </ul>
        </div>
      </div>
    )
  }
}

class WFItemUpload extends React.Component {
  openHandleUpload(folderId) {
    const {handleUpload} = this.props

    handleUpload && handleUpload(folderId)
  }

  render() {
    const {props} = this
    const {data, folderId} = props
    const _wfItemStyle = base.setDivStyle(data)
    data._link = `/owner/${data.bloggerId}`

    return (
      <div className='water-fall-item ins upload-add'
        style={_wfItemStyle}
        key={`wf-blog-${data.id}`}
        ref={`wf-blog-${data.id}`}
      >
        <div className="upload-add-icon"
          onClick={this.openHandleUpload.bind(this, folderId)}
        >
          <Icon type='new-folder-2'/>
          点击添加精选
        </div>
      </div>
    )
  }
}

export {
  WFItemIns,
  WFItemIns2,
  WFItemInsHistory,
  WFItemInsLike,
  WFItemInsFolder,
  WFItemRunway,
  WFItemRunwayFolder,
  WFItemRunwayHistory,
  WFItemCustomSearch,
  WFItemOrderMeeting,
  WFItemOrderFolder,
  WFItemRunwayHome,
  WFItemBrand,
  WFItemUpload,
  WFItemCollectLike
}