/**
 * Created by gewangjie on 2018/1/2
 */
import base from '../../../common/baseModule'
import classNames from 'classnames'

// 配置微信分享
base.wechatConfig([], () => {
    base.shareConfig({
        title: '识图|挑选你最喜欢的20张图', // 分享标题
        desc: '人人都是设计师，快来为你喜欢的图片打call', // 分享描述
        link: location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: base.ossImg('https://zhiyi-web.oss-cn-hangzhou.aliyuncs.com/exam/bg-v1.1.jpg', 100), // 分享图标
        success: function () {
            // 用户确认分享后执行的回调函数
        },
        cancel: function () {
            // 用户取消分享后执行的回调函数
        }
    });
});

// 常量
const version = '1.0.0.1';
// const examTotal = 60;
const screenWidth = document.documentElement.offsetWidth;
const screenHeight = document.documentElement.offsetHeight;

const imgWidth = (screenWidth - 45) / 2;

function imgColumn(data, column) {

    let groupHeight = new Array(column).fill(0);

    data.forEach((img) => {
        let {width, height} = img,
            minH = Math.min.apply(null, groupHeight),
            _column = groupHeight.indexOf(minH);

        let scale = imgWidth / width;

        img.like = -1;

        img.heightInDoc = ~~(height * scale);

        img.top = minH;

        img.column = _column;

        // 累加图片高
        groupHeight[_column] = img.top + img.heightInDoc + 51;

    });

    return data;
}

class Images extends React.Component {

    // 大图展示
    bigPicExhibition() {
        const {mediaUrl} = this.props.data;
        base.is_weixin() && wx.previewImage({
            current: mediaUrl, // 当前显示图片的http链接
            urls: [mediaUrl] // 需要预览的图片http链接列表
        });
    }

    render() {
        const {data, index, handleLike} = this.props,
            {like, mediaUrl, show, heightInDoc} = data;

        return (
            <div className='image-container'>
                <div className="image-content" style={{'height': heightInDoc + 'px'}}
                     onClick={this.bigPicExhibition.bind(this)}>
                    <img className={classNames({'hide': !show})} src={show ? base.ossImg(mediaUrl, imgWidth) : ''}
                         data-index={index}/>
                    <div className='image-index'><span>{index + 1}</span></div>
                </div>
                <button className='image-like' onClick={handleLike}>
                    <div className={classNames("image-heart", {"choose": like === 1})}/>
                </button>
            </div>
        )
    }
}

class MessagePop extends React.Component {

    setCloseMask() {
        const closeMask = this.props.closeMask;

        closeMask && closeMask();
    }

    render() {

        const {isVisible, content} = this.props;

        return (
            <div className={classNames('login-mask', {'visible': isVisible})}>
                <div className="login-message">
                    {content}
                    <div className="login-message-close" onClick={this.setCloseMask.bind(this)}/>
                </div>
            </div>
        )
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 0,
            examNum: 0,
            phone: '',
            isAward: 0
        }
    }

    componentWillMount() {
        // this.state.step = 1;
        this.getExamNum();
    }

    synchroData(options, cb) {
        let _data = this.state;
        for (let i in options) {
            _data[i] = options[i];
            // console.log(i, options[i]);
        }
        this.setState(_data, () => {
            cb && cb();
        });
    }

    // 获取题目套数
    getExamNum() {
        let self = this;
        $.ajax({
            "type": "GET",
            // 'async': false,
            "url": `${base.baseUrl}/mobile/exam/v2/nums`,
            'success': (d) => {
                if (!d.success) {
                    alert(e.errorDesc);
                    return;
                }

                let examNum = d.result.currExamNum;
                self.setState({
                    examNum,
                    // step: examNum === 0 ? 1 : 2
                    // examNum: 8,
                    step: 2,
                    // isAward : 8
                });
            },
            'fail': (err) => {
                alert(err)
            }
        });
    }

    render() {
        const {step, phone, examNum, isAward} = this.state;
        let component;
        switch (step) {
            case 1:
                component = <PhoneResigner synchroData={this.synchroData.bind(this)}/>;
                break;
            case 2:
                component = <Exam phone={phone}
                                  examNum={examNum}
                                  synchroData={this.synchroData.bind(this)}/>;
                break;
            case 3:
                component = <Result phone={phone}
                                    examNum={examNum}
                                    isAward={isAward}
                                    synchroData={this.synchroData.bind(this)}/>;
                break;
            default:
                component = null;
        }
        return component
    }
}

