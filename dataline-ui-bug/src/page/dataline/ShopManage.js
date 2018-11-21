import React, {Component} from 'react';
import {
    Row,
    Table,
    Input,
    Modal,
    Select,
    message,
    Button,
    LocaleProvider
} from 'antd'
import moment from 'moment'
import zh_CN from 'antd/lib/locale-provider/zh_CN'
import link from '../../base/link'
import request from '../../base/request'
import base from '../../base/baseMoudle'

const InputGroup = Input.Group;
const Option = Select.Option;

class ShopManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            pageNo: 1,//当前在第几页
            totalCount: 0,
            pageSize: 15,
            modelShow: false,
            loading: false,
            name: '',
            nameType: 'inputShopName',
            shopIdList: ''
        }
    }

    componentDidMount() {
        document.title = "已监控店铺";
        document.getElementById('title').innerText='已监控店铺'
        this.getShopIdList();
    }

    getShopIdList() {
        let self = this,
            {shopIdList, pageNo, pageSize} = self.state;
        request.basic('shop/follow-shop-id?pageNo=' + pageNo + '&pageSize=' + pageSize).then(data => {
            if (!data.resultList.length) {
                self.setState({
                    loading: false
                });
                return
            }
            data.resultList.forEach((item, index) => {
                if (!index) {
                    shopIdList += item;
                } else {
                    shopIdList += ',' + item
                }
            });
            self.setState({shopIdList}, () => {
                self.getFollowList()
            })
        }, data => {
            console.log(data.errorDesc)
        })
    }

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

    // 获取已监控店铺列表
    getFollowList() {
        let self = this,
            {loading, shopIdList, totalCount} = self.state;
        loading = true;
        self.setState({loading}, () => {
            if (!shopIdList) {
                return
            }
            this.setState({shopIdList: ''});
            let requestData = {
                shopIds: shopIdList
            };
            request.getShopList(base.objToSearch(requestData))
                .then(data => {
                    let {dataSource, shopIdList} = self.dealDataSource(data.resultList);
                    totalCount = data.resultCount;

                    if (!shopIdList) {
                        this.setState({
                            dataSource,
                            totalCount,
                            loading: false
                        });
                        return
                    }
                    request.basic('daily/shop-top-new-sale?startDate=2017-04-14&endDate=' + moment().format("YYYY-MM-DD") + '&shopIdList=' + shopIdList)
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
                        })
                }, data => {
                    this.setState({
                        dataSource: [],
                        totalCount: 0,
                        loading: false
                    });
                    console.log(data.errordesc)
                })
        })
    }

    //分页所调用函数
    onTablePageChange(page) {
        document.querySelector('.ant-layout-has-sider .ant-layout').scrollTop = 0;
        this.setState({
            pageNo: page
        })
    }

    showModal(isShow = true) {
        !!isShow && this.setState({
            name: '',
            nameType: 'inputShopName',
        });
        this.setState({
            modelShow: !!isShow
        })
    }

    addFollow(shopName = '') {
        let self = this,
            {name, dataSource, nameType, totalCount} = self.state, shop = '', seller = '';

        name = shopName || name;

        switch (nameType) {
            case 'inputSellerName':
                seller = name.trim();
                break;
            case 'inputShopName':
            default:
                shop = name.trim();
                break;
        }

        request.addShopFollow(shop, seller, {
            method: 'POST'
        })
            .then(() => {
                message.success(shop + '监控成功');
                if (!shopName) {
                    // 更新监控列表与监控数
                    self.getShopIdList();
                    self.showModal(false);
                    return
                }

                dataSource.map(item => {
                    if (item.shopName === shopName) {
                        item.followFlag = 1;
                    }
                    return item
                });
                totalCount++;
                self.setState({dataSource, totalCount})
            }, (d) => {
                message.warning('监控失败');
                console.log(d.errorDesc);
            })
    }

    handleInput(e) {
        this.setState({
            name: e.target.value
        })
    }

    handleCancel() {
        this.showModal(false)
    }

    handleOk() {
        let {name} = this.state;
        if (!name) {
            return
        }
        this.addFollow();
    }

    cancelShopFollow(shopId) {
        let self = this, {dataSource, totalCount} = self.state;
        request.basic('shop/follow_cancel?shopId=' + shopId)
            .then(() => {
                // 更新监控列表与监控数
                // self.getFollowList();

                dataSource.map(item => {
                    if (item.shopId === shopId) {
                        item.followFlag = 0;
                    }
                    return item
                });
                totalCount--;
                self.setState({dataSource, totalCount});

                message.success('取消监控成功');
            }, data => {
                message.warning('取消监控失败');
                console.log(data.errorDesc);
            })
    }

    handleChange(val) {
        this.setState({name: '', nameType: val})
    }

    render() {
        const {modelShow, totalCount, nameType, name, dataSource, loading, pageNo, pageSize} = this.state,
            columns = [
                {
                    title: '店铺名称',
                    dataIndex: 'shopName',
                    key: 'shopName',
                    width: '5%',
                    render: (text, record, index) => <a href={`/dataline/shopDetail?shopId=${record.shopId}`} target='view_window'>{text}</a>
                },
                {
                    title: '最近一次上新',
                    children: [
                        {
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
                            render: (text, record) => (text * 1).toFixed(2)
                        },
                        {
                            title: '热销款',
                            dataIndex: 'dayNewItemsList',
                            key: 'dayNewItemsList',
                            width: '12%',
                            render: (text, record) => <ul style={{overflow: 'hidden', height: '140px'}}>
                                {record.hotProduct.map((item, index) => {
                                    let key = `img-${index}`;
                                    return (
                                        <li key={key} style={{'display': 'inline-block', 'margin': '0 5px'}}>
                                            <div style={{width: 120, height: 120, overflow: 'hidden'}}>
                                                <img alt="爆款图片"
                                                     onClick={link.toGoodDetail.bind(null, item.itemId)}
                                                     style={{width: '100%', height: '100%', objectFit: 'cover'}}
                                                     src={item.picUrl + '_120x120.jpg'}>
                                                </img>
                                            </div>
                                            <div>销量:{item.firstDaySale}</div>
                                        </li>
                                    )
                                })}
                            </ul>
                        }
                    ]
                },
                {
                    title: '操作',
                    dataIndex: '',
                    key: '',
                    width: '9%',
                    render: (text, record, index) => (
                        <div>
                            <a onClick={link.toShopDetail.bind(null, record.shopId)}>店铺详情</a><br/>
                            {
                                !record.followFlag ?
                                    <a onClick={this.addFollow.bind(this, record.shopName)}>添加到监控店铺</a> :
                                    < a onClick={this.cancelShopFollow.bind(this, record.shopId)}>取消监控</a>

                            }
                        </div>
                    )
                },
            ];
        return (
            <div>
                <Row>
                    <Button onClick={this.showModal.bind(this)} type="primary">添加监控店铺</Button>
                </Row>
                <Row style={{'margin': '10px 0'}}>已监控店铺:{totalCount || '0'}个</Row>
                <Row>
                    <LocaleProvider locale={zh_CN}>
                        <Table loading={loading}
                               pagination={{
                                   defaultPageSize: pageSize,
                                   totalCount: totalCount,
                                   showQuickJumper: true,
                                   onChange: this.onTablePageChange.bind(this),
                                   pageNo: pageNo,
                                   defaultExpandAllRows: true,
                                   hideOnSinglePage: true
                               }}
                               columns={columns}
                               dataSource={dataSource}
                               bordered
                               scroll={{x: true}}
                               rowKey={record => record.shopId}
                               id='store-table'
                               locale={{emptyText: '暂无监控店铺'}}/>
                    </LocaleProvider>
                </Row>
                <Modal title="添加监控店铺"
                       visible={modelShow}
                       okText="添加店铺"
                       cancelText="取消"
                       onCancel={this.handleCancel.bind(this)}
                       onOk={this.handleOk.bind(this)}>
                    <InputGroup compact>
                        <Select value={nameType} onChange={this.handleChange.bind(this)}>
                            <Option value="inputShopName">店铺名称</Option>
                            <Option value="inputSellerName">淘宝旺旺</Option>
                        </Select>
                        <Input value={name}
                               style={{width: '50%'}}
                               onChange={this.handleInput.bind(this)}
                               onPressEnter={this.handleOk.bind(this)}
                               placeholder={nameType === "inputShopName" ? "请输入需要添加监控的店铺" : "请输入需要添加监控的旺旺名"}/>
                    </InputGroup>
                </Modal>
            </div>
        )
    }
}

export default ShopManage
