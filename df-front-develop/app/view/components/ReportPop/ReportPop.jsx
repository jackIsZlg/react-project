/**
 * Created by gewangjie on 2017/5/18.
 *
 <Report/>
 */

import classNames from 'classnames';
import base from '../../common/baseModule'

$('#app').append('<div id="report-pop-wrapper"></div>');

class ReportPop extends React.Component {
    constructor(props) {
        super(props);
        // 默认数据
        this.state = {
            isLogin: false,
            hidden: true,
            content: '',
            selectText: [],
            needTextArea: false,
            lightBtn: false
        }
    }

    // 第一次渲染前调用
    componentWillMount() {

        // 模块隐藏不触发
        if (!this.props.hidden) {
            this.state.isLogin ? this.init() : this.isLogin();
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.hidden === false) {
            this.init(nextProps.blogId === this.props.blogId)
        } else {
            this.setState({
                hidden: true
            });
        }
    }

    init(flag) {
        flag ? this.setState({hidden: false}) : this.setState({
            hidden: false,
            content: '',
            selectText: [{
                text: '垃圾广告',
                isCheck: false
            }, {
                text: '淫秽色情',
                isCheck: false
            }, {
                text: '人身攻击',
                isCheck: false
            }, {
                text: '敏感信息',
                isCheck: false
            }, {
                text: '骚扰他人',
                isCheck: false
            }],
            needTextArea: false,
            lightBtn: false
        });
    }

    // 判断登陆
    isLogin() {
        let self = this;
        base.request({
            "type": "GET",
            "url": base.baseUrl + '/users/login-state'
        }).done((d) => {
            if (d.success) {
                d.result * 1 !== 0 && self.init();
            } else {

            }
        }).fail();
    }

    //关闭弹窗
    closePop(cb) {
        this.setState({
            hidden: true
        }, function () {
            typeof cb === 'function' && cb();
        });

    }

    // 选择意见
    selectReport(index) {
        let _data = this.state.selectText,
            currentFlag = !_data[index].isCheck;

        this.selectAllFalse();

        // 选中
        if (currentFlag) {
            _data[index].isCheck = currentFlag;
            this.setState({
                needTextArea: false,
                selectText: _data,
            });
        }

        this.lightBtn();
    }

    selectReportOther() {
        this.selectAllFalse();
        this.setState({
            needTextArea: !this.state.needTextArea,
        });
        this.lightBtn();
    }

    selectAllFalse() {
        let _data = this.state.selectText;
        _data.forEach((item) => {
            item.isCheck = false
        });
        this.setState({
            selectText: _data,
        });
    }

    // 输入
    handleTextArea(e) {
        let val = e.target.value;
        this.setState({
            content: val
        }, () => {
            this.lightBtn();
        });

    }

    renderLabel() {
        return this.state.selectText.map((item, index) => {
            let _key = `report-${index}`;
            return <li key={_key} className={classNames({'select': item.isCheck})}
                       onClick={this.selectReport.bind(this, index)}>
                <div>
                    <span/>
                    {item.text}
                </div>
            </li>
        })
    }

    // 判定点亮按钮
    lightBtn() {
        if (this.state.needTextArea && this.state.content) {
            this.setState({
                lightBtn: true
            });
            return;
        }
        let isLight = this.state.selectText.some((item) => {
            return item.isCheck === true;
        });
        this.setState({
            lightBtn: isLight
        });
    }

    // 提交数据
    postData() {
        let self = this,
            el = self.refs['btn-post'],
            ani = base.animationBtn(el);
        // 用户无输入
        if (!self.state.lightBtn) {
            console.log('空数据');
            return;
        }
        ani.loading();

        let _array = [],
            i, _length = self.state.selectText.length;

        // 遍历按钮，获取按钮内容
        for (i = 0; i < _length; i++) {
            let item = self.state.selectText[i];
            item.isCheck && _array.push(item.text);
        }

        // 获取用户键入内容
        if (self.state.needTextArea && self.state.content) {
            _array.push(self.state.content);
        }

        console.log(self.props.blogId, _array.join(','));
        $.ajax({
            type: 'GET',
            url: `${base.baseUrl}/report?blogId=${self.props.blogId}&contentList=${_array.join(',')}`
        }).done((d) => {
            if (d.success) {
                ani.success(function () {
                    self.closePop();
                    df_alert({
                        tipImg: base.ossImg(self.props.mediaUrl, 288),
                        mainText: '成功提交反馈意见',
                    });
                });
            } else {
                ani.cancel();
            }
        }).fail(() => {
            ani.cancel();
        })
    }

    render() {
        let labelHtml = this.renderLabel();
        return <div id="report-pop-panel" className={classNames({'hidden': this.state.hidden})}>
            <div className="report-pop-panel">
                <i className="iconfont cancel-pop" onClick={this.closePop.bind(this)}/>
                <div className="report-pop-header">
                    举报
                </div>
                <div className="report-pop-content">
                    <div className="report-sub-text">该图片涉及</div>
                    <ul>
                        {labelHtml}
                        <li key='report-other' className={classNames({'select': this.state.needTextArea})}
                            onClick={this.selectReportOther.bind(this)}>
                            <div>
                                <span/>其他
                            </div>
                        </li>
                    </ul>
                    <div className="clearfix"/>
                    <div className={classNames('report-textarea', {'show-textarea': this.state.needTextArea})}>
                        <div className="textarea-pane">
                            <pre><span>{this.state.content}</span><br/></pre>
                            <textarea value={this.state.content}
                                      placeholder="可在此输入更多意见"
                                      onChange={this.handleTextArea.bind(this)}/>
                        </div>
                        <button ref="btn-post"
                                onClick={this.postData.bind(this)}
                                className={classNames('btn-to-post btn-animation', {'null': !this.state.lightBtn})}>
                            提交
                        </button>
                    </div>
                </div>
            </div>
        </div>
    }
}

export default ReportPop