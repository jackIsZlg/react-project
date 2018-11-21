import classNames from 'classnames'
import SharePane from '../SharePane/SharePane'

class FolderOperate extends React.Component {
  handleEdit() {
    let {changeEdit, endEdit, isEdit} = this.props
    if (!isEdit) {
      changeEdit && changeEdit()
    } else {
      endEdit && endEdit()
    }
  }

  handleMoveCopy(type) {
    this.props.openMoveCopyPop(type)
  }

  render() {
    const {props} = this
    const {shareData, selectNum, owned, isEdit, collect, runway} = props

    return (
      <div className="folder-operate-wrapper">
        <div className={classNames('folder-operate-panel', {
                    'edit': isEdit
                })}
        >
          {
            (owned === 0 || owned === 1) &&
            <div className="share-button">
              <button className="btn-default-red btn-set-folder float-r"
                onClick={props.openSetFolder}
              >分享
              </button>
              <div id="share-pane">
                <SharePane title='精选集'
                  pos="right"
                  showShare={true}
                  shareType="精选集"
                  shareData={shareData}
                  pointContent={this.props.shareFolderContent}
                />
              </div>
            </div>
          }
          {
            owned === 1 &&
            <button className="btn-default-red btn-share-folder float-r"
              onClick={props.openShareFolder}
            >共享
            </button>
          }
          {
            owned === 0 &&
            <button className="btn-default-red btn-collect-folder float-r"
              onClick={collect ? props.cancelCollection : props.getCollection}
            >
                {collect ? '已收藏' : '收藏'}
            </button>
          }
          {
            owned === 1 &&
            <button className="btn-default-red btn-edit-folder float-r"
              onClick={this.handleEdit.bind(this)}
            >批量管理
            </button>
          }
          {
            (owned === 0 || owned === 1) &&
            <button className="btn-default-red btn-download-folder float-r"
              onClick={this.handleEdit.bind(this)}
            >批量下载
            </button>
          }
          {
            owned === 0 &&
            <button className="btn-default-red btn-sellect-folder float-r"
              onClick={this.handleEdit.bind(this)}
            >批量精选
            </button>
          }
          {
            runway &&
            <button className="btn-default-red btn-share-folder float-r"
              onClick={this.handleEdit.bind(this)}
            >批量选择
            </button>
          }
          {/* { */}
          {/* runway && */}
          {/* <button className="btn-default-red btn-share-folder float-r" */}
          {/* onClick={props.downloadAtlas} */}
          {/* >下载图集 */}
          {/* </button> */}
          {/* } */}

          <div className={classNames('btn-edit-folder-list', {
                        'hide': !selectNum
                    })}
          >
            <button className="btn-default-red btn-edit-back float-r"
              onClick={this.handleEdit.bind(this, false)}
            >返回
            </button>
            {
              (owned === 0 || runway) &&
              <button
                className="btn-need-hide btn-default-red btn-animation btn-edit-collect-folder float-r"
                onClick={this.handleMoveCopy.bind(this, 'collect')}
              >批量精选
              </button>
                        }
            {
                            owned === 1 &&
                            <button
                              className="btn-need-hide btn-default-red btn-animation btn-edit-cancel-folder float-r"
                              onClick={props.cancelFav}
                            >取消精选
                            </button>
                        }
            {
                            owned === 1 &&
                            <button className="btn-need-hide btn-default-red btn-edit-copy float-r"
                              onClick={this.handleMoveCopy.bind(this, 'copy')}
                            >复制
                            </button>
                        }
            {
                            owned === 1 &&
                            <button className="btn-need-hide btn-default-red btn-edit-move float-r"
                              onClick={this.handleMoveCopy.bind(this, 'move')}
                            >移动
                            </button>
                        }
            <button className="btn-need-hide btn-default-red btn-edit-download float-r"
              onClick={props.openDownLoad}
            >下载
            </button>
          </div>
        </div>
      </div>
    )
  }
}

export {FolderOperate}