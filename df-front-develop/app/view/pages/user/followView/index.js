/**
 * Created by gewangjie on 2017/3/9.
 */
import base from '../../../common/baseModule'
import WaterFall from '../../../components/WaterFall/WaterFall'
import {CenterHeader, CenterNav} from '../../../components/UserCenter/UserCenter'


base.channel('3')
base.headerChange('white')

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      waterFallNull: true,
      userInfo: {}
    }
  }

  componentDidMount() {
    this.changeDifferences()
  }

  getWFDataSuccess(state) {
    if (state.waterFallTotal > 0 && this.state.waterFallNull) {
      this.setState({
        waterFallNull: false
      })
    }
  }

  changeDifferences() {
    // 获取用户信息
    base.changeDifferences((userInfo) => {
      this.setState({userInfo})
    })
  }

  changeFollowCount(type) {
    let {userInfo} = this.state
    userInfo.followCount = type === 'del' ? --userInfo.followCount : ++userInfo.followCount
    this.setState({userInfo})
  }

  render() {
    const {waterFallNull, userInfo} = this.state
    let seeBlogger = {
      source_page: 'user_followed_bloggers',
      source_type: 'recommended_blogger'
    }
    return (
      <div>
        <CenterHeader {...userInfo}/>
        <div className="folder-content" style={{background: '#e5e5e5', paddingTop: '12px'}}>
          <CenterNav waterFallNull={waterFallNull} {...userInfo} channel={2}/>
          <div className="water-fall-folder" style={{background: '#fff'}}>
            <div className="container"
              style={{overflow: 'hidden', borderTop: '1px solid #e5e5e5'}}
            >
              <div id="water-fall-panel">
                <WaterFall key="waterWall"
                  wfType="followOwner"
                  noFilter={true}
                  getDataSuccess={this.getWFDataSuccess.bind(this)}
                  changeFollowCount={this.changeFollowCount.bind(this)}
                  dataUrl='/owner/follow/query'
                  seeBlogger={seeBlogger}
                  followBlogger={seeBlogger}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

ReactDOM.render(<App/>, document.getElementById('follow-content'))

