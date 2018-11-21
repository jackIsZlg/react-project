import classNames from 'classnames'
import base from '../../common/baseModule'
import SetFolderPop from '../../components/SetFolderPop/SetFolderPop'
import {Icon, BtnSearchBlog, BtnExportIns, BtnAllRecom} from '../../components/base/baseComponents'
import {Folder} from '../FolderItem/Folder'

function CenterHeader(props) {
  const {avatar, name, intro, city, profession, openType, sex} = props
  let avatarBg = {
    backgroundImage: `url(${base.ossImg(avatar || 'https://zhiyi-image.oss-cn-hangzhou.aliyuncs.com/self-selected/1530244007170_431.png', 150)})`
  }
  let job = profession && profession.split('#')[0]
  return (
    <div className="user-center-header">
      <div className="container">
        <div className="avatar" style={avatarBg}/>
        <div className="center-basic-info">
          <div className="name">
            {name}
            {
              sex && <img src={sex * 1 === 1 ? 'https://zhiyi-image.oss-cn-hangzhou.aliyuncs.com/self-selected/1534937002980_309.png?x-oss-process=image/resize,w_1000/format,jpg/interlace,1' : 'https://zhiyi-image.oss-cn-hangzhou.aliyuncs.com/self-selected/1534937002983_547.png?x-oss-process=image/resize,w_1000/format,jpg/interlace,1'} alt=""/>
            }
          </div>
          <div className="info-row">
            { !!city &&
            <div className='city'>
              {city}
            </div>}
            {!!job &&
            <div className='profession'>
              {job}
            </div>}
          </div>
          <div className="user-intro">
            {intro && <div className="intro"><p dangerouslySetInnerHTML={{ __html: base.changeEnter(intro)}}/> </div>}
            {!openType && !intro && <a href="/users/profile-view" target="blank">点击设置个人简介</a>}
            {openType && !intro && <div className='no-intro'>暂无简介</div>}
          </div>
        </div>
        {
          !openType &&
          <a className="btn-set"
            href="/users/profile-view"
            target="blank"
          >账号设置
          </a>  
        }      
      </div>
    </div>
  )
}

function CenterNav(props) {
  const {channel, openType, uid, waterFallNull, followCount, folderCount, folderImgCount} = props

  return (
    <div className="user-center-nav">
      <ul className='container'>
        <li className={classNames({'current': channel === 1})}>
          <a href={!openType ? '/users/favorite-view' : `/users/folder/detail/${uid}`}>精选集 {base.numberFormat(folderCount) || ''}</a>
        </li>
        <li className={classNames({'current': channel === 3})}>
          <a href={!openType ? '/users/favorite-img-view' : `/users/other-favorite-img/${uid}`}>精选图片 {base.numberFormat(folderImgCount) || ''}</a>
        </li>
        <li className={classNames({'current': channel === 2})}>
          <a href={!openType ? '/users/follow-view' : `/users/foller/detail/${uid}`}>订阅列表 {base.numberFormat(followCount) || ''}</a>
        </li>
        {
                    !waterFallNull &&
                    <div>
                      <li className='follow'>
                        <BtnAllRecom source="订阅列表" text="推荐博主"/>
                      </li>
                      <li className='follow'>
                        <BtnExportIns source="订阅列表"/>
                      </li>
                      <li className='follow'>
                        <BtnSearchBlog source="订阅列表"/>
                      </li>
                    </div>
                }
      </ul>
    </div>
  )
}

function userType(item) {
  // 协作 3
  if (item.shared === 3) {
    return `/folder/work/${item.id}`
  }

  //  公开精选集 4
  if (item.shared === 4) {
    return `/folder/public/${item.id}`
  }

  //  自己创建的（2）  私有的（1）
  return `/users/favorite-content/${item.id}`
}

