/**
 * Created by gewangjie on 2017/12/22
 */
import base from '../../../common/baseModule'
import classNames from 'classnames'
import WaterFall from '../../../components/WaterFall/WaterFall'

const {Layout, Row, Col, Icon, Button, Input, Upload, message} = antd;
const {Content} = Layout;
//  获取上传凭证
const getToken = () => {
    return base.ajaxList.basicFetch(`${base.baseUrl}/oss-sign?dir=customSearch`, {
        credentials: 'include'
    })
};

// 上传图片
const uploadFile = (file, param) => {
    return new Promise((resolve, reject) => {
        let upload_url = `${param.host}`,
            request = new FormData();

        request.append('OSSAccessKeyId', param.accessid);
        request.append('policy', param.policy);
        request.append('Signature', param.signature);
        request.append('key', param.key);
        // request.append('expire', parseInt(param.expire));
        // request.append('success_action_redirect', 'http://oss.aliyun.com');
        request.append('success_action_status', 200);
        request.append('file', file);
        request.append('submit', 'Upload');

        let xhr = new XMLHttpRequest();
        xhr.open('POST', upload_url, true);
        xhr.send(request);

        // 进度
        xhr.upload.onprogress = function (event) {
            if (event.lengthComputable) {
                console.log((event.loaded / event.total) * 100);
            }
        };

        // 成功or失败会回调
        xhr.onreadystatechange = function () {
            // console.log(xhr);
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    resolve(param.host + '/' + param.key);
                } else if (xhr.status > 200) {
                    reject && reject(xhr.response)
                }
            }
        };
    });
};

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imgUrl: ''
        }
    }

    handleSearch() {
        this.setState({
            imgUrl: this.input.refs.input.value
        });
    }

    uploadImg(file) {
        let self = this;
        // 获取token -> 上传文件 -> 修改data
        getToken().then((param) => {
            return uploadFile(file, param)
        }).then((res) => {
            console.log(res);
            message.success('上传成功！');
            self.setState({
                imgUrl: res
            });
            self.input.refs.input.value = res
        }, (err) => {
            console.log(err);
        }).catch((err) => {
            console.log('异常：' + err)
        });
        return false
    }

    getDataSuccess(state) {
        message.info(`查询时间：${state.searchTime}ms`)
    }

    render() {
        const {imgUrl} = this.state;
        const url = `/search/custom/postbyimage?imgUrl=${imgUrl}`;
        return (
            <Layout>
                <Content>
                    <div className="container">
                        <Row>
                            <Col span={4}>
                                <Upload name="content"
                                        action=""
                                        accept='jpeg,jpg,png'
                                        beforeUpload={this.uploadImg.bind(this)}
                                        listType="text">
                                    <Button type="primary">
                                        <Icon type="upload"/> 本地上传
                                    </Button>
                                </Upload>
                            </Col>
                            <Col span={8}>
                                <Input ref={(el) => this.input = el}
                                       placeholder="复制图片网址到这里"
                                       onPressEnter={this.handleSearch.bind(this)}
                                       style={{'maxWidth': '200px'}}/>
                                <Button type="primary"
                                        style={{'marginLeft': '10px'}}
                                        icon="search"
                                        onClick={this.handleSearch.bind(this)}>
                                    搜索
                                </Button>
                                <Button type="primary"
                                        onClick={() => {
                                            location.href = '/search/custom'
                                        }}
                                        style={{'marginLeft': '10px'}}>
                                    筛选
                                </Button>
                            </Col>
                            <Col span={8}>
                                备注：建议图片尺寸大小小于1M
                            </Col>
                        </Row>
                    </div>

                    {
                        imgUrl && <div className="container">
                            <div>原始图片：</div>
                            <img src={`${imgUrl}`} height={140}/>
                            <div>外观相似图片</div>
                            <div id="water-fall-panel">
                                <WaterFall key="waterWall"
                                           wfType="customSearch"
                                           noResultTip="查询无数据"
                                           getDataSuccess={this.getDataSuccess.bind(this)}
                                           dataUrl={url}/>
                            </div>
                        </div>
                    }

                </Content>
            </Layout>
        )
    }
}

ReactDOM.render(<App/>, document.getElementById('df-search-image-wrapper'));