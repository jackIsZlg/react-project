import base from '../../common/baseModule'

/* 图片加载组件 */
class LoadImage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      bgColor: this.props.bgColor ? this.props.bgColor.replace('0x', '#') : base.getRandomColor(),
      status: false,
      originalSrc: this.props.src,
      src: this.props.loadImg || base.defaultGrayImg,
    }
  }

  componentDidMount() {
    this._initImage()
  }

  componentWillReceiveProps(nextProps) {
    let loadImageSrc = ''
    if (nextProps.src !== this.state.originalSrc) {
      this.setState({
        originalSrc: nextProps.src,
        src: nextProps.loadImg || loadImageSrc,
        status: false,
      }, function () {
        this._initImage()
      })
    }
  }

  // 获取随机颜色
  _initImage() {
    let loadImageSrc = ''
    let image = new Image()
    let t = this
    let tryCount = 2
    let _originalSrc = base.ossImg(t.state.originalSrc, 500)
    image.src = _originalSrc || loadImageSrc

    image.onload = function () {
      image.src === _originalSrc && t.setState({
        status: true,
        src: image.src
      })
    }
    image.onerror = function () {
      if (tryCount-- > 0) {
        image.src = t.state.originalSrc || loadImageSrc
      } else {
        // 图片加载错误，给默认图片
        image.src = loadImageSrc
      }
    }
  }

  render() {
    let style = {
      'width': `${this.props.width}px`,
      'height': `${this.props.height}px`,
      'background': this.state.bgColor
    }

    if (!this.state.status) {
      return <div style={style}/>
    }

    if (this.state.wfType === 'orderMeeting') {
      return <img src={this.state.src} alt=''/>
    }

    return (<img
      alt=''
      src={this.state.src}
      width={this.props.width}
      height={this.props.height}
    />)
  }
}

LoadImage.defaultProps = {
  width: 'auto',
  height: 'auto'
}
export default LoadImage