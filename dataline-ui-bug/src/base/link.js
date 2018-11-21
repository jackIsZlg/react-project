export default {
    //店铺明细
    toShopDetail(shopId) {
        window.open("/dataline/shopDetail?shopId=" + shopId)

    },
    //商品明细
    toGoodDetail(taobaoId) {
        window.open("/dataline/Inventory?taobaoId=" + taobaoId)
    },
    //店铺推荐
    toShopRecommend() {
        window.open("/page/recommend")
    }
}