import className from 'classnames'
import { Icon } from '../base/baseComponents'
import base from '../../common/baseModule'
import MoveCopyPop from '../MoveCopyPop/MoveCopyPop'

let count = 0
let uploadCount = 0

class Upload extends React.Component {
  constructor() {
    super()
    this.state = {
      uploadCount: 0,
      param: {},
      addPic: [],
      params: {
        folderId: 0,
        urls: []
      },
      total: 0,
      confirmFlag: false,
      tip: false,
      uploadPicInfo:[]
    }
  }

  componentWillMount() {
    // 锁定浮层下层
    this.state.closeBody = window.isBodyScroll
    window.isBodyScroll && base.bodyScroll(false)
  }

  componentDidMount() {
    let { params } = this.state
    params.folderId = this.props.id
    this.setState({ params })
  }

  uploadLocl(files) {
    let self = this
    let { total, uploadCount, addPic } = self.state

    total += files.length
    // 限制上传数量
    if (files.length === 0 || total > uploadCount) {
      total -= files.length
      self.setState({
        tip: true
      }, () => {
        let timeOut = setTimeout(() => {
          self.setState({
            tip: false
          }, () => {
            clearTimeout(timeOut)
          })
        }, 3000)
      })
      return
    }
    // if (files.length === 0) {
    //     return;
    // }
    self.setState({ total })
    for (let i = 0; i < files.length; i++) {
      let fr = new FileReader()
      fr.onload = (e) => {
        let img = new Image()
        img.src = e.target.result
        img.onload = () => {
          let imgInfo = {
            src: img.src,
            height: 0,
            uploadStatus: 3 // 图片上传状态 1.上传成功后 3.上传中 4.上传失败
          }
          addPic.push(imgInfo)
          self.setState({ addPic }, () => {
            self.uploadOssImg(imgInfo)
          })
        }
        img.onerror = () => {
          let imgInfo = {
            src: img.src,
            height: 0,
            uploadStatus: 1
          }
          addPic.unshift(imgInfo)
          self.setState({ addPic })
        }
      }
      fr.readAsDataURL(files[i])
    }
  }

  selectImg(e) {
    let self = this
    let file = e.currentTarget.files
    // let {uploadPicInfo} = self.state
    // 禁止上传重复图片
    // for (let i = 0; i < file.length; i++) {
    //   let result = uploadPicInfo.some(item => item.name === file[i].name)
    //   if (result) {
    //     return
    //   }
    //   uploadPicInfo.push(file[i])
    // }
    base.ajaxList.basic({
      type: 'GET',
      url: `${base.baseUrl}/user/upload/get-oss-upload-token`
    }, (d) => {
      let { leftUploadCount, sign } = d.result
      self.setState({
        uploadCount: leftUploadCount,
        param: sign,
        // uploadPicInfo
      }, () => {
        // 图片上传到本地
        self.uploadLocl(file)
      })
    })
  }

  closeUpload(num = 0, type = 0) {
    let { renderWater } = this.props
    uploadCount = 0
    count = 0
    !type && base.ajaxList.addPoint(2100005, { succeed: false })
    this.state.closeBody && base.bodyScroll(true)
    let uploadEl = ReactDOM.findDOMNode(this)
    $(uploadEl).remove()
    !!num && renderWater && renderWater(num)
  }

  deleteNode(index) {
    count -= 1
    uploadCount -= 1
    let { total, addPic, params } = this.state
    addPic.splice(index, 1)
    params.urls.splice(index, 1)
    total--
    this.setState({ addPic, params, total })
  }

  confirmUpload() {
    let self = this
    let { params } = self.state
    base.ajaxList.basic({
      type: 'POST',
      url: `${base.baseUrl}/user/upload/save-uploaded-picture`,
      data: params
    }, () => {
      let content = {
        pic_qty: params.urls.length,
        succeed: true
      }
      base.ajaxList.addPoint(2100005, content)
      self.closeUpload(params.urls.length, 1)
    })
  }

  close(cb) {
    typeof cb === 'function' && cb()
  }

  editSuccess(pic) {
    let { params } = this.state
    params.urls.push(pic)
    this.setState({ params })
  }

  uploadOssImg(imgInfo) {
    let self = this
    let { addPic } = self.state


    let param = addPic[uploadCount].src
    let suffix = param.slice(param.indexOf('/') + 1, param.indexOf(';'))

    self.putb64(param, suffix, imgInfo, () => {
      // if (addPic[count].height === 100) {
      imgInfo.uploadStatus = 1
      // }
      self.setState({ addPic })
    }, () => {
      imgInfo.uploadStatus = 4
      self.setState({ addPic })
      df_alert({
        type: 'warning',
        mainText: '上传图片失败',
      })
    })
  }

