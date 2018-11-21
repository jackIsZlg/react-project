import base from '../../../common/baseModule'
import { CenterHeader, CenterNav } from '../../../components/UserCenter/UserCenter'
import WaterFall from '../../../components/WaterFall/WaterFall'

const userId = /^\d+$/.test(base.getUrlStringId() * 1) ? base.getUrlStringId() : ''

// header初始化
base.channel(3)
base.headerChange('white')

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      userInfo: {}
    }
  }

  // 第一次渲染前调用
  componentWillMount() {
    this.changeDifferences()
    base.renderToTopButton(false)
  }

  changeDifferences() {
    if (userId) {
      base.ajaxList.basic({
        type: 'GET',
        url: `${base.baseUrl}/users/info/${userId}`
      }, (data) => {
        this.setState({userInfo: data.result})
      })
    } else {
      // 获取用户信息
      base.changeDifferences((userInfo) => {
        this.setState({userInfo})
      })
    }
  }

  render() {
    const {userInfo} = this.state
    return (
      <div>
        <CenterHeader openType={!!userId} {...userInfo} />
        <div className="folder-content" style={{ background: '#e5e5e5', paddingTop: '12px' }}>
          <CenterNav openType={!!userId} waterFallNull={true} {...userInfo} channel={3} uid={userId}/>
          <div id="water-fall-panel" className="water-fall-container img">
            <div className="container">
              <div className="folder-img">
                <WaterFall 
                  key="waterWall"
                  wfType="collectPic"
                  pageType={!!userId}
                  dataUrl={`/blog/user/folder-post?userId=${userId || ''}`}
                  noResultTip='暂时还没有精选过的图片'
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('folder-content'))