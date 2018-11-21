/**
 * Created by gewangjie on 2018/3/6
 */
import React, {Component} from 'react';
import {
    Row,
    Col,
    Form,
    Input,
    Button,
    Select,
    Table,
    DatePicker,
    Pagination,
    Spin,
    LocaleProvider
} from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment';
import '../../style/dataline/CommodityData.less';
import request from '../../base/request'
import link from '../../base/link'
import base from '../../base/baseMoudle'

const FormItem = Form.Item;
const Option = Select.Option;
const {RangePicker} = DatePicker;

class CommodityData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            requestInfo: {
                startDate: moment().subtract(31, 'days').format('YYYY-MM-DD'),//一周前的时间信息
                endDate: moment().subtract(1, 'days').format('YYYY-MM-DD'),//现在的时间信息
                title: '',// 商品名称
                shopLikeName: '',// 店铺名称
                categoryName: '',// 商品品类
                dayRange: 1,// 排序
                pageNo: 1,// 当前页
                pageSize: 15// 一页的数据个数
            },
            dataSource: [],//表格所需要的数据
            totalCount: 0,//显示总共有多少条数据
            totalLoading: false,
            shopNameList: [],// 所有店铺名
            newShopNameList: [],
            shopValue: [],//店铺数据
            productCategroryList: [],//店铺品类
            newProductCategroryList: [],
            categroryValue: [],
            fetching: false
        }
    }

    //请求数据生命周期
    componentDidMount() {
        document.title = "商品列表";
        this.getProductList();
        this.getShopnameList();
        this.getCategoryList()
    }

    // 获取所有品类名称
    getCategoryList(name = '') {
        let self = this, {productCategroryList, newProductCategroryList} = self.state;
        request.basic('item/all_category_name?name=' + name)
            .then(data => {
                !!name ? newProductCategroryList = data : productCategroryList = data;
                this.setState({
                    productCategroryList,
                    newProductCategroryList
                })
            }, data => {
                console.log(data.errorDesc)
            })
    }

    getCategoryFocus() {
        let {productCategroryList, newProductCategroryList} = this.state;
        newProductCategroryList = productCategroryList;
        this.setState({newProductCategroryList})
    }

    setCategoryValue(value) {
        let that = this;

        if (!value) {
            that.getCategoryFocus();
            return;
        }

        clearTimeout(that.time);
        that.time = setTimeout(() => {
            that.getCategoryList(value)
        }, 500)
    }

    // 获取所有店铺名称
    getShopnameList(name = '') {
        let self = this, {shopNameList, newShopNameList} = self.state;
        request.getshopNameAndTags(name)
            .then(data => {
                !!name ? newShopNameList = data : shopNameList = data;
                self.setState({
                    shopNameList, newShopNameList
                })
            }, (data) => {
                self.setState({
                    shopNameList: {}
                });
                console.log(data.errorDesc)
            })
    }

    // 店铺下拉搜索
    fetchUser(value) {
        let that = this;

        if (!value) {
            that.getFocus();
            return;
        }

        clearTimeout(that.timeOut);
        that.timeOut = setTimeout(() => {
            that.getShopnameList(value)
        }, 400)
    }

    // 获取焦点
    getFocus() {
        let {shopNameList, newShopNameList} = this.state;
        newShopNameList = shopNameList;
        this.setState({newShopNameList})
    }

    // 获取商品列表
    getProductList() {

        let self = this, {requestInfo, dataSource, totalCount, totalLoading} = self.state;
        totalLoading = true;
        self.setState({
            totalLoading
        }, () => {
            request.basic('item/item_list?' + base.objToSearch(requestInfo)).then(data => {
                dataSource = data.resultList;
                totalCount = data.resultCount;
                totalLoading = false;
                self.setState({dataSource, totalCount, totalLoading})
            }, (data) => {
                dataSource = [];
                totalCount = 0;
                totalLoading = false;
                self.setState({
                    dataSource,
                    totalCount,
                    totalLoading
                });
                console.log(data.errorDesc)
            })
        })
    }

    //时间控件点击ok后回调函数
    onOk(value) {
        let {requestInfo} = this.state;
        requestInfo.startDate = moment(value[0]).format('YYYY-MM-DD');
        requestInfo.endDate = moment(value[1]).format('YYYY-MM-DD');
        this.setState({
            requestInfo
        })
    }

    //点击分页回调
    onTablePageChange(page) {
        let self = this, {requestInfo} = self.state;
        document.querySelector('.ant-layout-has-sider .ant-layout').scrollTop = 0;
        requestInfo.pageNo = page;
        requestInfo.dayRange = 1;
        self.setState({
            requestInfo
        }, () => {
            self.getProductList()
        })
    }

    onSearch() {
        let {requestInfo} = this.state;
        requestInfo.pageNo = 1;
        requestInfo.dayRange = 1;
        this.setState({
            requestInfo
        }, () => {
            this.getProductList()
        })
    }

    //改变值
    searchChange(e) {
        let {requestInfo} = this.state;
        requestInfo.title = e.target.value;
        this.setState({requestInfo})
    }

    //不可选择预期
    disabledDate(current) {
        return (current.valueOf() < new Date("2017-04-14").getTime() || current.valueOf() > Date.now() - 60 * 60 * 24 * 1000)
    }

    //商品品类下拉选择
    chooseCategory(value) {
        let self = this,
            {requestInfo, categroryValue} = self.state, arrayList = '';

        categroryValue = value;

        value && value.forEach((item, index) => {
            arrayList += !index ? item.label : ',' + item.label
        });

        requestInfo.categoryName = arrayList;

        self.setState({requestInfo, categroryValue})
    }

    //店铺下拉点击选择
    chooseShopName(value) {

        let {requestInfo, shopValue} = this.state, arrayList = '';

        shopValue = value;

        value && value.forEach((item, index) => {
            arrayList += !index ? item.label : ',' + item.label
        });

        requestInfo.shopLikeName = arrayList;

        this.setState({shopValue, requestInfo})
    }

    //上新销量选择回调
    selectSaleChange(value) {
        let self = this,
            {requestInfo} = self.state;
        value = value * 1;
        if (requestInfo.dayRange === value) {
            return
        }
        requestInfo.dayRange = value;
        self.setState({
            requestInfo
        }, () => {
            self.getProductList()
        })
    }

    // dayRange转换
    getDayRange = () => {
        let {requestInfo} = this.state;
        switch (requestInfo.dayRange) {
            case 7:
                return 'firstWeekSale';
            case 30:
                return 'firstMonthSale';
            case 1:
            default:
                return 'firstDaySale';
        }
    };

    render() {
        let {requestInfo, dataSource, newShopNameList, newProductCategroryList, totalCount, totalLoading, shopValue, categroryValue} = this.state,
            {startDate, endDate, pageNo, pageSize, dayRange} = requestInfo,
            formItemLayout = {
                labelCol: {span: 6},
                // wrapperCol: {span: 18},
            },
            saleNumber =
                <div id='select-control'>
                    <Select onChange={this.selectSaleChange.bind(this)}
                            value={dayRange + ''}>
                        <Option key='1'>上新首日销量</Option>
                        <Option key='7'>上新一周销量</Option>
                        <Option key='30'>上新一个月销量</Option>
                    </Select>
                </div>,
            pageIndex = (pageNo - 1) * pageSize,
            sale = this.getDayRange();

        const columns = [
                {
                    title: '排名',
                    dataIndex: 'index',
                    key: 'index',
                    width: '4%',
                    render: (text, record, index) => <div>{index + pageIndex + 1}</div>,
                },
                {
                    title: '图片',
                    dataIndex: 'picUrl',
                    key: 'picUrl',
                    width: '9%',
                    render: (text, record, index) => <div style={{width: 120, height: 120, overflow: 'hidden'}}>
                        <img alt="图片" src={text + '_120x120.jpg'}
                             style={{width: '100%', height: '100%', objectFit: 'cover'}}/>
                    </div>,
                },
                {
                    title: '名称',
                    dataIndex: 'title',
                    key: 'title',
                    width: '9%',
                    render: (text, record, index) => <div>
                        <a style={{display: 'block'}} href={request.taobaoUrlHost + record.itemId}
                           target='view_window'>{text}</a>
                        {!!record.snapshot && <a
                            style={{display: 'block', marginTop: 5}} href={record.snapshot} target='view_window'>[页面快照]</a>}
                    </div>
                },
                {
                    title: '店铺',
                    dataIndex: 'shopName',
                    key: 'shopName',
                    width: '9%'
                },
                {
                    title: '品类',
                    dataIndex: 'categoryName',
                    key: 'categoryName',
                    width: '9%'
                },
                {
                    title: '上新时间',
                    dataIndex: 'saleTime',
                    key: 'saleTime',
                    width: '9%',
                    render: (text, record, index) => <span style={{
                        width: '85px',
                        wordBreak: 'break-all',
                        wordWrap: 'break-word',
                        display: 'inline-block'
                    }}>{text}</span>
                },
                {
                    title: '价格',
                    dataIndex: 'curCprice',
                    key: 'curCprice',
                    width: '12%',
                    render: text => {
                        text = (text * 1 / 100).toFixed(2);
                        if (Object.prototype.toString.call(text) === '[object Object]') {
                            return <div>
                                <div>当前:{text.curPrice}</div>
                                <div>上新:{text.shelfPrice}</div>
                                <div>最高:{text.max}</div>
                                <div>最低:{text.min}</div>
                            </div>
                        } else if (text === '暂无数据') {
                            return <div>{text}</div>
                        } else {
                            return <div>{text}</div>
                        }
                    }

                },
                {
                    title: saleNumber,
                    dataIndex: sale,
                    key: sale,
                    width: '9%',
                },
                {
                    title: '操作',
                    key: 'action',
                    width: '9%',
                    render: (text, record, index) => <a
                        onClick={link.toGoodDetail.bind(null, record.itemId)}>宝贝详情</a>
                },
            ],
            shopName = newShopNameList && newShopNameList.map((item) => <Option key={item}>{item}</Option>),
            category = newProductCategroryList && newProductCategroryList.map(item => <Option
                key={item}>{item}</Option>);

        return (
            <div className='content commodity-data-panel'>
                <div style={{color: '#333333', fontSize: '18px'}}>商品列表</div>
                <Row style={{marginTop: 10, borderBottom: '1px solid #e8e8e8', paddingBottom: 10}}>
                    <Col span={12}>
                        <Row>
                            <FormItem
                                label='商品搜索'
                                {...formItemLayout}
                            >
                                <Input placeholder='请输入商品名称'
                                       style={{width: 300}}
                                       onChange={this.searchChange.bind(this)}
                                />
                            </FormItem>
                        </Row>
                    </Col>
                </Row>
                <Row style={{margin: '10px 0'}}>
                    <Col span={12}>
                        <Row>
                            <FormItem
                                label='上新时间'
                                {...formItemLayout}>
                                <LocaleProvider locale={zh_CN}>
                                    <RangePicker showTime
                                                 format='YYYY-MM-DD'
                                                 placeholder={['开始时间', '结束时间']}
                                                 onOk={this.onOk.bind(this)}
                                                 style={{width: '300px'}}
                                                 disabledDate={this.disabledDate.bind(this)}
                                                 allowClear={false}
                                                 defaultValue={[moment(startDate), moment(endDate)]}/>
                                </LocaleProvider>
                            </FormItem>
                        </Row>
                    </Col>
                    <Col span={12}>
                        <Row>
                            <FormItem
                                label='商品品类'
                                {...formItemLayout}>
                                <Select mode='multiple'
                                        style={{width: '300px'}}
                                        labelInValue
                                        placeholder='请点击下拉选择品类'
                                        onSearch={this.setCategoryValue.bind(this)}
                                        onChange={this.chooseCategory.bind(this)}
                                        onFocus={this.getCategoryFocus.bind(this)}
                                        value={categroryValue}>
                                    {category}
                                </Select>
                            </FormItem>
                        </Row>
                    </Col>
                </Row>
                <Row style={{margin: '10px 0'}}>
                    <Col span={12}>
                        <Row>
                            <FormItem
                                label='店&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;铺:'
                                {...formItemLayout}>
                                <Select mode="multiple"
                                        labelInValue
                                        value={shopValue}
                                        style={{width: 300}}
                                        placeholder="请点击下拉选择店铺"
                                        onSearch={this.fetchUser.bind(this)}
                                        onChange={this.chooseShopName.bind(this)}
                                        onFocus={this.getFocus.bind(this)}
                                >
                                    {shopName}
                                </Select>
                            </FormItem>
                        </Row>
                    </Col>
                    <Col span={12}>
                        <Row>
                            <Col span={6}/>
                            <Col span={18} style={{textAlign: 'right', width: 300}}>
                                <Button type='primary' onClick={this.onSearch.bind(this)}>搜索</Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Spin tip='数据加载中...' spinning={totalLoading}>
                    <Row>
                        <Table pagination={false}
                               columns={columns}
                               dataSource={dataSource}
                               rowKey={record => record.itemId}
                               bordered
                               scroll={{x: true}}
                               id='store-table'
                               locale={{emptyText: '暂无上新商品'}}/>
                    </Row>
                    {
                        !!totalCount &&
                        <Row style={{marginTop: 10}}>
                            <Col span={5}>
                                （总共{totalCount}条数据）
                            </Col>
                            <Col span={19} style={{textAlign: 'right'}}>
                                <LocaleProvider locale={zh_CN}>
                                    <Pagination
                                        defaultPageSize={pageSize}
                                        total={totalCount}
                                        showQuickJumper={true}
                                        onChange={this.onTablePageChange.bind(this)}
                                        current={pageNo}
                                        defaultExpandAllRows={true}
                                    />
                                </LocaleProvider>
                            </Col>
                        </Row>
                    }
                </Spin>
            </div>
        );
    }
}

export default CommodityData