// 步骤1 -- 登记手机号
class PhoneResigner extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            phone: '',
            error: false
        }
    }

    componentDidMount() {
        let self = this;
        if (navigator.userAgent.indexOf('Android') > -1) {
            window.onresize = function () {
                let curH = document.documentElement.offsetHeight;
                let logoEl = self.logo;
                if (curH !== screenHeight) {
                    logoEl.style.transform = `translateY(${curH - screenHeight}px)`;
                    logoEl.style.webkitTransform = `translateY(${curH - screenHeight}px)`;
                } else {
                    logoEl.style.transform = `translateY(0)`;
                    logoEl.style.webkitTransform = `translateY(0)`;
                }
            };
        }
    }

    handleInput(e) {
        this.setState({
            phone: e.target.value
        })
    }

    postPhone() {
        const {phone} = this.state;
        if (phone.length < 11) {
            return;
        }

        if (!(/^1[34578]\d{9}$/.test(phone))) {
            this.setState({
                error: true
            });
            return;
        }

        this.props.synchroData({
            step: 2,
            phone
        })
    }

    setCloseMask() {
        this.setState({
            error: false
        })
    }

    render() {
        const {phone, error} = this.state;
        return (
            <div id="step-1-wrapper" className="page-wrapper">
                <MessagePop isVisible={error} content='请输入正确的手机号码' closeMask={this.setCloseMask.bind(this)}/>
                <div className="logo" ref={e => this.logo = e}>
                    <span className="horn horn-1"/>
                    <span className="horn horn-2"/>
                    <span className="horn horn-3"/>
                    <span className="horn horn-4"/>
                    <img src="http://zhiyi-web.oss-cn-hangzhou.aliyuncs.com/exam/logo3.png" width="72px"/>
                    <div className="tip">
                        本组共有60张老妮的开款意向图<br/>宝贝们选出你们最喜欢的20张图片<br/><br/>
                        <span>
                            答题结束有丰厚奖品哦<br/>记得手机号写准确方便领奖哈
                        </span>
                    </div>
                </div>
                <div className="footer">
                    <input name="phone"
                           onChange={this.handleInput.bind(this)}
                           placeholder="点击输入手机号码" type="tel" maxLength="11"/>
                    <button className={classNames('btn btn-start', {
                        "gray": phone.length !== 11,
                        "yellow": phone.length === 11
                    })} onClick={this.postPhone.bind(this)}>开始答题
                    </button>
                </div>
                <div className="alert-wrapper phone">
                    <div className="alert-content">
                        请输入正确的手机号码
                        <span className="close"/>
                    </div>
                </div>
            </div>
        )
    }
}


// 步骤2 -- 做题
class Exam extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            likeNum: 0,
            bigPic: false,
            completeMessage: false
        }
        this.scrollEnd = true;
    }

    componentWillMount() {
        const {phone} = this.props;
        this.getImage(phone)
    }

    // 图片加载
    checkImgs() {
        this.scrollEnd = false;
        let {data} = this.state,
            start = 10 * this.scrollTopCount,
            end = start + 10;

        for (; start < end; start++) {
            data[start].show = true;
        }

        // this.setState({
        //     data
        // });
        this.scrollTopCount++;

        this.scrollEnd = true;
    }

    // 监听滚动
    addEvent(e) {

        e.preventDefault();

        if (!this.scrollEnd) return;

        let {scrollTopCount, scrollTopList} = this;

        if (scrollTopCount >= scrollTopList.length) return;

        if (this.container.scrollTop + screenHeight > scrollTopList[scrollTopCount]) {
            this.checkImgs();
        }
    }

    // 初始化滚动阈值
    initScroll() {
        let array = [],
            start = 0;
        while (start < 60) {
            array.push(this.state.data[start].top);
            start += 10;
        }

        this.scrollTopList = array;
        this.scrollTopCount = 0;
        // 强制加载首屏图片
        this.checkImgs();
    }

    getImage(phone = '') {
        let self = this;

        $.ajax({
            "type": "GET",
            // 'async': false,
            "url": `${base.baseUrl}/mobile/exam/v2/exams`,
            "data": {
                'phone': phone
            },
            'success': (d) => {
                if (!d.success) {
                    d.errorCode === 'E03' ? self.props.synchroData({
                        step: 3,
                        examNum: 11
                    }) : alert(d.errorDesc);
                    return;
                }

                self.setState({
                    data: imgColumn(d.result.postList, 2),
                    likeNum: 0,
                }, self.initScroll);

                self.props.synchroData({examNum: d.result.examNum});
            },
            'fail': (err) => {
                alert(err)
            }
        });
    }

    // // 大图展示
    // bigPicExhibition(url) {
    //     let createEl = document.createElement('div');
    //     createEl.id = 'pic-wrapper';
    //     document.body.appendChild(createEl);
    //
    //     createEl.style.backgroundImage = `url(${url})`;
    //     createEl.addEventListener('click', () => {
    //         document.body.removeChild(createEl);
    //     })
    // }

    loadImage() {
        let data = this.state.data,
            _html1 = [],
            _html2 = [];

        // data数组分成2组
        data.forEach((img, index) => {
            let props = {
                data: img,
                handleLike: this.handleLike.bind(this, index),
                index
            };
            if (img.column === 0) {
                _html1.push(<Images {...props}/>);
            } else {
                _html2.push(<Images {...props}/>);

            }
        });

        return <div ref='picColums' className='exam-column'>
            <div className="exam-column-left">
                {_html1}
            </div>
            <div className="exam-column-right">
                {_html2}
            </div>
        </div>;

    }

    handleLike(index) {
        let {data, likeNum} = this.state,
            status = data[index].like,
            self = this;

        // 未操作
        if (status === -1) {
            if (likeNum >= 20) {
                self.setState({
                    completeMessage: true
                });
                return;
            }
            data[index].like = 1;
            likeNum++;
        }

        // 喜欢
        if (status === 0) {
            data[index].like = 1;
            likeNum++;
        }

        // no喜欢
        if (status === 1) {
            data[index].like = 0;
            likeNum--;
        }
        this.setState({
            data,
            likeNum,
        });
    }

    handlePost() {
        let self = this;
        const {likeNum, data} = this.state;

        if (likeNum !== 20) {
            return;
        }

        let disLikeList = [],
            likeList = [];

        data.forEach((item) => {
            item.like === 1 ? likeList.push(item.postId) : disLikeList.push(item.postId);
        });


        $.ajax({
            "type": "POST",
            "url": `${base.baseUrl}/mobile/exam/v2/examsAnswers`,
            "data": {
                likeList: likeList.toString(),
                disLikeList: disLikeList.toString()
            },
            'success': (d) => {
                if (!d.success) {
                    $btnPost[0].disabled = false;
                    alert(d.errorDesc);
                    return;
                }
                // 跳转下一步
                self.props.synchroData({
                    step: 3,
                    isAward: d.result.isAward,
                    phone: d.result.phone
                });
            },
            'fail': (err) => {
                alert(err)
            }
        });
    }

    setCloseMask() {
        this.setState({
            completeMessage: false
        })
    }

    render() {

        let {likeNum, completeMessage} = this.state,
            styleWidth = {
                width: likeNum / 20 * 100 + '%'
            };

        return (
            <div id="step-2-wrapper" className="page-wrapper">
                <MessagePop isVisible={completeMessage} content='你的喜欢数已经达到20了哦'
                            closeMask={this.setCloseMask.bind(this)}/>
                <div className='exam-container'
                     ref={el => this.container = el}
                     onScroll={this.addEvent.bind(this)}>
                    {this.loadImage()}
                </div>
                <footer>
                    <button className='footer-btn'>
                        {likeNum >= 20 ? <p onClick={this.handlePost.bind(this)}>提交并抽奖</p> :
                            <p>已喜欢<span>{likeNum > 20 ? 20 : likeNum}</span></p>}
                        <div className="progress" style={styleWidth}/>
                    </button>
                </footer>
            </div>
        )
    }
}