function preDealData(data) {
  let temp = []
  data.forEach((item) => {
    if (item.name === '默认精选集' && !item.folderCount) {
      return
    }

    let _data = {
      'id': item.id,
      'url': userType(item),
      'name': item.name,
      'shared': item.shared,
      'num': item.folderCount || 0,
      'isPrivate': item.isPrivate || 0,
      'mediaUrls': item.mediaUrls
    }
    let count = 0

    while (count < 3) {
      let url = item.mediaUrls[count] || ''
      _data[`cover_${count}`] = {
        'backgroundImage': url && `url(${base.ossImg(url)})`
      }
      count++
    }
    temp.push(_data)
  })
  return temp
}

class CenterContent extends React.Component {
  // 打开精选集编辑项
  openSetFolderPop(mode, index) {
    let c
    let editIndex
    if (mode === 'new') {
      editIndex = -1
      c = (<SetFolderPop mode={mode}
        callBack={this.props.newSuccess}
      />)
    }
    if (mode === 'edit') {
      let currentFolder = this.props.folderData[index]
      let {id, name} = currentFolder
      let folderInfo = {id, name}
      editIndex = index
      c = (<SetFolderPop mode={mode}
        getData={true}
        folderInfo={folderInfo}
        editIndex={editIndex}
        delFolder={this.props.delSuccess}
        callBack={this.props.editSuccess}
      />)
    }

    ReactDOM.render(c, document.getElementById('set-folder-pop-wrapper'))
  }

  changeFolder(select) {
    let {changeSelected} = this.props
    changeSelected && changeSelected(select)
  }

  render() {
    const {folderData, cooperationData, openType, selected, pointContent, count} = this.props
    const {create, join, collect} = count

    return (
      <div className="folder-list-content">
        <div className="container">
          <div id="file-list">
            <div className="folder-created">
              <div className="folder-created-header">
                <button className={classNames('btn-default', {
                                    'selected': selected === 1
                                })}
                  onClick={this.changeFolder.bind(this, 1)}
                >原创的 {base.numberFormat(create) || ''}
                </button>
                <button className={classNames('btn-default', {
                                    'selected': selected === 2
                                })}
                  onClick={this.changeFolder.bind(this, 2)}
                >收藏的 {base.numberFormat(collect) || ''}
                </button>
                {
                                    cooperationData &&
                                    <button className={classNames('btn-default', {
                                        'selected': selected === 3
                                    })}
                                      onClick={this.changeFolder.bind(this, 3)}
                                    >协作的 {base.numberFormat(join) || ''}
                                    </button>
                                }
              </div>
              {/* 新建 */}
              {
                                !openType && selected === 1 &&
                                <div className="file-item file-add"
                                  onClick={this.openSetFolderPop.bind(this, 'new')}
                                >
                                  <div className="file-cover-new">
                                    <Icon type="new-folder-2"/>
                                  </div>
                                  <div className="file-footer">
                                    <div className="file-name">
                                      <a>新建精选集</a>
                                    </div>
                                  </div>
                                </div>
                            }
              {/* 精选集列表 */}
              {
                                folderData && !!folderData.length && folderData.map((folder, index) => {
                                    let key = `folder-${folder.id}`
                                    return (<Folder {...folder}
                                      ref={key}
                                      handleEdit={this.openSetFolderPop.bind(this, 'edit', index)}
                                      key={key}
                                      openType={openType}
                                      pointContent={pointContent}
                                    />)
                                })
                            }

              {
                                selected === 2 && !folderData.length &&
                                <div className='folder-no-result'>
                                  <div>还没有收藏精选集哦</div>
                                  <div className='no-result-tip'>去热门精选看看吧，找到并收藏自己的专属风格</div>
                                  <a href={`${base.baseUrl}/folder/public/index`}
                                    target='_blank'
                                    className='folder-to-recommend'
                                  >热门精选
                                  </a>
                                </div>

                            }
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export {CenterHeader, CenterNav, CenterContent, preDealData}