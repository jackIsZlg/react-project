import React, {Component} from 'react';
import {connect} from 'react-redux'
import classNames from 'classnames';
import {Select, message} from 'antd'
import '../style/component/EditUserInfo.less'
import request from '../base/request'
import {editUserInfo} from "../redux/action";

const Option = Select.Option;

const ProfessionReference = ["设计师", "设计师助理", "版师", "买手", "学生", "品牌主", "运营", "企划师", "其他"],
    ProfessionReference1 = ["男装", "女装", "童装", "运动", "定制", "配饰", "其他"],
    SourceReference = ["天猫店", "网红店", "淘品牌", "C店", "线上设计师品牌", "线下设计师品牌", "设计工作室", "普通档口", "线下品牌", "工厂", "其它"];

// 个人资料修改
class EditUserInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nickname: '',
            sex: 1,
            profession_1: '', // 职业_1
            profession_2: '', // 职业_2
            source: '',// 来源

        }
    }

    // 输入昵称
    handleInputName(e) {
        let val = e.target.value;
        this.setState({
            nickname: val
        });
    }

    // 输入ins昵称
    handleInputInsName(e) {
        let val = e.target.value;
        this.setState({
            insId: val
        });
    }

    // 修改性别
    handleEditSex(sex) {
        this.setState({
            sex: sex
        });
    }

    // 选择职业
    handleEditProfession1(value) {
        this.setState({
            profession_1: value,
        });

        if (value !== '设计师') {
            this.setState({
                profession_2: ''
            })
        }
    }

    handleEditProfession2(value) {
        this.setState({
            profession_2: value
        })
    }

    handleEditSource(value) {
        this.setState({
            source: value
        })
    }

    // next
    handleNext() {
        let self = this,
            {nickname, sex, profession_1, profession_2, source} = self.state;

        if (!nickname) {
            message.warning('请输入昵称');
            return;
        }

        if (nickname.length > 45) {
            message.warning('昵称应为1-45字符');
            return;
        }

        if (!profession_1) {
            message.warning('请选择职业');
            return;
        }

        if (profession_1 === '设计师' && !profession_2) {
            message.warning('请选择你的设计方向');
            return;
        }

        if (!source) {
            message.warning('请选择来源');
            return;
        }

        request.basic('user/edit-profile', {
            method: 'post',
            body: request.toFormData({nickname, sex, profession: [profession_1, profession_2].join('#'), source})
        }).then(() => {
            // 修改store内userInfo
            self.props.editUserInfo({
                name: nickname
            });
            self.props.success();
        })
    }

    render() {
        const {nickname, sex, profession_1} = this.state;

        return <div className="login-panel login-panel-4">
            <div className="login-header">
                <div className="title">补全用户信息</div>
            </div>
            <div className="login-input">
                <div>
                    <input ref="nickname" type="text"
                           value={nickname}
                           onChange={this.handleInputName.bind(this)}
                           placeholder="输入昵称"/>
                </div>
                <div className="input-sex">
                    选择性别：
                    <ul>
                        <li className={classNames({"selected": sex === 1})}
                            onClick={this.handleEditSex.bind(this, 1)}>
                            男
                        </li>
                        <li className={classNames({"selected": sex === 2})}
                            onClick={this.handleEditSex.bind(this, 2)}>
                            女
                        </li>
                    </ul>
                </div>
                <div className="input-profession"
                     ref='profession_1'>
                    <Select placeholder="选择你的职业" style={{width: '100%'}}
                            onChange={this.handleEditProfession1.bind(this)}>
                        {
                            ProfessionReference.map((item, index) => {
                                let key = `profession-${index}`;
                                return <Option key={key} value={item}>{item}</Option>
                            })
                        }
                    </Select>
                </div>
                <div className="input-profession"
                     ref='profession_2'>
                    {profession_1 === '设计师' && (
                        <Select placeholder="选择你的设计方向" style={{width: '100%'}}
                                onChange={this.handleEditProfession2.bind(this)}>
                            {
                                ProfessionReference1.map((item, index) => {
                                    let key = `profession-${index}`;
                                    return <Option key={key} value={item}>{item}</Option>
                                })
                            }
                        </Select>
                    )}
                </div>
                <div className="input-profession"
                     ref='source'>
                    <Select placeholder="选择你的来源" style={{width: '100%'}}
                            onChange={this.handleEditSource.bind(this)}>
                        {
                            SourceReference.map((item, index) => {
                                let key = `source-${index}`;
                                return <Option key={key} value={item}>{item}</Option>
                            })
                        }
                    </Select>

                </div>
            </div>
            <div className="login-footer">
                <button className="btn-login black"
                        onClick={this.handleNext.bind(this)}>完成
                </button>
            </div>
        </div>;
    }
}

const mapStateToProps = () => {
    return {}
};

const mapDispatchToProps = dispatch => {
    return {
        editUserInfo: info => {
            dispatch(editUserInfo(info))
        }
    }
};

EditUserInfo = connect(
    mapStateToProps,
    mapDispatchToProps
)(EditUserInfo);

export default EditUserInfo;