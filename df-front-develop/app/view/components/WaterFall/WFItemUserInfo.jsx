/**
 * Created by gewangjie on 2017/7/28
 */

import base from '../../common/baseModule'
import {BtnSearchBlog, BtnExportIns} from '../../components/WaterFall/WaterFallBase'

// 订阅--个人信息
class WFItemUserInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            followCount: 0,
            name: '',
            avatar: '',
            favoriteCount: 0
        }
    }

    componentWillMount() {
        this.getUserInfo();
    }

    getUserInfo() {
        let self = this;
        base.ajaxList.getUserInfo((d) => {
            let {followCount, name, avatar, favoriteCount} = d.result;
            self.setState({followCount, name, avatar, favoriteCount})
        });
    }

    toUserCenter() {
        location.href = `${base.baseUrl}/users/favorite-view`;
    }

    render() {
        let data = this.props.data,
            _wfItemStyle = base.setDivStyle(data),
            avatarStyle = {
                'backgroundImage': `url(${this.state.avatar})`
            };
        return <div className="water-fall-item user-info"
                    style={_wfItemStyle}>
            <div className="user-info-h">
                <div className="avatar"
                     style={avatarStyle}
                     onClick={this.toUserCenter.bind(this)}/>
                <div className="user-info-r">
                    <div className="name one-line"
                         onClick={this.toUserCenter.bind(this)}>{this.state.name}</div>
                    <ul>
                        <li>
                            <a href="/users/follow-view">
                                <span>{this.state.followCount}</span>订阅
                            </a>
                        </li>
                        <li>
                            <a href="/users/favorite-view">
                                <span>{this.state.favoriteCount}</span>精选
                            </a>
                        </li>
                    </ul>
                    <a className="btn btn-round btn-default btn-edit-info"
                       href="/users/profile-view">编辑</a>
                </div>
            </div>
            <div className="btn-group">
                <BtnSearchBlog source="动态"/>
                <BtnExportIns source="动态"/>
            </div>
        </div>
    }
}

export {WFItemUserInfo}