  // 上传文件流
  putb64(base64, suffix, imgInfo, successCallback, errorCallback) {
    let self = this
    let { param, params, addPic } = self.state
    let { accessid, dir, host, policy, signature } = param
    let upload_url = `${host}`
    // upload_url = `${base.baseUrl}/users/Upload-avatar`,
    let xhr = new XMLHttpRequest()
    param.key = `${dir}/${new Date().getTime()}_${Math.floor((Math.random() + 1) * 300)}.${suffix}`
    params.urls.push(`${param.host}/${param.key}`)
    self.setState({ params })
    uploadCount++

    let request = new FormData()
    let fileData = base64.split(',')[1]

    fileData = window.atob(fileData)
    let ia = new Uint8Array(fileData.length)
    for (let i = 0; i < fileData.length; i++) {
      ia[i] = fileData.charCodeAt(i)
    }

    // canvas.toDataURL 返回的默认格式就是 image/png
    let blob = new Blob([ia], {
      type: 'image/jpeg'
    })

    request.append('OSSAccessKeyId', accessid)
    request.append('policy', policy)
    request.append('signature', signature)
    request.append('key', param.key)
    // request.append('expire', parseInt(param.expire));
    // request.append('success_action_redirect', 'http://oss.aliyun.com');
    request.append('success_action_status', 200)
    // request.append('callback', param.callback);
    request.append('file', blob)
    request.append('submit', 'Upload')

    xhr.open('POST', upload_url, true)
    // xhr.setRequestHeader('Content-Type', 'multipart/form-data; boundary=' + boundary);
    // xhr.sendAsBinary(installFormData(fileData));

    // 进度
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        // console.log(count, event.loaded, event.total);
        imgInfo.height = Math.ceil((event.loaded / event.total) * 100)
        self.setState({ addPic })
      }
    }

    xhr.send(request)

    // 成功or失败会回调
    xhr.onreadystatechange = () => {
      if (this.readyState === 4) {
        if (this.status === 200) {
          successCallback(this.responseText)
        } else if (this.status >= 400) {
          if (errorCallback && errorCallback instanceof Function) {
            errorCallback(this.responseText)
          }
        }
      }
    }
  }

  chooseFolder() {
    let { params, total } = this.state
    if (!total) {
      return
    }
    let content = {
      pic_qty: total,
      succeed: true
    }
    // ani.success(
    base.ajaxList.addPoint(2100005, content)
    ReactDOM.render(<MoveCopyPop title='collect' num={total} selectFolder='true' urls={params.urls} mediaUrl={params.urls[0]} hidden={false} />, document.getElementById('move-copy-pop-wrapper'))
    this.closeUpload(0, 1)
  }

  render() {
    let { addPic, tip } = this.state
    let { selectFolder } = this.props

    return (
      <div className='upload-container'>
        <div className={className(
          'upload-container-content',
          {
            'uploaded': !!addPic.length
          }
        )}
        >
          <div className={className('upload-tip', {
            'active': tip
          })}
          >
            抱歉！最多只能选择9张图片哦～
          </div>
          <div className="upload-container-header">
            添加精选
            <Icon type='close-recom' handleClick={() => this.closeUpload(0)} />
          </div>
          <div className={className('upload-container-box', { 'uploaded': !!addPic.length })}>
            {
              !addPic.length &&
              <div>
                <div className="upload-button">
                  点击上传
                  <input type="file"
                    id="upload-avatar"
                    multiple="multiple"
                    accept="image/png,image/jpg,image/jpeg"
                    onChange={this.selectImg.bind(this)}
                  />
                </div>
                点击一个或多个文件到这里上传<br />
                只支持jpg、png格式图片，且数量不超过9张
                <div className="upload-bottom">
                  * 请严格遵守法律法规，严禁在互联网上存储、处理、传输、发布涉密信息
                </div>
              </div>
            }
            {
              !!addPic.length &&
              <ul className='upload-pic'>
                {
                  addPic.map((item, index) => (<li key={`img-${index + 1}`} className='upload-pic-item'>
                    <img src={item.src} alt="" />
                    {
                      item.uploadStatus === 1 &&
                      <div className="upload-close" onClick={this.deleteNode.bind(this, index)}>
                        <Icon type='close-recom' />
                      </div>
                    }
                    {
                      item.uploadStatus === 3 &&
                      <div>
                        <div className="upload-progress"
                          style={{ height: `${100 - item.height}%` }}
                        >
                        </div>
                        <span>{`${item.height}%`}</span>
                      </div>
                    }
                    {
                      item.uploadStatus === 4 &&
                      <div className="upload-faild" onClick={this.uploadOssImg.bind(this, 1)}>
                        <Icon type='rotate' />
                        上传失败，请重新上传
                      </div>
                    }
                                               </li>))
                }
                {
                  addPic.length < 9 &&
                  <li className="upload-pic-item add-pic-btn">
                    <Icon type='new-folder-2' />
                    点击继续添加
                    <input type="file"
                      id="continue-add"
                      multiple="multiple"
                      accept="image/png,image/jpg,image/jpeg"
                      onChange={this.selectImg.bind(this)}
                    />
                  </li>
                }
              </ul>
            }
          </div>
          {
            !!addPic.length &&
            <div className="upload-container-button">
              <button ref={el => this.confirm = el}
                className='btn-animation upload-confirm'
                onClick={selectFolder ? this.chooseFolder.bind(this) : this.confirmUpload.bind(this)}
              >确定
              </button>
              <button className='upload-cancel' onClick={() => this.closeUpload(0)}>取消</button>
            </div>
          }
        </div>
      </div>
    )
  }
}

export default Upload