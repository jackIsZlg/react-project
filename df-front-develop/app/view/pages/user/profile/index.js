import classNames from 'classnames'
import base from '../../../common/baseModule'
import ImportIns from '../../../components/ImportIns/ImportIns'
import AvatarEditPane from '../../../components/AvatarEdit/AvatarEdit'
import QRCodeComponent from '../../../components/base/Qrcode'
import { Select } from '../../../components/base/baseComponents'
import LoginManage from '../../../components/Login/Login'
import { city, province } from './address'

base.headerChange('white')

base.channel(-1)

let $insText = $('.input-text-ins')
let $insInput = $('[name="insId"]')
let $nameText = $('.input-text-name')
let $nameInput = $('.input-text-edit')
let userInfo // 个人信息
let sexReference = [
  { 0: '男' },
  { 1: '女' },
  { 2: '保密' },
] // 上传凭证
let ProfessionReference = [
  { '0': '设计师' },
  { '1': '买手' },
  { '2': '搭配师' },
  { '3': '陈列师' },
  { '4': '学生' },
  { '5': '时尚编辑' },
  { '6': '模特' },
  { '7': '时尚爱好者' },
  { '8': '其他' }
]
let ProfessionReference1 = [
  { 0: '男装' },
  { 1: '女装' },
  { 2: '童装' },
  { 3: '运动' },
  { 4: '定制' },
  { 5: '配饰' },
  { 6: '其他' }
]

// 获取用户信息
base.ajaxList.getUserInfo((d) => {
  base.LS.set({
    ...d.result,
    timeStamp: new Date().getTime() / 1000,
    version: base.version
  })

  // 接口字段差异
  const { name: nickname, avatar, sex, insId, phone, city, intro, profession, wechatAccountBound } = d.result

  userInfo = {
    nickname, avatar, sex, insId, phone, wechatAccountBound, city, intro, profession: profession || ''
  }
  initProfession()
  initAddress()
  ReactDOM.render(<SettingInfo />, document.getElementsByClassName('user-settingInfo')[0])
})

let newProvince = []
let newCity = []
let array = []

province.forEach((item) => {
  let itemContent = {}
  itemContent[item.provinceId] = item.provinceName
  newProvince.push(itemContent)
})

// 映射索引
function initProfession() {
  let profession = userInfo.profession.split('#')
  let newProfession = ''
  let p0 = profession[0]
  let p1 = profession[1]

  p0 && ProfessionReference.forEach((item, index) => {
    if (item[index] === p0) {
      newProfession = `${index}`
    }
  })

  p1 && ProfessionReference1.forEach((item, index) => {
    if (item[index] === p1) {
      newProfession += `#${index}`
    }
  })

  userInfo.profession = newProfession
}

function initAddress() {
  let split = userInfo.city ? userInfo.city.split(' ') : ''
  let newAddress = ''
  let p0 = split[0]
  let p1 = split[1]

  p0 && province.forEach((item) => {
    if (item.provinceName === p0) {
      newAddress = `${item.provinceId}`
      array = city.filter(v => v.provId === item.provinceId)
    }
  })

  p1 && array.forEach((item) => {
    if (item.cityName === p1) {
      newAddress += ` ${item.cityId}`
    }
    let obj = {}
    obj[item.cityId] = item.cityName
    newCity.push(obj)
  })

  userInfo.city = newAddress
}

// 退出编辑状态，即时保存
function exitEdit(o) {
  o.addClass('edited').removeClass('edit')
  // o.classList.remove('edited');
}

function editAvatarSuccess(avatar) {
  // console.log('page：', avatar);
  postUserInfo({ avatar }, () => {
    df_alert({
      tipImg: avatar,
      mainText: '修改用户头像成功',
    })

    // 修改页面上头像元素
    userInfo.avatar = avatar
    $('.person-menu .avatar').css('background-image', `url(${userInfo.avatar})`)

    base.LS.set({ avatar })
  }, () => {
    df_alert({
      type: 'warning',
      mainText: '修改用户头像失败',
    })
  })
}

function renderAvatar() {
  ReactDOM.render(
    <AvatarEditPane avatar={userInfo.avatar}
      editSuccess={editAvatarSuccess}
    />,
    document.getElementById('avatar-edit-wrapper')
  )
}

function checkName() {
  let nickname = $nameInput.val()
  if (!nickname) {
    new base.warningTip($nameInput[0], '请输入昵称')
    return false
  }

  if (nickname.length > 20) {
    new base.warningTip($nameInput[0], '昵称应为1-20字符')
    return false
  }
  return true
}

