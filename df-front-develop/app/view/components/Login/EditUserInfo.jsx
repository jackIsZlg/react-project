import classNames from 'classnames'
import base from '../../common/baseModule'
import { Button } from './LoginBase'

const tagList = [
  { value: '设计师', selected: false },
  { value: '买手', selected: false },
  { value: '搭配师', selected: false },
  { value: '陈列师', selected: false },
  { value: '学生', selected: false },
  { value: '时尚编辑', selected: false },
  { value: '模特', selected: false },
  { value: '时尚爱好者', selected: false }
]

// class DFSelect extends React.Component {
//   constructor(props) {
//     super(props)
//     this.state = {
//       selected: {
//         index: -1,
//         value: props.value
//       },
//       dropFlag: false,
//     }
//   }

//   componentWillMount() {
//     const {options, value} = this.props
//     const {selected} = this.state

//     if (!options.length || value) {
//       return
//     }

//     for (let i = 0, len = options.length; i < len; i++) {
//       if (options[i].value === value) {
//         selected.index = i
//         this.setState({
//           selected
//         })
//         break
//       }
//     }
//   }

//   dropDown() {
//     this.setState({
//       dropFlag: !this.state.dropFlag
//     })
//   }

//   liClick(index) {
//     let {selected} = this.state
//     const {options} = this.props

//     // 未改变选项
//     if (selected.index === index) {
//       this.setState({
//         dropFlag: false
//       })
//       return
//     }

//     // 修改选中项
//     selected = {
//       index,
//       value: options[index].value
//     }

//     this.setState({
//       dropFlag: false,
//       selected
//     })

//     const onChange = this.props.onChange
//     onChange && onChange({
//       index,
//       opiton: options[index]
//     })
//   }

//   renderOption() {
//     const {options} = this.props
//     const {selected} = this.state

//     return options.map((option, index) => {
//       let key = `opiton-${index}`
//       let value = option.value
//       return (
//         <li key={key}
//           className={classNames({'active': selected.index === index})}
//           onClick={this.liClick.bind(this, index)}
//         >{value}
//         </li>
//       )
//     })
//   }

//   render() {
//     const {state, props} = this
//     const {dropFlag, selected} = state
//     return (
//       <div className="df-select" ref={props.ref}>
//         <div className={classNames('df-select-selection', {
//                     'active': dropFlag,
//                     'backgroundColor': !dropFlag && !!selected.value
//                 })}
//           onClick={this.dropDown.bind(this)}
//         >
//           {selected.value || (props.placeholder || '请选择')}
//           <i className="iconfont"/>
//         </div>
//         <ul className={classNames('df-select-down', {'active': dropFlag})}>
//           {this.renderOption()}
//         </ul>
//       </div>
//     )
//   }
// }

// 个人资料修改
class EditUserInfo extends React.Component {
  constructor(props) {
    super(props)
    console.log('reference', props.data.reference + '')
    this.state = {
      reference: props.data.reference + '' || -1
    }
  }

  changeStep(step) {
    this.props.changeStep(step)
  }

  // next
  handleNext() {
    let { reference } = this.state
    if (reference === -1) {
      return
    }

    $.ajax({
      'type': 'POST',
      'url': `${base.baseUrl}/users/edit-profile`,
      'contentType': 'application/json',
      'dataType': 'json',
      'data': JSON.stringify({
        mobile: this.state.phone,
        profession: tagList[reference].value,
        nickname: this.props.data.nickname
      })
    }).done((d) => {
      if (d.success) {
        // tagList[reference].selected = false
        // this.setState({
        //   reference: -1
        // }, () => {
        this.props.synchroData({ reference }, () => {
          this.changeStep(10)
        })
        // })
      } else {
        console.log(d.errorDesc)
      }
    }).fail((d) => {
      console.log(d.errorDesc)
    })
  }

  chooseJob(index) {
    let jobContent = tagList[index]
    let { reference } = this.state
    if (index === reference) {
      jobContent.selected = !jobContent.selected
      reference = -1
    } else {
      reference = index
      tagList.map((item, i) => {
        item.selected = i === index
        return item
      })
    }
    this.setState({ reference })
  }

  render() {
    let { reference } = this.state
    console.log(reference)
    return (
      <div className="login-panel login-panel-4">
        <div className="personal-job-header">
          您是
        </div>
        <div className="personal-job-intro">
          选择真实的身份及设计偏好，我们将努力为你推荐<br />更适合你的时尚图片
        </div>
        <ul className='personal-job-list'>
          {
            tagList.map((item, index) => <li className={classNames('personal-job-list-item', { 'select': item.selected })} onClick={this.chooseJob.bind(this, index)}>{item.value}</li>)
          }
        </ul>
        <div className="login-footer">
          <Button type={+reference === -1 ? 'forbid' : 'black'} handleClick={this.handleNext.bind(this)}>下一步</Button>
        </div>
      </div>)
  }
}

export default EditUserInfo