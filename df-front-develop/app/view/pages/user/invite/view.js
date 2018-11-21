import base from '../../../common/baseModule'
import InviteHeader from '../../../components/InviteHeader/InviteHeader'
import Pagination from '../../../components/Pagination/Pagination'
import {Loading} from '../../../components/WaterFall/WaterFallBase'


base.headerChange('white');

let invitationHeaderEl = document.querySelector('.invite-header-wrapper'),
    invitationInfoEl = document.querySelector('.invite-display-wrapper');

class App extends React.Component {
    constructor() {
        super();
        this.state = {
            inviteInfoList: [],
            totalPage: 0,
            currentPage: 0,
            start: 0,
            pageSize: 10,
            status: 0,
            shareInfo: {
                avatar: '',
                name: '',
                code: '',
                hiddenLink: true
            },
            shareData: {
                id: '',
                url: '',
                image: '',
                title: '分享 DEEPFASHION',
                description: 'DeepFashion-每天都想刷的时尚'
            }
        }
    }

    componentWillMount() {
        this.createErweiCode();
        this.getInvitationInfo();
    }

    createErweiCode() {
        let self = this;
        base.ajaxList.basic({
            type: 'GET',
            url: `${base.baseUrl}/users/invite/generate-code`,
        }, (d) => {
            let {shareData, shareInfo} = self.state,
                {id, avatar, name, code, inviteUrl} = d.result;

            shareData.id = id;
            shareData.url = base.baseUrl + inviteUrl;
            shareData.image = avatar;
            shareInfo.avatar = avatar;
            shareInfo.name = name;
            shareInfo.code = code;
            self.setState({
                shareData,
                shareInfo
            });
            ReactDOM.render(<InviteHeader
                shareData={shareData}
                shareInfo={shareInfo}
            />, invitationHeaderEl)
        });
    }

    getInvitationInfo() {
        let self = this,
            {pageSize, start} = self.state;

        base.ajaxList.basic({
            type: 'GET',
            url: `${base.baseUrl}/users/inviteList?start=${start}&pageSize=${pageSize}`
        }, (d) => {
            let {resultList, resultCount} = d.result;
            self.setState({
                inviteInfoList: resultList,
                totalPage: Math.ceil(resultCount / pageSize),
                status: !!resultCount ? 2 : 1
            });
        });

    }

    followBlogger() {

    }

    setPageNo(pageNo) {
        let self = this,
            {start, pageSize, status, currentPage} = self.state;

        start = pageNo * pageSize;
        status = 0;
        currentPage = pageNo;

        self.setState({
            start,
            status,
            currentPage
        }, () => {
            self.getInvitationInfo()
        })
    }

    renderInviteInfo() {
        let {status, inviteInfoList, currentPage, totalPage} = this.state;
        switch (status + '') {
            case '1':
                return <div className='no-invite'>
                    您现在还没有邀请好友哦<br/>成功邀请1位好友注册deepfashion<br/> 即可免费查看<span>订货会</span>哦！
                </div>;
            case '2':
                return <div>
                    {inviteInfoList && inviteInfoList.map((item, index) => {
                        let key = `invite-${index}`;
                        return <InviteItemCol data={item}
                                              key={key}
                                              followBlogger={this.followBlogger.bind(this, index)}/>
                    })}
                    <Pagination pageNo={currentPage}
                                totalPage={totalPage}
                                reset={this.setPageNo.bind(this)}
                    />
                </div>;
            case '0':
            default:
                return <Loading/>
        }

    }

    render() {
        return (
            <div className='invite-content'>
                <div className="invite-title">
                    我的邀请
                </div>
                <div className="invite-users-content">
                    {this.renderInviteInfo()}
                </div>
            </div>
        )
    }
}

class InviteItemCol extends React.Component {
    render() {
        let {data} = this.props,
            avatarStyle = {
                backgroundImage: `url(${base.ossImg(data.avatar, 60)})`
            };
        return (
            <div className='invite-item'>
                <div className='avatar'
                     style={avatarStyle}
                />
                <div className="invite-user">
                    <div className="invite-nickname">
                        {data.name}
                    </div>
                    <div className="invite-time">
                        {data.inviteAt}
                    </div>
                    <div className="invite-success">
                        已成功邀请
                    </div>
                </div>
            </div>
        )
    }
}

ReactDOM.render(<App/>, invitationInfoEl);
