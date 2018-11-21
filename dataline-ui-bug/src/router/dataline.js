/**
 * Created by gewangjie on 2018/3/7
 */
import React from 'react';
import {withRouter, Redirect} from 'react-router-dom';
import Bundle from '../base/bundle'

// 上新日报
const DataExpress = (props) => (
    <Bundle load={() => import('../page/dataline/DataExpress')}>
        {(DataExpress) => <DataExpress {...props}/>}
    </Bundle>
);

// 商品列表
const CommodityData = (props) => (
    <Bundle load={() => import('../page/dataline/CommodityData')}>
        {(CommodityData) => <CommodityData {...props}/>}
    </Bundle>
);

// 店铺管理
const ShopManage = (props) => (
    <Bundle load={() => import('../page/dataline/ShopManage')}>
        {(ShopManage) => <ShopManage {...props}/>}
    </Bundle>
);
// 爆款推荐
const recommendData = (props) => (
    <Bundle load={() => import('../page/dataline/Recommend')}>
        {(StoreData) => <StoreData {...props}/>}
    </Bundle>
);
// 我的收藏
const CollectionData = (props) => (
    <Bundle load={() => import('../page/dataline/Collection')}>
        {(StoreData) => <StoreData {...props}/>}
    </Bundle>
);
// 店铺列表
const StoreData = (props) => (
    <Bundle load={() => import('../page/dataline/Shops')}>
        {(StoreData) => <StoreData {...props}/>}
    </Bundle>
);
// 监控店铺
const shopwatch = (props) => (
    <Bundle load={() => import('../page/dataline/ShopWatch')}>
        {(StoreData) => <StoreData {...props}/>}
    </Bundle>
);
// 商品详情
const Inventory = (props) => (
    <Bundle load={() => import('../page/dataline/Inventory')}>
        {(Inventory) => <Inventory {...props}/>}
    </Bundle>
);

// 店铺详情
const ShopDetail = (props) => (
    <Bundle load={() => import('../page/dataline/ShopDetail')}>
        {(ShopDetail) => <ShopDetail {...props}/>}
    </Bundle>
);

// 店铺详情
const Compare = (props) => (
    <Bundle load={() => import('../page/Compare/')}>
        {(Compare) => <Compare {...props}/>}
    </Bundle>
);
const Setting = (props) => (
    <Bundle load={() => import('../page/Setting/')}>
        {(Setting) => <Setting {...props}/>}
    </Bundle>
);
const baseUrl = '/dataline';

// DataLine 伪首页
const Home = function () {
    return <Redirect to={baseUrl + '/shopwatch'}/>
    // document.title = "BI数据管理系统";
    // return <div style={{fontSize: '36px', textAlign: 'center'}}>
    //     Welcome to<br/>
    //     DataLine<br/>
    // </div>
};

export default [
    {
        path: baseUrl + '/',
        exact: true,
        main: Home
    }, {
        path: baseUrl + '/dataexpress',
        main: withRouter(DataExpress)
    }, {
        path: baseUrl + '/commoditydata',
        main: withRouter(CommodityData)
    }, {
        path: baseUrl + '/shopwatch',
        main: shopwatch
    }, {
        path: baseUrl + '/recommend',
        main: recommendData
        
    }, {
        path: baseUrl + '/collection',
        main: CollectionData
    }, {
        path: baseUrl + '/storedata',
        main: StoreData
    }, {
        path: baseUrl + '/shopDetail',
        main: ShopDetail
    }, {
        path: baseUrl + '/Inventory',
        main: Inventory
    }, {
        path: baseUrl + '/shopmanage',
        main: ShopManage
    }, {
        path: baseUrl + '/compare/:type',
        main: Compare
    }
    , {
        path: baseUrl + '/setting/',
        main: Setting
    }
]