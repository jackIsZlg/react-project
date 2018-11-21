import base from '../../../common/baseModule'
import WaterFall from '../../../components/WaterFall/WaterFall'
import {CenterHeader, CenterNav} from '../../../components/UserCenter/UserCenter'


base.channel('3')
base.headerChange('white')

let userId = base.getUrlStringId()
// let userId = 38274;

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      selfInfo: {}
    }
  }

  componentWillMount() {
    this.getSelfInfo()
  }

  // 获取共享精选集用户信息
  getSelfInfo() {
    console.log('getInfo')
    let self = this
    base.ajaxList.basic({
      type: 'GET',
      url: `${base.baseUrl}/users/info/${userId}`
    }, (data) => {
      if (!data.success) {
        data.errorCode === 'D02' ? self.setState({
          selfInfo: {
            avatar: 'https://zhiyi-web.oss-cn-hangzhou.aliyuncs.com/deepfashion/default-avatar.png',
            city: '',
            intro: '',
            name: '',
            profession: ''
          }
        }, () => {
          console.log('selfNullInfo', self.state.selfInfo)
        }) : console.log(data.errorDesc)

        return
      }

      self.setState({
        selfInfo: data.result
      })
    })
  }

  render() {
    let {selfInfo} = this.state
    let followBlogger = {
      source_page: 'other_user_followed_bloggers'
    }
    return (
      <div>
        <CenterHeader {...selfInfo}
          openType={true}
        />
        <div className="folder-content" style={{background: '#e5e5e5', paddingTop: '12px'}}>
          <CenterNav waterFallNull={true} {...selfInfo} channel={2} openType={true} uid={userId}/>
          <div className="water-fall-folder" style={{background: '#fff'}}>
            <div className="container" style={{overflow: 'hidden', borderTop: '1px solid #e5e5e5'}}>
              <div id="water-fall-panel">
                <WaterFall key="waterWall"
                  wfType="followOwner"
                  noFilter={true}
                  noResultTip="该用户暂无订阅"
                  dataUrl={`/follow/public/list?creator=${userId}`}
                  followBlogger={followBlogger}
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

