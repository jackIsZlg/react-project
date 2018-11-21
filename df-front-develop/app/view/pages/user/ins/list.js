import classNames from 'classnames'
import base from '../../../common/baseModule'
import WaterFall from '../../../components/WaterFall/WaterFall'
import ImportIns from '../../../components/ImportIns/ImportIns'
import UserReportPop from '../../../components/UserReportPop/UserReportPop'
import NewTipGuide from '../../../components/NewTipGuide/NewTipGuide'
import {Pinterestsearch} from '../../../components/SearchBar/index'
import {TwoLevelNavigation} from '../../../components/Navigation/SecondNavigation'
// header初始化
base.channel(0)
let guideEl
let postViewGuide = 'postViewGuide5'
let followBtn

function Btn(props) {
  const {btnText, tip, handleClick, recommend} = props
  return (
    <div className="ins-account-state">
      {tip}
      <div className='ins-account-recommend'>{recommend}</div>
      <button className={classNames('btn-round-big btn-gradient-deep-blue', {
        'btn-cursor-default': !handleClick
      })}
        onClick={handleClick || null}
      >{btnText}
      </button>
    </div>
  )
}

/*
 * 我的ins关注列表为空
 */
class UserInsList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      insName: '',
      status: '',
      guideFlag: false,
      insUpdate: {},
      followBlogger: {}
    }
  }

  componentWillMount() {
    this.getAccountState()
    this.getInsUpdateCount()
  }

  componentDidMount() {
    this.judgeGuideDesign()
  }

  getGuideEleGuide(ele) {
    followBtn = ele
    this.createWrapperElement()
  }

  getInsUpdateCount() {
    let self = this
    base.ajaxList.basic({
      'type': 'GET',
      'url': `${base.baseUrl}/ins-info`
    }, (d) => {
      self.setState({
        insUpdate: d.result
      })
    })
  }
  getAccountState() {
    let self = this
    base.ajaxList.basic({
      'type': 'GET',
      'url': `${base.baseUrl}/user/ins/account-state`
    }, (d) => {
      d.result.spiderStatus * 1 === 8 && self.getBloggerFansCount()
      self.setState({
        status: d.result.spiderStatus,
        insName: d.result.insAccount
      })
    })
  }

  getBloggerFansCount() {
    let self = this
    base.ajaxList.basic({
      'type': 'GET',
      'url': `${base.baseUrl}/user/ins/follow/user-blogger-ins-info`
    }, (d) => {
      self.setState({
        followBlogger: d.result
      })
    })
  }

  createWrapperElement() {
    let that = this

    guideEl = document.createElement('div')
    guideEl.id = 'guide-wrapper5'
    document.body.appendChild(guideEl)

    that.renderGuideWrapper()

    window.onresize = function () {
      that.renderGuideWrapper()
    }
  }

  judgeGuideDesign() {
    let that = this
    if (base.LS()[postViewGuide]) {
      return
    }

    // 5:关注ins列表
    base.ajaxList.getNewGuide(5, (d) => {
      // d.result(0:需要指引；1:不需要指引)
      if (d.result) {
        let store = {}
        store[postViewGuide] = 1
        base.LS.set(store)
        return
      }

      // 禁止遮罩层后面页面滚动
      base.bodyScroll(false)
      that.setState({
        guideFlag: true
      })
    })
  }

  editSuccess(name) {
    this.setState({
      insName: name,
      status: 0
    })
    df_alert({
      mainText: '开始读取instagram关注列表',
      subText: name
    })
  }

  // 导入ins关系
  handleImportIns() {
    ReactDOM.render(
      <ImportIns insName={this.state.insName}
        editSuccess={this.editSuccess.bind(this)}
      />,
      document.getElementById('import-ins-pop-wrapper')
    )
  }

  // 重试
  handleRetry() {

  }

  // 你的instagram关注数为0，请添加博主后重试  你的instagram账号为私密状态，请取消私密后重试
  handleReport() {
    ReactDOM.render(<UserReportPop hidden={false}/>, document.getElementById('user-report-pop-wrapper'))
  }


  changeFollowCount(type) {
    let {followBlogger} = this.state
    type === 'add' ? followBlogger.insFollowCount++ : followBlogger.insFollowCount--
    this.setState({
      followBlogger
    })
  }

  renderGuideWrapper() {
    let that = this
    let tipMessage = {
      targetElInfo: [{'targetEl': followBtn, 'position': 'bottom'}],
      tip: ['点击订阅，在DF查看这个博主'],
      total: 1,
      renderGuideFun: that.renderGuideWrapper,
      wrapper: guideEl,
      bodyScroll: true,
      localName: postViewGuide
    }
    ReactDOM.render(<NewTipGuide {...tipMessage}/>, guideEl)
  }
  render() {
    const {status, insUpdate, followBlogger} = this.state
    const {bloggerCount, userCount} = insUpdate
    const {insFollowCount, insToltalBloggerCount} = followBlogger
    let result = null
    let {guideFlag} = this.state
    let seeBlogger = {
      source_page: 'my_ins_blogger',
      source_type: 'recommended_blogger'
    }
    switch (status) {
      case -1:
        result = (<Btn handleClick={this.handleImportIns.bind(this)}
          btnText="读取instegram关注列表"
          tip={(<div>将您在Instagram关注列表添加到DeepFashion中<br/>不用VPN即可获取他们的图片更新</div>)}
          recommend={`已有${userCount}人通过该服务 获取了${bloggerCount}instagrtam博主更新`}
        />)
        break
      case 0:
        result = (<Btn btnText="读取中..."
          tip={(<div>将您在Instagram关注列表添加到DeepFashion中<br/>不用VPN即可获取他们的图片更新</div>)}
          recommend={`已有${userCount}人通过该服务 获取了${bloggerCount}instagrtam博主更新`}
        />)
        break
      case 1:
        result = (<Btn handleClick={this.handleImportIns.bind(this)}
          btnText="重试"
          tip="你的instagram账号为私密状态，请取消私密后重试"
        />)
        break
      case 2:
        result = (<Btn handleClick={this.handleImportIns.bind(this)}
          btnText="重试"
          tip="你的instagram关注数为0，请添加博主后重试"
        />)
        break
      case 3:
        result = (<Btn handleClick={this.handleImportIns.bind(this)}
          btnText="读取instagram关注列表"
          tip="你的instagram账号无效，请确认用户名后再次尝试"
        />)
        break
      case 8:
        // getDataSuccess()
        result = (
          <div>
            <div className='ins-header'>
              我的ins关注列表
              <div className="ins-header-followed">
                已订阅博主<span>{insFollowCount}</span> / {insToltalBloggerCount}
              </div>
            </div>
            <div className="ins-description">订阅ins博主我们会24小时内为您提供这些博主的INS图片，您可以在订阅中查看更新</div>
            <div id="water-fall-panel">
              <WaterFall key="waterWall"
                wfType="insOwner"
                pageSize={60}
                loadType={2}
                dataUrl="/user/ins/follow/list"
                getGuideDesign={guideFlag && this.getGuideEleGuide.bind(this)}
                changeFollowCount={this.changeFollowCount.bind(this)}
                seeBlogger={seeBlogger}
                followBlogger={seeBlogger}
                notBelongToRecommend={true}
              />
            </div>
          </div>
        )
        break
      default:
        break
    }
    return result
  }
}

ReactDOM.render(<Pinterestsearch />, document.querySelector('#pinterest_search'))
ReactDOM.render(<TwoLevelNavigation channel={11}/>, document.getElementsByClassName('header-labs')[0])
ReactDOM.render(<UserInsList/>, document.getElementById('user-ins-list'))

