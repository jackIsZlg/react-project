import base from '../../../common/baseModule';
import classNames from 'classnames';

base.headerChange('white');

let params = [],
    url = window.location.href,
    num = url.indexOf('?'),
    paramArr = url.substr(num + 1).split('&'),
    paramObj = {},
    itemArr = [];

class NoticeInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            avatar: props.avatar || base.mediaUrl,
            name: props.name || '',
            city: props.city || '',
            profession: props.profession || '',
            uId: props.id,
            followFlag: false
        }
    }

    // 点击关注和取消关注
    // handleFollow(id) {
    //     let self = this,
    //         {avatar, name, followFlag} = this.state;
    //
    //     if(!followFlag){
    //         base.ajaxList.followOwner(id, (data) => {
    //             if (data.success) {
    //                 self.setState({
    //                     followFlag: true
    //                 });
    //                 df_alert({
    //                     tipImg: base.ossImg(avatar, 120),
    //                     mainText: '成功订阅博主',
    //                     subText: name
    //                 });
    //             }
    //         });
    //     }else {
    //         base.ajaxList.unFollowOwner(id, (d) => {
    //             d.success && self.setState({
    //                 followFlag: false
    //             });
    //         });
    //     }
    // }

    render() {

        let {avatar, name, city, profession, uId} = this.state,
            style = {
                'backgroundImage': `url(${base.ossImg(avatar, 106)})`
            };

        return (
            <div className='notice-item-user'>
                <a className="notice-item-user-info" href={'/users/folder/detail/' + uId}>
                    <div className="avatar" style={style}/>
                    <div className="name">
                        {name}
                    </div>
                    <div className="city-profession">
                        <span className={classNames({
                            'no-attr': !!city && !!profession
                        })} title={city}>{city}</span>
                        {(!!city && !!profession) && <em>|</em>}
                        <span className={classNames({
                            'no-attr': !!city && !!profession
                        })} title={profession}>{profession}</span>
                    </div>
                </a>
            </div>
        )
    }
}

class NoticeItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            folderId: props.folderId,
            userInfo: props.userList || [],
            imgList: []
        }
    }

    componentWillReceiveProps(nextProps) {

        let that = this;
        that.setState({
            folderId: nextProps.folderId,
            userInfo: this.dealData(nextProps.userList)
        }, () => {
            that.getFolderImg();
        })
    }

    // 处理数据
    dealData(data) {

        let arr = [];

        for (let i = 0; i < data.length; i++) {
            if (!data[i]) {
                continue;
            }
            let obj = {};
            obj.avatar = data[i].avatar || 'https://zhiyi-web.oss-cn-hangzhou.aliyuncs.com/deepfashion/default-avatar.png';
            obj.city = data[i].city || '';
            obj.id = data[i].id || 0;
            obj.name = data[i].name || '';
            obj.profession = data[i].profession || '';
            arr.push(obj);
        }

        return arr;
    }

    // 获取精选集图片
    getFolderImg() {
        let {folderId} = this.state,
            self = this;

        base.ajaxList.getFolderImg(folderId, (d) => {
            self.setState({
                imgList: d.result
            })
        });
    }

    // 返回前三张图片
    renderFolderImg() {
        let imgList = [];
        for (let i = 0; i < 3; i++) {
            let img = this.state.imgList[i] || '',
                _class = `cover-${i}`,
                bgStyle = img ? {
                    'backgroundImage': `url(${base.ossImg(img.mediaUrl)})`
                } : {};
            imgList.push(<div className={_class} style={bgStyle}/>)
        }
        return <div className="file-cover">{imgList}</div>
    }

    render() {
        const {folderName} = this.props;

        let {userInfo} = this.state,
            userList = userInfo.map(v => <NoticeInfo {...v}/>);

        return (
            <div className='notice-item'>
                <div className="container">
                    <div className="notice-item-up">
                        {this.renderFolderImg()}
                        {
                            userInfo.length === 1 &&
                            <div className="notice-item-basic-info">
                                精选集
                                <span>《{folderName}》</span>
                                被
                                <i>{userInfo[0].name}</i>
                                收藏了
                            </div>
                        }
                        {
                            userInfo.length > 1 &&
                            <div className="notice-item-basic-info">
                                精选集
                                <span>《{folderName}》</span>
                                被收藏了
                                <em>{userInfo.length}</em>
                                次
                            </div>
                        }
                    </div>
                    <div className="notice-item-down">
                        <div className='notice-item-collector-info'>
                            {userList}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

class NoticeList extends React.Component {
    constructor() {
        super();
        this.state = {
            noticeInfo: {}
        }
    }

    componentWillMount() {
        params = this.getParamsValue();
        !!params.folderId && !!params.userIdList &&
        this.getCollectedInfo();
    }

    getParamsValue() {

        for (let i = 0; i < paramArr.length; i++) {
            itemArr = paramArr[i].split('=');
            paramObj[itemArr[0]] = itemArr[1];
        }

        return paramObj;
    }

    getCollectedInfo() {
        let self = this;

        base.ajaxList.basic({
            url: base.baseUrl + '/folder/collect/fans-list',
            type: 'GET',
            data: {
                userIdList: params.userIdList,
                folderId: params.folderId
            }
        }, (data) => {

            if (!data.result.userList.length) {
                return;
            }

            self.setState({
                noticeInfo: data.result
            })
        })
    }

    render() {

        let {noticeInfo} = this.state;

        return (
            <div className='notice-list'>
                <div className="notice-list-title">
                    <div className="container">
                        精选集被收藏
                    </div>
                </div>
                <div className="notice-list-content">
                    <NoticeItem {...noticeInfo}/>
                </div>
            </div>
        )
    }
}

ReactDOM.render(<NoticeList/>, document.querySelector('.notice-content'));