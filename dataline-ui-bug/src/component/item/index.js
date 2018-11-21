import React, { Component } from 'react';
import { Rate } from 'antd'
class Item extends Component {
    render() {
        const { item, index, eventContent,link } = this.props
        return (
            <div className="img-single" style={{ width: '300px' }}>
                <div style={{ position: 'relative' }}>
                    <div onClick={this.changeDiff.bind(this, item.contrastFlag, index, item.itemId)} className="marke-diff">{item.contrastFlag ? '取消对比' : '对比'}</div>
                    <div onClick={this.changeCollect.bind(this, item.collectFlag, index, item.itemId)} className="marke-collect">{item.collectFlag ? '取消收藏' : '收藏'}</div>
                    <div
                        data-code="2100001"
                        data-content={JSON.stringify(eventContent)}
                        onClick={link.toGoodDetail.bind(null, item.itemId)}
                        className="img-single-item" style={{ background: `url(${item.picUrl || this.state.nullImg}) top/contain no-repeat`, height: '300px', width: '300px' }}>
                    </div>
                </div>
                <div data-code="2100001" data-content={JSON.stringify(eventContent)} onClick={link.toGoodDetail.bind(null, item.itemId)} >
                    <div className='item-info'>
                        <span>爆款值:<Rate disabled defaultValue={item.hotLevel} /></span>
                        <span>30天销量:{item.salesVolume30 ? parseInt(item.salesVolume30, 10) : 0}</span>
                    </div>
                    <div className='item-name'>
                        <a target="view_window" onClick={link.toGoodDetail.bind(null, item.itemId)}>{item.itemName || '暂无'}</a>
                    </div>
                    <div className='item-price'>
                        <span>¥{item.price / 100}</span>
                        <span>{item.saleTime}上架</span>
                    </div>
              </div>
            </div>
        )
  }
}

export default Item;