function editName(e) {
  if (e.target.className.split(' ')[1] === 'update') {
    $('.user-wechatInfo').addClass('edit')
    $nameInput.val(userInfo.nickname)
  } else if (e.target.className.split(' ')[1] === 'save') {
    let wechat = $('.user-wechatInfo')
    // 未修改，直接退出编辑
    if (userInfo.nickname === $nameInput.val()) {
      exitEdit(wechat)
      return
    }
    if (!checkName()) {
      return
    }

    let ani = base.animationBtn(e.target)
    ani.loading()

    let data = {}
    data.nickname = $nameInput.val()
    userInfo.nickname = $nameInput.val()

    postUserInfo(data, () => {
      ani.success(() => {
        df_alert({
          mainText: '修改昵称成功',
        })
        $('.person-menu .nickname').html(userInfo.nickname)
        base.LS.set({ name: userInfo.nickname })

        renderName()
        exitEdit(wechat)
      })
    }, () => {
      df_alert({
        type: 'warning',
        mainText: '修改昵称失败',
      })
      ani.cancel()
    })
  }
}


// $nameInput.on('keydown', function (e) {
//     if (e.keyCode === 13) {
//         let $el = $(this).parents('.user-wechatName').find('.save')[0];
//         checkParam($el);
//     }
// });

function renderName() {
  $nameText.html(userInfo.nickname)
  ReactDOM.render(<Button btnType="update"
    btnName="修改"
    iconUrl={'&#xe613;'}
    btnClick={editName}
  />, document.getElementsByClassName('user-edit')[0])
  ReactDOM.render(<Button btnType="save"
    btnName="保存"
    btnClick={editName}
  />, document.getElementsByClassName('btn-save')[0])
}

// 提交修改数据
function postUserInfo(data, success, fail) {
  base.request({
    type: 'POST',
    url: `${base.baseUrl}/users/edit-profile`,
    contentType: 'application/json',
    dataType: 'json',
    data: JSON.stringify(data)
  }).done((d) => {
    if (d.success) {
      success && success()
    } else {
      fail && fail()
    }
  }).fail(() => {
    fail && fail()
  })
}

class Button extends React.Component {
  render() {
    return (
      <button className={`button-container ${this.props.btnType ? this.props.btnType : ''} btn-animation`}
        onClick={this.props.btnClick}
      >
        {this.props.btnName || 'Button'}
      </button>
    )
  }
}

class BindWeChat extends React.Component {
  constructor() {
    super()
    this.state = {
      cordUrl: '',
      index_qr: 0,
      index: 1,
      time: 20,
      timeout: 2000,
      hidden: false
    }
  }

  componentWillMount() {
    // 锁定浮层下层
    this.state.closeBody = window.isBodyScroll
    window.isBodyScroll && base.bodyScroll(false)
  }

  componentDidMount() {
    this.getBindWechatQRCordUrl()
  }

  getBindWechatQRCordUrl() {
    let self = this
    base.ajaxList.basic({
      type: 'GET',
      url: `${base.baseUrl}/bindWechatAccountStr`
    }, (data) => {
      self.setState({
        cordUrl: data.result
      }, () => {
        self.loopRequestBindWechat()
      })
    }, () => {
      self.state.index_qr < self.state.time && self.getBindWechatQRCordUrl()
    })
  }

  loopRequestBindWechat() {
    this.setState({
      index: 1,
      hidden: false
    }, () => {
      this.idBindWechat()
    })
  }

  idBindWechat() {
    let self = this
    base.ajaxList.basic({
      type: 'GET',
      url: `${base.baseUrl}/bindWechatAccountStatus`
    }, (data) => {
      if (!data.result.status) {
        self.state.index !== self.state.time && setTimeout(self.idBindWechat.bind(self), self.state.timeout)
      } else {
        // 停止计时器
        self.state.index = self.state.time
        this.props.changeWechatStatus && this.props.changeWechatStatus()
        self.handleCancel()
      }
      self.state.index === self.state.time && self.setState({
        hidden: true
      })
    }, () => {
      self.state.index < self.state.time && self.idBindWechat.bind(self)
    })
  }

  changeHidden() {
    this.setState({
      hidden: !this.state.hidden
    }, () => {
      this.loopRequestBindWechat()
    })
  }

