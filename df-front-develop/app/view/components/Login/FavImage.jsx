/**
 * Created by gewangjie on 2017/8/9
 */

import base from '../../common/baseModule'
import classNames from 'classnames';

// 选择喜欢的图片
class FavImage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 1,
            style: [{'name': '日韩', 'id': 414}, {'name': '欧美', 'id': 415}],
            content: [{'name': '服饰', 'id': 416}, {'name': '生活', 'id': 417}, {'name': '摄影', 'id': 418},
                {'name': '灵感', 'id': 419}, {'name': '平面', 'id': 420}, {'name': '家居', 'id': 421}],
            selectedStyle: false,
            selectedContent: false
        }
    }

    changeStep(step) {
        this.props.changeStep(step);
    }

    // 选择风格
    selectStyle(i) {
        if (this.state.step === 2) {
            return;
        }
        let _data = this.state.style;
        _data[i].selected = !_data[i].selected;
        this.setState({
            'style': _data
        });
    }

    // 选择内容
    selectContent(i) {
        if (this.state.step === 2) {
            return;
        }
        let _data = this.state.content;
        _data[i].selected = !_data[i].selected;
        this.setState({
            'content': _data
        });
    }

    // 发送
    postImageId() {
        let self = this;
        if (self.state.selectedContent && self.state.selectedStyle) {
            let postData = [];
            self.state.style.forEach((item) => {
                item.selected && postData.push(item.id);
            });
            self.state.content.forEach((item) => {
                item.selected && postData.push(item.id);
            });

            console.log(postData.toString());

            self.setState({
                step: 2
            });
            $.ajax({
                'type': 'POST',
                'url': base.baseUrl + '/users/heatmap',
                'data': {
                    'tagIdList': postData.toString()
                }
            }).done((d) => {
                if (d.success) {
                    self.props.successLogin();
                } else {
                    self.setState({
                        step: 1
                    });
                }
            }).fail((d) => {
                self.setState({
                    step: 1
                });
            })
        }
    }

    //skip 跳过
    skip() {
        this.changeStep(7);
    }

    render() {
        // 放在render前，先重置选中状态，按钮文案渲染在列表渲染前
        this.state.selectedStyle = this.state.selectedContent = false;
        let btnText = '请选择风格和内容',
            styleHtml = this.state.style.map((item, i) => {
                let _classname;
                if (item.selected) {
                    this.state.selectedStyle = true;
                    _classname = `image-style-${i} selected`;
                } else {
                    _classname = `image-style-${i} `;
                }
                return <li className={_classname} onClick={this.selectStyle.bind(this, i)}>
                    <span>{item.name}</span><i/></li>
            }),
            contentHtml = this.state.content.map((item, i) => {
                let _classname;
                if (item.selected) {
                    this.state.selectedContent = true;
                    _classname = `image-content-${i} selected`;
                } else {
                    _classname = `image-content-${i} ${this.state.step === 2 ? 'invisible' : ''}`;
                }
                return <li className={_classname} onClick={this.selectContent.bind(this, i)}>
                    <span>{item.name}</span><i/></li>
            });
        if (this.state.selectedStyle && this.state.selectedContent) {
            btnText = '完成';
        } else if (this.state.selectedStyle) {
            btnText = '请选择内容';
        } else if (this.state.selectedContent) {
            btnText = '请选择风格';
        }
        return <div className="login-panel login-panel-5">
            <div className="fav-image-panel">
                <div className="fav-image-panel-header">
                    <div className="title">欢迎加入DeepFashion</div>
                    <div className="nickname one-line">{this.props.data.nickname}</div>
                    <div className={classNames('sub-text', {
                        'invisible': this.state.step === 2
                    })}>请选择喜欢的风格和内容<br/>我们会为您专门创建一个个性化主页
                    </div>
                    <div className="btn-opreate-panel">

                        <button className={classNames('btn-finish', {
                            'finish': this.state.selectedContent & this.state.selectedStyle,
                            'hidden': this.state.step === 2
                        })} onClick={this.postImageId.bind(this)}>{btnText}</button>
                        <button className={classNames({
                            'btn-pass': true,
                            'hidden': this.state.step === 2
                        })} onClick={this.skip.bind(this)}>跳过
                        </button>
                        <span className={classNames({'hidden': this.state.step === 1})}>正在为您创建个性化主页，请稍后</span>
                    </div>
                </div>
                <div className="select-image-panel">
                    <div className="select-image-item">
                        <div className="select-image-title">喜欢的风格</div>
                        <ul>{styleHtml}</ul>
                    </div>
                    <div className="select-image-item">
                        <div className="select-image-title">喜欢的内容</div>
                        <ul>{contentHtml}</ul>
                    </div>
                </div>
            </div>
        </div>;
    }
}

export default FavImage;