import classNames from 'classnames'
import base from '../../common/baseModule'
import {Icon} from '../../components/base/baseComponents'

let idArray = []

$('#app').append('<div id="download-pop-wrapper"></div>')
class DownloadPop extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: this.props.data,
      closeBody: false
    }
  }

  // 第一次渲染前调用
  componentWillMount() {
    this.init()
  }

  getAllPicIds(params) {
    idArray = []
    let newData = []
    // console.log(121212, params.folderId, params.showId)
    if (!params.folderId && !params.showId) {
      idArray.push(params.idList)
      return
    }
    let url = params.folderId ? `/folder/get-all-folder-post?folderId=${params.folderId}` : `/show/get-show-post?showId=${params.showId}`
    base.ajaxList.basic({
      type: 'GET',
      url: `${base.baseUrl}${url}`
    }, (data) => {
      if (params.unSelectedIdList) {
        let unSelected = params.unSelectedIdList.split(',')
        newData = data.result.filter((element) => {
          let compareResult = unSelected.some(v => v * 1 === element) 
          if (!compareResult) {
            return element
          }
        })
      } else {
        newData = data.result
      }
      data.success && idArray.push(newData.join(','))
    })
  }

  init() {
    // 锁定浮层下层
    this.state.closeBody = window.isBodyScroll
    window.isBodyScroll && base.bodyScroll(false)
  }

  handleDownload(link, i, num) {
    let {pointContent} = this.props
    let content = {
      pic_id: idArray[i],
      pic_qty: idArray[i].split(',').length
    }
    for (let key in pointContent) {
      content[key] = pointContent[key]
    }
    base.ajaxList.addPoint(2100004, content)

    window.open(link)
    let _data = this.state.data
    _data[i].status = true

    base.eventCount.add(1028, {
      '下载数量': num,
    })

    this.setState({
      data: _data
    }, () => {
      this.closePop()
      this.props.endEdit && this.props.endEdit()
    })
  }

  closePop() {
    this.state.closeBody && base.bodyScroll(true)

    let el = ReactDOM.findDOMNode(this)
    el.parentNode.removeChild(el)

    delete this
  }

  renderList() {
    return this.state.data.map((item, i) => {
      let _key = `download-zip-${i}`
      let _filename = `${this.props.folderName}${i * 1 === 0 ? '' : `_${i}`}`
      let _href = !this.props.requestInterface ? `/folder/download?${base.objToSearch(item.params)}` : `/show/download?${base.objToSearch(item.params)}`
      console.log(_href)
      console.log(item)
      this.getAllPicIds(item.params)
      return (
        <li key={_key}>
          <img alt='' src="https://zhiyi-web.oss-cn-hangzhou.aliyuncs.com/static-web/icon-zip.png"/>
          <div className="one-line">{`${_filename}.zip`}</div>
          <button onClick={this.handleDownload.bind(this, _href, i, item.num)}
            className={classNames('btn-round', {
                    'btn-red': !item.status,
                    'btn-disabled': item.status
                  })}
          >
            {item.status ? '已' : <Icon type="download"/>}下载
          </button>
        </li>)
    })
  }

  render() {
    return (
      <div id="download-pop-panel">
        <div className="download-pop-panel">
          <i className="iconfont cancel-pop" onClick={this.closePop.bind(this)}/>
          <div className="download-pop-header">
            下载
            {this.state.data.length > 1 &&
            <div className="download-tip warning">每个压缩包最多包含100张图片</div>}
          </div>
          <div className="download-pop-content">
            <ul>
              {this.renderList()}
            </ul>
          </div>
        </div>
      </div>)
  }
}

export default DownloadPop