  // 销毁
  handleCancel() {
    let el = ReactDOM.findDOMNode(this)
    this.state.closeBody && base.bodyScroll(true)
    el.parentNode.removeChild(el)
    delete this
  }

  render() {
    return (
      <div className='bindwechat' onClick={this.handleCancel.bind(this)}>
        <div className="bind-page">
          <div className="cord">
            {this.state.cordUrl && <QRCodeComponent text={this.state.cordUrl} size={220} />}
            <div className={classNames('reload', { hidden: !this.state.hidden })}
              onClick={this.changeHidden.bind(this)}
            />
          </div>
          <div className="tip-message">温馨提示：该微信号已注册，继续绑定将丢失该账号信息。</div>
        </div>
      </div>
    )
  }
}

class SettingInfo extends React.Component {
  constructor() {
    super()
    this.state = {
      sex: (userInfo.sex - 1).toString() || ['-1'],
      address: userInfo.city ? userInfo.city.split(' ') : [],
      introdution: userInfo.intro || '',
      tags: [],
      phone: userInfo.phone || '',
      wechat: userInfo.wechatAccountBound || '',
      insId: userInfo.insId || '',
      profession: userInfo.profession ? userInfo.profession.split('#') : ['-1']
    }
    this.initPanel = this.initPanel.bind(this)
    this.renderIns = this.renderIns.bind(this)
    this.renderPhone = this.renderPhone.bind(this)
    this.renderWechat = this.renderWechat.bind(this)
    this.renderAddress = this.renderAddress.bind(this)
    this.renderProfession = this.renderProfession.bind(this)
    this.renderIntrodution = this.renderIntrodution.bind(this)
    this.getTag = this.getTag.bind(this)
    this.editInfo = this.editInfo.bind(this)
  }

  componentDidMount() {
    // 初始化页面
    this.initPanel()
    // 获取标签数据
    this.getTag()

    // // 回车监听
    // $insInput.on('keydown', function (e) {
    //     if (e.keyCode === 13) {
    //         let $el = $(this).parents('.user-item-input').find('.btn-sure')[0];
    //         checkParam($el);
    //     }
    // });
    // !!this.state.address.length && 
  }

  getTag() {
    let that = this
    base.ajaxList.basic({
      type: 'GET',
      url: `${base.baseUrl}/user/tag/list`
    }, (d) => {
      userInfo.favTag = d.result
      that.setState({
        tags: userInfo.favTag
      }, () => {
        if (that.state.tags.length) {
          this.userTag.classList.add('edited')
        }
      })
    })
  }

  initPanel() {
    // 原始个人数据绑定，头像、性别等
    renderAvatar()
    renderName()
    this.renderIns()
    this.renderPhone()
    this.renderWechat()
    this.renderAddress()
    this.renderProfession()
    this.renderIntrodution()
  }

  inputClick(el) {
    let param = 'sex'
    let val = el * 1 + 1
    let text = '性别'
    let that = this

    let data = {}
    data[param] = val
    userInfo[param] = val
    postUserInfo(data, () => {
      let state = that.state
      state.sex = el
      that.setState(state)
      base.LS.set({
        sex: el * 1 + 1
      })
      df_alert({
        mainText: `修改${text}成功`,
      })
    }, () => {
      df_alert({
        type: 'warning',
        mainText: `修改${text}失败`,
      })
    })
  }

  professionClick(el) {
    // if (el === '0') {
    //   $('.df-select:nth-child(2)').show()
    //   return
    // }

    // $('.df-select:nth-child(2)').hide()
    let param = 'profession'
    let val = ProfessionReference[el * 1][el]
    let text = '职业'
    let that = this

    let data = {}
    data[param] = val
    userInfo[param] = val
    postUserInfo(data, () => {
      let state = that.state
      state.profession = [el]
      that.setState(state)
      base.LS.set({ profession: val })
      df_alert({
        mainText: `修改${text}成功`,
      })
    }, () => {
      df_alert({
        type: 'warning',
        mainText: `修改${text}失败`,
      })
    })
  }

  profession2Click(el) {
    let param = 'profession'
    let val = ProfessionReference1[el * 1][el]
    let text = '职业'
    let that = this

    let data = {}
    data[param] = `设计师#${val}`
    userInfo[param] = `设计师#${val}`
    postUserInfo(data, () => {
      let state = that.state
      state.profession = ['0', el]
      that.setState(state)
      base.LS.set({ profession: `设计师#${val}` })
      df_alert({
        mainText: `修改${text}成功`,
      })
    }, () => {
      df_alert({
        type: 'warning',
        mainText: `修改${text}失败`,
      })
    })
  }

