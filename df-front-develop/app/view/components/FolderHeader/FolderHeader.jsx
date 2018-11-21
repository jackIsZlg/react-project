import classNames from 'classnames'
import base from '../../common/baseModule'
import { Icon} from '../../components/base/baseComponents'
import {FolderOperate} from '../FolderOperate/FolderOperate'
import ShareFolder from '../ShareFolder/ShareFolder'

let identification = true

class CreatorInfo extends React.Component {
  render() {
    const {owned, createdAt, creatorName, userId} = this.props
    return (
      <a className="creator-info" href={!owned ? `/users/folder/detail/${userId}` : '/users/favorite-view'}>
        {/* <div className="avatar" style={avatar}/> */}
        <div className="creator-name">
          <div className="one-line">{creatorName}</div>
          <div className="creator-icon">{createdAt && createdAt.split(' ')[0]} 创建</div>
        </div>
      </a>
    )
  }
}

class Collectors extends React.Component {
  closeCollectorPop() {
    let el = ReactDOM.findDOMNode(this)
    el.parentNode.removeChild(el)
    delete this
    base.bodyScroll()
  }

  render() {
    const {collectors} = this.props
    return (
      <div id='collector-pop-panel'>
        <div className="collector-pop-panel">
          <div className="collector-pop-header">
            收藏者
            <Icon type='close-collect' handleClick={this.closeCollectorPop.bind(this)}/>
          </div>
          <div className='collector-pop-content'>
            <div className='collector-pop-list'>
              {collectors.map((v, i) => {
                let collectorAvatar = {
                  backgroundImage: `url(${base.ossImg(v.avatar, 54)})`
                }
                return (
                  <a key={`collector-${i}`}
                    className="collector-info"
                    href={`${base.baseUrl}/users/folder/detail/${v.userId}`}
                  >
                    <div className="collector-avatar" style={collectorAvatar}/>
                    <div className="collector-basicInfo">
                      <div className="one-line">{v.name}</div>
                      <div className="creator-icon"><span>{v.publicFolderNum}</span>精选集</div>
                    </div>
                  </a>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

class FolderHeader extends React.Component {
  openCollectorPop() {
    base.bodyScroll(false)
    let collectorEl = document.createElement('div')
    collectorEl.id = 'collector-pop-wrapper'
    document.getElementById('app').appendChild(collectorEl)
    const {id} = this.props.folderInfo
    base.ajaxList.basic({
      type: 'GET',
      url: `${base.baseUrl}/folder/collect/users`,
      data: {
        folderId: id
      }
    }, (data) => {
      data.success && ReactDOM.render(<Collectors
        collectors={data.result}
      />, document.querySelector('#collector-pop-wrapper'))
    })
  }
  // 点击收藏
  completeCollect(type) {
    if (!base.LS().userId) {
      base.login(() => {
        base.loadFunctionColumn() 
      })
      base.eventCount.add('1064')
      return
    }
    if (!identification) {
      return
    }
    identification = false

    let that = this
    let {id, folderInfo, seeFolderContent} = that.props
    let {name} = folderInfo
    let {shareCover} = that.state
    let content = {}

    for (let key in seeFolderContent) {
      content[key] = seeFolderContent[key]
    }
    base.ajaxList.addPoint(2200002, content)

    base.eventCount.add('1038', {
      '精选集ID': id,
      '用户ID': base.LS().id
    })

    base.ajaxList.folderCollected(id, (data) => {
      if (data.success) {
        identification = true
        df_alert({
          tipImg: base.ossImg(shareCover, 120),
          mainText: '收藏成功',
          subText: name
        })
        // 修改收藏数据
        this.props.setCollectData && this.props.setCollectData(type)
      }
    })
  }

  // 点击取消收藏
  cancelCollect(type) {
    if (identification) {
      identification = false
      let {id} = this.props
      let {isCollect} = this.state
      let that = this
      base.ajaxList.folderCollectedCencel(id, (data) => {
        if (data.success) {
          isCollect = !isCollect
          that.setState({isCollect}, () => identification = true)
          this.props.setCollectData && this.props.setCollectData(type)
        }
      })
    }
  }

  // 打开精选集共享
  openShareFolder() {
    let {id, folderInfo} = this.props
    let {creatorName, avatar, userId} = folderInfo
    ReactDOM.render(<ShareFolder folderId={id}
      userType={1}
      userId={userId}
      userName={creatorName}
      userAvatar={avatar}
    />, document.getElementById('share-folder-pop-wrapper'))
  }

  renderIntro() {
    const {folderInfo} = this.props
    const {intro, owned} = folderInfo
    if (intro) {
      return (
        <div className='folder-intro'>
          <div
            className='intro-header'
            style={{float: 'left', fontSize: '12px', color: '#4a4a4a', marginTop: '5px'}}
          >
            简介：
          </div>
          <div className="intro">
            <p dangerouslySetInnerHTML={{__html: base.changeEnter(intro)}}/>
          </div>
          {
            !!folderInfo.owned && !!owned && null
            /* <div className="folder-set" onClick={openSetFolder}>
              <Icon type='bianjijingxuanji'/>
            </div> */
          }
        </div>
      )
    }

    if (!!owned) {
      return null
      /* return (
        <button
          className="input-intro"
          onClick={openSetFolder}
        >
          #点击输入简介
        </button>
      ) */
    }

    return null
  }
  render() {
    const {id, folderInfo, openSetFolder, changeEdit, endEdit, selectNum, openDownLoad, openMoveCopyPop, cancelFav, batchSelected, workFlag, shareFolderContent} = this.props
    const {name, num, owned, viewCount, shared, tagList, intro, isPrivate, isEdit, collect, mediaUrls} = folderInfo
    let shareData = {
      id,
      // mobileUrl: `${base.baseUrl}/mobile/folder/public/${id}`,
      url: `${base.baseUrl}/mobile/folder/public/${id}`,
      image: mediaUrls && mediaUrls.length && mediaUrls[0] || base.defaultGrayImg,
      title: `精选集 ${name}`,
      description: intro || ''
    }
    return (
      <div className="folder-header container">
        <div className="folder-info">
          <div className="folder-left">
            <div className="name">
              <div className="tip">
                {/* <FolderShareIcon shared={shared}/>
                <FolderPricateIcon isPrivate={isPrivate}/> */}
                {
                  (shared && shared !== 1 && shared !== 4) ? <button className="invite-bot">协作</button> : null
                }
                {
                  isPrivate ? <button className="invite-bot">私密</button> : null
                }
              </div>
              <span>{name}</span>
            </div>
            <div className='folder-creator'>
              <CreatorInfo {...folderInfo}/>
            </div>
            {
              ((tagList && !!tagList.length) || (!!folderInfo.intro)) &&
              <div className={classNames('tag-intro', {
                'no-result': (!tagList || !tagList.length) && !intro
              })}
              >
                {
                  tagList && !!tagList.length &&
                  <div className="tag-intro-up">
                    {
                      tagList && !!tagList.length &&
                      <div
                        className='tag-header'
                        style={{
                          float: 'left',
                          fontSize: '12px',
                          color: '#4a4a4a',
                          marginTop: '5px'
                        }}
                      >标签：
                      </div>
                    }
                    <ul className="tag-list">
                      {
                        tagList && tagList.map((tag, index) => {
                          let key = `tag-${index}`
                          return <li key={key}># {tag}</li>
                        })
                      }
                      {
                        (tagList && tagList.length === 0 && !!owned) && null
                        /* <li className="input-tag">
                          <button onClick={openSetFolder}>#点击添加标签</button>
                        </li> */
                      }
                    </ul>
                  </div>
                }
                {this.renderIntro()}
              </div>
            }

          </div>
          <div className="folder-right">
            {/* <div className="folder-num">
              <div className="folder-pic-num">
                浏览数 <span>{viewCount}</span>
              </div>
              <div className="folder-pic-num">
                图片数 <span>{num}</span>
              </div>
            </div> */}
            {
              !!folderInfo.owned && !!owned && name !== '默认精选集' &&
              <button className="edit-button" onClick={openSetFolder}>
                编辑
              </button>
            }
            {
              !workFlag &&
              <div className="folder-operation">
                <FolderOperate selectNum={selectNum}
                  owned={owned}
                  isEdit={isEdit}
                  collect={collect}
                  shareData={shareData}
                  openShareFolder={this.openShareFolder.bind(this)}
                  openMoveCopyPop={openMoveCopyPop}
                  openDownLoad={openDownLoad}
                  cancelFav={cancelFav}
                  changeEdit={changeEdit}
                  endEdit={endEdit}

                  batchSelected={batchSelected}
                  getCollection={this.completeCollect.bind(this, 'collect')}
                  cancelCollection={this.cancelCollect.bind(this, 'cancel')}
                />
              </div>
            }
          </div>
          <div className="folder-botton">
            <div className="folder-num">
              <div className="folder-pic-num">
                浏览数 <span>{base.numberFormat(viewCount)}</span>
              </div>
              <div className="folder-pic-num">
                图片数 <span>{base.numberFormat(num)}</span>
              </div>
            </div>
            {
              !workFlag &&
              <div className="folder-operation">
                <FolderOperate
                  selectNum={selectNum}
                  owned={owned}
                  isEdit={isEdit}
                  collect={collect}
                  shareData={shareData}
                  openShareFolder={this.openShareFolder.bind(this)}
                  openMoveCopyPop={openMoveCopyPop}
                  openDownLoad={openDownLoad}
                  cancelFav={cancelFav}
                  changeEdit={changeEdit}
                  endEdit={endEdit}

                  batchSelected={batchSelected}
                  getCollection={this.completeCollect.bind(this, 'collect')}
                  cancelCollection={this.cancelCollect.bind(this, 'cancel')}
                  shareFolderContent={shareFolderContent}
                />
              </div>
            }
          </div>
        </div>
      </div>
    )
  }
}

export default FolderHeader