import className from 'classnames'
import { Icon } from '../base/baseComponents'
import base from '../../common/module/baseModule'
// 默认文件夹
class Folder extends React.Component {
  seeSelfFolder() {
    let content = {
      source_page: this.props.pointContent ? this.props.pointContent.source_page : 'user_albums',
      source_type: 'main_album',
      album_id: this.props.id
    }
    base.ajaxList.addPoint(2200001, content)
  }

  render() {
    const { url, name, num, cover_0, cover_1, cover_2, shared, isPrivate, handleEdit, openType } = this.props

    return (
      (!openType || isPrivate !== 1) &&
      <div className="file-item">
        <a href={url} rel="noopener noreferrer" target='_blank' className="file-cover-new" ref="file-cover" onClick={this.seeSelfFolder.bind(this)}>
          <div className="cover-0" style={cover_0} />
          <div className="cover-1" style={cover_1} />
          <div className="cover-2" style={cover_2} />
        </a>
        <div className="folder-icon-list">
          {(shared !== 1 && shared !== 4) && <i className="icon-share-folder" />}
          {isPrivate === 1 && <i className="icon-private-folder" />}
        </div>
        <div className="file-item-num">
          <Icon type="folder-num" />{base.numberFormat(num)}枚
        </div>

        <div className="file-footer">
          {
            shared !== 3 && shared !== 4 && !openType && name !== '默认精选集' &&
            <button className="btn-effect btn-edit-name"
              onClick={handleEdit}
            >
              {/* <Icon type="folder-edit"/> */}
              编辑
            </button>
          }
          <div className="file-name">
            <a href={url} target={name}>{name}</a>
          </div>
        </div>
      </div>
    )
  }
}

// 推荐精选集
class FolderRecommended extends React.Component {
  getCollect(id) {
    let { handleEdit, handleEditNotCollected, colleced } = this.props

    if (!colleced) {
      handleEdit && handleEdit(id)
      return
    }
    handleEditNotCollected && handleEditNotCollected(id)
    base.eventCount.add(1050, {
      '用户ID': base.LS().id,
      '精选集ID': id
    })
  }

  seeFolder() {
    let { seeFolderContent } = this.props
    let content = seeFolderContent
    base.ajaxList.addPoint(2200001, content)
  }

  render() {
    const { id, num, url, createrName, folderName, colleced, cover_0, cover_1, cover_2, recommended } = this.props

    return (
      <div className={className('file-item', {
        'recommended-folder': recommended
      })}
      >
        <a href={url} target={createrName} className="file-cover-new" ref="file-cover" onClick={this.seeFolder.bind(this)}>
          <div className="cover-0" style={cover_0} />
          <div className="cover-1" style={cover_1} />
          <div className="cover-2" style={cover_2} />
        </a>
        <div className="file-item-num">
          <Icon type="folder-num" />{base.numberFormat(num)}枚
        </div>
        {
          recommended ?
            <div className="file-footer recommended">
              <button className={className('btn-collect', {
                'collected': !colleced
              })}
                onClick={this.getCollect.bind(this, id)}
              >
                {
                  !!colleced ?
                    '已收藏'
                    :
                    <div>
                      <Icon type='follow-blogger' />收藏
                    </div>
                }
              </button>
              <div className="file-name recommended">
                <a href={url} target={folderName}>{folderName}</a>
                <div className='file-creator'>by <span>{createrName}</span></div>
              </div>
            </div> :
            <div className="file-footer recommended">
              <button className={className('btn-collect', {
                'collected': !colleced
              })}
                onClick={this.getCollect.bind(this, id)}
              >
                {
                  !!colleced ?
                    '已收藏'
                    :
                    <div>
                      <Icon type='follow-blogger' />收藏
                    </div>
                }
              </button>
              <div className="file-name recommended">
                <a href={url} target={folderName}>{folderName}</a>
              </div>
            </div>

        }
      </div>
    )
  }
}

// 精选集首页列表专用
class Folderlist extends React.Component {
  getCollect(id) {
    let { handleEdit, handleEditNotCollected, colleced, changeStatus } = this.props
    if (!base.LS().userId) {
      base.login(() => {
        base.loadFunctionColumn() 
      })
      return
    }
    if (!colleced) {
      handleEdit ? handleEdit(id) : base.ajaxList.folderCollected(id, () => {
        changeStatus && changeStatus(id)
      })
      return
    }

    handleEditNotCollected ? handleEditNotCollected(id) : base.ajaxList.folderCollectedCencel(id, () => {
      changeStatus && changeStatus(id)
    })

    base.eventCount.add(1050, {
      '用户ID': base.LS().id,
      '精选集ID': id
    })
  }