  handleInputIntro(e) {
    let val = e.target.value
    this.setState({
      introdution: val
    })
  }

  // 绑定手机号
  bindPhoneSuccess(phone) {
    console.log('绑定手机号成功', phone)
    userInfo.phone = phone
    this.setState({ phone: `${phone.substr(0, 3)}****${phone.substr(7)}` }, () => {
      this.renderPhone()
    })
  }

  editInfo(e) {
    let targetObjName = e.target.className.split(' ')[1]
    let currentObjName1 = e.target.parentNode.className.split(' ')[1]
    let currentObjName2 = e.target.parentNode.parentNode.className.split(' ')[1]
    let brotherObjValue = e.target.parentNode.firstChild.value
    let ee = e.target
    let self = this

    function checkParam(el) {
      let $el = $(el)
      let action = $el.parents('.user-default')[0].className.split(' ')[1]
      let param = ''
      let val = ''
      let text = ''
      switch (action) {
        case 'user-ins':
          param = 'insId'
          val = $insInput.val()
          text = 'Instagram账号'
          break
        case 'user-address':
          param = 'city'
          val = brotherObjValue
          text = '居住地'
          break
        case 'user-introdution':
          param = 'intro'
          val = $('.editIntrodution').val()
          text = '个人简介'
          break
        default:
          break
      }

      // 未修改，直接退出编辑
      if (userInfo[param] === val && val !== '') {
        exitEdit($el.parents('.user-default'))
        return
      }

      // 校验居住地
      if (param === 'city' && !checkAddress()) {
        return
      }

      // 校验个人简介
      if (param === 'intro' && !checkIntrodution()) {
        return
      }

      // ins校验
      if (param === 'insId' && !checkIns()) {
        return
      }

      let ani = base.animationBtn(el)
      ani.loading()

      let data = {}
      data[param] = val
      userInfo[param] = val

      postUserInfo(data, () => {
        ani.success(() => {
          df_alert({
            mainText: `修改${text}成功`,
          })
          switch (action) {
            case 'user-ins':
              self.renderIns()
              break
            case 'user-address':
              self.setState({
                address: brotherObjValue
              }, () => {
                base.LS.set({ city: self.state.address })
              })

              break
            case 'user-introdution':
              self.setState({
                introdution: $('.editIntrodution').val()
              }, () => {
                base.LS.set({ intro: self.state.introdution })
              })
              break
            default:
              break
          }
          exitEdit($el.parents('.user-default'))

          // 简介为空，异常处理
          if (action === 'user-introdution' && !val) {
            $el.parents('.user-default').removeClass('edited')
          }

          // 编辑ins账号，执行导入ins关系
          if (action === 'user-ins' && userInfo.insId) {
            ReactDOM.render(<ImportIns insName={userInfo.insId}
              editSuccess={editInsSuccess}
            />, document.getElementById('import-ins-pop-wrapper'))
          }
        })
      }, () => {
        df_alert({
          type: 'warning',
          mainText: `修改${text}失败`,
        })
        ani.cancel()
      })
    }

    function checkAddress() {
      let address = brotherObjValue
      if (!address) {
        new base.warningTip($('.address-input')[0], '请输入居住地')
        return false
      }

      if (address.length > 45) {
        new base.warningTip($('.address-input')[0], '居住地应为1-45字符')
        return false
      }
      return true
    }

    function checkIntrodution() {
      let introduce = $('.editIntrodution').html()
      if (!introduce) {
        new base.warningTip($('.editIntrodution')[0], '请输入个人简介')
        return false
      }
      if (introduce.length > 200) {
        new base.warningTip($('.editIntrodution')[0], '个人简介最多200字')
        return false
      }
      return true
    }

    function checkIns() {
      let insId = $insInput.val()
      if (insId.length > 30) {
        new base.warningTip($insInput[0], 'ins用户名不得超过30字符')
        return false
      }
      return true
    }

    // 编辑ins账号成功
    function editInsSuccess(insId) {
      // 未修改
      if (insId === userInfo.insId) {
        return
      }
      userInfo.insId = insId
      $insText.html(userInfo.insId)
    }
    switch (targetObjName) {
      case 'btn-show':
        if (currentObjName1 === 'user-address') {
          this.userAddress.classList.remove('edited')
          this.userAddress.classList.add('edit')
        } else if (currentObjName1 === 'user-introdution') {
          this.userIntrodution.classList.remove('edited')
          this.userIntrodution.classList.add('edit')
        }
        break
      case 'save':
        if (currentObjName2 === 'user-address') {
          checkParam(ee)
        } else if (currentObjName2 === 'user-introdution') {
          checkParam(ee)
        }
        break
      case 'add':
        if (currentObjName1 === 'user-address') {
          this.userAddress.classList.add('edit')
        } else if (currentObjName1 === 'user-introdution') {
          this.userIntrodution.classList.add('edit')
        } else if (currentObjName1 === 'user-tag') {
          ReactDOM.render(
            <LoginManage mode='edit' hasSelect={userInfo.favTag} onFinish={this.getTag} />,
            document.getElementById('select-tag-wrapper')
          )
        }
        break
      case 'update':
        if (currentObjName1 === 'user-tag') {
          ReactDOM.render(
            <LoginManage mode='edit' hasSelect={userInfo.favTag} onFinish={this.getTag} />,
            document.getElementById('select-tag-wrapper')
          )
        }
        break
      case 'addJump':
        if (currentObjName1 === 'user-phone') {
          ReactDOM.render(<LoginManage
            mode='bindPhone'
            success={this.bindPhoneSuccess.bind(this)}
          />, document.getElementById('bind-phone-pop-wrapper'))
        } else if (currentObjName1 === 'user-wechat') {
          ReactDOM.render(<BindWeChat
            changeWechatStatus={this.changeBindWechatStatus.bind(this)}
          />, document.getElementById('bind-phone-pop-wrapper'))
        } else if (currentObjName1 === 'user-ins') {
          window.open(`${base.baseUrl}/users/ins/list`)
          base.eventCount.add(1023, {
            '来源页面': '修改资料页'
          })
        }
        break
      case 'exhibitionBtn':
        if (currentObjName1 === 'user-ins') {
          window.open(`${base.baseUrl}/users/ins/list`)
          base.eventCount.add(1023, {
            '来源页面': '修改资料页'
          })
        }
        break
      default:
        break
    }
  }

