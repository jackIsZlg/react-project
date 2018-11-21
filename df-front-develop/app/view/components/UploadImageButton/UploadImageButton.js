import base from '../../common/baseModule'
import {Icon} from '../base/baseComponents'
import Upload from '../Upload/Upload'

class UploadImageButton extends React.Component {
  uploadImage() {
    let uploadBtn = document.querySelector('#upload')
    if (!uploadBtn) {
      uploadBtn = document.createElement('div')
      uploadBtn.id = 'upload'
      document.body.appendChild(uploadBtn)
    }
    ReactDOM.render(<Upload selectFolder='true'/>, uploadBtn)
    base.eventCount.add('1066', {
      '登陆状态': '已登陆'
    })
  }

  login() {
    let self = this
    let {loginSuccess} = this.props
    base.login(() => {
      self.uploadImage()
      loginSuccess && loginSuccess()
    }, 'login')
    base.eventCount.add('1066', {
      '登陆状态': '未登陆'
    })
  }

  render() {
    let {isLogin} = this.props
    return (
      <div className='upload-btn'>
        <Icon type='shangchuan' title='上传图片' handleClick={isLogin === 1 ? this.login.bind(this) : this.uploadImage.bind(this)}/>
      </div>
    )
  }
}

export default UploadImageButton