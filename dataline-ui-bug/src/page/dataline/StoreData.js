/**
 * Created by gewangjie on 2018/3/6
 */
import React, { Component } from 'react';
import {
    Row,
    Form,
    Input,
    Table,
    DatePicker,
    message,
    LocaleProvider
} from 'antd'
import zh_CN from 'antd/lib/locale-provider/zh_CN'
import moment from 'moment'
import link from '../../base/link'
import request from '../../base/request'
import base from '../../base/baseMoudle'
import '../../style/dataline/DateExpress.less'

const FormItem = Form.Item,
    Search = Input.Search,
    { RangePicker } = DatePicker;

class StoreData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            startDate: moment().subtract(31, 'days').format('YYYY-MM-DD'),//一周前的时间信息
            endDate: moment().subtract(1, 'days').format('YYYY-MM-DD'),//现在的时间信息
            dataSource: [],//表格数据源存放的地方
            searchValue: '',//搜索的名字
            pageNo: 1,//当前在第几页
            pageSize: 15,
            totalCount: 0,//数据总数，后台返回数据有多少条
            loading: true
        }
    }

    componentDidMount() {
        document.title = "店铺列表";
        document.getElementById('title').innerText = '店铺列表'
        this.getShopList();
    }

    // 处理店铺列表返回数据，并收集店铺id列表
    dealDataSource(data) {
        let shopIdList = '',
            shopInfo = data && data.map((item, index) => {
                if (!index) {
                    shopIdList += item.dailyShopInfo.shopId
                } else {
                    shopIdList += ',' + item.dailyShopInfo.shopId;
                }
                item.dailyShopInfo.newProductsSaleAmount = (item.dailyShopInfo.newProductsSaleAmount * 1 / 100).toFixed(2);
                item.dailyShopInfo.shopName = item.shopInfo.shopName;
                item.dailyShopInfo.shopUrl = item.shopInfo.shopUrl;
                item.dailyShopInfo.followFlag = item.followFlag;
                return item.dailyShopInfo
            });
        return {
            dataSource: shopInfo,
            shopIdList
        }
    }

    // 获取店铺信息
    getShopList() {
        let self = this, { startDate, endDate, pageNo, pageSize, searchValue } = self.state;

        self.setState({
            loading: true
        }, () => {
            let requestdata = {
                startDate,
                endDate,
                shopName: searchValue,
                pageNo,
                pageSize
            };
            request.getShopList(base.objToSearch(requestdata))
                .then(data => {
                    let { shopIdList, dataSource } = self.dealDataSource(data.resultList),
                        totalCount = data.resultCount;

                    if (!shopIdList) {
                        self.setState({
                            dataSource,
                            totalCount,
                            loading: false
                        });
                        return
                    }

                    request.basic('daily/shop-top-new-sale?startDate=' + startDate + '&endDate=' + endDate + '&shopIdList=' + shopIdList)
                        .then(d => {
                            for (let i = 0; i < dataSource.length; i++) {
                                dataSource[i].hotProduct = d[dataSource[i].shopId]
                            }
                            self.setState({
                                dataSource,
                                totalCount,
                                loading: false
                            })
                        }, d => {
                            console.log(d.errorDesc)
                        });
                }, (data) => {
                    this.setState({
                        dataSource: [],
                        totalCount: 0,
                        loading: false
                    });
                    console.log(data.errorDesc)
                })
        })
    }

    // 监控店铺
    addShopFollow(index) {
        let self = this,
            { dataSource } = self.state,
            item = dataSource[index],
            { shopName } = item;
        request.addShopFollow(shopName, '', {
            method: 'POST'
        }).then(() => {
            message.success(shopName + '监控成功');
            item.followFlag = 1;
            self.setState({ dataSource })
        }, (d) => {
            message.warning('监控失败');
            console.log(d.errorDesc);
        })
    }

    //分页所调用函数
    onTablePageChange(page) {
        let self = this;
        document.querySelector('.ant-layout-has-sider .ant-layout').scrollTop = 0;
        self.setState({
            pageNo: page
        }, () => {
            self.getShopList()
        })
    }

    onOk(value) {
        let self = this;

        self.setState({
            startDate: moment(value[0]).format('YYYY-MM-DD'),
            endDate: moment(value[1]).format('YYYY-MM-DD'),
            pageNo: 1
        }, () => {
            self.getShopList();
        })
    }

    setInputValue(flag) {
        if (!flag) {
            return
        }
        this.setState({
            searchValue: document.querySelector('#input-search').value
        })
    }

    //搜索框回调函数
    searchText(value) {
        let self = this;
        self.setState({
            searchValue: value,
            pageNo: 1
        }, () => {
            self.getShopList();
        })

    }

    //估计不可选择预期
    disabledDate(current) {
        return (current.valueOf() < new Date("2017-04-14").getTime() || current.valueOf() > Date.now() - 60 * 60 * 24 * 1000)
    }

    render() {
        const eventContent = {}
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 },
        },
            { dataSource, loading, pageNo, pageSize, totalCount, startDate, endDate } = this.state,
            columns = [
                {
                    title: '店铺',
                    dataIndex: 'shopName',
                    key: 'shopName',
                    width: '5%',
                    render: (text, record, index) => {
                        return (
                            <a href={`/dataline/shopDetail?shopId=${record.shopId}`} target='view_window'>{text}</a>
                        )
                    }
                },
                {
                    title: '最近一次上新',
                    children: [{
                        title: '上新时间',
                        dataIndex: 'onSaleDate',
                        key: 'onSaleDate',
                        width: '5%'
                    },
                    {
                        title: '上新款数',
                        dataIndex: 'newProductsItemCount',
                        key: 'newProductsItemCount',
                        width: '4%',
                    },
                    {
                        title: '上新首日销量',
                        dataIndex: 'newProductsSale',
                        key: 'newProductsSale',
                        width: '6%'
                    },
                    {
                        title: '上新首日估算销售额',
                        dataIndex: 'newProductsSaleAmount',
                        key: 'newProductsSaleAmount',
                        width: '7%',
                        render: (text, record) => (text * 1 / 100).toFixed(2)
                    },
      
                    {
                        title: '热销款',
                        dataIndex: 'hotProduct',
                        key: 'hotProduct',
                        width: '12%',
                        render: (text, record) => {
                            return (<ul style={{ overflow: 'hidden', height: '140px' }}>
                                {record.hotProduct.map((item, index) => {
                                    let key = `img-${index}`;
                                    return (
                                        <li key={key} style={{ 'display': 'inline-block', 'margin': '0 5px' }}>
                                            <div style={{ width: 120, height: 120, overflow: 'hidden' }}>
                                                <img alt="爆款图片"
                                                    onClick={link.toGoodDetail.bind(null, item.itemId)}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                    src={item.picUrl + '_120x120.jpg'}>
                                                </img>
                                            </div>
                                            <div>销量:{item.firstDaySale}</div>
                                        </li>
                                    )
                                })}
                            </ul>)
                        }
                    }
                    ]
                },
                {
                    title: '操作',
                    dataIndex: '',
                    key: '',
                    width: '9%',
                    render: (text, record, index) => {
                        return (
                            <div>
                                <a onClick={link.toShopDetail.bind(null, record.shopId)}>店铺详情</a><br />
                                {record.followFlag === 1 ? <a>已监控</a> :
                                    <a onClick={this.addShopFollow.bind(this, index)}>添加到监控店铺</a>}
                            </div>
                        )
                    }
                },
            ];
        return (
            <div className='content'>
                <Form layout='inline' style={{ marginBootom: '24px' }}>
                    <FormItem label='店铺搜索'
                        {...formItemLayout}>
                        <Search placeholder='请输入店铺名称'
                            id='input-search'
                            enterButton
                            onSearch={this.searchText.bind(this)} />
                    </FormItem>
                    <FormItem
                        label='日期搜索'
                        {...formItemLayout}>
                        <LocaleProvider locale={zh_CN}>
                            <RangePicker showTime
                                format='YYYY-MM-DD'
                                placeholder={['开始时间', '结束时间']}
                                onOk={this.onOk.bind(this)}
                                disabledDate={this.disabledDate}
                                allowClear={false}
                                onOpenChange={this.setInputValue.bind(this)}
                                defaultValue={[moment(startDate), moment(endDate)]} />
                        </LocaleProvider>
                    </FormItem>
                </Form>
                <Row>
                    <LocaleProvider locale={zh_CN}>
                        <Table loading={loading}
                            pagination={{
                                defaultPageSize: pageSize,
                                showQuickJumper: true,
                                total: totalCount,
                                onChange: this.onTablePageChange.bind(this),
                                current: pageNo,
                                defaultExpandAllRows: true,
                                hideOnSinglePage: true
                            }}
                            columns={columns}
                            dataSource={dataSource}
                            bordered
                            scroll={{ x: true }}
                            rowKey={record => record.shopId}
                            id='store-table'
                            locale={{ emptyText: '暂无店铺' }} />
                    </LocaleProvider>
                </Row>
            </div>
        );
    }
}

export default StoreData