// 步骤3 -- 结果
class Result extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            endPage: false
        }
    }

    selectTip() {
        const {isAward, examNum, phone} = this.props;

        let telephone = phone.substring(7);

        // 中奖
        if (isAward === 8) {
            return (
                <div className="result result-1">
                    {/*亲爱的 {phone} 粉丝<br/>*/}
                    <span className="yellow">哇哦！恭喜<br/>手机尾号为 {telephone} 的宝贝中奖</span>
                    <span>请截图联系客服领取奖励哦</span>
                </div>
            )
        }

        // 最后一套未中奖
        if (isAward === 4 && examNum === 10) {
            return (
                <div className="result result-2">
                    哇哦，很遗憾宝贝<br/>这次还是没有中奖呢
                    <span>老妮已经暴打技术小哥哥了</span>
                </div>
            )
        }

        // 粉丝未中奖
        if (isAward === 4) {
            return (
                <div className="result result-2">
                    哇哦，很遗憾宝贝<br/>这次没有中奖呢
                    <span>试试下一套说不定有意外惊喜哦</span>
                </div>
            )
        }
    }

    endPage() {
        return (
            <div className="result result-2">
                水土不服只服你<br/>恭喜宝贝你已完成全部10套题
            </div>
        )
    }

    // 继续答题
    handleClick() {
        const {examNum} = this.props;

        examNum < 10 ?
            this.props.synchroData({step: 2}) :
            this.setState({
                endPage: true
            });


    }

    render() {
        const {examNum} = this.props;
        let {endPage} = this.state;

        return (
            <div id="step-3-wrapper" className="page-wrapper">
                <div className={classNames("logo", {"finish": (endPage || examNum > 10)})}>
                    <span className="horn horn-1"/>
                    <span className="horn horn-2"/>
                    <span className="horn horn-3"/>
                    <span className="horn horn-4"/>
                    {examNum <= 10 && !endPage ? this.selectTip() : this.endPage()}
                    {/*继续答题*/}
                    {examNum < 10 && <div className="exam-num">
                        您已经完成{examNum}套题,
                        还剩{10 - examNum}套题
                    </div>}
                </div>
                {examNum <= 10 && !endPage && <div className="footer">
                    <button className="btn btn-next yellow"
                            onClick={this.handleClick.bind(this)}>
                        {examNum < 10 ? '再来一套' : '我知道了'}
                    </button>
                </div>}
            </div>
        )
    }
}

ReactDOM.render(<App/>, document.getElementById('app'));