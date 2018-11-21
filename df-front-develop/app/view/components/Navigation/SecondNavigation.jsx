import classNames from 'classnames'
import base from '../../common/module/baseModule'
import SetFolderPop from '../SetFolderPop/SetFolderPop'

class TwoLevelNavigation extends React.Component {
  render() {
    const {channel} = this.props
    return (
      <div className="header-lab-lists">
        <a href="/index" className={classNames({ 'current': channel === 4 })}>最新</a>
        <a href="/hot" className={classNames({'current': channel === 5})}>榜单</a>
        {/* <a href="/owner/recom/home" className={classNames({'current': channel === 6})}>时尚博主</a> */}
        <a href="/gallery/styles" className={classNames({'current': channel === 1})}>分类找图</a>
        <a href="/users/ins/list" className={classNames({'current': channel === 11})}>我的INS</a>
      </div>
    )
  }
}

class TrendNavigation extends React.Component {
  render() {
    const {channel} = this.props
    return (
      <div className='trend-header-lab-lists'>
        <a href="/ordering/collections" className={classNames({'current': channel === 5})}>订货会</a>
        <a href="/market/collections" className={classNames({'current': channel === 6})}>品牌精选</a>
      </div>
    )
  }
}

class TwoLevelNavigation_folder extends React.Component {
  newSuccess() {
    window.open(`${base.baseUrl}/users/favorite-view`)
  }
  openCreateFolder() {
    let c = (<SetFolderPop mode="new"
      callBack={this.newSuccess.bind(this)}
    />)
    ReactDOM.render(c, document.getElementById('set-folder-pop-wrapper'))
  }

  render() {
    const {channel} = this.props
    return (
      <div className='folder-header-lab-lists'>
        <div className="container">
          <a href="/folder/public/index"
            className={classNames('recommended', {'current': channel === 7})}
          >精选
          </a>
          <a href="/folder/public/rank"
            className={classNames('recommended', {'current': channel === 8})}
          >热门
          </a>
          <div className='folder-add-btn' onClick={this.openCreateFolder.bind(this)}>新建精选集</div>
        </div>
      </div>
    )
  }
}

export {
  TwoLevelNavigation,
  TwoLevelNavigation_folder,
  TrendNavigation
}