  clickEnter() {
    let { id } = this.props
    let content = this.props.pointContent || {
      source_page: 'album_index',
      source_type: 'hot_recommended'
    }
    content.album_id = id
    base.ajaxList.addPoint(2200001, content)
  }

  renderImgNum(props) {
    let {cover_0, cover_1, cover_2, cover_3, url, createrName} = props
    if (cover_0 && cover_1 && cover_2 && cover_3) {
      return (
        <a href={url} onClick={this.clickEnter.bind(this)} target={createrName} className="file-cover-new" ref="file-cover">
          <div className="cover-0" style={cover_0} />
          <div className="cover-1" style={cover_1} />
          <div className="cover-2" style={cover_2} />
          <div className="cover-3" style={cover_3} />
        </a>
      )
    }
    if (cover_0) {
      return (
        <a href={url} onClick={this.clickEnter.bind(this)} target={createrName} className="file-cover-new" ref="file-cover">
          <div className="cover-4" style={cover_0} />
        </a>
      )
    }

    const imgSObj = {
      backgroundImage: `url(${base.ossImg('', 288)})`
    }
    return (
      <a href={url} onClick={this.clickEnter.bind(this)} target={createrName} className="file-cover-new" ref="file-cover">
        <div className="cover-4" style={imgSObj} />
      </a>
    )
  }

  renderImg(props) {
    let {cover_0, cover_1, cover_2, cover_3, cover_4, url, createrName, firstFolder} = props
    let cover = [cover_0, cover_1, cover_2, cover_3, cover_4]
    return (
      <a href={url} onClick={this.clickEnter.bind(this)} target={createrName} className="file-cover-new" ref="file-cover">
        {
          firstFolder && <div className="first">首选</div>
        }
        {
          cover && cover.map((item, index) => item && <div className={`cover-${index}`} style={item}/>)
        }
      </a>
    )
  }

  render() {
    const {
      id, num, url, createrName, folderName, colleced,
      cover_0, cover_1, cover_2, cover_3, recommended, viewCount, isIns
    } = this.props

    if (isIns) {
      return (
        <div className='file-item folder-index-list ins'>
          {this.renderImg(this.props)}
          <div className="file-item-num">
            图片 {base.numberFormat(num)}
          </div>
          <div className="file-footer recommended">
            {
              colleced === 2 && 
              <button className='btn-collect collected cursor'>
                已收藏
              </button>
            }
            {
              colleced !== 2 && 
              <button className={className('btn-collect', {
                'collected': !!colleced
              })}
                onClick={this.getCollect.bind(this, id)}
              >
                {
                  !!colleced ?
                    '已收藏'
                    :
                    '收藏'
                }
              </button>
            }
            <div className="file-name">
              <a href={url} target={folderName}>{folderName}</a>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className={className('file-item', {
        'folder-index-list': true
      })}
      >
        {this.renderImgNum(this.props)}
        {
          cover_0 && cover_1 && cover_2 && cover_3 ?
            <div className="file-item-num">
              图片{base.numberFormat(num)}·浏览{base.numberFormat(viewCount)}
            </div>
            :
            <div className="file-item-num img-onlyone">
              图片{base.numberFormat(num)}·浏览{base.numberFormat(viewCount)}
            </div>
        }
        {
          recommended ?
            <div className="file-footer recommended">
              <button className={className('btn-collect', {
                'collected': !colleced
              })}
                onClick={this.getCollect.bind(this, id)}
              >
                {
                  !!colleced ?
                    '已收藏'
                    :
                    <div>
                      <Icon type='follow-blogger' />收藏
                    </div>
                }
              </button>
              <div className="file-name recommended">
                <a href={url} target={folderName}>{folderName}</a>
                <div className='file-creator'>by <span>{createrName}</span></div>
              </div>
            </div> :
            <div className="file-footer recommended">
              <button className={className('btn-collect', {
                'collected': !colleced
              })}
                onClick={this.getCollect.bind(this, id)}
              >
                {
                  !!colleced ?
                    '已收藏'
                    :
                    <div>
                      <Icon type='follow-blogger' />收藏
                    </div>
                }
              </button>
              <div className="file-name recommended">
                <a href={url} target={folderName}>{folderName}</a>
              </div>
            </div>

        }
      </div>
    )
  }
}

export { Folder, FolderRecommended, Folderlist }
