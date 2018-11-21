/**
 * Created by gewangjie on 2017/11/27
 */

import base from '../../common/baseModule'
import {Icon} from '../../components/base/baseComponents'
import classNames from 'classnames'

$('#app').append('<div id="avatar-edit-pop-wrapper"></div>')

let param,
  _canvas, // 头像操作区
  ctx,
  img = new Image(), // 上传图片
  file,
  operate = {
    drag: false,
    mx: 0,
    my: 0,
  }, // 头像操作鼠标参数
  avatarConfig = {
    position: {x: 0.5, y: 0.5},
    scale: 1,
    rotate: 0,
    border: 30,
    borderRadius: 0,
    width: 340,
    height: 340,
    color: [0, 0, 0, 0.5],
    style: {},
    image: {}
  }// 头像操作图片属性

// 获取上传凭证
function getToken() {
  base.ajaxList.basic({
    type: 'GET',
    url: `${base.baseUrl}/oss-sign?dir=useravatar`
  }, (d) => {
    param = d.result
  })
}

// 上传文件流
function putb64(base64, successCallback, errorCallback) {
  let upload_url = `${param.host}`,
    // upload_url = `${base.baseUrl}/users/Upload-avatar`,
    xhr = new XMLHttpRequest()

  let request = new FormData(),
    fileData = base64.split(',')[1]

  fileData = window.atob(fileData)
  let ia = new Uint8Array(fileData.length)
  for (let i = 0; i < fileData.length; i++) {
    ia[i] = fileData.charCodeAt(i)
  }
  // canvas.toDataURL 返回的默认格式就是 image/png
  let blob = new Blob([ia], {
    type: 'image/jpeg'
  })

  request.append('OSSAccessKeyId', param.accessid)
  request.append('policy', param.policy)
  request.append('Signature', param.signature)
  request.append('key', param.key)
  // request.append('expire', parseInt(param.expire));
  // request.append('success_action_redirect', 'http://oss.aliyun.com');
  request.append('success_action_status', 200)
  // request.append('callback', param.callback);
  request.append('file', blob)
  request.append('submit', 'Upload')

  xhr.open('POST', upload_url, true)
  // xhr.setRequestHeader('Content-Type', 'multipart/form-data; boundary=' + boundary);
  xhr.send(request)
  // xhr.sendAsBinary(installFormData(fileData));

  // 进度
  xhr.upload.onprogress = function (event) {
    if (event.lengthComputable) {
      duringCallback((event.loaded / event.total) * 100)
    }
  }

  // 成功or失败会回调
  xhr.onreadystatechange = function () {
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

function duringCallback(loaded) {
  console.log(`${loaded}%`)
}

// avatar操作
let avatarEdit = {
  init(img) {
    _canvas.width = 400
    _canvas.height = 400
    this.handleImageReady(img)
    this.update(ctx)
  },

  update(context) {
    context.clearRect(0, 0, 400, 400)
    this.paint(context)
    this.paintImage(context, avatarConfig.image, avatarConfig.border)
  },

  close() {
    // 移除事件

  },

  // 鼠标事件
  handleMouseDown(e) {
    e = e || window.event
    // if e is a touch event, preventDefault keeps
    // corresponding mouse events from also being fired
    // later.
    e.preventDefault()
    const mousePositionX = e.targetTouches ? e.targetTouches[0].pageX : e.clientX
    const mousePositionY = e.targetTouches ? e.targetTouches[0].pageY : e.clientY

    operate.drag = true
    operate.mx = mousePositionX
    operate.my = mousePositionY
    animate()
  },

  handleMouseUp() {
    operate.drag = false
  },

  handleMouseMove(e) {
    e = e || window.event

    if (operate.drag === false) {
      return
    }

    const mousePositionX = e.targetTouches ? e.targetTouches[0].pageX : e.clientX
    const mousePositionY = e.targetTouches ? e.targetTouches[0].pageY : e.clientY

    let rotate = avatarConfig.rotate

    rotate %= 360
    rotate = (rotate < 0) ? rotate + 360 : rotate
    rotate -= rotate % 90

    const mx = operate.mx - mousePositionX
    const my = operate.my - mousePositionY

    const width = avatarConfig.image.width * avatarConfig.scale
    const height = avatarConfig.image.height * avatarConfig.scale

    let last = this.getCroppingRect(),
      lastX = last.x,
      lastY = last.y

    lastX *= width
    lastY *= height

    // helpers to calculate vectors
    const toRadians = degree => degree * (Math.PI / 180)
    const cos = Math.cos(toRadians(rotate))
    const sin = Math.sin(toRadians(rotate))

    const x = lastX + (mx * cos) + (my * sin)
    const y = lastY + (-mx * sin) + (my * cos)

    const relativeWidth = (1 / avatarConfig.scale) * this.getXScale()
    const relativeHeight = (1 / avatarConfig.scale) * this.getYScale()

    avatarConfig.position = {
      x: (x / width) + (relativeWidth / 2),
      y: (y / height) + (relativeHeight / 2)
    }

    operate.mx = mousePositionX
    operate.my = mousePositionY
  },

  // 头像旋转、缩放
  handleScaleRotate(action) {
    let _rotate = 0
    switch (action) {
      case 'big':
        avatarConfig.scale = Math.min(avatarConfig.scale + 0.1, 2)
        break
      case 'small':
        avatarConfig.scale = Math.max(avatarConfig.scale - 0.1, 1)
        break
      case 'left':
        _rotate = avatarConfig.rotate - 90
        avatarConfig.rotate = _rotate < -1 ? 270 : _rotate
        break
      case 'right':
        _rotate = avatarConfig.rotate + 90
        avatarConfig.rotate = _rotate > 361 ? 90 : _rotate
        break
    }
    avatarEdit.update(ctx)
  },

  isVertical() {
    return avatarConfig.rotate % 180 !== 0
  },

  getDimensions() {
    const {width, height, rotate, border} = avatarConfig

    const canvas = {}

    const canvasWidth = width + (border * 2)
    const canvasHeight = height + (border * 2)

    if (this.isVertical()) {
      canvas.width = canvasHeight
      canvas.height = canvasWidth
    } else {
      canvas.width = canvasWidth
      canvas.height = canvasHeight
    }

    return {
      canvas,
      rotate,
      width,
      height,
      border
    }
  },

  getImage() {
    // get relative coordinates (0 to 1)
    const cropRect = this.getCroppingRect()
    const image = avatarConfig.image


    // get actual pixel coordinates
    cropRect.x *= image.resource.width
    cropRect.y *= image.resource.height
    cropRect.width *= image.resource.width
    cropRect.height *= image.resource.height

    const scale = avatarConfig.width / cropRect.width

    // create a canvas with the correct dimensions
    const canvas = document.createElement('canvas')


    // 裁剪头像为矩形，完成图片压缩
    canvas.width = avatarConfig.width
    canvas.height = avatarConfig.height

    // if (this.isVertical()) {
    //     canvas.width = cropRect.height;
    //     canvas.height = cropRect.width;
    // } else {
    //     canvas.width = cropRect.width;
    //     canvas.height = cropRect.height;
    // }

    // console.log(canvas.width, canvas.height);

    const context = canvas.getContext('2d')

    context.translate((canvas.width / 2), (canvas.height / 2))
    context.rotate((avatarConfig.rotate * Math.PI / 180))
    context.translate(-canvas.width / 2, -canvas.height / 2)

    // if (this.isVertical()) {
    //     context.translate((canvas.width - canvas.height) / 2, (canvas.height - canvas.width) / 2)
    // }

    context.drawImage(
      image.resource, -cropRect.x * scale, -cropRect.y * scale,
      image.resource.width * scale, image.resource.height * scale
    )

    return canvas
  },

  getImageScaledToCanvas() {
    const {width, height} = this.getDimensions()

    const canvas = document.createElement('canvas')

    if (this.isVertical()) {
      canvas.width = height
      canvas.height = width
    } else {
      canvas.width = width
      canvas.height = height
    }

    // don't paint a border here, as it is the resulting image
    this.paintImage(canvas.getContext('2d'), avatarConfig.image, 0)

    return canvas
  },

  getXScale() {
    const canvasAspect = avatarConfig.width / avatarConfig.height
    const imageAspect = avatarConfig.image.width / avatarConfig.image.height

    return Math.min(1, canvasAspect / imageAspect)
  },

  getYScale() {
    const canvasAspect = avatarConfig.height / avatarConfig.width
    const imageAspect = avatarConfig.image.height / avatarConfig.image.width

    return Math.min(1, canvasAspect / imageAspect)
  },

  getCroppingRect() {
    const position = avatarConfig.position || {x: avatarConfig.image.x, y: avatarConfig.image.y}
    const width = (1 / avatarConfig.scale) * this.getXScale()
    const height = (1 / avatarConfig.scale) * this.getYScale()

    const croppingRect = {
      x: position.x - (width / 2),
      y: position.y - (height / 2),
      width,
      height
    }

    let xMin = 0
    let xMax = 1 - croppingRect.width
    let yMin = 0
    let yMax = 1 - croppingRect.height

    // If the cropping rect is larger than the image, then we need to change
    // our maxima & minima for x & y to allow the image to appear anywhere up
    // to the very edge of the cropping rect.
    const isLargerThanImage = width > 1 || height > 1

    if (isLargerThanImage) {
      xMin = -croppingRect.width
      xMax = 1
      yMin = -croppingRect.height
      yMax = 1
    }

    return {
      ...croppingRect,
      x: Math.max(xMin, Math.min(croppingRect.x, xMax)),
      y: Math.max(yMin, Math.min(croppingRect.y, yMax))
    }
  },

  isDataURL(str) {
    if (str === null) {
      return false
    }
    const regex = /^\s*data:([a-z]+\/[a-z]+(;[a-z-]+=[a-z-]+)?)?(;base64)?,[a-z0-9!$&',()*+;=\-._~:@/?%\s]*\s*$/i
    return !!str.match(regex)
  },

  handleImageReady(image) {
    const imageState = this.getInitialSize(image.width, image.height)
    imageState.resource = image
    imageState.x = 0.5
    imageState.y = 0.5
    avatarConfig.image = imageState
  },

  getInitialSize(width, height) {
    let newHeight
    let newWidth

    const dimensions = this.getDimensions()
    const canvasRatio = dimensions.height / dimensions.width
    const imageRatio = height / width

    if (canvasRatio > imageRatio) {
      newHeight = (this.getDimensions().height)
      newWidth = (width * (newHeight / height))
    } else {
      newWidth = (this.getDimensions().width)
      newHeight = (height * (newWidth / width))
    }

    return {
      height: newHeight,
      width: newWidth
    }
  },

  paintImage(context, image, border) {
    if (image.resource) {
      const position = this.calculatePosition(image, border)

      context.save()

      context.translate((context.canvas.width / 2), (context.canvas.height / 2))
      context.rotate((avatarConfig.rotate * Math.PI / 180))
      context.translate(-(context.canvas.width / 2), -(context.canvas.height / 2))

      if (this.isVertical()) {
        context.translate((context.canvas.width - context.canvas.height) / 2, (context.canvas.height - context.canvas.width) / 2)
      }

      context.globalCompositeOperation = 'destination-over'
      context.drawImage(image.resource, position.x, position.y, position.width, position.height)
      context.restore()
    }
  },

  calculatePosition(image, border) {
    image = image || avatarConfig.image

    const croppingRect = this.getCroppingRect()

    const width = image.width * avatarConfig.scale
    const height = image.height * avatarConfig.scale

    const x = border - (croppingRect.x * width)
    const y = border - (croppingRect.y * height)

    return {
      x,
      y,
      height,
      width
    }
  },

  paint(context) {
    context.save()
    context.translate(0, 0)
    context.fillStyle = `rgba(${avatarConfig.color.slice(0, 4).join(',')})`

    let borderRadius = avatarConfig.borderRadius
    const dimensions = this.getDimensions()
    const borderSize = dimensions.border
    const height = dimensions.canvas.height
    const width = dimensions.canvas.width

    // clamp border radius between zero (perfect rectangle) and half the size without borders (perfect circle or "pill")
    borderRadius = Math.max(borderRadius, 0)
    borderRadius = Math.min(borderRadius, width / 2 - borderSize, height / 2 - borderSize)

    context.beginPath()
    // inner rect, possibly rounded
    this.drawRoundedRect(context, borderSize, borderSize, width - borderSize * 2, height - borderSize * 2, borderRadius)
    context.rect(width, 0, -width, height)// outer rect, drawn "counterclockwise"
    context.fill('evenodd')

    context.restore()
  },

  drawRoundedRect(context, x, y, width, height, borderRadius) {
    if (borderRadius === 0) {
      context.rect(x, y, width, height)
    } else {
      const widthMinusRad = width - borderRadius
      const heightMinusRad = height - borderRadius
      context.translate(x, y)
      context.arc(borderRadius, borderRadius, borderRadius, Math.PI, Math.PI * 1.5)
      context.lineTo(widthMinusRad, 0)
      context.arc(widthMinusRad, borderRadius, borderRadius, Math.PI * 1.5, Math.PI * 2)
      context.lineTo(width, heightMinusRad)
      context.arc(widthMinusRad, heightMinusRad, borderRadius, Math.PI * 2, Math.PI * 0.5)
      context.lineTo(borderRadius, height)
      context.arc(borderRadius, heightMinusRad, borderRadius, Math.PI * 0.5, Math.PI)
      context.translate(-x, -y)
    }
  }
}

// 高性能渲染，canvas操作
function animate() {
  operate.drag && window.requestAnimationFrame(animate)
  avatarEdit.update(ctx)
}

class AvatarEditPop extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      img: props.img,
      hidden: props.hidden,
      closeBody: false
    }
  }

  // 第一次渲染后调用
  componentDidMount() {
    _canvas = this.refs.canvas // 头像操作区
    ctx = _canvas.getContext('2d')
    this.init()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.hidden === false) {
      this.setState({
        img: nextProps.img,
        hidden: false,
      }, this.init)
    }
  }

  init() {
    // 初始化图片
    avatarEdit.init(this.state.img)

    // 锁定浮层下层
    this.state.closeBody = window.isBodyScroll
    window.isBodyScroll && base.bodyScroll(false)
  }

  handleUpdate() {
    let self = this,
      c = avatarEdit.getImage().toDataURL('image/jpeg'),
      el = self.refs['post-avatar'],
      ani = base.animationBtn(el)

    // 按钮动画开始
    ani.loading()
    putb64(c, () => {
      let avatar = `${param.host}/${param.key}`
      self.props.editSuccess(avatar)
      ani.success(self.close.bind(self))
    }, () => {
      df_alert({
        type: 'warning',
        mainText: '修改用户头像失败',
      })
      ani.cancel()
    })
  }

  // 关闭
  close(cb) {
    this.setState({
      hidden: true
    }, function () {
      this.state.closeBody && base.bodyScroll(true)
      typeof cb === 'function' && cb()
    })
  }

  render() {
    const {hidden} = this.state

    return (
      <div id="avatar-pop-panel" className={classNames({'hidden': hidden})}>
            <div className="avatar-pop-panel">
              <i className="close-pop"
                  onClick={this.close.bind(this)}
                />
              <div className="avatar-pop-header">修改头像</div>
              <div className="canvas-pop-content">
                  <canvas id="canvas-avatar"
                      ref="canvas"
                      onMouseDown={avatarEdit.handleMouseDown.bind(avatarEdit)}
                      onMouseMove={avatarEdit.handleMouseMove.bind(avatarEdit)}
                      onMouseUp={avatarEdit.handleMouseUp.bind(avatarEdit)}
                      onMouseOut={avatarEdit.handleMouseUp.bind(avatarEdit)}
                    />
                  <div className="btn-edit-list">
                      <button onClick={avatarEdit.handleScaleRotate.bind(avatarEdit, 'big')}>
                          <Icon type="fangda"/>
                        </button>
                      <button onClick={avatarEdit.handleScaleRotate.bind(avatarEdit, 'small')}>
                          <Icon type="suoxiao1"/>
                        </button>
                      <button className="btn-avatar-left"
                          onClick={avatarEdit.handleScaleRotate.bind(avatarEdit, 'left')}
                        >
                          <Icon type="rotate"/>
                        </button>
                      <button onClick={avatarEdit.handleScaleRotate.bind(avatarEdit, 'right')}>
                          <Icon type="rotate"/>
                        </button>
                      <div className="float-r btn-right">
                          <button className="btn-select-avatar btn-round btn-default">
                                    重新上传
                            </button>
                          <input type="file"
                              id="re-upload-avatar"
                              accept="image/png,image/jpg,image/jpeg"
                              onChange={this.props.selectImg}
                            />
                          <button className="btn-post-avatar btn-round btn-animation btn-default-red"
                              ref="post-avatar"
                              onClick={this.handleUpdate.bind(this)}
                            >
                                    保存
                            </button>
                        </div>
                    </div>
                </div>
            </div>
          </div>
    )
  }
}

class AvatarEditPane extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hidden: true,
      avatar: props.avatar,
      closeBody: false
    }
  }

  selectImg(e) {
    let self = this
    getToken()
    if (e.currentTarget.files.length === 0) {
      return
    }

    file = e.currentTarget.files[0]

    let fr = new FileReader()
    fr.onload = function (e) {
      img.src = e.target.result
      img.onload = function () {
        ReactDOM.render(
          <AvatarEditPop img={img}
            hidden={false}
            editSuccess={self.editSuccess.bind(self)}
            selectImg={self.selectImg.bind(self)}
          />,
          document.getElementById('avatar-edit-pop-wrapper')
        )
      }
    }
    fr.readAsDataURL(file)
  }

  editSuccess(avatar) {
    this.setState({
      avatar
    })
    this.props.editSuccess(avatar)
  }

  render() {
    let avatarBg = {
      backgroundImage: `url(${base.ossImg(this.state.avatar, 163)})`
    }
    return (
      <div className="user-avatar" style={avatarBg}>
            <span>修改</span>
            <input type="file"
              id="upload-avatar"
              accept="image/png,image/jpg,image/jpeg"
              onChange={this.selectImg.bind(this)}
            />
          </div>
    )
  }
}

export default AvatarEditPane