  changeBindWechatStatus() {
    this.setState({ wechat: true }, () => {
      this.renderWechat()
    })
  }

  renderIntrodution() {
    if (this.state.introdution) {
      this.userIntrodution.classList.add('edited')
    }
  }

  renderProfession() {
    if (this.state.profession[0] !== '-1') {
      if (this.state.profession[0] === '0') {
        this.profession.classList.add('active')
      } else {
        this.profession.classList.remove('active')
      }
      this.profession.classList.add('edited')
    }
  }

  renderAddress() {
    if (this.state.address) {
      $('.address-input').val(this.state.address)
      this.userAddress.classList.add('edited')
    }
  }

  renderIns() {
    if (this.state.insId) {
      this.userIns.classList.add('edited')
    }
  }

  renderPhone() {
    if (this.state.phone) {
      this.userPhone.classList.add('edited')
    }
  }

  renderWechat() {
    this.state.wechat && this.userWechat.classList.add('edited')
  }

  changeProvince(el) {
    let obj = newProvince[el * 1 - 1]
    let key = 0
    let val = ''
    for (let i in obj) {
      key = i
      val = obj[i]
    }
    newCity = []
    city.forEach((item) => {
      if (item.provId === key * 1) {
        let cityData = {}
        cityData[item.cityId] = item.cityName
        newCity.push(cityData)
      }
    })
    this.setState({
      address: val
    })
  }

  changeCity(el) {
    let { address } = this.state
    let text = '居住地'
    let result = city.filter(item => item.cityId === el * 1)
    if (result && !result.length) {
      return
    }

    address = `${address.split(' ')[0]} ${result[0].cityName}`
    postUserInfo({ city: address }, () => {
      this.setState({
        address
      })
      base.LS.set({
        city: address
      })
      df_alert({
        mainText: `修改${text}成功`,
      })
    }, () => {
      df_alert({
        type: 'warning',
        mainText: `修改${text}失败`,
      })
    })
  }

