/**
 * Created by gewangjie on 2017/12/20
 */
import base from '../../../common/baseModule'
import classNames from 'classnames'
import LoadImage from '../../../components/base/LoadImage'
import {Icon} from '../../../components/base/baseComponents';
import WaterFall from '../../../components/WaterFall/WaterFall'
import SelectPop from '../../../components/SelectPop/SelectPop'

const searchUrl = [
    '/post/recom/similarity?',
    '/post/recom/image?type=1&',
    '/post/recom/image?type=2&',
    '/post/recom/image?type=3&'
];
const recomTitle = [
    '单图推荐',
    '以图搜图(传统特征)',
    '以图搜图(深度特征-无Tag)',
    '以图搜图(深度特征-有Tag)'
];
// '相关图片推荐(ins)'

// 单图推荐
class ImageRecom extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            mediaUrl: '',
            headImg: '',
            nickname: '',
            bloggerId: '',
            averageHue: '',
            width: 0,
            height: 0,
            postTime: '',
            bloggerTags: [],
            featuresTags: [],
            textContent: '',
            getDataFinish: false,
            recomType: 0
        }
    }

    componentWillMount() {
        this.getImgDetail();
    }

    // 获取图片详情数据
    getImgDetail() {
        let self = this;
        base.ajaxList.basic({
            'type': "GET",
            "url": `${base.baseUrl}/v1/blog/${self.props.id}`,
        }, (d) => {
            const {post, bloggerTags, featureTags} = d.result;
            const {blogger, mediaUrl, averageHue, width, height, postTime, textContent} = post;
            const {nickname, headImg, id: bloggerId} = blogger;
            self.setState({
                mediaUrl,
                headImg,
                nickname,
                bloggerId,
                averageHue,
                width,
                height,
                postTime,
                textContent,
                bloggerTags: bloggerTags || [],
                featureTags: featureTags || [],
                getDataFinish: true
            })
        });
    }

    // 切换推荐类型
    changeRecom(recomType) {
        this.setState({
            recomType
        })
    }

    // 精选
    handleSelectPop() {
        const {id, mediaUrl, nickname} = this.state;
        ReactDOM.render(<SelectPop blogId={id}
                                   wfType="customSearch"
                                   mediaUrl={mediaUrl}
                                   nickname={nickname}
                                   outIndex={0}
                                   handleAddFolder={() => {
                                   }}
                                   hidden={false}/>, document.getElementById('select-pop-wrapper'));
    }

    render() {
        const {
            mediaUrl,
            headImg,
            nickname,
            id,
            bloggerId,
            averageHue,
            width,
            height,
            postTime,
            textContent,
            bloggerTags,
            featureTags,
            getDataFinish,
            recomType
        } = this.state;

        if (!getDataFinish) {
            return <div>loading</div>
        }

        let _scale = height / width,
            _w = 560,
            _h = 560 * _scale,
            dataUrl = `${searchUrl[recomType]}postId=${id}`;

        return (
            <div className="image-recom-pane">
                <div className="image-content">
                    <div className="image">
                        <LoadImage bgColor={averageHue}
                                   src={mediaUrl}
                                   aliWidth={560}
                                   width={_w}
                                   height={_h}/>
                        <button className="add-folder btn-red btn-round btn-effect"
                                onClick={this.handleSelectPop.bind(this)}>
                            <Icon type="follow-blog"/>精选
                        </button>
                    </div>
                    <a className="blogger" href={`/owner/${bloggerId}`} target={nickname}>
                        <div className="avatar">
                            <img src={base.ossImg(headImg, 36)} alt={nickname}/>
                        </div>
                        <div className="name one-line">
                            {nickname}
                        </div>
                    </a>
                    <ul className="info">
                        <li>
                            <span className="title">postTime:</span>{postTime}
                        </li>
                        <li>
                            <span className="title">博主标签:</span>
                            {
                                bloggerTags.map((tag, i) => <span className="tag" key={i}>{tag}</span>)
                            }
                        </li>
                        <li>
                            <span className="title">识别标签:</span>
                            {
                                featureTags.map((tag, i) => <span className="tag" key={i}>{tag}</span>)
                            }
                        </li>
                        <li>
                            <span className="title">textContent</span>{textContent}
                        </li>
                    </ul>
                </div>
                <div className="recom-pane">
                    <ul className="recom-tab">
                        {
                            recomTitle.map((title, index) => {
                                let key = `title-${index}`;
                                return <li key={key}
                                           className={classNames({'current': index === recomType})}
                                           onClick={this.changeRecom.bind(this, index)}>{title}</li>
                            })
                        }
                    </ul>
                    <WaterFall key="waterWall"
                               wfType="customSearch"
                               noResultTip="无推荐数据"
                               dataUrl={dataUrl}/>
                </div>
            </div>
        )
    }
}

ReactDOM.render(<ImageRecom id={postId}/>, document.getElementById('df-search-recom-wrapper'));