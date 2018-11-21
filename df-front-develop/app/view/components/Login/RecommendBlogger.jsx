/**
 * Created by gewangjie on 2017/8/9
 */

import base from '../../common/baseModule'
import {Icon} from '../../components/base/baseComponents'
import classNames from 'classnames';

// 推荐博主板块
class RecommendBlogger extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 1,
            typeReference: {
                1: '日韩',
                2: '欧美',
                3: '男装',
                4: '女装',
                5: '童装'
            },
            typeList: [{
                id: 1,
                bg: 'recommend-type-1.jpg',
                select: true
            }, {
                id: 2,
                bg: 'recommend-type-2.jpg',
                select: true
            }, {
                id: 4,
                bg: 'recommend-type-4.jpg',
                select: true
            }, {
                id: 3,
                bg: 'recommend-type-3.jpg',
                select: true
            }, {
                id: 5,
                bg: 'recommend-type-5.jpg',
                select: true
            }],
            isSelectType: true,
            isSelectBlogger: true,
            bloggerInfo: {},
            bloggerImg: [], // 预览图片数组
            bloggerImgType: 1, // 预览图片分类
            bloggerImgShow: false, // 预览图片显示flag
            bloggerImgShowPos: 'bottom', // 预览图片显示位置
            time: setTimeout(() => {
            }, 0)
        }
    }

    changeStep(step) {
        this.props.changeStep(step);
    }

    // 选中分类
    handleClickType(i) {
        let data = this.state.typeList;
        data[i].select = !data[i].select;
        this.setState({
            typeList: data
        });
        this.isSelectType();
    }

    // 判断是否选择分类
    isSelectType() {
        let isSelectType = this.state.typeList.some((item) => {
            return item.select === true;
        });
        this.setState({
            isSelectType: isSelectType,
        });
    }

    // 下一步
    handleClickNext() {
        // 未选择分类
        if (!this.state.isSelectType) {
            return;
        }

        let selectTypeList = [],
            selectNameList = [];
        this.state.typeList.forEach((item) => {
            if (item.select) {
                selectTypeList.push(item.id);
                selectNameList.push(this.state.typeReference[item.id]);
            }
        });

        base.eventCount.add(1008, {
            '选择数量': selectTypeList.length,
            '选择分类名称': selectNameList.toString()
        });

        this.getBloggerInfo(selectTypeList);
        console.log(selectTypeList);
    }

    // 根据分类获取博主信息
    getBloggerInfo(list) {
        let self = this,
            btn = this.refs['btn-next'],
            ani = base.animationBtn(btn);
        ani.loading();
        $.ajax({
            "type": 'GET',
            "url": `${base.baseUrl}/recommend/blogger-list?typeList=${list.toString()}`
        }).done((d) => {
            if (!d.success) {
                ani.cancel();
                return;
            }
            let data = {};
            d.result.forEach((item) => {
                if (!data.hasOwnProperty(item.type)) {
                    data[item.type] = [];
                }
                item.select = true;
                data[item.type].push(item);
            });

            self.setState({
                step: 2,
                bloggerInfo: data
            });
            ani.success();
        }).fail(() => {
            ani.cancel();
        });
    }

    // 选择博主
    handleSelectBlogger(type, index) {
        let data = this.state.bloggerInfo;
        data[type][index].select = !data[type][index].select;

        this.setState({
            bloggerInfo: data,
            isSelectBlogger: this.getSelectBlogger().len > 0
        });
    }

    getSelectBlogger() {
        let self = this,
            bloggerIdList = [],
            idList = [],
            data = self.state.bloggerInfo;
        for (let type in data) {
            data[type].forEach((blogger) => {
                if (blogger.select) {
                    idList.push(blogger.id);
                    bloggerIdList.push(blogger.bloggerId);
                }
            })
        }

        return {
            bloggerIdList,
            idList,
            len: idList.length
        };
    }

    // 选择完成提交数据
    handlePostData() {
        if (!this.state.isSelectBlogger) {
            return;
        }

        let self = this,
            btn = self.refs['btn-start'],
            ani = base.animationBtn(btn),
            {bloggerIdList, idList} = self.getSelectBlogger();


        ani.loading();
        $.ajax({
            "type": 'POST',
            "url": `${base.baseUrl}/follow/batch/add`,
            "data": {
                idList: idList.toString(),
                bloggerIdList: bloggerIdList.toString()
            }
        }).done((d) => {
            if (!d.success) {
                ani.cancel();
                return;
            }
            base.eventCount.add(1009, {
                '选择数量': bloggerIdList.length,
                '选择博主Id': bloggerIdList.toString()
            });
            ani.success(() => {
                self.changeStep(7);
                console.log('选择成功');
            });
        }).fail(() => {
            ani.cancel();
        });
    }

    // 鼠标hover，预览博主图片
    handleMouseEnter(type, index) {
        let el = this.refs[`row-blogger-${type}`],
            _bottom = document.body.clientHeight - el.getBoundingClientRect().bottom;

        console.log(_bottom);

        clearTimeout(this.state.time);
        let data = this.state.bloggerInfo,
            a = data[type] ? data[type][index].mediaUrlList : [];
        this.setState({
            bloggerImg: a,
            bloggerImgType: type,
            bloggerImgShow: true,
            bloggerImgShowPos: _bottom < 400 ? 'top' : 'bottom'
        });
    }

    handleMouseLeave() {
        let self = this;
        self.state.time = setTimeout(() => {
            self.setState({
                bloggerImgShow: false
            });
        }, 100);
    }

    // 渲染博主行
    _renderRow() {
        let a = [],
            typeList = [1, 2, 4, 3, 5]; // lily要求的渲染顺序

        for (let i = 0, len = typeList.length; i < len; i++) {
            let type = typeList[i],
                item = this.state.bloggerInfo[type],
                key = `row-blogger-${type}`;
            // 无数据进入下一次循环
            if (!item || item.length === 0) {
                continue;
            }
            a.push(<li key={key} className="row-blogger">
                <div className="type-name">{this.state.typeReference[type]}</div>
                <ul className="row-blogger-list" ref={key}>
                    {item.map((blogger, index) => {
                        let key = `col-blogger-${blogger.id}`,
                            bgStyle = {
                                'backgroundImage': `url(${blogger.headImg})`
                            };
                        return <li key={key}
                                   className={classNames('col', {'select': blogger.select})}
                                   onMouseEnter={this.handleMouseEnter.bind(this, type, index)}
                                   onMouseLeave={this.handleMouseLeave.bind(this)}
                                   onClick={this.handleSelectBlogger.bind(this, type, index)}>
                            <div className="avatar" style={bgStyle}>
                                <div className="select-flag">
                                    <Icon type="xuanze3"/>
                                </div>
                            </div>
                            <div className="blogger-name">{blogger.nickname}</div>
                        </li>
                    })}
                </ul>
                <ul className={classNames('blogger-img-list', {
                    'show': this.state.bloggerImgType === type && this.state.bloggerImgShow,
                    'bottom': this.state.bloggerImgShowPos === 'bottom',
                    'top': this.state.bloggerImgShowPos === 'top'
                })}>
                    {this.state.bloggerImg.map((img, index) => {
                        let key = `blogger-img=${type}-${index}`,
                            bgStyle = {'backgroundImage': `url(${base.ossImg(img, 253)})`};
                        return <li key={key} style={bgStyle}/>
                    })}
                </ul>
            </li>)
        }
        return a;
    }

    render() {
        return <div className="login-panel login-panel-9">
            <div className={classNames("recommend-list-panel step-1", {'show': this.state.step === 1})}>
                <div className="panel-header">选择分类，看喜欢的时尚</div>
                <ul>
                    {this.state.typeList.map((item, i) => {
                        let _key = `type_${item.id}`,
                            bgStyle = {
                                'backgroundImage': `url(https://zhiyi-web.oss-cn-hangzhou.aliyuncs.com/static-web/${item.bg})`
                            };
                        return <li key={_key}>
                            <div className={classNames('type-img', {'select': item.select})}
                                 style={bgStyle}
                                 onClick={this.handleClickType.bind(this, i)}>
                                <div className="select-flag">
                                    <Icon type="xuanze3"/>
                                </div>
                            </div>
                            <span>{this.state.typeReference[item.id]}</span>
                        </li>
                    })}
                </ul>
                <div className="panel-footer">
                    <button className={classNames('btn btn-round btn-animation', {
                        'btn-red': this.state.isSelectType,
                        'btn-disabled': !this.state.isSelectType
                    })}
                            ref="btn-next"
                            onClick={this.handleClickNext.bind(this)}>
                        下一步
                    </button>
                </div>
            </div>
            <div className={classNames("recommend-list-panel step-2", {'show': this.state.step === 2})}>
                <div className="panel-header">DeepFashion精心为您推荐的用户</div>
                <ul className="blogger-panel">
                    {this._renderRow()}
                </ul>
            </div>
            <div className={classNames("login-panel-footer", {'show': this.state.step === 2})}>
                <button className={classNames("btn btn-round btn-animation", {
                    'btn-disabled': !this.state.isSelectBlogger,
                    'btn-red': this.state.isSelectBlogger
                })}
                        ref="btn-start"
                        onClick={this.handlePostData.bind(this)}>
                    {this.state.isSelectBlogger ? '开启你的时尚之旅' : '请选择任意博主'}
                </button>
            </div>
        </div>
    }
}

export default RecommendBlogger