  render() {
    let job1 = this.state.profession[0]
    // let job2 = this.state.profession[1]
    let address = this.state.address

    return (
      <div className="settingInfo-container">
        <div className="user-item">
          <div className="user-item-title">性别</div>
          <div className="user-setting">
            <div className="user-default user-sex">
              <Select options={sexReference}
                value={this.state.sex}
                onChange={this.inputClick.bind(this)}
              >
              </Select>
            </div>
          </div>
        </div>
        <div className="user-item">
          <div className="user-item-title">居住地</div>
          <div className="user-setting">
            <div ref={el => this.userAddress = el} className="user-default user-address">
              <Select options={newProvince}
                value={address[0] || '-1'}
                onChange={this.changeProvince.bind(this)}
              >
              </Select>
              {
                this.state.address &&
                <Select options={newCity}
                  value={address[1] || '-1'}
                  onChange={this.changeCity.bind(this)}
                >
                </Select>
              }

              {/* <Button btnType="add" btnName="添加居住地" btnClick={this.editInfo}>
              </Button>
              <Button btnType="btn-show" btnName={this.state.address} btnClick={this.editInfo}>
              </Button>
              <div className="EditStatus-container">
                <input className="address-input" type="text"/>
                <button className="button-container save btn-animation" onClick={this.editInfo}>保存
                </button>
              </div> */}
            </div>
          </div>
        </div>
        <div className="user-item">
          <div className="user-item-title">职业</div>
          <div className="user-setting">
            <div ref={el => this.profession = el} className="user-default user-profession">
              <Select options={ProfessionReference}
                value={job1 || '-1'}
                onChange={this.professionClick.bind(this)}
              >
              </Select>
              {/* <Select options={ProfessionReference1}
                value={job2 || '-1'}
                onChange={this.profession2Click.bind(this)}
              >
              </Select> */}
            </div>
          </div>
        </div>
        <div className="user-item">
          <div className="user-item-title">个人简介</div>
          <div className="user-setting">
            <div ref={el => this.userIntrodution = el} className="user-default user-introdution">
              {this.state.introdution ?
                <div className="introdutionShow btn-show"
                  onClick={this.editInfo.bind(this)}
                >{this.state.introdution}
                </div>
                :
                <Button btnType="add" btnName="添加个人简介" btnClick={this.editInfo} />}
              <div className="EditStatus-container">
                <div className="kuang">
                  <textarea value={this.state.introdution ? this.state.introdution : ''}
                    placeholder="输入个人简介"
                    className='editIntrodution'
                    maxLength='200'
                    onChange={this.handleInputIntro.bind(this)}
                  />
                  <span className={classNames('word-tip', {
                    red: this.state.introdution.length > 200
                  })}
                  >{this.state.introdution ? this.state.introdution.length : 0}
                  </span>
                </div>
                <button className="button-container save btn-animation" onClick={this.editInfo}>保存
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="user-item">
          <div className="user-item-title">喜欢的标签</div>
          <div className="user-setting">
            <div ref={el => this.userTag = el} className="user-default user-tag">
              <Button btnType="add" btnName="选择你喜欢的标签" btnClick={this.editInfo}>
              </Button>
              <div className="userTags">
                {this.state.tags.length ? this.state.tags.map(v => (<Button key={v.id}
                  btnType="tag"
                  btnName={v.content}
                />)) : null}
              </div>
              <Button btnType="update"
                iconUrl={'&#xe613;'}
                btnName="修改"
                btnClick={this.editInfo}
              />
            </div>
          </div>
        </div>
        <div className="user-item">
          <div className="user-item-title">instagram关注列表</div>
          <div className="user-setting">
            <div ref={el => this.userIns = el} className="user-default user-ins user-default-text">
              <div className="user-label">用户名</div>
              <Button btnType="addJump"
                iconUrl={'&#xe65e;'}
                btnName="添加 instagram 用户名"
                btnClick={this.editInfo}
              >
              </Button>
              <div className="exhibitionBtn">{this.state.insId}</div>
            </div>
          </div>
        </div>
        <div className="user-item">
          <div className="user-item-title">绑定设置</div>
          <div className="user-setting">
            <div ref={el => this.userPhone = el} className="user-default user-phone user-default-text ">
              <div className="user-label">手机号</div>
              <Button btnType="addJump"
                iconUrl='&#xe65e;'
                btnName="添加手机号码"
                btnClick={this.editInfo}
              >
              </Button>
              <div className="exhibitionBtn">{this.state.phone}</div>
            </div>
            <div ref={el => this.userWechat = el} className="user-default user-wechat user-default-text">
              <div className="user-label">微信</div>
              {this.state.wechat ? <div className="user-messege">已绑定</div> :
              <Button btnType="addJump"
                iconUrl='&#xe65e;'
                btnName="绑定微信"
                btnClick={this.editInfo}
              >
              </Button>}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
