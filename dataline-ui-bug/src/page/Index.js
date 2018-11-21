import React, { Component } from 'react'
import { Header, Footer } from '../component/common/CommonComponent'
import request from '../base/request'
import content1 from '../image/index/1.png'
import content2 from '../image/index/2.png'
import content3 from '../image/index/3.png'
import bottom1 from '../image/index/bottom1.png'
import bottom2 from '../image/index/bottom2.png'
import bottom3 from '../image/index/bottom3.png'

import '../style/Index.less'
// import { request } from 'http';

class Index extends Component {
  constructor () {
    super()
    this.state = {
      headerType: 0,
      isTransparent: true
    }
  }

  componentDidMount () {
    document.addEventListener('scroll', () => {
      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      this.setState({
        headerType: scrollTop > 0 ? 1 : 0,
        isTransparent: !!(scrollTop < 800)
      })
    })
  }
  toHome () {
    let shopListCount = localStorage.userPlatformData ? JSON.parse(localStorage.userPlatformData).shopListCount : ''
    this.props.history.push(shopListCount ? '/dataline/shopwatch' : '/dataline/dataexpress')
  }
  render () {
    let { headerType, isTransparent } = this.state
    return (
      <div className='login-page'>
        <Header isTransparent={isTransparent} type={headerType} rightSolt={<button className='in-site-btn' onClick={this.toHome.bind(this)}>进入AI数据</button>} />
        <div className='whole-container no-bottom login'>
          <div className='login-section one'>
            <div className='login-section-banner'>
              <div className='first-title'>数据赋能，快速发现爆款</div>
              <div className='second-title'>基于海量电商上新和销售数据，为服装设计师打造的开款工具</div>
              <div className='btn-wrap'>
                <div className='index-btn login-btn' onClick={() => this.props.history.push('/index/login')}>登录</div>
                <div className='index-btn login-register' onClick={() => this.props.history.push('/index/register')}>立即注册</div>
              </div>
              <div className='banner-bottom' />
              <div className='banner-bottom-text'>
                <div className='banner-bottom-title banner-bottom-title-1'>服装设计师的业务挑战</div>
                <div className='banner-bottom-title banner-bottom-title-2'>服装款式更新频率快，流行风格多变，无法持续完成爆款的设计。线上线下竞争对手众多，</div>
                <div className='banner-bottom-title banner-bottom-title-2'>竞争压力巨大面对各种开款方向，无法做出最科学的设计决策。</div>
              </div>
            </div>
          </div>

          <div className='content-wrap'>
            <div className='content-title'>数据如何赋能</div>
            <div className='content-cell-wrap'>
              <div className='content-info first-cell'>
                <div className='content-detail-title '>数据分析</div>
                <div className='content-detail'>基于行业大数据，复盘宝贝历史销售数据，了解每一次上新效果。甄别热门款式和滞销款式，洞悉趋势，科学开款。</div>
              </div>
              <div className='content-img'>
                <img alt='数据分析' src={content1} />
              </div>
            </div>
            <div className='content-cell-wrap second-cell-wrap'>
              <div className='content-img second-cell'>
                <img alt='竞店监控' src={content2} />
              </div>
              <div className='content-info'>
                <div className='content-detail-title '>竞店监控</div>
                <div className='content-detail'>基于店铺风格，销售规模及类型，为用户持续挖掘竞店。监控对手的上新及销售趋势，及时调整设计方向，不再错过爆款的跟进设计。</div>
              </div>
            </div>
            <div className='content-cell-wrap third-cell-wrap'>
              <div className='content-info third-cell'>
                <div className='content-detail-title '>AI爆款推荐</div>
                <div className='content-detail'>基于海量的行业历史数据和最新流行趋势智能推荐海量爆款，让用户轻松获取开款灵感。</div>
              </div>
              <div className='content-img'>
                <img alt='AI爆款推荐' src={content3} />
              </div>
            </div>
          </div>

          <div className='bottom-info-wrap'>
            <div className='bottom-info-title'>他们正在借助AI数据开款</div>
            <div className='bottom-info-img'>
              <div className='info-cell'>
                <img alt='莉贝琳sisy' src={bottom1} />
                <div className='info-title'>莉贝琳sisy</div>
                {/* <div className='info-detail'>基于海量的行业历史数据和最新流行趋势，只能推荐海量爆款，让用户轻松获取开款灵感。基于海…</div> */}
              </div>
              <div className='info-cell info-cell-center'>
                <img alt='BIGKING大金家' src={bottom2} />
                <div className='info-title'>BIGKING大金家</div>
                {/* <div className='info-detail'>基于海量的行业历史数据和最新流行趋势，只能推荐海量爆款，让用户轻松获取开款灵感。</div> */}
              </div>
              <div className='info-cell'>
                <img alt='左娇娇私服店' src={bottom3} />
                <div className='info-title'>19UP 左娇娇私服店</div>
                {/* <div className='info-detail'>基于海量的行业历史数据和最新流行趋势</div> */}
              </div>
            </div>
          </div>
          <div className='bottom-footer'>
            <div className='bottom-footer-title'>数据赋能，快速发现爆款</div>
            <div className='bottom-footer-title'>仅需 ¥6800/年</div>
            <div className='bottom-footer-register' onClick={() => this.props.history.push('/index/register')}>立即注册购买</div>
          </div>
        </div>
        <Footer noFixed />
      </div>
    )
  }
}

export default Index
