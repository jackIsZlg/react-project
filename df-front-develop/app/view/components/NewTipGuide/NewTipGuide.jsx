import base from '../../common/baseModule'
import {ToolTip} from '../ToolTip/ToolTip'


// 指引组件
class NewTipGuide extends React.Component {
  constructor() {
    super()
    this.state = {
      order: 1
    }
  }

  // 获取下一个指引信息
  getNextStep() {
    let {order} = this.state

    const {total, renderGuideFun, wrapper, bodyScroll, localName} = this.props

    if (order === total) {
      document.body.removeChild(wrapper)
      bodyScroll && base.bodyScroll()
      base.guideFlag = true

      let localStorage = {}
      localStorage[localName] = 1
      base.LS.set(localStorage)
      return
    }
    order++
    this.setState({order}, () => {
      renderGuideFun && renderGuideFun()
    })
  }

  render() {
    let {order} = this.state
    const {targetElInfo, tip, total} = this.props,
      el = targetElInfo[order - 1].targetEl,
      pos = targetElInfo[order - 1].position

    return (
      <ToolTip pos={pos} el={el} background='white'>
        <div className='tip-container'>
          <div className='tip-info'>
            {
                            total !== 1 &&
                            <span>{order}/{total}</span>
                        }
            <div className='one-tip'>{tip[order - 1]}</div>
          </div>
          <div className='next-step'
            onClick={this.getNextStep.bind(this)}
          >{order === total ? '明白了' : '下一步'}
          </div>
        </div>
      </ToolTip>
    )
  }
}

export default NewTipGuide