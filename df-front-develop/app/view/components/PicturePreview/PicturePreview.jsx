import classNames from 'classnames'
import { Icon } from '../base/baseComponents'

let percent1
let percent2
let screenWidth = document.documentElement.clientWidth
let screenHeight = document.documentElement.clientHeight

class PicturePreview extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            src: props.src,
            zoomRatio: 1,//图片缩放比例
            rotate: 0,//旋转角度
            position: { l: 0, t: 0 },
            percentTipsVisible: false,//缩放百分比提示
            percentTips: false,
            transitionFlag: false,
            width: props.picWidth,
            height: props.picHeight
        };
        this.mouseWheelScroll = this.mouseWheelScroll.bind(this);
    }

    componentDidMount() {
        // 初始化位置
        this.setState({ position: this.initPosition() });
        // 初始化百分数
        this.initPercent();
        // 绑定滚轮事件
        this.bindMouseWheelEvent();
    }

    initPosition() {
        let pos = {},
            { width, height } = this.state,
            r = width / height,
            offW = this.pictureEl.offsetHeight * r;

        pos.l = screenWidth / 2 - offW / 2;
        pos.t = screenHeight / 2 - this.pictureEl.offsetHeight / 2;
        return pos;
    }

    // 解绑滚轮事件
    componentWillUnmount() {
        this.unbindMouseWheelEvent()
    }

    // 初始化百分比设置
    initPercent() {
        let that = this,
            { percentTipsVisible, percentTips } = that.state;

        clearTimeout(percent2);
        clearTimeout(percent1);

        percentTipsVisible = false;
        percentTips = false;
        that.setState({ percentTipsVisible, percentTips }, () => that.percentageHidden());
    }

    // 百分比消失
    percentageHidden() {
        let { percentTipsVisible, percentTips } = this.state,
            that = this;
        percent1 = setTimeout(() => {
            percentTipsVisible = true;
            that.setState({ percentTipsVisible }, () => {
                percent2 = setTimeout(() => {
                    percentTipsVisible = false;
                    percentTips = true;
                    that.setState({ percentTipsVisible, percentTips })
                }, 3000)
            });
        }, 1500)
    }

    // 点击关闭按钮关闭弹窗
    closePicture() {
        this.stopPropagation();
        this.componentWillUnmount();
        const { closeClick } = this.props;
        closeClick && closeClick();
    }

    // 阻止冒泡
    stopPropagation(e) {

        let evt = e ? e : window.event;

        // W3C: evt.stopPropagation()  IE: evt.cancelBubble = true
        evt.stopPropagation ? evt.stopPropagation() : evt.cancelBubble = true;
    }

    // 旋转图片
    turnRight(e) {

        e.stopPropagation();

        let that = this,
            { rotate } = this.state;

        that.setState({
            position: that.initPosition()
        }, () => {
            rotate = rotate + 90;
            this.setState({ rotate });
        })

    }

    // 缩放图片，100%查看
    zoomImage(type = '') {

        let that = this,
            { zoomRatio } = that.state,
            ratio = 1.25,
            pic = that.pictureEl;

        that.setState({
            position: that.initPosition()
        }, () => {
            that.initPercent();

            switch (type) {
                case 'enlarge':
                    zoomRatio = zoomRatio * ratio;
                    break;
                case 'narrow':
                    zoomRatio = zoomRatio / ratio;
                    break;
                default:
                    zoomRatio = 1;
                    break;
            }

            if (zoomRatio >= 10) {
                zoomRatio = 10;
            }

            if (zoomRatio <= 0.2) {
                zoomRatio = 0.2;
            }

            that.setState({ zoomRatio }, () => {
                if (that.state.zoomRatio <= 1) {
                    pic.onmousedown = null;
                    return;
                }

                that.bindMouseMoveEvent();

            });
        })

    }

    bindMouseMoveEvent() {

        let that = this,
            picX = 0,
            picY = 0,
            picEl = that.pictureEl;

        picEl.onmousedown = (e) => {
            e.preventDefault();

            let { position, transitionFlag } = that.state,
                { l, t } = position,
                picSize = picEl.getBoundingClientRect();

            transitionFlag = true;

            that.setState({ transitionFlag }, () => {
                //鼠标在图片中的位置
                picX = e.clientX;
                picY = e.clientY;

                picEl.onmousemove = (e) => {
                    e.preventDefault();

                    let x = e.clientX - picX,
                        y = e.clientY - picY;

                    position.l = l + x;
                    position.t = t + y;

                    let // 相对100%图片偏移量
                        cx = picSize.top - t,
                        cy = picSize.left - l,
                        // 图片在浏览器中的位置
                        top = position.t + cx,
                        left = position.l + cy;

                    if (top <= screenHeight / 2 - picSize.height) {
                        position.t = screenHeight / 2 - picSize.height - cx;
                    }

                    if (top >= screenHeight / 2) {
                        position.t = screenHeight / 2 - cx;
                    }

                    if (left <= screenWidth / 2 - picSize.width) {
                        position.l = -(picSize.width - screenWidth / 2) - cy;
                    }
                    if (left >= screenWidth / 2) {
                        position.l = screenWidth / 2 - cy;
                    }

                    that.setState({ position });

                };
                document.onmouseup = () => {
                    this.setState({
                        transitionFlag: false
                    }, () => picEl.onmousemove = null)
                }
            })

        };
    }

    //滚轮事件
    mouseWheelScroll(e) {

        e.preventDefault();

        let _delta = parseInt((e.wheelDelta || -e.detail), 10);

        _delta > 0 ? this.zoomImage('enlarge') : this.zoomImage('narrow');
    }

    //绑定鼠标滚轮事件
    bindMouseWheelEvent() {

        let MOUSE_WHEEL_EVENT = navigator.userAgent.indexOf("Firefox") > -1 ? "DOMMouseScroll" : "mousewheel";


        if (document.attachEvent) {
            document.body.attachEvent("on" + MOUSE_WHEEL_EVENT, this.mouseWheelScroll);
        } else if (document.addEventListener) {
            document.body.addEventListener(MOUSE_WHEEL_EVENT, this.mouseWheelScroll, false);
        }
    }

    //解除鼠标滚轮事件
    unbindMouseWheelEvent() {
        let MOUSE_WHEEL_EVENT = navigator.userAgent.indexOf("Firefox") > -1 ? "DOMMouseScroll" : "mousewheel";

        if (document.attachEvent) {
            document.body.detachEvent("on" + MOUSE_WHEEL_EVENT, this.mouseWheelScroll);
        } else if (document.addEventListener) {
            document.body.removeEventListener(MOUSE_WHEEL_EVENT, this.mouseWheelScroll);
        }
    }

    noRightClick(e) {
        e.preventDefault ? e.preventDefault() : (e.returnValue = false)
    }

    render() {

        let { src, zoomRatio, rotate, percentTipsVisible, percentTips, position, transitionFlag } = this.state,
            { l, t } = position,
            style = {
                'transform': `rotate(${rotate}deg) scale(${zoomRatio})`,
                'transition': `all ${transitionFlag ? '0s' : '.2s'} linear`,
                'top': t + 'px',
                'left': l + 'px'
            },
            ratio = Math.round(zoomRatio * 100);


        return (
            <div className='picturePreview-container'>
                <Icon type='close-collect' handleClick={this.closePicture.bind(this)} />
                <div className="picturePreview-container-up" onClick={this.closePicture.bind(this)}>
                    <img ref={el => this.pictureEl = el} src={src} className="picturePreview-pic" style={style}
                        onClick={this.stopPropagation.bind(this)} onContextMenu={this.noRightClick.bind(this)} />
                    <div ref='percentage'
                        className={classNames('picturePreview-percentage', {
                            'picturePreview-hidden': percentTipsVisible,
                            'no-percentage': percentTips
                        })}
                        onClick={this.stopPropagation.bind(this)}>{ratio}&nbsp;%
                    </div>
                </div>
                <div className="picturePreview-container-down">
                    <Icon type='full' title='100%显示' handleClick={this.zoomImage.bind(this)} />
                    <Icon type='fangda' title='放大' handleClick={this.zoomImage.bind(this, 'enlarge')} />
                    <Icon type='suoxiao1' title='缩小' handleClick={this.zoomImage.bind(this, 'narrow')} />
                    <Icon type='rotate' title='向右旋转' handleClick={this.turnRight.bind(this)} />
                </div>
            </div>
        )
    }
}

export default PicturePreview;