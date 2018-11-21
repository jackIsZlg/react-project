import React, { Component } from 'react';
import { Row, Modal, message, AutoComplete, Col, Table, Tooltip, Button, DatePicker, Tabs, LocaleProvider } from 'antd'
import moment from 'moment';
import '../../style/dataline/ShopDetail.less'
import ReactEcharts from 'echarts-for-react'
import request from '../../base/request'
import base from '../../base/baseMoudle'
import link from '../../base/link'

import zh_CN from 'antd/lib/locale-provider/zh_CN'

const { RangePicker } = DatePicker,
    { TabPane } = Tabs,
    lastWeekDate = moment().subtract(31, 'days').format("YYYY-MM-DD"),
    nowDate = moment().subtract(1, 'days').format("YYYY-MM-DD");

class ShopDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
            dateError: false,
            limiteDate: "",
            emailList: [],
            dataSource: [],
            emailSource: [],
            storemode: 'all',
            mode: "24hours",
            changeStoreTab: 0,
            changeSaleTab: 1,
            page: 1,
            total: 0,
            current: 1,
            totalCount: 0,
            isSearchStatus: false,
            searchName: "",
            activeKey: "",
            shopId: "",
            loading: true,
            visible: false,//控制弹框是否开启状态
            everyDaySale: [],
            pageSize: 15,
            dateRange: [moment(moment().subtract(31, 'days').format("YYYY-MM-DD")), moment(moment().subtract(1, 'days').format("YYYY-MM-DD"))]
        };
    }

    componentWillMount() {
        let url = window.location.search; //获取url中"?"符后的字串
        if (url.indexOf("?") === -1) { //判断是否有参数
            return;
        }
        let str = url.substr(1), //从第一个字符开始 因为第0个是?号 获取所有除问号的所有符串
            strs = str.split("="); //用等号进行分隔 （因为知道只有一个参数 所以直接用等号进分隔 如果有多个参数 要用&号分隔 再用等号进行分隔）
        this.setState({
            shopId: strs[1]
        })
    }

    componentDidMount() {
        document.title = '店铺详情';
        document.getElementById('title').innerText = '店铺详情'
        this.getSalesInfo(lastWeekDate, nowDate);
    }

    dealData(data) {
        data = data.map(item => {
            item.curCprice = (item.curCprice * 1 / 100).toFixed(2);
            return item;
        });
        return data;
    }

    changePageNo(page) {
        let self = this, { current, activeKey } = self.state;
        document.querySelector('.ant-layout-has-sider .ant-layout').scrollTop = 0;
        current = page;
        self.setState({ current }, () => {
            self.getShopInfo(activeKey)
        })
    }
    handleChange = (value) => {
        this.setState({
            email: value,
            emailSource: !value || value.indexOf('@') >= 0 ? [] : [
                ...this.state.emailList,
                `${value}@gmail.com`,
                `${value}@163.com`,
                `${value}@qq.com`,
            ],
        });
    }
    getShopInfo(day) {
        let self = this,
            chooseDay = moment(day).format("YYYY-MM-DD"),
            { shopId, everyDaySale, current, dataSource, loading, pageSize } = self.state,
            data = this.state.data;

        let requestdata = {
            shopId,
            date: chooseDay,
            pageNo: current,
            pageSize
        };

        request.getNewProductList(base.objToSearch(requestdata))
            .then(d => {
                everyDaySale.forEach(item => {
                    if (moment(item.saleDay).format('YYYY-MM-DD') === chooseDay) {
                        data.shelfCount = item.newItemCount;
                        data.saleCount = item.newItemSalesVolume;
                        data.saleAmount = (item.newItemSale / 100).toFixed(2);
                    }
                });

                if (!d.resultList.length) {
                    self.setState({
                        dataSource: [],
                        data,
                        loading: false
                    });
                    return;
                }

                loading = false;
                dataSource = self.dealData(d.resultList);
                self.setState({
                    dataSource,
                    loading,
                    data
                })
            }, data => {
                self.setState({
                    dataSource: [],
                    data: {},
                    loading: false,
                });
                console.log(data.errorDesc)
            });
    }

    // 获取一段时间内店铺的销售情况
    getSalesInfo(lastWeekDate, nowDate) {
        let self = this,
            { shopId, data } = self.state,
            shopInfo = {
                dateArray: [],//X轴日前
                CumulativeSalesArray: [],//上新销量
                UpToCountArray: [],//上新款数
                daySaleArray: [],//上新估算销售额
                tabPanesArray: [],
                everyDaySale: []
            };

        request.basic('daily/shop-new-sale-stat?shopId=' + shopId + "&startDate=" + lastWeekDate + "&endDate=" + nowDate)
            .then(d => {
                data.shopName = d.shopInfo.shopName;
                data.url = d.shopInfo.shopUrl;
                data.agency = d.shopInfo.agency;
                data.agencyCountry = d.shopInfo.agencyCountry;
                if (!d.shopDailyList.length) {
                    shopInfo.activeKey = '';
                    self.setState(shopInfo);
                    return;
                }
                d.shopDailyList.forEach(item => {
                    shopInfo.tabPanesArray.push(item.saleDay);
                    shopInfo.dateArray.push(moment(item.saleDay).format('MM-DD'));
                    shopInfo.daySaleArray.push(item.newItemSale / 100);
                    shopInfo.CumulativeSalesArray.push(item.newItemSalesVolume);
                    shopInfo.UpToCountArray.push(item.newItemCount);
                });
                shopInfo.activeKey = d.shopDailyList[d.shopDailyList.length - 1].saleDay;
                shopInfo.everyDaySale = d.shopDailyList;
                self.setState(shopInfo);
                self.getShopInfo(shopInfo.activeKey);
            }, d => {
                self.setState(shopInfo);
            });
    }

    changeTabs(key) {
        let self = this, { activeKey, loading, current } = self.state;
        activeKey = key;
        current = 1;
        loading = true;
        self.setState({
            activeKey,
            current,
            loading
        }, () => {
            self.getShopInfo(activeKey);
        });
    }

    //不可选择预期
    disabledDate(current) {
        const { limiteDate } = this.state
        if (limiteDate) {
            return (current.valueOf() < new Date("2017-04-14").getTime()
                || current.valueOf() > moment(Date.now() - 3600 * 1000 * 24)
                || current.valueOf() > moment(limiteDate).subtract(-3, "months").format("x")
                || current.valueOf() < moment(limiteDate).subtract(3, "months").format("x")
            )
        }
        return (current.valueOf() < new Date("2017-04-14").getTime()
            || current.valueOf() > moment(Date.now() - 3600 * 1000 * 24)
        )

    }
    changeRangePick(data) {
        this.setState({ limiteDate: data[0] })
    }
    onOk(value) {
        this.setState({
            current: 1,
            isSearchStatus: false,
            loading: true,
        });
        let lastWeekDate = moment(value[0]).format('YYYY-MM-DD'),
            nowDate = moment(value[1]).format('YYYY-MM-DD');
        this.setState({
            dateRange: [lastWeekDate, nowDate]
        })
        this.getSalesInfo(lastWeekDate, nowDate);
    }
    handleCancel() {
        this.setState({ visible: false })
    }
    openModal() {
        this.setState({ visible: true, dateError: false })
        request.getEmailList().then((res) => {
            this.setState({ emailList: res })
        })
    }
    onExportClick = () => {
    }
    handleOk() {
        const { dateRange, email, shopId } = this.state
        // 时间跨度判读
        const startDateTime = moment(dateRange[0]._i || dateRange[0])
        const endDateTime = moment(dateRange[1]._i || dateRange[1]).format('x')
        const tmpEndTime = moment(startDateTime).subtract(-3, "months").format("x")
        if (tmpEndTime < endDateTime) {
            message.error('时间跨度不能超过3个月')
            this.setState({ dateError: true })
            return
        }
        this.setState({ dateError: false })
        // 邮箱判断
        const reg = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/
        if (!reg.test(email)) {
            message.error('邮箱格式不正确')
            return
        }
        this.setState({ visible: false }, () => {
            request.basic(`/file/shop-sale-stat?email=${email}&shopId=${shopId}&startDate=${moment(dateRange[0]).format('YYYY-MM-DD')}&endDate=${moment(dateRange[1]).format('YYYY-MM-DD')}`)
                .then((res) => {
                    console.log(res)
                    message.success(res);
                })
        })
    }
    render() {
        let {
            data,
            dataSource,
            dateArray,
            daySaleArray,
            CumulativeSalesArray,
            UpToCountArray,
            tabPanesArray,
            loading,
            pageSize,
            current,
            dateRange,
            visible,
            dateError
        } = this.state;
        const columns = [
            {
                title: '图片',
                dataIndex: 'picUrl',
                key: 'picUrl',
                width: '9%',
                render: (text) => <div style={{ width: 120, height: 120, overflow: 'hidden' }}>
                    <img alt="图片"
                        src={text + '_120x120.jpg'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>,
            },
            {
                title: '名称',
                dataIndex: 'title',
                key: 'title',
                width: '9%',
                render: (text, record) => <div>
                    <a data-code="2100003" data-content={JSON.stringify({ item_id: record.itemId })} href={request.taobaoUrlHost + record.itemId} target='view_window' style={{ fontSize: "14px" }}>
                        <Tooltip placement="top" title="宝贝详情">
                            <span className='icon-item' />
                        </Tooltip>
                    </a>
                    <a data-code="2100001" data-content={JSON.stringify({ item_id: record.itemId })} target="view_window" onClick={link.toGoodDetail.bind(null, record.itemId)}>{record.title}</a>
                    {!!record.snapshot && <a
                        style={{ display: "block", marginTop: 5 }} href={record.snapshot} target="view_window">[页面快照]</a>}
                </div>
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
                render: (text) => <span style={{
                    wordBreak: "break-all",
                    wordWrap: "break-word",
                    display: "inline-block"
                }}>{text}</span>
            },
            {
                title: '价格',
                dataIndex: 'curCprice',
                key: 'curCprice',
                width: '6%',
                render: text => {
                    if (Object.prototype.toString.call(text) === "[object Object]") {
                        return <div>
                            <div>当前:{text.curPrice}</div>
                            <div>上新:{text.shelfPrice}</div>
                            <div>最高:{text.max}</div>
                            <div>最低:{text.min}</div>
                        </div>
                    } else if (text === "暂无数据") {
                        return <div>{text}</div>
                    } else {
                        return <div>{text}</div>
                    }
                }

            },
            {
                title: '上新首日销量',
                dataIndex: 'firstDaySale',
                key: 'firstDaySale',
                width: '9%',
                sorter: (a, b) => a.firstDaySale - b.firstDaySale,
            },
            {
                title: '30天销量',
                dataIndex: 'firstMonthSale',
                key: 'firstMonthSale',
                width: '9%',
                sorter: (a, b) => a.firstMonthSale - b.firstMonthSale,
            },
            {
                title: '收藏量',
                dataIndex: 'collect',
                key: 'collect',
                width: '9%',
                sorter: (a, b) => a.collect - b.collect,
            },
            // {
            //     title: '操作',
            //     key: 'action',
            //     width: '9%',
            //     render: (text, record, index) => <a
            //         onClick={link.toGoodDetail.bind(null, record.itemId)}>宝贝明细</a>
            // },
        ];

        // 图表配置
        const option = {
            tooltip: {
                trigger: "axis",
                axisPointer: {
                    type: "shadow",
                    textStyle: {
                        color: "#fff"
                    }
                },
            },
            grid: {
                borderWidth: 0,
                top: 110,
                bottom: 95,
                textStyle: {
                    color: "#fff"
                }
            },
            legend: {
                x: '4%',
                top: '11%',
                textStyle: {
                    color: '#90979c',
                },
                data: ['上新估算销售额', '上新销量', '上新款数']
            },
            calculable: true,
            xAxis: [{
                type: "category",
                splitNumber: 10,
                axisLine: {
                    lineStyle: {
                        color: '#90979c'
                    }
                },
                splitLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                splitArea: {
                    show: false
                },
                axisLabel: {
                    interval: 0,
                    rotate: -30
                },
                data: dateArray,
            }],
            yAxis: [{
                type: "value",
                splitLine: {
                    "show": false
                },
                name: "上新估算销售额",
                position: 'right',
                axisLine: {
                    lineStyle: {
                        color: '#f9cf5f'
                    }
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    interval: 0,

                },
                splitArea: {
                    show: false
                },

            }, {
                type: "value",
                splitLine: {
                    "show": false
                },
                name: "上新销量",
                offset: 50,
                position: 'left',
                axisLine: {
                    lineStyle: {
                        color: '#44a11f'
                    }
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    interval: 0,

                },
                splitArea: {
                    show: false
                },

            }, {
                type: "value",
                splitLine: {
                    "show": false
                },
                name: "上新款数",
                position: 'left',
                axisLine: {
                    lineStyle: {
                        color: '#1890ff'
                    }
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    interval: 0,

                },
                splitArea: {
                    show: false
                },

            }],
            series: [
                {
                    name: "上新估算销售额",
                    type: "line",
                    symbolSize: 8,
                    symbol: 'circle',
                    itemStyle: {
                        normal: {
                            color: "#f9cf5f",
                            barBorderRadius: 0,
                            label: {
                                show: false,
                                position: "top",
                                formatter: function (p) {
                                    return p.value > 0 ? (p.value) : '';
                                }
                            }
                        }
                    },
                    yAxisIndex: 0,
                    data: daySaleArray
                }, {
                    name: "上新销量",
                    type: "line",
                    symbolSize: 8,
                    symbol: 'circle',
                    itemStyle: {
                        normal: {
                            color: "#44a11f",
                            barBorderRadius: 0,
                            label: {
                                show: false,
                                position: "top",
                                formatter: function (p) {
                                    return p.value > 0 ? (p.value) : '';
                                }
                            }
                        }
                    },
                    yAxisIndex: 1,
                    data: CumulativeSalesArray
                }, {
                    name: "上新款数",
                    type: "bar",
                    barMaxWidth: 20,
                    barGap: "10%",
                    itemStyle: {
                        normal: {
                            color: "#1890ff",
                            label: {
                                show: false,
                                textStyle: {
                                    color: "#fff"
                                },
                                position: "insideTop",
                                formatter: function (p) {
                                    return p.value > 0 ? (p.value) : '';
                                }
                            }
                        }
                    },
                    yAxisIndex: 2,
                    data: UpToCountArray
                }
            ]
        };
        let tabPanes = (tabPanesArray && tabPanesArray.length) ? tabPanesArray.map(item => {
            return <TabPane tab={moment(item).format('YYYY-MM-DD') + '上新'} key={item}>
                <Row style={{
                    fontSize: 14,
                    padding: '15px',
                    borderLeft: '1px solid #e8e8e8',
                    borderRight: '1px solid #e8e8e8'
                }}>
                    {moment(item).format('YYYY-MM-DD')}
                    &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
                    上新款数:<span style={{ color: "#3a9c09" }}>{data.shelfCount}件</span>
                    &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
                    上新首日销量:<span style={{ color: "#3a9c09" }}>{data.saleCount}件</span>
                    &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
                    上新首日估算销售额:<span style={{ color: "#3a9c09" }}>{data.saleAmount}元</span>
                </Row>
                <LocaleProvider locale={zh_CN}>
                    <Table loading={loading}
                        pagination={{
                            defaultPageSize: pageSize,
                            showQuickJumper: true,
                            total: data.shelfCount,
                            onChange: this.changePageNo.bind(this),
                            current: current,
                            defaultExpandAllRows: true,
                            hideOnSinglePage: true
                        }}
                        columns={columns}
                        dataSource={dataSource}
                        bordered
                        rowKey={record => record.itemId}
                        scroll={{ x: true }}
                        id="store-table" />
                </LocaleProvider>
            </TabPane>
        }) : <div style={{ textAlign: 'center', padding: '50px' }}>该时间段暂无上新数据</div>;
        return (
            <div className="content">
                <Modal title="导出表格"
                    className="modal-wrap"
                    visible={visible}
                    onOk={this.handleOk.bind(this)}
                    onCancel={this.handleCancel.bind(this)}
                    destroyOnClose={true}
                >
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '60%',
                        marginLeft: '20%',
                        alignItems: 'start'
                    }}>
                        <span style={{ marginBottom: '10px' }}>您已选择导出下列上新数据：</span>
                        <span style={{ color: `${dateError ? 'red' : 'rgba(0, 0, 0, 0.65)'}` }}><b>时间：{dateRange[0]._i || dateRange[0]} ~ {dateRange[1]._i || dateRange[1]}</b></span>
                        <span><b>店铺：{data.shopName}</b></span>
                        <span style={{ marginBottom: '10px', marginTop: '10px' }}>请在下方输入您的邮箱，便于接收数据：</span>
                        <AutoComplete
                            dataSource={this.state.emailSource}
                            style={{ width: '100%', marginTop: '5px' }}
                            onChange={this.handleChange}
                            placeholder="请输入邮箱"
                        />
                    </div>
                </Modal>
                <Row type="flex" align='middle' style={{ fontSize: 18, color: "black" }}>
                    {data.agency ? <span className='agency-tag'>代购</span> : null}
                    {data.agencyCountry
                        ? <span className='agency-country agency-style'
                            style={{ backgroundColor: `${data.agencyCountry === '欧美' ? '#ff7b8c' : data.agencyCountry === '韩国' ? '#83d587' : '#4dbcd5'}` }}>
                            {data.agencyCountry || '暂无'}
                        </span>
                        : null
                    }
                    <a style={{ fontSize: "18px", color: "#333333" }}>{data.shopName}</a>
                    <a data-code="2200003" data-content={JSON.stringify({ shop_id: data.shopId })} href={data.url} target='view_window' style={{ fontSize: "14px", height: '18px' }}>
                        <span className='icon-shop' style={{ margin: '0 15px -1px 30px' }} />
                        <span>进入店铺</span>
                    </a>

                </Row>
                <Row style={{ marginTop: "10px", marginBottom: "10px" }} id="itemSearch-content">
                    {/* <Col span={10} style={{ fontSize: 16 }}>
                        上新次数:{tabPanesArray ? tabPanesArray.length : 0}
                    </Col> */}
                    <Col span={14} style={{ textAlign: "left" }}>
                        <LocaleProvider locale={zh_CN}>
                            <RangePicker
                                format="YYYY-MM-DD"
                                placeholder={['开始时间', '结束时间']}
                                onChange={this.onOk.bind(this)}
                                style={{ width: "300px" }}
                                allowClear={false}
                                onCalendarChange={this.changeRangePick.bind(this)}
                                disabledDate={this.disabledDate.bind(this)}
                                defaultValue={this.state.dateRange}
                            />
                        </LocaleProvider>
                        <Tooltip placement="top" title={'导出该时间段店铺上新详情'}>
                            <Button type='primary' onClick={this.openModal.bind(this)} style={{ marginLeft: 20 }} >导出</Button>
                            {/* <Button onClick={this.onExportClick} style={{ marginLeft: 20 }} type="primary">导出</Button> */}
                        </Tooltip>
                    </Col>
                </Row>
                <Row style={{ "border": "1px solid #e7e7e7" }}>
                    {((daySaleArray && daySaleArray.length) || (CumulativeSalesArray && CumulativeSalesArray.length) || (UpToCountArray && UpToCountArray.length))
                        ? <ReactEcharts ref='echartsInstance' option={option} />
                        : <div style={{ textAlign: 'center', padding: '50px' }}>暂无图表信息</div>}
                </Row>
                <Row style={{ marginTop: 10 }}>
                    <Tabs type="card"
                        activeKey={this.state.activeKey}
                        onChange={this.changeTabs.bind(this)}
                        className="tab-store-detail">
                        {tabPanes}
                    </Tabs>
                </Row>
            </div>
        );
    }
}

export default ShopDetail;
